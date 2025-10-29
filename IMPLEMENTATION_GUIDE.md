# Vault Admin Dashboard - Step-by-Step Implementation Guide

**Created:** January 28, 2025
**Purpose:** Actionable implementation steps for the admin dashboard expansion

---

## Prerequisites Checklist

Before starting implementation, ensure you have:

- [ ] Firebase project set up and configured
- [ ] Firebase CLI installed (`npm install -g firebase-tools`)
- [ ] Access to Firebase Console
- [ ] Access to RevenueCat dashboard
- [ ] Node.js 18+ installed
- [ ] Understanding of current codebase structure

---

## Phase 0: Foundation Setup (Days 1-3)

### Day 1: Firebase Functions Setup

**Step 1.1: Initialize Firebase Functions**
```bash
# In project root
firebase init functions

# Select options:
# - TypeScript
# - ESLint
# - Install dependencies
```

**Step 1.2: Install Required Dependencies**
```bash
cd functions
npm install firebase-admin firebase-functions
npm install --save-dev @types/node
```

**Step 1.3: Create Functions Directory Structure**
```bash
mkdir -p src/services
mkdir -p src/utils
mkdir -p src/types
```

**Step 1.4: Create Base Configuration**
- File: `functions/src/config.ts`
```typescript
export const config = {
  revenueCat: {
    webhookSecret: process.env.REVENUECAT_WEBHOOK_SECRET,
  },
  notifications: {
    fcmServerKey: process.env.FCM_SERVER_KEY,
  },
  schedules: {
    dailyAggregation: '0 0 * * *', // Midnight daily
    hourlyMetrics: '0 * * * *',   // Every hour
  },
};
```

**Step 1.5: Set Environment Variables**
```bash
firebase functions:config:set revenuecat.webhook_secret="YOUR_SECRET"
firebase functions:config:set fcm.server_key="YOUR_KEY"
```

**Step 1.6: Deploy Initial Setup**
```bash
firebase deploy --only functions
```

### Day 2: Firestore Collections Setup

**Step 2.1: Create Firestore Indexes**
- File: `firestore.indexes.json`
```json
{
  "indexes": [
    {
      "collectionGroup": "users",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "subscriptionTier", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "sessions",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "reports",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "timestamp", "order": "DESCENDING" }
      ]
    }
  ]
}
```

**Step 2.2: Deploy Indexes**
```bash
firebase deploy --only firestore:indexes
```

**Step 2.3: Create Security Rules for New Collections**
- File: `firestore.rules` - Add rules for new collections:
```javascript
match /revenueEvents/{eventId} {
  allow read, write: if false; // Only Cloud Functions
}
match /errorLogs/{logId} {
  allow write: if request.auth != null;
  allow read: if false; // Only admin
}
match /reports/{reportId} {
  allow create: if request.auth != null;
  allow read, update: if false; // Only admin
}
match /featureFlags/{flagId} {
  allow read: if request.auth != null;
  allow write: if false; // Only admin
}
match /metrics/{document=**} {
  allow read, write: if false; // Only Cloud Functions
}
```

**Step 2.4: Deploy Security Rules**
```bash
firebase deploy --only firestore:rules
```

### Day 3: Mobile App Foundation Updates

**Step 3.1: Add Required Fields to User Model**
- File: `mobile-app/models/User.ts` (or equivalent)
```typescript
interface User {
  // Existing fields...

  // Phase 1: Analytics
  lastLoginAt?: string;
  deviceInfo?: {
    platform: 'iOS' | 'Android';
    osVersion: string;
    appVersion: string;
  };
  signupMethod?: 'email' | 'google' | 'apple' | 'phone';

  // Phase 2: Revenue
  subscriptionStartedAt?: string;
  subscriptionCancelledAt?: string;
  subscriptionPlatform?: 'ios' | 'android';
  subscriptionPrice?: number;

  // Phase 3: Moderation
  isBanned?: boolean;

  // Phase 4: Notifications
  fcmToken?: string;
  notificationPreferences?: {
    marketing: boolean;
    social: boolean;
    training: boolean;
  };
}
```

**Step 3.2: Update User Document on App Launch**
- File: `mobile-app/services/AuthService.ts`
```typescript
async function updateUserLoginInfo() {
  const deviceInfo = {
    platform: Platform.OS,
    osVersion: Platform.Version,
    appVersion: getAppVersion(),
  };

  await firestore()
    .collection('users')
    .doc(currentUserId)
    .update({
      lastLoginAt: firestore.FieldValue.serverTimestamp(),
      deviceInfo,
    });
}

// Call on app launch/authentication
```

**Step 3.3: Test Mobile Updates**
- [ ] Run mobile app on iOS simulator
- [ ] Run mobile app on Android emulator
- [ ] Verify user document updates in Firestore Console
- [ ] Check deviceInfo and lastLoginAt fields

