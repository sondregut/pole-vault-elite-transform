import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

interface PortalRequest {
  userId: string;
}

interface PortalResponse {
  url: string;
}

export const customerPortal = functions.https.onCall(
  async (data: PortalRequest, context): Promise<PortalResponse> => {
    // Verify user is authenticated
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'User must be authenticated to access the customer portal'
      );
    }

    const { userId } = data;

    // Ensure the authenticated user matches the requested userId
    if (context.auth.uid !== userId) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'You can only access your own customer portal'
      );
    }

    const db = admin.firestore();

    // Get user's Stripe customer ID
    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      throw new functions.https.HttpsError(
        'not-found',
        'User not found'
      );
    }

    const userData = userDoc.data();
    const stripeCustomerId = userData?.stripeCustomerId;

    if (!stripeCustomerId) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'No Stripe customer found for this user. Please subscribe first.'
      );
    }

    // Create billing portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${process.env.FRONTEND_URL || 'https://vault-app.com'}/vault/dashboard`,
    });

    return {
      url: session.url,
    };
  }
);
