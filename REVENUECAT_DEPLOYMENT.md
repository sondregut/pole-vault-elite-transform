# RevenueCat Integration - Deployment Guide

This guide walks through deploying and testing the RevenueCat integration for accurate revenue tracking.

## What Was Implemented

### 1. Firebase Cloud Function - RevenueCat Webhook Handler
**Location:** `Vault/functions/notifications.js`

**Features:**
- Receives webhooks from RevenueCat for subscription events
- Saves all events to `revenueEvents` collection for historical tracking
- Updates user documents with subscription status and actual prices
- Handles events: INITIAL_PURCHASE, RENEWAL, CANCELLATION, EXPIRATION, PRODUCT_CHANGE, BILLING_ISSUE

**New Firestore Collections:**
- `revenueEvents` - Stores all subscription events with actual prices and timestamps

**Updated User Document Fields:**
- `subscriptionStatus` - 'active', 'cancelled', 'expired', 'payment_failed'
- `subscriptionExpiresAt` - When subscription expires (from RevenueCat)
- `lastSubscriptionPrice` - Actual price paid (from RevenueCat)
- `lastRevenueEvent` - Last event type received
- `lastRevenueEventAt` - Timestamp of last event

### 2. iOS App - Subscription Status Sync
**Location:** `Vault/src/contexts/SubscriptionContext.tsx`

**Features:**
- Syncs subscription status on app launch via `refreshSubscriptionStatus()`
- Updates Firestore with current subscription status from RevenueCat
- Tracks actual subscription price from product mapping
- Checks subscription expiration and updates status accordingly

### 3. Web Dashboard - Revenue Service Updates
**Location:** `GForce/pole-vault-elite-transform/src/services/revenueService.ts`

**Features:**
- `calculateMRR()` - Now queries only users with `subscriptionStatus === 'active'`
- Uses actual prices from `lastSubscriptionPrice` field when available
- Converts yearly subscriptions to monthly for accurate MRR
- `getRevenueByTier()` - Tracks revenue per tier with actual prices
- `getConversionFunnel()` - Uses active status for accurate conversion tracking
- `getChurnRate()` - Tracks actual cancellations vs active subscriptions

## Deployment Steps

### Step 1: Deploy Firebase Cloud Functions

```bash
cd /Users/simenguttormsen/Documents/Business/Vault/functions
firebase deploy --only functions:revenueCatWebhook
```

After deployment, note the function URL:
```
https://YOUR_REGION-YOUR_PROJECT_ID.cloudfunctions.net/revenueCatWebhook
```

### Step 2: Configure RevenueCat Webhook