---

## Phase 1: User Insights & Analytics (Days 4-10)

### Day 4: Analytics Service (Website)

**Step 4.1: Create Analytics Service**
- File: `src/services/analyticsService.ts`

```typescript
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';

export class AnalyticsService {
  // Daily Active Users
  async calculateDAU(date: Date = new Date()): Promise<number> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const usersRef = collection(db, 'users');
    const q = query(
      usersRef,
      where('lastLoginAt', '>=', Timestamp.fromDate(startOfDay)),
      where('lastLoginAt', '<=', Timestamp.fromDate(endOfDay))
    );

    const snapshot = await getDocs(q);
    return snapshot.size;
  }

  // Weekly Active Users
  async calculateWAU(): Promise<number> {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const usersRef = collection(db, 'users');
    const q = query(
      usersRef,
      where('lastLoginAt', '>=', Timestamp.fromDate(weekAgo))
    );

    const snapshot = await getDocs(q);
    return snapshot.size;
  }

  // Monthly Active Users
  async calculateMAU(): Promise<number> {
    const now = new Date();
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const usersRef = collection(db, 'users');
    const q = query(
      usersRef,
      where('lastLoginAt', '>=', Timestamp.fromDate(monthAgo))
    );

    const snapshot = await getDocs(q);
    return snapshot.size;
  }

  // User Growth Data (last 30 days)
  async getUserGrowthData(): Promise<Array<{ date: string; count: number }>> {
    const usersRef = collection(db, 'users');
    const q = query(usersRef);
    const snapshot = await getDocs(q);

    // Group by signup date
    const growthMap = new Map<string, number>();

    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.createdAt) {
        const date = data.createdAt.toDate().toISOString().split('T')[0];
        growthMap.set(date, (growthMap.get(date) || 0) + 1);
      }
    });

    // Convert to array and sort
    return Array.from(growthMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  // Device Breakdown
  async getDeviceBreakdown(): Promise<{ iOS: number; Android: number; unknown: number }> {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);

    const breakdown = { iOS: 0, Android: 0, unknown: 0 };

    snapshot.forEach((doc) => {
      const data = doc.data();
      const platform = data.deviceInfo?.platform;

      if (platform === 'iOS') breakdown.iOS++;
      else if (platform === 'Android') breakdown.Android++;
      else breakdown.unknown++;
    });

    return breakdown;
  }

  // Engagement Metrics
  async getEngagementMetrics(): Promise<{
    avgSessionsPerUser: number;
    avgJumpsPerSession: number;
    totalSessions: number;
  }> {
    const sessionsRef = collection(db, 'sessions');
    const sessionsSnapshot = await getDocs(sessionsRef);

    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersRef);

    let totalJumps = 0;
    const totalSessions = sessionsSnapshot.size;

    sessionsSnapshot.forEach((doc) => {
      const data = doc.data();
      totalJumps += data.jumps?.length || 0;
    });

    return {
      avgSessionsPerUser: totalSessions / usersSnapshot.size,
      avgJumpsPerSession: totalJumps / totalSessions,
      totalSessions,
    };
  }
}

export const analyticsService = new AnalyticsService();
```

**Step 4.2: Test Analytics Service**
- Create test file: `src/services/__tests__/analyticsService.test.ts`
- Test each function with mock data
- Verify calculations are correct

### Day 5: User Insights Page (Website)

**Step 5.1: Create User Insights Page Component**
- File: `src/pages/VaultAdminUserInsights.tsx`

```typescript
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { analyticsService } from '@/services/analyticsService';

export default function VaultAdminUserInsights() {
  const [dau, setDau] = useState<number>(0);
  const [wau, setWau] = useState<number>(0);
  const [mau, setMau] = useState<number>(0);
  const [growthData, setGrowthData] = useState<Array<{ date: string; count: number }>>([]);
  const [deviceBreakdown, setDeviceBreakdown] = useState({ iOS: 0, Android: 0, unknown: 0 });
  const [engagement, setEngagement] = useState({ avgSessionsPerUser: 0, avgJumpsPerSession: 0, totalSessions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    setLoading(true);
    try {
      const [dauData, wauData, mauData, growth, devices, engagementData] = await Promise.all([
        analyticsService.calculateDAU(),
        analyticsService.calculateWAU(),
        analyticsService.calculateMAU(),
        analyticsService.getUserGrowthData(),
        analyticsService.getDeviceBreakdown(),
        analyticsService.getEngagementMetrics(),
      ]);

      setDau(dauData);
      setWau(wauData);
      setMau(mauData);
      setGrowthData(growth);
      setDeviceBreakdown(devices);
      setEngagement(engagementData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  }

  const pieData = [
    { name: 'iOS', value: deviceBreakdown.iOS, color: '#007AFF' },
    { name: 'Android', value: deviceBreakdown.Android, color: '#3DDC84' },
    { name: 'Unknown', value: deviceBreakdown.unknown, color: '#999' },
  ];

  if (loading) {
    return <div className="p-8">Loading analytics...</div>;
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">User Insights</h1>

      {/* Active Users Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Daily Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{dau}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{wau}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{mau}</div>
          </CardContent>
        </Card>
      </div>

      {/* User Growth Chart */}
      <Card>
        <CardHeader>
          <CardTitle>User Growth (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#8884d8" name="New Users" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Device Breakdown & Engagement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Device Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Engagement Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm text-gray-600">Avg Sessions per User</div>
              <div className="text-2xl font-bold">{engagement.avgSessionsPerUser.toFixed(1)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Avg Jumps per Session</div>
              <div className="text-2xl font-bold">{engagement.avgJumpsPerSession.toFixed(1)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Total Sessions</div>
              <div className="text-2xl font-bold">{engagement.totalSessions}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

**Step 5.2: Add Route to VaultAdmin Navigation**
- File: `src/pages/VaultAdmin.tsx`
- Add "User Insights" tab to the navigation tabs

```typescript
const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'users', label: 'Users' },
  { id: 'promo-codes', label: 'Promo Codes' },
  { id: 'user-insights', label: 'User Insights' }, // Add this
];

