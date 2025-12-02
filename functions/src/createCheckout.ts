import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

const MONTHLY_PRICE_ID = process.env.VAULT_PRO_MONTHLY_PRICE_ID || '';
const YEARLY_PRICE_ID = process.env.VAULT_PRO_YEARLY_PRICE_ID || '';
const LAUNCH_COUPON_ID = process.env.LAUNCH_COUPON_ID || 'LAUNCH50';

interface CheckoutRequest {
  priceId: 'monthly' | 'yearly';
  userId: string;
  userEmail: string;
  applyCoupon?: boolean;
}

interface CheckoutResponse {
  url: string;
  couponApplied: boolean;
  couponRemaining?: number;
}

export const createCheckout = functions.https.onCall(
  async (data: CheckoutRequest, context): Promise<CheckoutResponse> => {
    // Verify user is authenticated
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'User must be authenticated to create a checkout session'
      );
    }

    const { priceId, userId, userEmail, applyCoupon } = data;

    // Validate input
    if (!priceId || !userId || !userEmail) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Missing required fields: priceId, userId, userEmail'
      );
    }

    // Map price ID to actual Stripe price ID
    const stripePriceId = priceId === 'monthly' ? MONTHLY_PRICE_ID : YEARLY_PRICE_ID;

    if (!stripePriceId) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'Stripe price IDs not configured'
      );
    }

    const db = admin.firestore();

    // Check if user already has an active subscription
    const userDoc = await db.collection('users').doc(userId).get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      if (
        userData?.subscriptionStatus === 'active' &&
        (userData?.subscriptionTier === 'athlete' || userData?.subscriptionTier === 'athlete_plus')
      ) {
        throw new functions.https.HttpsError(
          'already-exists',
          'User already has an active subscription'
        );
      }
    }

    // Look up or create Stripe customer
    let stripeCustomerId: string;
    const existingCustomerId = userDoc.data()?.stripeCustomerId;

    if (existingCustomerId) {
      stripeCustomerId = existingCustomerId;
    } else {
      // Search for existing customer by email
      const existingCustomers = await stripe.customers.list({
        email: userEmail,
        limit: 1,
      });

      if (existingCustomers.data.length > 0) {
        stripeCustomerId = existingCustomers.data[0].id;
      } else {
        // Create new customer
        const customer = await stripe.customers.create({
          email: userEmail,
          metadata: {
            firebaseUserId: userId,
          },
        });
        stripeCustomerId = customer.id;
      }

      // Save customer ID to user document
      await db.collection('users').doc(userId).set(
        { stripeCustomerId },
        { merge: true }
      );
    }

    // Check coupon availability and apply if requested
    let couponApplied = false;
    let couponRemaining: number | undefined;
    let discounts: Stripe.Checkout.SessionCreateParams.Discount[] | undefined;

    if (applyCoupon) {
      const couponDoc = await db.collection('stripeCoupons').doc(LAUNCH_COUPON_ID).get();

      if (couponDoc.exists) {
        const couponData = couponDoc.data();
        const currentRedemptions = couponData?.currentRedemptions || 0;
        const maxRedemptions = couponData?.maxRedemptions || 100;

        couponRemaining = maxRedemptions - currentRedemptions;

        if (currentRedemptions < maxRedemptions) {
          // Use transaction to safely increment redemption count
          await db.runTransaction(async (transaction) => {
            const freshCouponDoc = await transaction.get(
              db.collection('stripeCoupons').doc(LAUNCH_COUPON_ID)
            );
            const freshData = freshCouponDoc.data();
            const freshCount = freshData?.currentRedemptions || 0;

            if (freshCount < maxRedemptions) {
              transaction.update(db.collection('stripeCoupons').doc(LAUNCH_COUPON_ID), {
                currentRedemptions: admin.firestore.FieldValue.increment(1),
                redeemedBy: admin.firestore.FieldValue.arrayUnion(userId),
              });
              couponApplied = true;
            }
          });

          if (couponApplied) {
            discounts = [{ coupon: LAUNCH_COUPON_ID }];
            couponRemaining = couponRemaining - 1;
          }
        }
      }
    }

    // Only yearly plans get a 14-day free trial
    const isYearly = priceId === 'yearly';
    const subscriptionData: Stripe.Checkout.SessionCreateParams.SubscriptionData = {
      metadata: {
        firebaseUserId: userId,
        platform: 'web',
        priceType: priceId,
      },
    };

    // Add trial period only for yearly plans
    if (isYearly) {
      subscriptionData.trial_period_days = 14;
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      subscription_data: subscriptionData,
      discounts,
      success_url: `${process.env.FRONTEND_URL || 'https://vault-app.com'}/vault/subscription-success?session_id={CHECKOUT_SESSION_ID}&plan=${priceId}`,
      cancel_url: `${process.env.FRONTEND_URL || 'https://vault-app.com'}/vault#pricing`,
      metadata: {
        firebaseUserId: userId,
        platform: 'web',
        priceType: priceId,
      },
    });

    if (!session.url) {
      throw new functions.https.HttpsError(
        'internal',
        'Failed to create checkout session URL'
      );
    }

    return {
      url: session.url,
      couponApplied,
      couponRemaining,
    };
  }
);
