# Vault Admin Dashboard Expansion Plan

**Created:** January 28, 2025
**Status:** Planning Phase

---

## Current Dashboard Features (Implemented)

### Overview Tab
- Total users, lifetime users, active promo codes, total redemptions
- Subscription breakdown (Free, Trial, Athlete, Athlete+)
- Recent promo code redemptions
- Conversion rate and average redemptions per code

### Promo Codes Tab
- Create/edit/delete promo codes
- Set lifetime or trial extension types
- Configure uses (unlimited or specific number)
- Set expiration dates
- Activate/deactivate codes
- View redemption details

### Users Tab
- Search users by email/username
- View subscription tier with color-coded badges
- See trial days remaining
- View promo code usage
- Toggle lifetime access on/off

---

## Planned Expansions

### Phase 1: User Insights & Analytics (Week 1)

**Website Changes:**

**1.1 Analytics Aggregation Service**
- File: `src/services/analyticsService.ts`
- Functions:
  - `calculateDAU()` - Daily Active Users
  - `calculateWAU()` - Weekly Active Users
  - `calculateMAU()` - Monthly Active Users
  - `getUserGrowthData()` - New signups over time
  - `getEngagementMetrics()` - Sessions/jumps per user averages
  - `getDeviceBreakdown()` - iOS vs Android distribution

**1.2 User Insights Page**
- File: `src/pages/VaultAdminUserInsights.tsx`
- Components:
  - User growth line chart (recharts)
  - Device breakdown pie chart
  - Engagement metrics cards
  - Active users trends
  - User activity heatmap (day/time)

**1.3 Enhanced User Detail Modal**
- File: `src/components/admin/vault/UserDetailModal.tsx`
- Features:
  - Activity timeline (all sessions, posts, logins)
  - Performance trends chart
  - Equipment inventory display
  - Social activity summary
  - Admin actions: Send notification, reset password, add notes

**1.4 Update Admin Navigation**
- File: `src/pages/VaultAdmin.tsx`
- Add "User Insights" tab to navigation

**Mobile App Changes Required:**
⚠️ MOBILE APP UPDATES NEEDED:

1. Update user document on app launch:
  - Set lastLoginAt: serverTimestamp()
  - Update deviceInfo: { platform: 'iOS'|'Android', osVersion: string, appVersion: string }
2. Track daily active users:
  - On first launch each day, add entry to dailyActiveUsers collection
  - Document: {userId}/{date} with timestamp
3. Add fields to user document on signup:
  - deviceInfo (platform, OS version, app version)
  - signupMethod (email, google, apple, phone)

---

### Phase 2: Revenue Analytics (Week 2)

**Website Changes:**

**2.1 Revenue Service**
- File: `src/services/revenueService.ts`
- Functions:
  - `calculateMRR()` - Monthly Recurring Revenue
  - `calculateARR()` - Annual Recurring Revenue
  - `getRevenueByTier()` - Revenue breakdown
  - `getConversionFunnel()` - Trial→Paid conversion
  - `getChurnRate()` - Monthly cancellation rate
  - `getARPU()` - Average Revenue Per User

**2.2 Revenue Analytics Page**
- File: `src/pages/VaultAdminRevenue.tsx`
- Components:
  - MRR/ARR stat cards
  - Revenue chart over time
  - Revenue by tier breakdown
  - Conversion funnel visualization
  - Churn rate trends
  - Failed payments table

**2.3 Revenue Data Hooks**
- File: `src/hooks/useRevenueData.tsx`
- Real-time revenue metrics with auto-refresh

**Backend Changes Required:**
⚠️ FIREBASE FUNCTIONS NEEDED:

1. RevenueCat Webhook Handler:
  - Create Cloud Function at functions/revenuecatWebhook.ts
  - Listen to RevenueCat events (purchase, renewal, cancellation)
  - Store in revenueEvents collection
2. Daily Revenue Aggregation:
  - Scheduled Cloud Function (runs daily at midnight)
  - Calculate and cache daily revenue in metrics/dailyRevenue/{date}
  - Makes admin dashboard queries faster

