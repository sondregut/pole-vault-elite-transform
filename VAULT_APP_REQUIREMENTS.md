# Vault iOS App Requirements for Full Admin Dashboard Functionality

**Created:** January 28, 2025
**Purpose:** Complete list of everything needed in the Vault iOS app to make all admin dashboard features work

---

## 📊 Current Integration Status

| Feature | Web Dashboard | iOS App | Backend | Status |
|---------|--------------|---------|---------|--------|
| User Insights | ✅ Complete | ✅ Complete | ⚠️ Optional | **Working** |
| Revenue Analytics | ✅ Complete | ⚠️ Partial | ❌ Needed | Partial |
| Content Moderation | ✅ Complete | ❌ Needed | ❌ None | UI Only |
| Push Notifications | ✅ Complete | ❌ Needed | ❌ Needed | UI Only |
| System Health | ✅ Complete | ❌ Needed | ⚠️ Optional | UI Only |
| Video Management | ✅ Complete | ✅ Complete | ⚠️ Optional | **Working** |
| Training Analytics | ✅ Complete | ✅ Complete | ❌ None | **Working** |
| Data Management | ✅ Complete | ❌ Needed | ❌ Needed | UI Only |

---

## ✅ Phase 1: User Insights & Analytics

### Status: **FULLY WORKING** ✅

### iOS App Requirements:

#### ✅ Already Implemented:
- `lastLoginAt` - Updates on app launch (in `useAuthContext.tsx`)
- `createdAt` - Set on signup (all signup screens)

#### No Additional Work Needed!
The dashboard shows accurate DAU/WAU/MAU and user growth data.

---

## ⚠️ Phase 2: Revenue Analytics

### Status: **PARTIALLY WORKING** ⚠️

### What Works:
- ✅ Basic MRR/ARR calculations (based on `subscriptionTier`)
- ✅ Conversion funnel
- ✅ Tier breakdown

### iOS App Requirements:

#### Task 1: Track Subscription Start
**When:** User purchases a subscription (via RevenueCat)

**What to add to user document:**
```typescript
{
  subscriptionStartedAt: new Date().toISOString(),
  subscriptionPlatform: 'ios',
  subscriptionPrice: 9.99 // or 19.99 for Athlete+
}
```

**Where:** In your subscription purchase handler

#### Task 2: Track Subscription Cancellation
**When:** User cancels subscription (via RevenueCat webhook or app)

**What to add to user document:**
```typescript
{
  subscriptionCancelledAt: new Date().toISOString()
}
```

**Where:** In your subscription cancellation handler

#### Task 3: Keep Subscription Tier Updated
**What's needed:**
Ensure `subscriptionTier` field stays in sync with RevenueCat:
- `'free'` - No subscription
- `'trial'` - In trial period
- `'athlete'` - Athlete subscription
- `'athlete_plus'` - Athlete+ subscription
- `'lifetime'` - Lifetime access

**Estimated time:** 1-2 hours

---

## ❌ Phase 3: Content Moderation

### Status: **UI ONLY** - Needs iOS Implementation

### iOS App Requirements:

#### Task 1: Add "Report Post" Feature
**When:** User taps three-dot menu on any feed post

**What to implement:**
1. Add "Report" option to post menu
2. Show dialog with report reasons:
   - Inappropriate content
   - Spam or misleading
   - Harassment or bullying
   - Violence or dangerous behavior
   - Other (with text input)
3. Create report document in Firestore

**What to write to Firestore:**
```typescript
await firestore().collection('reports').add({
  postId: post.id,
  reportedBy: currentUserId,
  reportedUserId: post.userId,
  reason: selectedReason,
  additionalInfo: optionalText, // if "Other" selected
  timestamp: firestore.FieldValue.serverTimestamp(),
  status: 'pending'
});
```

**Where:** Feed post component (likely `FeedList.tsx` or similar)

#### Task 2: Check Ban Status
**When:** Feed screen loads or user tries to create post

**What to implement:**
1. Read `isBanned` field from user document
2. If banned, hide "Create Post" button
3. Show message: "Your posting privileges have been restricted"

**How to check:**
```typescript
const userDoc = await firestore()
  .collection('users')
  .doc(currentUserId)
  .get();

const isBanned = userDoc.data()?.isBanned;

if (isBanned) {
  // Hide create post button
  // Show restricted message
}
```

**Where:** Feed screen component

#### Task 3: Handle Deleted Posts
**When:** Real-time feed updates

**What to implement:**
1. Listen for post deletions via Firestore snapshot listener
2. Remove deleted posts from local state/UI
3. Optional: Show "Post removed" placeholder

**How to implement:**
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

**Where:** Feed display component

**Estimated time:** 2-3 hours total

---

## ❌ Phase 4: Push Notifications