// In the render section:
{activeTab === 'user-insights' && <VaultAdminUserInsights />}
```

### Day 6-7: Testing Phase 1

**Step 6.1: Manual Testing**
- [ ] Navigate to User Insights page
- [ ] Verify DAU/WAU/MAU calculations
- [ ] Check user growth chart displays correctly
- [ ] Verify device breakdown pie chart
- [ ] Test engagement metrics accuracy

**Step 6.2: Performance Testing**
- [ ] Test with large dataset (500+ users)
- [ ] Check page load time (should be < 3 seconds)
- [ ] Monitor Firestore read count
- [ ] Optimize queries if needed

**Step 6.3: Mobile App Testing**
- [ ] Verify lastLoginAt updates on app launch
- [ ] Check deviceInfo is saved correctly
- [ ] Test on both iOS and Android
- [ ] Verify data appears in Firestore Console

### Day 8-10: Firebase Function - Daily Metrics Aggregation

**Step 8.1: Create Daily Aggregation Function**
- File: `functions/src/scheduledFunctions/dailyMetricsAggregation.ts`

```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const dailyMetricsAggregation = functions.pubsub
  .schedule('0 0 * * *') // Midnight daily
  .timeZone('America/New_York')
  .onRun(async (context) => {
    const db = admin.firestore();
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];

    console.log(`Running daily aggregation for ${dateStr}`);

    try {
      // Calculate DAU
      const startOfDay = new Date(today);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(today);
      endOfDay.setHours(23, 59, 59, 999);

      const usersSnapshot = await db.collection('users')
        .where('lastLoginAt', '>=', admin.firestore.Timestamp.fromDate(startOfDay))
        .where('lastLoginAt', '<=', admin.firestore.Timestamp.fromDate(endOfDay))
        .get();

      const dau = usersSnapshot.size;

      // Calculate WAU
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const wauSnapshot = await db.collection('users')
        .where('lastLoginAt', '>=', admin.firestore.Timestamp.fromDate(weekAgo))
        .get();

      const wau = wauSnapshot.size;

      // Calculate MAU
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      const mauSnapshot = await db.collection('users')
        .where('lastLoginAt', '>=', admin.firestore.Timestamp.fromDate(monthAgo))
        .get();

      const mau = mauSnapshot.size;

      // Get total users
      const allUsersSnapshot = await db.collection('users').get();
      const totalUsers = allUsersSnapshot.size;

      // Save to metrics collection
      await db.collection('metrics').doc(`daily_${dateStr}`).set({
        date: dateStr,
        dau,
        wau,
        mau,
        totalUsers,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`Daily metrics saved: DAU=${dau}, WAU=${wau}, MAU=${mau}`);
      return null;
    } catch (error) {
      console.error('Error in daily aggregation:', error);
      throw error;
    }
  });
```

**Step 8.2: Update Index File**
- File: `functions/src/index.ts`

```typescript
import { dailyMetricsAggregation } from './scheduledFunctions/dailyMetricsAggregation';

export { dailyMetricsAggregation };
```

**Step 8.3: Deploy Function**
```bash
cd functions
npm run build
firebase deploy --only functions:dailyMetricsAggregation
```

**Step 8.4: Test Scheduled Function**
```bash
# Trigger manually for testing
firebase functions:shell
> dailyMetricsAggregation()
```

**Step 8.5: Update Analytics Service to Use Cached Data**
- File: `src/services/analyticsService.ts`
- Add method to fetch from metrics collection:

```typescript
async getMetricsFromCache(date: string): Promise<any> {
  const metricsRef = doc(db, 'metrics', `daily_${date}`);
  const snapshot = await getDoc(metricsRef);

  if (snapshot.exists()) {
    return snapshot.data();
  }

  // Fallback to real-time calculation
  return null;
}
```

---

## Phase 2: Revenue Analytics (Days 11-17)

### Day 11: RevenueCat Webhook Setup

**Step 11.1: Create Webhook Handler Function**
- File: `functions/src/webhooks/revenuecatWebhook.ts`

```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