**Mobile App Changes Required:**
⚠️ MOBILE APP UPDATES NEEDED:

1. Add subscription tracking fields:
  - subscriptionStartedAt: string (ISO date)
  - subscriptionCancelledAt: string (ISO date if cancelled)
  - subscriptionPlatform: 'ios' | 'android'
  - subscriptionPrice: number (monthly cost)
2. Update on subscription events:
  - On purchase: Set subscriptionStartedAt
  - On cancellation: Set subscriptionCancelledAt
  - Keep fields in sync with RevenueCat

---

### Phase 3: Content Moderation (Week 3)

**Website Changes:**

**3.1 Moderation Service**
- File: `src/services/moderationService.ts`
- Functions:
  - `getReportedPosts()` - Fetch reported content
  - `deletePost()` - Remove post from feed
  - `hidePost()` - Soft delete (keep but hide)
  - `banUserFromSocial()` - Prevent posting
  - `dismissReport()` - Mark report as handled

**3.2 Content Moderation Page**
- File: `src/pages/VaultAdminModeration.tsx`
- Components:
  - Reported posts queue
  - Post preview with video/image
  - Moderation actions (delete, hide, dismiss)
  - User ban management
  - Recent posts feed

**3.3 Moderation Components**
- Files: `src/components/admin/vault/moderation/`
  - `PostPreviewCard.tsx` - Post display with actions
  - `ReportQueueItem.tsx` - Report details
  - `BanUserDialog.tsx` - Ban confirmation
  - `ModerationHistory.tsx` - Past actions log

**Mobile App Changes Required:**
⚠️ MOBILE APP UPDATES NEEDED:

1. Add Report Post feature:
  - Add "Report" button to feed post menu
  - Show report reasons (inappropriate, spam, harassment, etc.)
  - Create document in reports collection:
```
{
  postId: string,
  reportedBy: string (userId),
  reason: string,
  timestamp: serverTimestamp(),
  status: 'pending'
}
```
2. Check for ban status:
  - On app launch, check user.isBanned field
  - If banned, disable posting to feed
  - Show message: "Your account has been restricted"
3. Handle deleted posts:
  - Listen for post deletions
  - Remove from local cache when deleted

---

### Phase 4: Push Notifications Management (Week 4)

**Website Changes:**

**4.1 Notification Service**
- File: `src/services/notificationService.ts`
- Functions:
  - `sendToAllUsers()` - Broadcast notification
  - `sendToSegment()` - Target specific tier/status
  - `sendToUser()` - Single user notification
  - `scheduleNotification()` - Send at specific time
  - `getNotificationHistory()` - Past sends

**4.2 Push Notifications Page**
- File: `src/pages/VaultAdminNotifications.tsx`
- Components:
  - Notification composer (title, body, deep link)
  - Audience selector (All, Free, Trial, Athlete, Athlete+, Lifetime)
  - Schedule picker (send now or schedule)
  - Notification history table
  - Delivery/open rate stats

**4.3 Notification Templates**
- Pre-built templates for common messages
- Variables (user name, trial days, etc.)

**Backend Changes Required:**
⚠️ FIREBASE FUNCTIONS NEEDED:

1. Send Notification Function:
  - File: functions/sendNotification.ts
  - Use Firebase Cloud Messaging (FCM)
  - Batch sending for large groups
  - Track delivery in notificationLogs collection
2. Scheduled Notifications:
  - Use Firebase Scheduler
  - Process scheduled notifications from queue

**Mobile App Changes Required:**
⚠️ MOBILE APP UPDATES NEEDED:

1. Store FCM token:
  - On app launch, get FCM token
  - Save to user document: fcmToken: string
  - Update token if it changes
2. Track notification interactions:
  - Track opens in analytics
  - Handle deep links (navigate to specific screens)
  - Update lastNotificationOpenedAt field
3. Notification preferences:
  - Let users opt-out of certain notification types
  - Store in notificationPreferences subcollection