### Status: **UI ONLY** - Needs iOS Implementation + Backend

### iOS App Requirements:

#### Task 1: Request Notification Permissions
**When:** App first launch or settings screen

**What to implement:**
1. Request notification permissions from iOS
2. Get FCM/APNs token
3. Save token to Firestore user document

**What to write to Firestore:**
```typescript
{
  fcmToken: deviceToken // The FCM/APNs token string
}
```

**Where:** App initialization or settings

#### Task 2: Handle Incoming Notifications
**When:** Notification received (foreground or background)

**What to implement:**
1. Background notification handler
2. Parse deep links (e.g., "vault://sessions/123")
3. Navigate to correct screen when tapped
4. Optional: Track opens

**What to write to Firestore (optional):**
```typescript
{
  lastNotificationOpenedAt: new Date().toISOString()
}
```

**Where:** AppDelegate (iOS) or notification handler

#### Task 3: Notification Preferences (Optional)
**When:** Settings screen

**What to implement:**
1. UI for notification preferences
2. Let users opt-out of notification types
3. Save preferences to user document

**What to write to Firestore:**
```typescript
{
  notificationPreferences: {
    marketing: true/false,
    social: true/false,
    training: true/false
  }
}
```

**Where:** Settings → Notifications screen

**Estimated time:** 3-4 hours

### Backend Requirements:

#### Cloud Function: Send Notification
**What it does:**
- Monitors `scheduledNotifications` collection
- When new notification appears, sends via Firebase Cloud Messaging
- Batches sending (500 users at a time)
- Logs to `notificationLogs` collection

**Estimated time:** 2-3 hours

---

## ❌ Phase 5: System Health & Monitoring

### Status: **UI ONLY** - Needs iOS Implementation

### iOS App Requirements:

#### Task 1: Error Logging
**When:** Any error occurs in the app

**What to implement:**
1. Global error handler (try-catch wrapper)
2. Catch errors in critical flows
3. Log to Firestore

**What to write to Firestore:**
```typescript
await firestore().collection('errorLogs').add({
  userId: currentUserId,
  error: error.message,
  stackTrace: error.stack,
  timestamp: firestore.FieldValue.serverTimestamp(),
  screen: currentScreen, // e.g., "LoginScreen", "SessionDetailScreen"
  appVersion: DeviceInfo.getVersion(),
  platform: 'iOS'
});
```

**Where:**
- Global error boundary
- Critical user flows (login, signup, session creation, video upload)
- API call error handlers

#### Task 2: Performance Tracking (Optional)
**When:** Key operations complete

**What to implement:**
1. Track app launch time
2. Track API response times
3. Track video upload duration

**What to write to Firestore:**
```typescript
await firestore().collection('performanceMetrics').add({
  appLoadTime: launchTimeMs,
  timestamp: firestore.FieldValue.serverTimestamp(),
  userId: currentUserId
});
```

**Where:** App initialization, API services, video upload service

**Estimated time:** 2-3 hours

---

## ✅ Phase 6: Video Management

### Status: **FULLY WORKING** ✅

### iOS App Requirements:

#### ✅ Already Implemented:
- Video URLs saved to jumps
- Thumbnails saved
- `compressedSize` and `originalSize` now saved (after recent fix)

#### No Additional Work Needed!
The dashboard tracks 11 videos with accurate sizes for new uploads.

---

## ✅ Phase 9: Training Analytics

### Status: **FULLY WORKING** ✅

### iOS App Requirements:

#### ✅ Already Implemented:
- Sessions with jumps (heights, ratings, poles)
- Weather data (if logged)
- Upload timestamps

#### No Additional Work Needed!
The dashboard analyzes all existing training data.

---

## ❌ Phase 8: Data Management (GDPR)

### Status: **UI ONLY** - Needs iOS Implementation + Backend

### iOS App Requirements:

#### Task 1: "Request My Data" Button
**Where:** Settings → Privacy screen

**What to implement:**
1. Add "Request My Data" button
2. Create export request in Firestore
3. Show request status

**What to write to Firestore:**
```typescript
await firestore().collection('dataExportRequests').add({
  userId: currentUserId,
  userEmail: currentUserEmail,
  userName: currentUserName,
  requestedAt: firestore.FieldValue.serverTimestamp(),
  status: 'pending'
});
```

**Status Display:**
- Show "Request submitted" message
- Poll for status updates
- Show download button when `status === 'completed'`

#### Task 2: "Delete My Account" Flow
**Where:** Settings → Privacy → Delete Account

**What to implement:**
1. Warning dialog explaining consequences
2. Password confirmation
3. Create deletion request
4. Log user out immediately

