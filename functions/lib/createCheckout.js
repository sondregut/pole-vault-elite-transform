"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCheckout = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16',
});
const MONTHLY_PRICE_ID = process.env.VAULT_PRO_MONTHLY_PRICE_ID || '';
const YEARLY_PRICE_ID = process.env.VAULT_PRO_YEARLY_PRICE_ID || '';
const LAUNCH_COUPON_ID = process.env.LAUNCH_COUPON_ID || 'LAUNCH50';
exports.createCheckout = functions.https.onCall(async (data, context) => {
    var _a;
    // Verify user is authenticated
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated to create a checkout session');
    }
    const { priceId, userId, userEmail, applyCoupon } = data;
    // Validate input
    if (!priceId || !userId || !userEmail) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing required fields: priceId, userId, userEmail');
    }
    // Map price ID to actual Stripe price ID
    const stripePriceId = priceId === 'monthly' ? MONTHLY_PRICE_ID : YEARLY_PRICE_ID;
    if (!stripePriceId) {
        throw new functions.https.HttpsError('failed-precondition', 'Stripe price IDs not configured');
    }
    const db = admin.firestore();
    // Check if user already has an active subscription
    const userDoc = await db.collection('users').doc(userId).get();
    if (userDoc.exists) {
        const userData = userDoc.data();
        if ((userData === null || userData === void 0 ? void 0 : userData.subscriptionStatus) === 'active' &&
            ((userData === null || userData === void 0 ? void 0 : userData.subscriptionTier) === 'athlete' || (userData === null || userData === void 0 ? void 0 : userData.subscriptionTier) === 'athlete_plus')) {
            throw new functions.https.HttpsError('already-exists', 'User already has an active subscription');
        }
    }
    // Look up or create Stripe customer
    let stripeCustomerId;
    const existingCustomerId = (_a = userDoc.data()) === null || _a === void 0 ? void 0 : _a.stripeCustomerId;
    if (existingCustomerId) {
        stripeCustomerId = existingCustomerId;
    }
    else {
        // Search for existing customer by email
        const existingCustomers = await stripe.customers.list({
            email: userEmail,
            limit: 1,
        });
        if (existingCustomers.data.length > 0) {
            stripeCustomerId = existingCustomers.data[0].id;
        }
        else {
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
        await db.collection('users').doc(userId).set({ stripeCustomerId }, { merge: true });
    }
    // Check coupon availability and apply if requested
    let couponApplied = false;
    let couponRemaining;
    let discounts;
    if (applyCoupon) {
        const couponDoc = await db.collection('stripeCoupons').doc(LAUNCH_COUPON_ID).get();
        if (couponDoc.exists) {
            const couponData = couponDoc.data();
            const currentRedemptions = (couponData === null || couponData === void 0 ? void 0 : couponData.currentRedemptions) || 0;
            const maxRedemptions = (couponData === null || couponData === void 0 ? void 0 : couponData.maxRedemptions) || 100;
            couponRemaining = maxRedemptions - currentRedemptions;
            if (currentRedemptions < maxRedemptions) {
                // Use transaction to safely increment redemption count
                await db.runTransaction(async (transaction) => {
                    const freshCouponDoc = await transaction.get(db.collection('stripeCoupons').doc(LAUNCH_COUPON_ID));
                    const freshData = freshCouponDoc.data();
                    const freshCount = (freshData === null || freshData === void 0 ? void 0 : freshData.currentRedemptions) || 0;
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
    const subscriptionData = {
        metadata: {
            firebaseUserId: userId,
            platform: 'web',
            priceType: priceId,
        },
    };
    // Add trial period only for yearly plans (7-day free trial)
    if (isYearly) {
        subscriptionData.trial_period_days = 7;
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
        throw new functions.https.HttpsError('internal', 'Failed to create checkout session URL');
    }
    return {
        url: session.url,
        couponApplied,
        couponRemaining,
    };
});
//# sourceMappingURL=createCheckout.js.map