---

### Phase 5: System Health & Monitoring (Week 5)

**Website Changes:**

**5.1 System Health Service**
- File: `src/services/systemHealthService.ts`
- Functions:
  - `getErrorLogs()` - Recent errors
  - `getErrorRate()` - Errors per hour/day
  - `getAPIHealth()` - Check Firebase, RevenueCat status
  - `getStorageUsage()` - Firebase Storage totals
  - `getPerformanceMetrics()` - App load times

**5.2 System Health Page**
- File: `src/pages/VaultAdminSystemHealth.tsx`
- Components:
  - Error rate chart
  - Recent errors table (filterable by type)
  - API status indicators (green/yellow/red)
  - Storage usage graph
  - Performance metrics cards

**5.3 Alert Configuration**
- Set error rate thresholds
- Email alerts for critical issues

**Backend Changes Required:**
⚠️ FIREBASE FUNCTIONS NEEDED:

1. Error Aggregation Function:
  - Runs hourly
  - Aggregate errors from errorLogs collection
  - Calculate error rates
  - Store in metrics/errors/{hour}
2. API Health Check:
  - Runs every 5 minutes
  - Checks Firebase, RevenueCat, Weather API
  - Stores status in apiHealth collection
3. Storage Calculator:
  - Runs daily
  - Calculates total Firebase Storage usage
  - Stores in metrics/storage/{date}

**Mobile App Changes Required:**
⚠️ MOBILE APP UPDATES NEEDED:

1. Error logging:
  - Catch and log errors to Firestore
  - Collection: errorLogs
  - Fields: {
  userId, error, stackTrace, timestamp,
  deviceInfo, appVersion, screen
}
2. Performance tracking:
  - Track app launch time
  - Track video upload duration
  - Track API response times
  - Store in performanceMetrics collection
3. Analytics events:
  - Track feature usage
  - Track screen views
  - Send to Firebase Analytics

---

### Phase 6: Video Management (Week 6)

**Website Changes:**

**6.1 Video Management Service**
- File: `src/services/videoManagementService.ts`
- Functions:
  - `getAllVideos()` - Fetch video metadata
  - `getVideosByUser()` - User's videos
  - `calculateStorageUsage()` - Total GB used
  - `deleteVideo()` - Remove video and metadata
  - `bulkDeleteVideos()` - Delete multiple

**6.2 Video Management Page**
- File: `src/pages/VaultAdminVideoManagement.tsx`
- Components:
  - Video gallery with thumbnails
  - Storage usage pie chart
  - Filter by: user, date range, size
  - Sort by: size, date, views
  - Bulk select and delete
  - Storage cost calculator

**Backend Changes Required:**
⚠️ FIREBASE FUNCTIONS NEEDED:

1. Daily Storage Calculation:
  - Calculate total Firebase Storage usage
  - Break down by user
  - Store in metrics/storage
2. Video Compression (Optional):
  - Compress videos over 100MB
  - Reduce quality for old videos
  - Save storage costs
3. Orphan Video Cleanup:
  - Find videos not linked to any session/jump
  - Auto-delete after 30 days

**Mobile App Changes Required:**
No mobile app changes needed - videos already stored properly in Firebase Storage

---

### Phase 7: Feature Flags & Experiments (Week 7)

**Website Changes:**

**7.1 Feature Flags Service**
- File: `src/services/featureFlagsService.ts`
- Functions:
  - `getAllFlags()` - List all feature flags
  - `createFlag()` - New feature flag
  - `updateFlag()` - Toggle or change rollout
  - `deleteFlag()` - Remove flag
  - `checkUserEligibility()` - Check if user gets feature

**7.2 Feature Flags Page**
- File: `src/pages/VaultAdminFeatureFlags.tsx`
- Components:
  - Feature flags list
  - Create/edit flag form
  - Rollout percentage slider (0-100%)
  - Target tier selector (All, Athlete, Athlete+, etc.)
  - Feature flag history