**What to write to Firestore:**
```typescript
await firestore().collection('dataDeletionRequests').add({
  userId: currentUserId,
  userEmail: currentUserEmail,
  userName: currentUserName,
  requestedAt: firestore.FieldValue.serverTimestamp(),
  status: 'pending'
});

// Then immediately log out
await auth().signOut();
```

**Estimated time:** 2-3 hours

### Backend Requirements:

#### Cloud Function: Process Data Export
**What it does:**
- Listens for new export requests
- Collects all user data from Firestore
- Generates JSON and CSV files
- Creates ZIP archive
- Uploads to Firebase Storage
- Updates request with download URL
- Sends email to user

**Guide:** See `CLOUD_FUNCTION_EXPORT_TASK.md` for complete implementation

**Estimated time:** 4-6 hours

#### Cloud Function: Process Data Deletion
**What it does:**
- Listens for new deletion requests
- Deletes user document and all subcollections
- Deletes videos from Firebase Storage
- Removes from feed posts and friend lists
- Anonymizes references
- Updates request with completion status

**Estimated time:** 3-4 hours

---

## 📋 Priority Matrix

### Must Have (Legal/Critical):
1. ✅ User analytics tracking - **DONE**
2. ✅ Video size tracking - **DONE**
3. ❌ GDPR data export (legal requirement if you have EU users)
4. ❌ GDPR data deletion (legal requirement if you have EU users)

### Should Have (High Value):
5. ❌ Push notifications (user engagement)
6. ❌ Revenue tracking (business metrics)
7. ❌ Error logging (catch bugs early)

### Nice to Have (Enhancement):
8. ❌ Content moderation (if you have social features)
9. ❌ Performance tracking (optimization)

---

## 🚀 Quick Start Implementation Guide

### Week 1: Core Functionality
**Day 1-2:** Revenue tracking (subscription events)
**Day 3-4:** Push notifications (FCM tokens + sending)
**Day 5:** Error logging

### Week 2: Compliance
**Day 1-3:** GDPR data export Cloud Function
**Day 4:** GDPR mobile app UI
**Day 5:** Testing and refinement

### Week 3: Polish (Optional)
**Day 1-2:** Content moderation features
**Day 3-4:** Performance tracking
**Day 5:** Final testing

---

## 📝 Summary Checklist

### iOS App Changes Needed:

**Analytics (Phase 1):**
- [x] ~~Track `lastLoginAt` on app launch~~ - DONE
- [x] ~~Set `createdAt` on signup~~ - DONE

**Revenue (Phase 2):**
- [ ] Save `subscriptionStartedAt` on purchase
- [ ] Save `subscriptionCancelledAt` on cancellation
- [ ] Save `subscriptionPrice` on purchase

**Moderation (Phase 3):**
- [ ] Add "Report Post" button to feed
- [ ] Check `isBanned` status before allowing posts
- [ ] Handle deleted posts in real-time listener

**Notifications (Phase 4):**
- [ ] Request notification permissions
- [ ] Save FCM token to user document
- [ ] Handle incoming notifications with deep links
- [ ] Track notification opens (optional)

**System Health (Phase 5):**
- [ ] Log errors to `errorLogs` collection
- [ ] Track performance metrics (optional)

**Videos (Phase 6):**
- [x] ~~Save video sizes to Firestore~~ - DONE
- [x] ~~Save thumbnails~~ - DONE

**Training Analytics (Phase 9):**
- [x] ~~Log sessions with jumps~~ - DONE
- [x] ~~Include heights, ratings, poles~~ - DONE

**GDPR (Phase 8):**
- [ ] "Request My Data" button in Settings
- [ ] "Delete My Account" flow in Settings
- [ ] Show export request status

---

### Backend (Cloud Functions) Needed:

**Revenue:**
- [ ] RevenueCat webhook handler

**Notifications:**
- [ ] Send notification function
- [ ] Scheduled notification processor

**System Health:**
- [ ] Error aggregation (optional)
- [ ] API health checker (optional)

**GDPR:**
- [ ] Data export processor (legal requirement)
- [ ] Data deletion processor (legal requirement)
- [ ] Cleanup expired exports

**Videos:**
- [ ] Backfill video sizes (optional, one-time)
- [ ] Bulk delete handler (optional)

---

## 🎯 Recommended Implementation Order

### Phase 1: Get Core Features Working (Week 1)

**Priority 1: Revenue Tracking**
- iOS: Add subscription tracking (1-2 hours)
- Backend: RevenueCat webhook (1-2 hours)
- Value: Business metrics

**Priority 2: Push Notifications**
- iOS: FCM tokens (2 hours)
- Backend: Send notification function (2-3 hours)
- Value: User engagement

**Priority 3: Error Logging**
- iOS: Add error logging (2-3 hours)
- Value: Catch bugs early

### Phase 2: Legal Compliance (Week 2)

