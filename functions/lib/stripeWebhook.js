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
exports.stripeWebhook = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16',
});
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }
    const sig = req.headers['stripe-signature'];
    if (!sig) {
        res.status(400).send('Missing stripe-signature header');
        return;
    }
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
    }
    catch (err) {
        functions.logger.error('Webhook signature verification failed:', err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }
    const db = admin.firestore();
    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                await handleCheckoutCompleted(db, session);
                break;
            }
            case 'customer.subscription.created':
            case 'customer.subscription.updated': {
                const subscription = event.data.object;
                await handleSubscriptionUpdate(db, subscription);
                break;
            }
            case 'customer.subscription.deleted': {
                const subscription = event.data.object;
                await handleSubscriptionDeleted(db, subscription);
                break;
            }
            case 'invoice.paid': {
                const invoice = event.data.object;
                await handleInvoicePaid(db, invoice);
                break;
            }
            case 'invoice.payment_failed': {
                const invoice = event.data.object;
                await handlePaymentFailed(db, invoice);
                break;
            }
            default:
                functions.logger.info(`Unhandled event type: ${event.type}`);
        }
        res.json({ received: true });
    }
    catch (error) {
        functions.logger.error('Error processing webhook:', error);
        res.status(500).send('Webhook processing error');
    }
});
async function handleCheckoutCompleted(db, session) {
    var _a, _b, _c;
    const userId = (_a = session.metadata) === null || _a === void 0 ? void 0 : _a.firebaseUserId;
    if (!userId) {
        functions.logger.error('No firebaseUserId in checkout session metadata');
        return;
    }
    // Get subscription details
    const subscriptionId = session.subscription;
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const trialEnd = subscription.trial_end
        ? new Date(subscription.trial_end * 1000).toISOString()
        : null;
    const currentPeriodEnd = subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000).toISOString()
        : null;
    // Determine price from subscription
    const priceId = (_b = subscription.items.data[0]) === null || _b === void 0 ? void 0 : _b.price.id;
    const priceAmount = ((_c = subscription.items.data[0]) === null || _c === void 0 ? void 0 : _c.price.unit_amount) || 0;
    await db.collection('users').doc(userId).set({
        subscriptionTier: 'athlete',
        subscriptionStatus: 'active',
        isTrialing: subscription.status === 'trialing',
        trialEndsAt: trialEnd,
        subscriptionExpiresAt: currentPeriodEnd,
        subscriptionPlatform: 'web',
        stripeCustomerId: session.customer,
        stripeSubscriptionId: subscriptionId,
        lastSubscriptionPrice: priceAmount / 100, // Convert from cents
        productId: priceId,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
    functions.logger.info(`Checkout completed for user ${userId}`);
}
async function handleSubscriptionUpdate(db, subscription) {
    var _a;
    const userId = (_a = subscription.metadata) === null || _a === void 0 ? void 0 : _a.firebaseUserId;
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
    }
    else {
        await updateUserSubscription(db, userId, subscription);
    }
}
async function updateUserSubscription(db, userId, subscription) {
    const isActive = ['active', 'trialing'].includes(subscription.status);
    const isTrialing = subscription.status === 'trialing';
    const trialEnd = subscription.trial_end
        ? new Date(subscription.trial_end * 1000).toISOString()
        : null;
    const currentPeriodEnd = subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000).toISOString()
        : null;
    await db.collection('users').doc(userId).set({
        subscriptionTier: isActive ? 'athlete' : 'free',
        subscriptionStatus: isActive ? 'active' : subscription.status,
        isTrialing,
        trialEndsAt: trialEnd,
        subscriptionExpiresAt: currentPeriodEnd,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
    functions.logger.info(`Subscription updated for user ${userId}: ${subscription.status}`);
}
async function handleSubscriptionDeleted(db, subscription) {
    var _a;
    const userId = (_a = subscription.metadata) === null || _a === void 0 ? void 0 : _a.firebaseUserId;
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
    await db.collection('users').doc(targetUserId).set({
        subscriptionTier: 'free',
        subscriptionStatus: 'cancelled',
        isTrialing: false,
        lastChurnDate: admin.firestore.FieldValue.serverTimestamp(),
        subscriptionCancelledAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
    functions.logger.info(`Subscription cancelled for user ${targetUserId}`);
}
async function handleInvoicePaid(db, invoice) {
    var _a, _b;
    const customerId = invoice.customer;
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
    const periodEnd = (_b = (_a = invoice.lines.data[0]) === null || _a === void 0 ? void 0 : _a.period) === null || _b === void 0 ? void 0 : _b.end;
    const expiresAt = periodEnd
        ? new Date(periodEnd * 1000).toISOString()
        : null;
    await db.collection('users').doc(userDoc.id).set({
        subscriptionStatus: 'active',
        subscriptionExpiresAt: expiresAt,
        isTrialing: false, // Invoice paid means trial is over
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
    functions.logger.info(`Invoice paid for user ${userDoc.id}`);
}
async function handlePaymentFailed(db, invoice) {
    const customerId = invoice.customer;
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
    await db.collection('users').doc(userDoc.id).set({
        subscriptionStatus: 'payment_failed',
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
    functions.logger.warn(`Payment failed for user ${userDoc.id}`);
}
//# sourceMappingURL=stripeWebhook.js.map