**7.3 Firestore Collection**
- Collection: `featureFlags`
- Schema:
  {
    flagName: string,
    enabled: boolean,
    rolloutPercentage: number, // 0-100
    targetTiers: string[], // ['athlete', 'athlete_plus']
    description: string,
    createdAt: string
  }

**Mobile App Changes Required:**
⚠️ MOBILE APP UPDATES NEEDED:

1. Feature Flag Service:
  - File: Create FeatureFlagService in mobile app
  - On app launch, fetch all flags from featureFlags collection
  - Cache locally for performance
  - Refresh periodically (every hour)
2. Check flags before showing features:
  - Example: if (FeatureFlags.isEnabled('newAnalytics')) { show feature }
  - Use user's tier to check eligibility
  - Use userId hash for rollout percentage
3. Force refresh flags:
  - Add silent background refresh
  - Allow manual refresh in developer settings

---

### Phase 8: GDPR & Data Compliance (Week 8)

**Website Changes:**

**8.1 GDPR Service**
- File: `src/services/gdprService.ts`
- Functions:
  - `exportUserData()` - Generate complete data export
  - `deleteUserCompletely()` - GDPR deletion
  - `getDataRequests()` - Fetch export/deletion requests
  - `processDataRequest()` - Mark as completed

**8.2 Data Management Page**
- File: `src/pages/VaultAdminDataManagement.tsx`
- Components:
  - Data export request queue
  - Data deletion request queue
  - Manual export tool (export any user)
  - GDPR compliance dashboard
  - Audit log viewer

**8.3 Request Collections**
- Collections: `dataExportRequests`, `dataDeletionRequests`
- Schema:
  {
    userId: string,
    userEmail: string,
    requestedAt: string,
    status: 'pending' | 'processing' | 'completed',
    completedAt?: string,
    downloadUrl?: string (for exports)
  }

**Backend Changes Required:**
⚠️ FIREBASE FUNCTIONS NEEDED:

1. Data Export Function:
  - Generate JSON/CSV of all user data
  - Include: sessions, poles, posts, videos (URLs)
  - Zip files and upload to temporary storage
  - Email download link to user
  - Auto-delete after 7 days
2. Data Deletion Function:
  - Delete user document
  - Recursively delete all subcollections (sessions, poles, etc.)
  - Delete videos from Storage
  - Remove from feed posts
  - Remove from friend lists
  - Anonymize or delete reports/comments
3. Scheduled Cleanup:
  - Process pending requests daily
  - Alert if requests exceed compliance deadline (30 days)

**Mobile App Changes Required:**
⚠️ MOBILE APP UPDATES NEEDED:

1. Request My Data button:
  - In Settings > Privacy
  - Creates document in dataExportRequests collection
  - Shows status ("Request submitted", "Processing", "Ready")
  - Downloads data when ready
2. Delete My Account flow:
  - In Settings > Privacy > Delete Account
  - Warning dialog with consequences
  - Confirmation (enter password)
  - Creates document in dataDeletionRequests
  - Logs user out
  - Shows confirmation message

---

### Phase 9: Content Moderation (Week 3)

**Website Changes:**

**9.1 Moderation Service**
- File: `src/services/moderationService.ts`
- Functions:
  - `getReportedPosts()` - Fetch reports
  - `getRecentPosts()` - All posts for monitoring
  - `deletePost()` - Permanent removal
  - `hidePost()` - Soft delete
  - `banUser()` - Block from social features
  - `unbanUser()` - Restore access
  - `dismissReport()` - Mark as handled

**9.2 Content Moderation Page**
- File: `src/pages/VaultAdminModeration.tsx`
- Components:
  - Reported posts queue (with priority)
  - Post preview with images/videos
  - Report details (reporter, reason, timestamp)
  - Moderation actions toolbar
  - User ban list
  - Recent posts feed (last 50 posts)

