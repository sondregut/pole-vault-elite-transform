import * as admin from 'firebase-admin';

// Initialize Firebase Admin
admin.initializeApp();

// Export all functions
export { createCheckout } from './createCheckout';
export { stripeWebhook } from './stripeWebhook';
export { customerPortal } from './customerPortal';
export { checkCouponAvailability } from './checkCouponAvailability';
export { vaultChat } from './vaultChat';
export { generateGreeting } from './generateGreeting';
