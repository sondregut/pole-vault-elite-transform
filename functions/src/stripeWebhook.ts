import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export const stripeWebhook = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const sig = req.headers['stripe-signature'];

  if (!sig) {
    res.status(400).send('Missing stripe-signature header');
    return;
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
  } catch (err: any) {
    functions.logger.error('Webhook signature verification failed:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  const db = admin.firestore();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(db, session);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(db, subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(db, subscription);
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaid(db, invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(db, invoice);
        break;
      }

      default:
        functions.logger.info(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    functions.logger.error('Error processing webhook:', error);
    res.status(500).send('Webhook processing error');
  }
});

async function handleCheckoutCompleted(
  db: admin.firestore.Firestore,
  session: Stripe.Checkout.Session
) {
  const userId = session.metadata?.firebaseUserId;

  if (!userId) {
    functions.logger.error('No firebaseUserId in checkout session metadata');
    return;
  }

  // Get subscription details
  const subscriptionId = session.subscription as string;
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const trialEnd = subscription.trial_end
    ? new Date(subscription.trial_end * 1000).toISOString()
    : null;

  const currentPeriodEnd = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000).toISOString()
    : null;

  // Determine price from subscription
  const priceId = subscription.items.data[0]?.price.id;
  const priceAmount = subscription.items.data[0]?.price.unit_amount || 0;

  await db.collection('users').doc(userId).set(
    {
      subscriptionTier: 'athlete',
      subscriptionStatus: 'active',
      isTrialing: subscription.status === 'trialing',
      trialEndsAt: trialEnd,
      subscriptionExpiresAt: currentPeriodEnd,
      subscriptionPlatform: 'web',
      stripeCustomerId: session.customer as string,
      stripeSubscriptionId: subscriptionId,
      lastSubscriptionPrice: priceAmount / 100, // Convert from cents
      productId: priceId,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  functions.logger.info(`Checkout completed for user ${userId}`);
}

async function handleSubscriptionUpdate(
  db: admin.firestore.Firestore,
  subscription: Stripe.Subscription
) {
  const userId = subscription.metadata?.firebaseUserId;

  if (!userId) {
    // Try to find user by stripeSubscriptionId
    const usersSnapshot = await db
      .collection('users')
      .where('stripeSubscriptionId', '==', subscription.id)
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      functions.logger.error('Could not find user for subscription:', subscription.id);
      return;
    }

    const userDoc = usersSnapshot.docs[0];
    await updateUserSubscription(db, userDoc.id, subscription);
  } else {
    await updateUserSubscription(db, userId, subscription);
  }
}

async function updateUserSubscription(
  db: admin.firestore.Firestore,
  userId: string,
  subscription: Stripe.Subscription
) {
  const isActive = ['active', 'trialing'].includes(subscription.status);
  const isTrialing = subscription.status === 'trialing';

  const trialEnd = subscription.trial_end
    ? new Date(subscription.trial_end * 1000).toISOString()
    : null;

  const currentPeriodEnd = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000).toISOString()
    : null;

  await db.collection('users').doc(userId).set(
    {
      subscriptionTier: isActive ? 'athlete' : 'free',
      subscriptionStatus: isActive ? 'active' : subscription.status,
      isTrialing,
      trialEndsAt: trialEnd,
      subscriptionExpiresAt: currentPeriodEnd,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  functions.logger.info(`Subscription updated for user ${userId}: ${subscription.status}`);
}

async function handleSubscriptionDeleted(
  db: admin.firestore.Firestore,
  subscription: Stripe.Subscription
) {
  const userId = subscription.metadata?.firebaseUserId;

  let targetUserId = userId;

  if (!targetUserId) {
    // Try to find user by stripeSubscriptionId
    const usersSnapshot = await db
      .collection('users')
      .where('stripeSubscriptionId', '==', subscription.id)
      .limit(1)
      .get();

    if (!usersSnapshot.empty) {
      targetUserId = usersSnapshot.docs[0].id;
    }
  }

  if (!targetUserId) {
    functions.logger.error('Could not find user for deleted subscription:', subscription.id);
    return;
  }

  await db.collection('users').doc(targetUserId).set(
    {
      subscriptionTier: 'free',
      subscriptionStatus: 'cancelled',
      isTrialing: false,
      lastChurnDate: admin.firestore.FieldValue.serverTimestamp(),
      subscriptionCancelledAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  functions.logger.info(`Subscription cancelled for user ${targetUserId}`);
}

async function handleInvoicePaid(
  db: admin.firestore.Firestore,
  invoice: Stripe.Invoice
) {
  const customerId = invoice.customer as string;

  // Find user by stripeCustomerId
  const usersSnapshot = await db
    .collection('users')
    .where('stripeCustomerId', '==', customerId)
    .limit(1)
    .get();

  if (usersSnapshot.empty) {
    functions.logger.warn('No user found for customer:', customerId);
    return;
  }

  const userDoc = usersSnapshot.docs[0];

  // Update subscription expiry based on invoice period
  const periodEnd = invoice.lines.data[0]?.period?.end;
  const expiresAt = periodEnd
    ? new Date(periodEnd * 1000).toISOString()
    : null;

  await db.collection('users').doc(userDoc.id).set(
    {
      subscriptionStatus: 'active',
      subscriptionExpiresAt: expiresAt,
      isTrialing: false, // Invoice paid means trial is over
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  functions.logger.info(`Invoice paid for user ${userDoc.id}`);
}

async function handlePaymentFailed(
  db: admin.firestore.Firestore,
  invoice: Stripe.Invoice
) {
  const customerId = invoice.customer as string;

  // Find user by stripeCustomerId
  const usersSnapshot = await db
    .collection('users')
    .where('stripeCustomerId', '==', customerId)
    .limit(1)
    .get();

  if (usersSnapshot.empty) {
    functions.logger.warn('No user found for customer:', customerId);
    return;
  }

  const userDoc = usersSnapshot.docs[0];

  await db.collection('users').doc(userDoc.id).set(
    {
      subscriptionStatus: 'payment_failed',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  functions.logger.warn(`Payment failed for user ${userDoc.id}`);
}