**9.3 Moderation Components**
- Files: `src/components/admin/vault/moderation/`
  - `PostPreviewCard.tsx` - Display post with media
  - `ReportQueueItem.tsx` - Report list item
  - `BanUserDialog.tsx` - Ban confirmation dialog
  - `ModerationHistoryLog.tsx` - Past actions

**Mobile App Changes Required:**
⚠️ MOBILE APP UPDATES NEEDED:

1. Report Post feature:
  - Add "Report" option to post menu (three dots)
  - Show report reasons:
      - Inappropriate content
    - Spam or misleading
    - Harassment or bullying
    - Violence or dangerous behavior
    - Other (with text input)
  - Create document in reports collection:
```
{
  postId: string,
  reportedBy: string,
  reportedUserId: string,
  reason: string,
  additionalInfo?: string,
  timestamp: serverTimestamp(),
  status: 'pending'
}
```
2. Check ban status:
  - On feed screen load, check user.isBanned
  - If banned, hide "Create Post" button
  - Show message: "Your posting privileges have been restricted"
3. Handle deleted posts:
  - Real-time listener on feed posts
  - Remove from UI when deleted
  - Show "Post removed" placeholder if user tries to view

---

### Phase 10: Push Notifications Management (Week 4)

**Website Changes:**

**10.1 Notification Service**
- File: `src/services/notificationService.ts`
- Functions:
  - `sendToAllUsers()` - Broadcast
  - `sendToSegment()` - Target specific group
  - `sendToUser()` - Single user
  - `scheduleNotification()` - Future send
  - `getNotificationHistory()` - Past sends with stats

**10.2 Push Notifications Page**
- File: `src/pages/VaultAdminNotifications.tsx`
- Components:
  - Notification composer form
  - Audience selector (checkboxes for tiers)
  - Deep link builder (link to specific app screen)
  - Schedule picker (datetime)
  - Preview panel
  - Send/schedule buttons
  - Notification history table with delivery stats

**10.3 Notification Templates**
- Pre-built messages:
  - "Trial ending in 3 days"
  - "New feature announcement"
  - "Weekly training reminder"
  - "Personal record achieved!"
  - "Friend request received"

**Backend Changes Required:**
⚠️ FIREBASE FUNCTIONS NEEDED:

1. Send Notification Function:
  - Callable function: sendNotification(title, body, userIds, deepLink)
  - Use Firebase Cloud Messaging (FCM)
  - Batch sending (500 users at a time)
  - Track in notificationLogs collection
2. Scheduled Notification Processor:
  - Runs every minute
  - Checks scheduledNotifications collection
  - Sends notifications when time arrives
  - Marks as sent
3. Auto-notifications:
  - Trial ending (3 days before)
  - Subscription renewal reminder
  - Personal record achieved (trigger from session creation)

**Mobile App Changes Required:**
⚠️ MOBILE APP UPDATES NEEDED:

1. FCM Token Management:
  - Request notification permissions
  - Get FCM token on app launch
  - Save to user document: fcmToken: string
  - Update if token changes
2. Handle notifications:
  - Background handler for FCM messages
  - Parse deep links (e.g., "vault://session/123")
  - Navigate to correct screen
  - Track opens: lastNotificationOpenedAt
3. Notification preferences:
  - Settings screen for notification types
  - Let users opt-out of marketing notifications
  - Store in user document: notificationPreferences

---

### Phase 11: Training Data Analytics (Week 9)

**Website Changes:**

**11.1 Training Analytics Service**
- File: `src/services/trainingAnalyticsService.ts`
- Functions:
  - `getSessionStats()` - Total sessions, average per user
  - `getJumpDistribution()` - Heights attempted
  - `getSuccessRates()` - Success % by height
  - `getRatingDistribution()` - Rating breakdown
  - `getEquipmentTrends()` - Popular poles
  - `getWeatherCorrelations()` - Weather impact

**11.2 Training Analytics Page**
- File: `src/pages/VaultAdminTrainingAnalytics.tsx`
- Components:
  - Session activity heatmap (day/time)
  - Height distribution histogram
  - Success rate by height chart
  - Popular equipment list
  - Weather impact analysis