**Priority 4: GDPR Export**
- Backend: Export processor (4-6 hours)
- iOS: "Request My Data" UI (1 hour)
- Value: Legal requirement for EU users

**Priority 5: GDPR Deletion**
- Backend: Deletion processor (3-4 hours)
- iOS: "Delete Account" UI (2 hours)
- Value: Legal requirement

### Phase 3: Polish (Week 3+)

**Priority 6: Content Moderation**
- iOS: Report button + ban check (2-3 hours)
- Value: Community health

**Priority 7: Everything Else**
- Performance tracking
- Advanced features
- Optimizations

---

## 📖 Detailed Implementation Guides

### For iOS App Changes:
- `CODING_AGENT_PROMPT.md` - Analytics tracking (already done)
- `MOBILE_APP_INTEGRATION_INSTRUCTIONS.md` - Full iOS integration guide
- `VIDEO_SIZE_TRACKING_NEEDED.md` - Video size tracking (already done)

### For Backend (Cloud Functions):
- `CLOUD_FUNCTION_EXPORT_TASK.md` - GDPR export implementation
- `IMPLEMENTATION_GUIDE.md` - Full guide with all Cloud Function code examples

---

## 🔧 Technical Details

### Firestore Collections Used by Admin Dashboard:

**Read by Dashboard:**
- `users` - User profiles and subscription info
- `users/{userId}/sessions` - Training sessions
- `feed` - Social posts
- `reports` - Content reports
- `promoCodes` - Promo codes
- `revenueEvents` - Subscription events (from webhook)
- `errorLogs` - App errors
- `notificationLogs` - Notification history
- `scheduledNotifications` - Queued notifications
- `dataExportRequests` - Export requests
- `dataDeletionRequests` - Deletion requests
- `metrics` - Cached analytics (optional)

**Written by iOS App:**
- `users/{userId}` - Updates to user document
- `users/{userId}/sessions` - New sessions
- `feed` - New posts
- `reports` - New reports
- `errorLogs` - New errors
- `dataExportRequests` - New export requests
- `dataDeletionRequests` - New deletion requests

**Written by Cloud Functions:**
- `revenueEvents` - From RevenueCat webhook
- `notificationLogs` - After sending notifications
- `metrics` - Cached analytics
- Updates to request documents (status changes)

---

## 🎯 Minimum Viable Backend

**If you have limited time, implement these 3 Cloud Functions:**

1. **RevenueCat Webhook** (1-2 hours)
   - Enables revenue tracking
   - High business value

2. **Send Notification** (2-3 hours)
   - Enables user engagement
   - Templates already built

3. **GDPR Export** (4-6 hours)
   - Legal requirement
   - Complete guide available

**Total:** ~8-11 hours for core backend functionality

---

## 📞 Support Resources

**iOS App Code Location:**
`/Users/simenguttormsen/Documents/Business/Vault`

**Web Dashboard Location:**
`/Users/simenguttormsen/Documents/Business/GForce/pole-vault-elite-transform`

**Key Files to Modify in iOS App:**
- `src/contexts/useAuthContext.tsx` - Already updated
- `src/services/videoUploadQueue.ts` - Already updated
- `src/components/feed/FeedList.tsx` - Needs report button
- Settings screens - Need GDPR UI
- Subscription handlers - Need tracking

**Key Backend Files to Create:**
- `functions/src/webhooks/revenuecatWebhook.ts`
- `functions/src/notifications/sendNotification.ts`
- `functions/src/gdpr/processDataExport.ts`
- `functions/src/gdpr/processDataDeletion.ts`

---

## 💡 Quick Wins (30 mins each)

These are fast, high-value additions:

1. **Add subscription dates** (iOS)
   - 30 minutes
   - Enables better revenue tracking

2. **Add FCM token** (iOS)
   - 30 minutes
   - Ready for push notifications

3. **Add error logging** (iOS)
   - 30 minutes
   - Start catching bugs

Total: 90 minutes for 3 quick wins that significantly improve the dashboard!

---

## 🎉 Summary

**What's Already Working:**
- ✅ User analytics (DAU/WAU/MAU, growth)
- ✅ Video tracking (11 videos with sizes)
- ✅ Training analytics (heights, ratings, equipment)
- ✅ Basic revenue metrics

**What Needs Work:**
- ❌ Push notifications (iOS + backend)
- ❌ GDPR compliance (iOS + backend)
- ❌ Content moderation (iOS)
- ❌ Error logging (iOS)
- ⚠️ Enhanced revenue tracking (iOS)

**Estimated Total Time to Complete Everything:**
- iOS App: 10-15 hours
- Backend: 15-20 hours
- **Total: 25-35 hours**

**Or just do the Quick Wins:** 90 minutes for immediate value!

---

**This document is your complete roadmap for making all admin dashboard features fully functional.**