1. Go to [RevenueCat Dashboard](https://app.revenuecat.com/)
2. Navigate to your project
3. Go to **Project Settings** → **Integrations** → **Webhooks**
4. Click **Add New Webhook**
5. Enter the webhook URL from Step 1
6. Select the following events:
   - ✅ Initial Purchase
   - ✅ Renewal
   - ✅ Cancellation
   - ✅ Expiration
   - ✅ Billing Issue
   - ✅ Product Change
7. (Optional) Add an authorization header for security
8. Click **Save**
9. Click **Test** to verify the webhook works

### Step 3: Update Firestore Security Rules

Add rules for the new `revenueEvents` collection:

```javascript
// In Vault/firestore.rules
match /revenueEvents/{eventId} {
  // Only allow reads by authenticated users (for admin dashboard)
  allow read: if request.auth != null;
  // Only Cloud Functions can write
  allow write: if false;
}
```

Deploy the updated rules:
```bash
cd /Users/simenguttormsen/Documents/Business/Vault
firebase deploy --only firestore:rules
```

### Step 4: Update Web Dashboard

The revenue service is already updated. If you need to deploy the web dashboard:

```bash
cd /Users/simenguttormsen/Documents/Business/GForce/pole-vault-elite-transform
npm run build
# Deploy to your hosting platform (Vercel, Netlify, etc.)
```

### Step 5: Test iOS App Sync

The iOS app already syncs subscription status on launch via `SubscriptionContext`. No deployment needed - the changes are part of the existing app code.

## Testing the Integration

### Test 1: Verify Webhook Connection

1. In RevenueCat Dashboard, go to Webhooks
2. Click **Test** on your webhook
3. Check Firebase Console → Functions → Logs
4. You should see: "RevenueCat webhook received"

### Test 2: Test Purchase Flow

1. Make a test purchase in the iOS app using a sandbox account
2. Check Firestore:
   - Navigate to `users/{userId}`
   - Verify `subscriptionStatus` is 'active'
   - Verify `lastSubscriptionPrice` has the correct price
   - Navigate to `revenueEvents` collection
   - Verify a new event document with type 'INITIAL_PURCHASE' exists

3. Check the admin dashboard:
   - Navigate to the Revenue page
   - MRR should reflect the new subscription
   - User should appear in the conversion funnel as paid

### Test 3: Test Subscription Status Sync

1. Launch the iOS app (or refresh subscription status)
2. Check Firestore console for the user document
3. Verify fields are updated:
   - `subscriptionStatus`: 'active'
   - `subscriptionExpiresAt`: Future date
   - `lastSubscriptionPrice`: Actual price

### Test 4: Test Cancellation

1. In RevenueCat Dashboard, cancel a test subscription
2. Check Firestore:
   - User's `subscriptionStatus` should be 'cancelled'
   - `subscriptionCancelledAt` should have a timestamp
   - A new event in `revenueEvents` with type 'CANCELLATION'

3. Check admin dashboard:
   - MRR should decrease
   - Churn rate should update

### Test 5: Verify Revenue Calculations

1. Go to admin dashboard Revenue page
2. Check that MRR only counts users with `subscriptionStatus === 'active'`
3. Verify that prices match actual RevenueCat prices
4. Check conversion funnel shows accurate trial vs paid counts

## Monitoring

### Check Revenue Events

Query revenue events in Firestore:
```javascript
// In Firebase Console
collection: revenueEvents
orderBy: timestamp (descending)
limit: 50
```

### Check Cloud Function Logs

```bash
firebase functions:log --only revenueCatWebhook
```

Or in Firebase Console:
1. Go to Functions → Dashboard
2. Click on `revenueCatWebhook`
3. View execution logs

### Monitor Active Subscriptions

Query active users in Firestore:
```javascript
collection: users
where: subscriptionStatus == 'active'
```

## Troubleshooting

### Webhook Not Receiving Events

1. Check webhook URL is correct in RevenueCat dashboard
2. Verify Cloud Function is deployed: `firebase functions:list`
3. Check function logs for errors
4. Test webhook manually from RevenueCat dashboard

### Revenue Not Updating in Dashboard

1. Check Firestore to verify user documents have `subscriptionStatus === 'active'`
2. Verify `lastSubscriptionPrice` field exists on user documents
3. Check browser console for errors in revenue service
4. Clear browser cache and reload dashboard

### iOS App Not Syncing Status

1. Check that app is calling `refreshSubscriptionStatus()` on launch
2. Verify RevenueCat SDK is properly initialized
3. Check app logs for RevenueCat errors
4. Verify Firebase connection in app

### Price Tracking Not Working

1. Verify product IDs match the price map in `SubscriptionContext.tsx`
2. Check that RevenueCat entitlements include product identifiers
3. Update price map if product IDs have changed
4. Check webhook events include `price_in_purchased_currency`

## Next Steps

### Optional Enhancements

1. **Historical Revenue Tracking**: Use `revenueEvents` to build revenue over time charts
2. **Failed Payment Alerts**: Add email notifications for billing issues
3. **Revenue Forecasting**: Analyze renewal patterns for predictions
4. **Advanced Analytics**: Track cohort retention and LTV

### Recommended Monitoring

1. Set up Firebase alerts for function errors
2. Create dashboard for daily MRR tracking
3. Monitor webhook failures in RevenueCat
4. Regular audits of subscription vs revenue data

## Summary

You now have:
- ✅ Real-time webhook integration with RevenueCat
- ✅ Historical revenue event tracking in Firestore
- ✅ Accurate MRR based on actual active subscriptions
- ✅ Actual price tracking from RevenueCat
- ✅ iOS app syncing subscription status on launch
- ✅ Admin dashboard showing accurate revenue metrics

The integration replaces estimated revenue with real RevenueCat data, ensuring accurate tracking of:
- Active vs cancelled subscriptions
- Actual prices paid (not hardcoded estimates)
- Trial conversions
- Churn rate
- MRR and ARR

## Support

For issues or questions:
1. Check Firebase function logs
2. Review RevenueCat webhook logs
3. Verify Firestore data structure
4. Test with sandbox subscriptions first