interface RevenueCatEvent {
  event: {
    type: string;
    app_user_id: string;
    product_id: string;
    period_type: string;
    purchased_at_ms: number;
    expiration_at_ms: number;
    store: string;
    price: number;
    currency: string;
  };
}

export const revenuecatWebhook = functions.https.onRequest(async (req, res) => {
  // Verify webhook signature
  const signature = req.headers['x-revenuecat-signature'];
  // TODO: Verify signature with webhook secret

  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {
    const event: RevenueCatEvent = req.body;
    const db = admin.firestore();

    console.log('RevenueCat webhook received:', event.event.type);

    // Store event in revenueEvents collection
    await db.collection('revenueEvents').add({
      type: event.event.type,
      userId: event.event.app_user_id,
      productId: event.event.product_id,
      periodType: event.event.period_type,
      purchasedAt: new Date(event.event.purchased_at_ms),
      expiresAt: event.event.expiration_at_ms ? new Date(event.event.expiration_at_ms) : null,
      store: event.event.store,
      price: event.event.price,
      currency: event.event.currency,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Update user document based on event type
    const userRef = db.collection('users').doc(event.event.app_user_id);

    switch (event.event.type) {
      case 'INITIAL_PURCHASE':
      case 'RENEWAL':
        await userRef.update({
          subscriptionStartedAt: new Date(event.event.purchased_at_ms).toISOString(),
          subscriptionPlatform: event.event.store === 'app_store' ? 'ios' : 'android',
          subscriptionPrice: event.event.price,
        });
        break;

      case 'CANCELLATION':
        await userRef.update({
          subscriptionCancelledAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        break;

      case 'EXPIRATION':
        // Handle subscription expiration
        break;
    }

    res.status(200).send('Webhook processed');
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).send('Internal Server Error');
  }
});
```

**Step 11.2: Deploy Webhook**
```bash
firebase deploy --only functions:revenuecatWebhook
```

**Step 11.3: Configure RevenueCat Webhook**
1. Go to RevenueCat Dashboard → Project Settings → Webhooks
2. Add new webhook URL: `https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/revenuecatWebhook`
3. Select events to listen for:
   - Initial Purchase
   - Renewal
   - Cancellation
   - Expiration
   - Billing Issue
4. Save and test webhook

### Day 12-13: Revenue Service (Website)

**Step 12.1: Create Revenue Service**
- File: `src/services/revenueService.ts`

```typescript
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';

export class RevenueService {
  // Monthly Recurring Revenue
  async calculateMRR(): Promise<number> {
    const usersRef = collection(db, 'users');
    const q = query(
      usersRef,
      where('subscriptionTier', 'in', ['athlete', 'athlete_plus'])
    );

    const snapshot = await getDocs(q);
    let mrr = 0;

    snapshot.forEach((doc) => {
      const data = doc.data();
      // Assuming prices: athlete = $9.99, athlete_plus = $19.99
      if (data.subscriptionTier === 'athlete') mrr += 9.99;
      if (data.subscriptionTier === 'athlete_plus') mrr += 19.99;
    });

    return mrr;
  }

  // Annual Recurring Revenue
  async calculateARR(): Promise<number> {
    const mrr = await this.calculateMRR();
    return mrr * 12;
  }

  // Revenue by Tier
  async getRevenueByTier(): Promise<{ athlete: number; athlete_plus: number }> {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);

    let athleteRevenue = 0;
    let athletePlusRevenue = 0;

    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.subscriptionTier === 'athlete') athleteRevenue += 9.99;
      if (data.subscriptionTier === 'athlete_plus') athletePlusRevenue += 19.99;
    });

    return {
      athlete: athleteRevenue,
      athlete_plus: athletePlusRevenue,
    };
  }

  // Conversion Funnel (Trial to Paid)
  async getConversionFunnel(): Promise<{
    totalUsers: number;
    trialUsers: number;
    paidUsers: number;
    conversionRate: number;
  }> {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);

    let totalUsers = 0;
    let trialUsers = 0;
    let paidUsers = 0;

    snapshot.forEach((doc) => {
      const data = doc.data();
      totalUsers++;

      if (data.subscriptionTier === 'trial') trialUsers++;
      if (['athlete', 'athlete_plus'].includes(data.subscriptionTier)) paidUsers++;
    });

    const conversionRate = trialUsers > 0 ? (paidUsers / trialUsers) * 100 : 0;

    return { totalUsers, trialUsers, paidUsers, conversionRate };
  }

  // Churn Rate
  async getChurnRate(): Promise<number> {
    const now = new Date();
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const usersRef = collection(db, 'users');
    const cancelledQuery = query(
      usersRef,
      where('subscriptionCancelledAt', '>=', Timestamp.fromDate(monthAgo))
    );

    const cancelledSnapshot = await getDocs(cancelledQuery);
    const allSnapshot = await getDocs(usersRef);

    const churnRate = (cancelledSnapshot.size / allSnapshot.size) * 100;
    return churnRate;
  }

  // Average Revenue Per User
  async getARPU(): Promise<number> {
    const mrr = await this.calculateMRR();
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);

    return snapshot.size > 0 ? mrr / snapshot.size : 0;
  }

  // Revenue Events (last 30 days)
  async getRevenueEvents(): Promise<any[]> {
    const now = new Date();
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const eventsRef = collection(db, 'revenueEvents');
    const q = query(
      eventsRef,
      where('timestamp', '>=', Timestamp.fromDate(monthAgo))
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}

export const revenueService = new RevenueService();
```

### Day 14-15: Revenue Analytics Page

**Step 14.1: Create Revenue Analytics Page**
- File: `src/pages/VaultAdminRevenue.tsx`

```typescript
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { revenueService } from '@/services/revenueService';

export default function VaultAdminRevenue() {
  const [mrr, setMrr] = useState<number>(0);
  const [arr, setArr] = useState<number>(0);
  const [revenueByTier, setRevenueByTier] = useState({ athlete: 0, athlete_plus: 0 });
  const [conversionFunnel, setConversionFunnel] = useState({ totalUsers: 0, trialUsers: 0, paidUsers: 0, conversionRate: 0 });
  const [churnRate, setChurnRate] = useState<number>(0);
  const [arpu, setArpu] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRevenueData();
  }, []);

  async function loadRevenueData() {
    setLoading(true);
    try {
      const [mrrData, arrData, tierRevenue, funnel, churn, arpuData] = await Promise.all([
        revenueService.calculateMRR(),
        revenueService.calculateARR(),
        revenueService.getRevenueByTier(),
        revenueService.getConversionFunnel(),
        revenueService.getChurnRate(),
        revenueService.getARPU(),
      ]);

      setMrr(mrrData);
      setArr(arrData);
      setRevenueByTier(tierRevenue);
      setConversionFunnel(funnel);
      setChurnRate(churn);
      setArpu(arpuData);
    } catch (error) {
      console.error('Error loading revenue data:', error);
    } finally {
      setLoading(false);
    }
  }

  const tierData = [
    { name: 'Athlete', revenue: revenueByTier.athlete },
    { name: 'Athlete+', revenue: revenueByTier.athlete_plus },
  ];

  const funnelData = [
    { stage: 'Total Users', count: conversionFunnel.totalUsers },
    { stage: 'Trial Users', count: conversionFunnel.trialUsers },
    { stage: 'Paid Users', count: conversionFunnel.paidUsers },
  ];

  if (loading) {
    return <div className="p-8">Loading revenue data...</div>;
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Revenue Analytics</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>MRR</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${mrr.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ARR</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${arr.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ARPU</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${arpu.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Churn Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{churnRate.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue by Tier */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Tier</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tierData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Conversion Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Conversion Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={funnelData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stage" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 text-center">
            <p className="text-lg">Conversion Rate: <span className="font-bold">{conversionFunnel.conversionRate.toFixed(1)}%</span></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

**Step 14.2: Add Revenue Tab to Navigation**
- File: `src/pages/VaultAdmin.tsx`
- Add "Revenue" tab

### Day 16-17: Daily Revenue Aggregation Function

**Step 16.1: Create Daily Revenue Function**
- File: `functions/src/scheduledFunctions/dailyRevenueAggregation.ts`

```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const dailyRevenueAggregation = functions.pubsub
  .schedule('0 1 * * *') // 1 AM daily
  .timeZone('America/New_York')
  .onRun(async (context) => {
    const db = admin.firestore();
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];

    console.log(`Running revenue aggregation for ${dateStr}`);

    try {
      // Get all active subscribers
      const usersSnapshot = await db.collection('users')
        .where('subscriptionTier', 'in', ['athlete', 'athlete_plus'])
        .get();

      let mrr = 0;
      let athleteCount = 0;
      let athletePlusCount = 0;

      usersSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.subscriptionTier === 'athlete') {
          mrr += 9.99;
          athleteCount++;
        } else if (data.subscriptionTier === 'athlete_plus') {
          mrr += 19.99;
          athletePlusCount++;
        }
      });

      const arr = mrr * 12;
      const totalPaidUsers = athleteCount + athletePlusCount;

      // Get trial users
      const trialSnapshot = await db.collection('users')
        .where('subscriptionTier', '==', 'trial')
        .get();

      const trialUsers = trialSnapshot.size;

      // Save to metrics
      await db.collection('metrics').doc(`revenue_${dateStr}`).set({
        date: dateStr,
        mrr,
        arr,
        athleteCount,
        athletePlusCount,
        totalPaidUsers,
        trialUsers,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`Revenue metrics saved: MRR=$${mrr.toFixed(2)}, ARR=$${arr.toFixed(2)}`);
      return null;
    } catch (error) {
      console.error('Error in revenue aggregation:', error);
      throw error;
    }
  });
```

**Step 16.2: Deploy Function**
```bash
firebase deploy --only functions:dailyRevenueAggregation
```

**Step 16.3: Test Revenue Tracking**
- [ ] Create test purchase event
- [ ] Verify webhook receives event
- [ ] Check revenueEvents collection
- [ ] Verify user document updated
- [ ] Check revenue metrics page

---

## Phase 3: Content Moderation (Days 18-24)

### Day 18-19: Moderation Service

**Step 18.1: Create Moderation Service**
- File: `src/services/moderationService.ts`

```typescript
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';

export class ModerationService {
  // Get reported posts
  async getReportedPosts(): Promise<any[]> {
    const reportsRef = collection(db, 'reports');
    const q = query(reportsRef, where('status', '==', 'pending'));

    const snapshot = await getDocs(q);

    // Fetch post details for each report
    const reports = await Promise.all(
      snapshot.docs.map(async (reportDoc) => {
        const reportData = reportDoc.data();

        // Get the actual post
        const postRef = doc(db, 'feed', reportData.postId);
        const postSnapshot = await getDoc(postRef);

        return {
          id: reportDoc.id,
          ...reportData,
          post: postSnapshot.exists() ? { id: postSnapshot.id, ...postSnapshot.data() } : null,
        };
      })
    );

    return reports;
  }

  // Get recent posts for monitoring
  async getRecentPosts(limit: number = 50): Promise<any[]> {
    const feedRef = collection(db, 'feed');
    const snapshot = await getDocs(feedRef);

    return snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  // Delete post permanently
  async deletePost(postId: string): Promise<void> {
    const postRef = doc(db, 'feed', postId);
    await deleteDoc(postRef);
  }

  // Hide post (soft delete)
  async hidePost(postId: string): Promise<void> {
    const postRef = doc(db, 'feed', postId);
    await updateDoc(postRef, {
      isHidden: true,
      hiddenAt: new Date().toISOString(),
    });
  }

  // Ban user from social features
  async banUser(userId: string, reason: string): Promise<void> {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      isBanned: true,
      bannedAt: new Date().toISOString(),
      banReason: reason,
    });
  }

  // Unban user
  async unbanUser(userId: string): Promise<void> {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      isBanned: false,
      unbannedAt: new Date().toISOString(),
    });
  }

  // Dismiss report
  async dismissReport(reportId: string): Promise<void> {
    const reportRef = doc(db, 'reports', reportId);
    await updateDoc(reportRef, {
      status: 'dismissed',
      dismissedAt: new Date().toISOString(),
    });
  }

  // Mark report as handled
  async markReportHandled(reportId: string): Promise<void> {
    const reportRef = doc(db, 'reports', reportId);
    await updateDoc(reportRef, {
      status: 'handled',
      handledAt: new Date().toISOString(),
    });
  }
}

export const moderationService = new ModerationService();
```

### Day 20-22: Moderation Page & Components

**Step 20.1: Create Moderation Components**
- File: `src/components/admin/vault/moderation/PostPreviewCard.tsx`

```typescript
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PostPreviewCardProps {
  post: any;
  onDelete: () => void;
  onHide: () => void;
  onBanUser: () => void;
}

export function PostPreviewCard({ post, onDelete, onHide, onBanUser }: PostPreviewCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <p className="font-medium">{post.userName}</p>
            <p className="text-sm text-gray-500">{post.userId}</p>
          </div>
          <div className="text-sm text-gray-500">
            {new Date(post.timestamp).toLocaleString()}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>{post.caption}</p>

        {post.videoUrl && (
          <video src={post.videoUrl} controls className="w-full max-h-96 rounded" />
        )}

        {post.imageUrl && (
          <img src={post.imageUrl} alt="Post" className="w-full max-h-96 object-contain rounded" />
        )}

        <div className="flex gap-2">
          <Button variant="destructive" onClick={onDelete}>
            Delete Post
          </Button>
          <Button variant="outline" onClick={onHide}>
            Hide Post
          </Button>
          <Button variant="destructive" onClick={onBanUser}>
            Ban User
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

- File: `src/components/admin/vault/moderation/BanUserDialog.tsx`

```typescript
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface BanUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  userName: string;
}

export function BanUserDialog({ isOpen, onClose, onConfirm, userName }: BanUserDialogProps) {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    onConfirm(reason);
    setReason('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ban User: {userName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p>This will prevent the user from posting to the social feed.</p>

          <Textarea
            placeholder="Ban reason (visible to admins only)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Confirm Ban
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

**Step 20.2: Create Moderation Page**
- File: `src/pages/VaultAdminModeration.tsx`

```typescript
import React, { useEffect, useState } from 'react';
import { moderationService } from '@/services/moderationService';
import { PostPreviewCard } from '@/components/admin/vault/moderation/PostPreviewCard';
import { BanUserDialog } from '@/components/admin/vault/moderation/BanUserDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function VaultAdminModeration() {
  const [reports, setReports] = useState<any[]>([]);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [reportsData, postsData] = await Promise.all([
        moderationService.getReportedPosts(),
        moderationService.getRecentPosts(50),
      ]);

      setReports(reportsData);
      setRecentPosts(postsData);
    } catch (error) {
      console.error('Error loading moderation data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeletePost(postId: string, reportId?: string) {
    if (confirm('Are you sure you want to permanently delete this post?')) {
      await moderationService.deletePost(postId);
      if (reportId) {
        await moderationService.markReportHandled(reportId);
      }
      loadData();
    }
  }

  async function handleHidePost(postId: string, reportId?: string) {
    await moderationService.hidePost(postId);
    if (reportId) {
      await moderationService.markReportHandled(reportId);
    }
    loadData();
  }

  function handleBanUserClick(userId: string, userName: string) {
    setSelectedUser({ id: userId, name: userName });
    setBanDialogOpen(true);
  }

  async function handleBanConfirm(reason: string) {
    if (selectedUser) {
      await moderationService.banUser(selectedUser.id, reason);
      loadData();
    }
  }

  async function handleDismissReport(reportId: string) {
    await moderationService.dismissReport(reportId);
    loadData();
  }

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Content Moderation</h1>

      <Tabs defaultValue="reports">
        <TabsList>
          <TabsTrigger value="reports">
            Reported Posts ({reports.length})
          </TabsTrigger>
          <TabsTrigger value="recent">Recent Posts</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4">
          {reports.length === 0 ? (
            <p className="text-gray-500">No pending reports</p>
          ) : (
            reports.map((report) => (
              <div key={report.id} className="space-y-2">
                <div className="bg-yellow-50 p-4 rounded">
                  <p><strong>Reason:</strong> {report.reason}</p>
                  <p className="text-sm text-gray-600">
                    Reported by: {report.reportedBy} at {new Date(report.timestamp.toDate()).toLocaleString()}
                  </p>
                  {report.additionalInfo && (
                    <p className="text-sm"><strong>Additional info:</strong> {report.additionalInfo}</p>
                  )}
                  <button
                    onClick={() => handleDismissReport(report.id)}
                    className="text-sm text-blue-600 hover:underline mt-2"
                  >
                    Dismiss Report
                  </button>
                </div>

                {report.post && (
                  <PostPreviewCard
                    post={report.post}
                    onDelete={() => handleDeletePost(report.postId, report.id)}
                    onHide={() => handleHidePost(report.postId, report.id)}
                    onBanUser={() => handleBanUserClick(report.post.userId, report.post.userName)}
                  />
                )}
              </div>
            ))
          )}
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          {recentPosts.map((post) => (
            <PostPreviewCard
              key={post.id}
              post={post}
              onDelete={() => handleDeletePost(post.id)}
              onHide={() => handleHidePost(post.id)}
              onBanUser={() => handleBanUserClick(post.userId, post.userName)}
            />
          ))}
        </TabsContent>
      </Tabs>

      <BanUserDialog
        isOpen={banDialogOpen}
        onClose={() => setBanDialogOpen(false)}
        onConfirm={handleBanConfirm}
        userName={selectedUser?.name || ''}
      />
    </div>
  );
}
```

### Day 23-24: Mobile App - Report Feature

**Step 23.1: Add Report Button to Feed Post Menu**
- File: `mobile-app/screens/FeedScreen.tsx` (or wherever posts are displayed)

```typescript
// Add to post menu options
const showReportDialog = (post) => {
  Alert.alert(
    'Report Post',
    'Why are you reporting this post?',
    [
      { text: 'Inappropriate content', onPress: () => reportPost(post, 'Inappropriate content') },
      { text: 'Spam or misleading', onPress: () => reportPost(post, 'Spam or misleading') },
      { text: 'Harassment or bullying', onPress: () => reportPost(post, 'Harassment or bullying') },
      { text: 'Violence or dangerous behavior', onPress: () => reportPost(post, 'Violence or dangerous behavior') },
      { text: 'Other', onPress: () => showCustomReportDialog(post) },
      { text: 'Cancel', style: 'cancel' },
    ]
  );
};

const reportPost = async (post, reason) => {
  try {
    await firestore().collection('reports').add({
      postId: post.id,
      reportedBy: currentUserId,
      reportedUserId: post.userId,
      reason,
      timestamp: firestore.FieldValue.serverTimestamp(),
      status: 'pending',
    });

    Alert.alert('Success', 'Post reported. Our team will review it shortly.');
  } catch (error) {
    console.error('Error reporting post:', error);
    Alert.alert('Error', 'Failed to report post. Please try again.');
  }
};
```

**Step 23.2: Check Ban Status**
- File: `mobile-app/screens/FeedScreen.tsx`

```typescript
useEffect(() => {
  const checkBanStatus = async () => {
    const userDoc = await firestore()
      .collection('users')
      .doc(currentUserId)
      .get();

    const isBanned = userDoc.data()?.isBanned;
    setCanPost(!isBanned);
  };

  checkBanStatus();
}, []);

// In UI:
{canPost ? (
  <Button onPress={createPost}>Create Post</Button>
) : (
  <Text>Your posting privileges have been restricted</Text>
)}
```

**Step 23.3: Handle Deleted Posts**
- Add real-time listener for post deletions:

```typescript
useEffect(() => {
  const unsubscribe = firestore()
    .collection('feed')
    .onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'removed') {
          // Remove from local state
          setPosts(prev => prev.filter(p => p.id !== change.doc.id));
        }
      });
    });

  return () => unsubscribe();
}, []);
```

---

## Testing & Deployment Checklist

### Phase 1 Testing
- [ ] User insights page loads without errors
- [ ] DAU/WAU/MAU calculations are accurate
- [ ] Charts render correctly
- [ ] Mobile app updates lastLoginAt on launch
- [ ] Device info saved to Firestore
- [ ] Daily aggregation function runs successfully

### Phase 2 Testing
- [ ] RevenueCat webhook receives events
- [ ] Revenue events stored in Firestore
- [ ] User documents updated on purchase
- [ ] Revenue page shows correct MRR/ARR
- [ ] Conversion funnel displays correctly
- [ ] Daily revenue aggregation runs

### Phase 3 Testing
- [ ] Report post feature works on mobile
- [ ] Reports appear in admin dashboard
- [ ] Delete post removes from feed
- [ ] Hide post soft-deletes correctly
- [ ] Ban user prevents posting
- [ ] Mobile app checks ban status
- [ ] Deleted posts removed from mobile UI

---

## Next Steps After Phase 3

Once Phases 1-3 are complete and tested, you can proceed with:

- **Phase 4:** Push Notifications (Days 25-31)
- **Phase 5:** System Health & Monitoring (Days 32-38)
- **Phase 6:** Video Management (Days 39-45)
- **Phase 7:** Feature Flags (Days 46-52)
- **Phase 8:** GDPR Compliance (Days 53-60)

Each phase follows the same pattern:
1. Create services
2. Build UI components
3. Implement Firebase Functions if needed
4. Update mobile app
5. Test thoroughly
6. Deploy

---

## Troubleshooting Guide

### Common Issues

**Issue: Firestore permission denied**
- Check security rules
- Verify user authentication
- Ensure admin privileges

**Issue: Firebase Function timeout**
- Increase timeout in function config
- Optimize queries
- Add pagination for large datasets

**Issue: Mobile app not updating user fields**
- Check Firebase SDK version
- Verify field names match exactly
- Check network connection

**Issue: RevenueCat webhook not receiving events**
- Verify webhook URL is correct
- Check RevenueCat dashboard for webhook status
- Test webhook with sample payload
- Verify function is deployed

**Issue: Charts not rendering**
- Check recharts installation
- Verify data format matches chart requirements
- Check browser console for errors

---

## Performance Optimization Tips

1. **Cache Aggregated Data**: Use Cloud Functions to pre-calculate daily metrics
2. **Paginate Large Lists**: Don't load all users/posts at once
3. **Use Indexes**: Create composite indexes for common queries
4. **Optimize Images**: Compress images before storing
5. **Batch Operations**: Use batched writes for bulk updates
6. **Monitor Costs**: Set up billing alerts in Firebase Console

---

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [RevenueCat Webhooks](https://docs.revenuecat.com/docs/webhooks)
- [Recharts Documentation](https://recharts.org/)
- [Firebase Cloud Functions](https://firebase.google.com/docs/functions)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

---

## Deployment Commands Reference

```bash
# Deploy all Firebase Functions
firebase deploy --only functions

# Deploy specific function
firebase deploy --only functions:functionName

# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Firestore indexes
firebase deploy --only firestore:indexes

# View function logs
firebase functions:log

# Test function locally
firebase functions:shell
```
