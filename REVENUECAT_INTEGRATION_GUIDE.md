# RevenueCat Integration for Accurate Revenue Tracking

**Purpose:** Replace estimated revenue calculations with real RevenueCat subscription data

**Current Issue:** The admin dashboard calculates revenue based on `subscriptionTier` field with hardcoded prices ($9.99, $19.99), which may not reflect actual subscription status or pricing.

---

## The Problem with Current Implementation

### What the Dashboard Does Now:
```typescript
// Current logic in revenueService.ts
if (tier === 'athlete') {
  mrr += 9.99;  // ❌ Assumes $9.99 - might not be accurate
}
```

### Issues:
- ❌ Doesn't know if subscription is actually active
- ❌ Doesn't account for price changes or promotions
- ❌ Doesn't track actual payment status
- ❌ Doesn't know if payment failed
- ❌ Can't track historical revenue
- ❌ Doesn't handle refunds or grace periods

---

## Solution: RevenueCat Webhook Integration

### How It Works:

1. **RevenueCat sends webhook** when subscription events occur
2. **Firebase Cloud Function receives** the webhook
3. **Data saved to Firestore** in `revenueEvents` collection
4. **Admin dashboard reads** real revenue data

---

## Implementation Steps

### Step 1: Set Up RevenueCat Webhook (Backend)

#### A. Create Webhook Handler Cloud Function

**File:** `functions/src/webhooks/revenuecatWebhook.ts`

**What to implement:**

The Cloud Function should:
1. Listen for HTTPS POST requests from RevenueCat
2. Verify webhook signature (security)
3. Parse the event data
4. Save to `revenueEvents` collection
5. Update user document with subscription status

**RevenueCat Event Types to Handle:**
- `INITIAL_PURCHASE` - First subscription purchase
- `RENEWAL` - Subscription renewed
- `CANCELLATION` - User cancelled (but still has access until period ends)
- `EXPIRATION` - Subscription expired (access ended)
- `BILLING_ISSUE` - Payment failed
- `PRODUCT_CHANGE` - Upgraded/downgraded

**Data to Save to Firestore:**

Collection: `revenueEvents`
```typescript
{
  type: 'INITIAL_PURCHASE' | 'RENEWAL' | 'CANCELLATION' | etc,
  userId: string,                    // RevenueCat app_user_id
  productId: string,                 // e.g., "athlete_monthly"
  price: number,                     // Actual price paid
  currency: string,                  // e.g., "USD"
  purchasedAt: Timestamp,
  expiresAt: Timestamp,
  store: 'app_store',               // Always app_store for iOS
  periodType: 'normal' | 'trial',
  timestamp: serverTimestamp()
}
```

**Data to Update in User Document:**

```typescript
users/{userId}:
{
  subscriptionTier: 'athlete' | 'athlete_plus',
  subscriptionStatus: 'active' | 'cancelled' | 'expired',
  subscriptionStartedAt: ISO date,
  subscriptionExpiresAt: ISO date,
  lastRevenueEvent: 'RENEWAL' | 'CANCELLATION' | etc,
  lastRevenueEventAt: ISO date
}
```

#### B. Deploy the Webhook Function

```bash
cd /Users/simenguttormsen/Documents/Business/Vault/functions
firebase deploy --only functions:revenuecatWebhook
```

#### C. Configure RevenueCat to Send Webhooks

1. Go to RevenueCat Dashboard
2. Navigate to Project Settings → Webhooks
3. Add new webhook URL: `https://YOUR_REGION-YOUR_PROJECT_ID.cloudfunctions.net/revenuecatWebhook`
4. Select events to send:
   - ✅ Initial Purchase
   - ✅ Renewal
   - ✅ Cancellation
   - ✅ Expiration
   - ✅ Billing Issue
   - ✅ Product Change
5. Set authorization header (webhook secret)
6. Save and test

---

### Step 2: Update Revenue Service (Web Dashboard)

#### Current Implementation (Estimated):
```typescript
// In revenueService.ts
async calculateMRR() {
  // Counts users with tier='athlete' and multiplies by $9.99
  // ❌ Not accurate - doesn't check if subscription is actually active
}
```

#### New Implementation (RevenueCat Data):

**Option A: Use Revenue Events (Recommended)**

```typescript
async calculateMRR() {
  // Get all users with active subscriptions
  const usersRef = collection(db, 'users');
  const activeQuery = query(
    usersRef,
    where('subscriptionStatus', '==', 'active')
  );

  const snapshot = await getDocs(activeQuery);
  let mrr = 0;

  snapshot.forEach(doc => {
    const data = doc.data();

    // Get actual price from last revenue event
    // or calculate from subscriptionTier if no event data
    const price = data.lastSubscriptionPrice || this.getDefaultPrice(data.subscriptionTier);

    mrr += price;
  });

  return mrr;
}
```

**Option B: Query Revenue Events Directly**

```typescript
async calculateMRR() {
  const eventsRef = collection(db, 'revenueEvents');

  // Get most recent event for each user
  const snapshot = await getDocs(eventsRef);

  const activeSubscriptions = new Map();

  snapshot.forEach(doc => {
    const event = doc.data();
    const userId = event.userId;

    // Keep only the most recent event per user
    const existing = activeSubscriptions.get(userId);
    if (!existing || event.purchasedAt > existing.purchasedAt) {
      // Check if subscription is still active
      const expiresAt = event.expiresAt?.toDate?.() || new Date(event.expiresAt);
      const isActive = expiresAt > new Date();

      if (isActive && event.type !== 'EXPIRATION' && event.type !== 'BILLING_ISSUE') {
        activeSubscriptions.set(userId, event);
      }
    }
  });

  let mrr = 0;
  activeSubscriptions.forEach(event => {
    mrr += event.price || 0;
  });

  return mrr;
}
```

