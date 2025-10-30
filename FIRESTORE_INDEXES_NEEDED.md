# Firestore Indexes for RevenueCat Integration

The following composite indexes may be needed for optimal query performance.

## Required Indexes

### 1. Users Collection - Active Subscriptions Query

**Collection:** `users`
**Fields:**
- `subscriptionStatus` (Ascending)
- `subscriptionTier` (Ascending)

**Used by:** `revenueService.ts` - `calculateMRR()`, `getRevenueByTier()`

**Why:** Efficiently queries users with active subscriptions by tier

### 2. Revenue Events - Time-based Queries

**Collection:** `revenueEvents`
**Fields:**
- `userId` (Ascending)
- `timestamp` (Descending)

**Used by:** `revenueService.ts` - `getRevenueEvents()`

**Why:** Retrieves recent events for a specific user or all users

### 3. Revenue Events - Type and Date Range

**Collection:** `revenueEvents`
**Fields:**
- `type` (Ascending)
- `timestamp` (Descending)

**Used by:** Future analytics for specific event types

## Creating Indexes

### Option 1: Automatic Index Creation (Recommended)

1. Run the admin dashboard and navigate to the Revenue page
2. Firebase will detect missing indexes and provide links
3. Click the links to automatically create the indexes

### Option 2: Manual Creation via Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to Firestore → Indexes → Composite
4. Click **Create Index**
5. Add the fields listed above

### Option 3: Using firestore.indexes.json

Create or update `Vault/firestore.indexes.json`:

```json
{
  "indexes": [
    {
      "collectionGroup": "users",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "subscriptionStatus",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "subscriptionTier",
          "order": "ASCENDING"
        }
      ]
    },
    {
      "collectionGroup": "revenueEvents",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "userId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "timestamp",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "revenueEvents",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "type",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "timestamp",
          "order": "DESCENDING"
        }
      ]
    }
  ]
}
```

Deploy indexes:
```bash
cd /Users/simenguttormsen/Documents/Business/Vault
firebase deploy --only firestore:indexes
```

## Testing Index Performance

After creating indexes, monitor query performance:

1. Go to Firebase Console → Firestore → Usage
2. Check query execution times
3. Verify indexes are being used in the query plan

## Notes

- Index creation can take several minutes
- Existing data will be indexed automatically
- Composite indexes are required when filtering on multiple fields
- Single-field queries usually don't require indexes