**No Backend Changes Required** - Data already in Firestore

**No Mobile App Changes Required** - Data already tracked

---

### Phase 12: Video Management (Week 6)

**Website Changes:**

**12.1 Video Management Service**
- File: `src/services/videoManagementService.ts`
- Functions:
  - `getAllVideos()` - List with thumbnails
  - `getVideosByUser()` - User's videos
  - `getStorageUsage()` - Total GB, cost estimate
  - `deleteVideo()` - Remove from Storage
  - `bulkDeleteVideos()` - Multiple deletion

**12.2 Video Management Page**
- File: `src/pages/VaultAdminVideoManagement.tsx`
- Components:
  - Video gallery grid
  - Storage usage chart
  - Largest videos list
  - Search/filter by user, date, size
  - Bulk selection tools
  - Storage cost calculator

**Backend Changes Required:**
⚠️ FIREBASE FUNCTIONS NEEDED:

1. Daily Storage Usage:
  - Calculate total Storage used
  - Break down by user
  - Estimate monthly cost
  - Store in metrics/storage/{date}
2. Video Compression (Optional):
  - Compress videos >100MB
  - Re-encode to lower bitrate
  - Automatic for videos >6 months old
3. Orphan Cleanup:
  - Find videos not linked to sessions
  - Mark for deletion
  - Auto-delete after 30 days

**No Mobile App Changes Required**

---

## Implementation Priority Ranking

### Must Have (Phases 1-2):
1. ✅ **User Insights** - Understand your users
2. ✅ **Revenue Analytics** - Track business health

### Should Have (Phases 3-5):
3. **Content Moderation** - As social features grow
4. **Push Notifications** - Drive engagement
5. **System Health** - Catch issues early

### Nice to Have (Phases 6-8):
6. **Video Management** - Control costs
7. **Feature Flags** - Safer rollouts
8. **GDPR Compliance** - Legal requirement for EU users

### Optional (Phases 9+):
9. **Training Analytics** - Product insights
10. **Support Tickets** - If volume justifies

---

## Technical Requirements Summary

### Firestore Collections to Create:
- `revenueEvents` - Subscription transactions
- `errorLogs` - App errors and crashes
- `reports` - Content moderation reports
- `featureFlags` - Feature toggles
- `scheduledNotifications` - Queued notifications
- `notificationLogs` - Notification history
- `dataExportRequests` - GDPR export requests
- `dataDeletionRequests` - GDPR deletion requests
- `metrics/*` - Cached analytics data
- `apiHealth` - API status monitoring

### Firebase Functions to Create:
1. RevenueCat webhook handler
2. Daily metrics aggregation
3. Error log aggregation
4. API health checker
5. Send push notification
6. Scheduled notification processor
7. Data export generator
8. Data deletion processor
9. Storage usage calculator

### Mobile App Field Additions:
- `lastLoginAt`, `deviceInfo`, `fcmToken`
- `subscriptionStartedAt`, `subscriptionCancelledAt`
- `isBanned`, `notificationPreferences`
- Track errors and performance to Firestore

---

## Cost Considerations

### Firebase Costs:
- **Firestore reads**: Each admin page load queries all users/sessions
  - Optimization: Cache aggregated data in `metrics` collection
  - Use Cloud Functions to pre-calculate daily
- **Cloud Functions**: Scheduled functions run frequently
  - Use free tier wisely (2M invocations/month free)
- **Storage**: Videos are biggest cost
  - Monitor and set user limits
  - Compress old videos

### Recommended Optimizations:
1. Cache heavy queries (refresh hourly, not real-time)
2. Use Firebase Analytics (free) instead of custom tracking where possible
3. Paginate large lists (don't load all users at once)
4. Use incremental aggregation (update counts on write, not read)

---

## Next Steps

1. Review this plan
2. Decide which phases to implement
3. Set up Firebase Functions project (if not already done)
4. Prioritize mobile app updates needed
5. Start with Phase 1 (User Insights)