---

### Step 3: Add Subscription Fields to iOS App

#### When User Purchases Subscription

**Where:** Your subscription purchase handler (likely where you call RevenueCat)

**What to add:**

```typescript
// After successful purchase from RevenueCat
await firestore()
  .collection('users')
  .doc(userId)
  .update({
    subscriptionTier: productId.includes('plus') ? 'athlete_plus' : 'athlete',
    subscriptionStatus: 'active',
    subscriptionStartedAt: new Date().toISOString(),
    subscriptionExpiresAt: expirationDate.toISOString(),
    lastSubscriptionPrice: price, // Get from RevenueCat
    subscriptionPlatform: 'ios'
  });
```

#### When Checking Subscription Status

**Where:** App launch or when checking subscription

**What to update:**

RevenueCat SDK provides current entitlements. Sync to Firestore:

```typescript
// Get current subscription status from RevenueCat
const customerInfo = await Purchases.getCustomerInfo();
const entitlement = customerInfo.entitlements.active['pro']; // or your entitlement ID

if (entitlement) {
  // User has active subscription
  await firestore()
    .collection('users')
    .doc(userId)
    .update({
      subscriptionStatus: 'active',
      subscriptionExpiresAt: new Date(entitlement.expirationDate).toISOString(),
      subscriptionTier: entitlement.productIdentifier.includes('plus') ? 'athlete_plus' : 'athlete'
    });
} else {
  // No active subscription
  await firestore()
    .collection('users')
    .doc(userId)
    .update({
      subscriptionStatus: 'expired',
      subscriptionTier: 'free'
    });
}
```

---

## Quick Implementation Path

### Fastest Way to Get Accurate Revenue (No Backend):

**Option: Sync RevenueCat Status on App Launch**

1. **On app launch,** query RevenueCat for current subscription
2. **Update Firestore** user document with:
   - `subscriptionStatus: 'active' | 'expired'`
   - `subscriptionExpiresAt: date`
   - `subscriptionTier: tier`
3. **Update revenue service** to only count users with `subscriptionStatus === 'active'`

**Estimated time:** 1-2 hours iOS app work
**No backend needed!**

This gives you accurate "right now" revenue, but not historical data.

---

### Best Way to Get Complete Revenue Tracking (With Backend):

**Setup RevenueCat Webhook + Cloud Function**

**What you get:**
- ✅ Real-time revenue event tracking
- ✅ Historical revenue data
- ✅ Accurate MRR/ARR calculations
- ✅ Churn tracking (actual cancellations)
- ✅ Revenue trends over time
- ✅ Failed payment tracking

**Estimated time:**
- Backend: 2-3 hours
- iOS app sync: 1 hour
- **Total: 3-4 hours**

---

## Recommended Approach

### Phase 1: Quick Fix (1-2 hours)
1. Update iOS app to sync RevenueCat status on launch
2. Update revenue service to check `subscriptionStatus === 'active'`
3. Get accurate current MRR immediately

### Phase 2: Full Integration (2-3 hours)
1. Set up RevenueCat webhook
2. Create Cloud Function handler
3. Enable historical tracking and trends

---

## What to Tell Claude Code (Vault App)

**For Quick Fix (No Backend):**

```
In the Vault iOS app, implement RevenueCat subscription status syncing:

1. On app launch (after authentication), query RevenueCat for current subscription status
2. Update the user document in Firestore with:
   - subscriptionStatus: 'active' or 'expired'
   - subscriptionExpiresAt: expiration date from RevenueCat
   - subscriptionTier: product tier from RevenueCat
   - lastSubscriptionPrice: price from RevenueCat (if available)

Use the RevenueCat SDK's Purchases.getCustomerInfo() method.

Location: Likely in your auth context or app initialization where you check subscription status.
```

**For Full Webhook (Backend):**

```
In the Vault app functions directory, create a RevenueCat webhook handler:

1. Create a Cloud Function that receives HTTPS POST webhooks from RevenueCat
2. Verify webhook signature for security
3. Parse RevenueCat event data (INITIAL_PURCHASE, RENEWAL, CANCELLATION, etc.)
4. Save events to Firestore collection 'revenueEvents'
5. Update user document with current subscription status
6. Deploy the function
7. Configure the webhook URL in RevenueCat dashboard

See the RevenueCat webhook documentation for event format and signature verification.
```

---

## Key RevenueCat Fields to Track

From RevenueCat webhook/SDK:
- `app_user_id` → Your userId
- `product_id` → The subscription product
- `price_in_purchased_currency` → Actual price paid
- `currency` → USD, EUR, etc.
- `period_type` → 'normal' or 'trial'
- `expiration_at_ms` → When subscription expires
- `purchased_at_ms` → When purchased
- `store` → 'app_store' for iOS

---

## Testing the Integration

### After Implementation:

1. **Make a test purchase** in the app
2. **Check Firestore:**
   - User document updated with `subscriptionStatus: 'active'`
   - (If webhook) `revenueEvents` has new document
3. **Check admin dashboard:**
   - MRR shows accurate number
   - User appears in Revenue tab
   - Conversion funnel accurate

---

## Summary

**Current:** Dashboard uses estimated revenue based on tier
**Goal:** Dashboard uses actual RevenueCat subscription data

**Quick Path:** iOS app syncs RevenueCat status (1-2 hours)
**Complete Path:** Webhook + Cloud Function (3-4 hours)

**Which approach would you like to take?**
