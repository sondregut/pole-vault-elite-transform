# Mobile App Integration Instructions for Analytics Dashboard (iOS Only)

**Purpose:** Enable the admin analytics dashboard to track user activity and engagement metrics.

**Target:** iOS app developers or coding agents working on the React Native iOS app

---

## Overview

The web admin dashboard now has a "User Insights" page that displays:
- Daily/Weekly/Monthly Active Users (DAU/WAU/MAU)
- User growth over time
- Engagement metrics (sessions per user, jumps per session)

To populate this dashboard with accurate data, the iOS app needs to:
1. Track when users log in
2. Store device information on signup
3. Ensure proper data structure for sessions

---

## Required Changes

### 1. User Document Fields

Add the following fields to the user document in Firestore:

```typescript
interface User {
  // Existing fields...
  id: string;
  email: string;
  username: string;
  createdAt: string; // ISO date string - MUST BE SET ON SIGNUP

  // NEW FIELDS TO ADD:
  lastLoginAt?: Timestamp; // Firestore server timestamp
  deviceInfo?: {
    platform: 'iOS';
    osVersion: string;        // e.g., "17.2"
    appVersion: string;       // e.g., "1.0.5"
  };
  signupMethod?: 'email' | 'google' | 'apple' | 'phone'; // Optional but useful

  // Future fields (for Phase 2 - Revenue Analytics):
  subscriptionStartedAt?: string;
  subscriptionCancelledAt?: string;
  subscriptionPlatform?: 'ios';
  subscriptionPrice?: number;

  // Future fields (for Phase 3 - Moderation):
  isBanned?: boolean;

  // Future fields (for Phase 4 - Notifications):
  fcmToken?: string;
  notificationPreferences?: {
    marketing: boolean;
    social: boolean;
    training: boolean;
  };
}
```

---

## Implementation Instructions

### TASK 1: Update User Login Tracking

**When:** Every time the app launches or user authenticates

**Where to implement:** In your authentication service or app initialization code (e.g., `AuthService.ts`, `App.tsx`, or equivalent)

**What to do:**

#### For React Native with Firebase:

```typescript
import firestore from '@react-native-firebase/firestore';
import DeviceInfo from 'react-native-device-info'; // Install: npm install react-native-device-info

/**
 * Call this function when the app launches and user is authenticated
 */
async function updateUserLoginInfo(userId: string) {
  try {
    const deviceInfo = {
      platform: 'iOS' as const,
      osVersion: DeviceInfo.getSystemVersion(), // e.g., "17.2"
      appVersion: DeviceInfo.getVersion(), // e.g., "1.0.5"
    };

    await firestore()
      .collection('users')
      .doc(userId)
      .update({
        lastLoginAt: firestore.FieldValue.serverTimestamp(),
        deviceInfo: deviceInfo,
      });

    console.log('✅ User login tracked successfully');
  } catch (error) {
    console.error('❌ Error updating user login info:', error);
    // Don't throw - this shouldn't break the app
  }
}

// USAGE EXAMPLE:
// Call this in your app initialization or after successful login
useEffect(() => {
  if (user?.uid) {
    updateUserLoginInfo(user.uid);
  }
}, [user]);
```

#### For Native iOS (Swift):

```swift
import FirebaseFirestore
import UIKit

func updateUserLoginInfo(userId: String) {
    let db = Firestore.firestore()

    let deviceInfo: [String: Any] = [
        "platform": "iOS",
        "osVersion": UIDevice.current.systemVersion,
        "appVersion": Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "unknown"
    ]

    db.collection("users").document(userId).updateData([
        "lastLoginAt": FieldValue.serverTimestamp(),
        "deviceInfo": deviceInfo
    ]) { error in
        if let error = error {
            print("❌ Error updating login info: \(error)")
        } else {
            print("✅ User login tracked successfully")
        }
    }
}

// Call this in AppDelegate or after authentication
```

---

### TASK 2: Update User Signup Flow

**When:** During user registration/signup

**Where to implement:** In your signup function (e.g., `AuthService.createAccount()`, `SignupScreen.tsx`)

**What to do:**

#### For React Native:

```typescript
import firestore from '@react-native-firebase/firestore';
import DeviceInfo from 'react-native-device-info';

/**
 * Call this when creating a new user account
 */
async function createUserDocument(
  userId: string,
  email: string,
  username: string,
  signupMethod: 'email' | 'google' | 'apple' | 'phone'
) {
  try {
    const deviceInfo = {
      platform: 'iOS' as const,
      osVersion: DeviceInfo.getSystemVersion(),
      appVersion: DeviceInfo.getVersion(),
    };

    const userData = {
      id: userId,
      email: email,
      username: username,
      createdAt: new Date().toISOString(), // CRITICAL: Must be ISO string
      lastLoginAt: firestore.FieldValue.serverTimestamp(),
      deviceInfo: deviceInfo,
      signupMethod: signupMethod,
      subscriptionTier: 'trial', // or 'free' depending on your logic
      subscriptionStatus: 'trial',
      // Add other default user fields here...
    };

    await firestore()
      .collection('users')
      .doc(userId)
      .set(userData);

    console.log('✅ User document created successfully');
  } catch (error) {
    console.error('❌ Error creating user document:', error);
    throw error; // This should break signup flow
  }
}

// USAGE EXAMPLE:
async function handleSignup(email: string, password: string, username: string) {
  // 1. Create Firebase Auth user
  const userCredential = await auth().createUserWithEmailAndPassword(email, password);

  // 2. Create Firestore user document with required fields
  await createUserDocument(
    userCredential.user.uid,
    email,
    username,
    'email'
  );

  // 3. Continue with your signup flow...
}
```

**IMPORTANT:** Make sure `createdAt` is set during signup! The analytics dashboard needs this to calculate user growth over time.

---

### TASK 3: Ensure Sessions Collection Structure

**When:** When creating training sessions

**Where to implement:** In your session logging service (e.g., `SessionService.ts`, `LogSessionScreen.tsx`)

**What to verify:**

The analytics dashboard expects sessions to be stored at:
```
/users/{userId}/sessions/{sessionId}
```

Each session document should have:

```typescript
interface Session {
  id: string;
  userId: string;
  createdAt: string | Timestamp;
  jumps: Array<{
    height: number;
    success: boolean;
    // ...other jump fields
  }>;
  // ...other session fields
}
```

**Action:** No changes needed if you're already storing sessions this way. If you're using a different structure, you may need to refactor or create a duplicate flat collection for analytics.

**Alternative (Better for performance):** Create a flat `sessions` collection at the root level:

```typescript
// When creating a session, also write to flat collection:
const sessionData = {
  id: sessionId,
  userId: userId,
  createdAt: new Date().toISOString(),
  jumps: jumpsArray,
  // ...other fields
};

// Write to both locations:
await Promise.all([
  // User's subcollection (for app functionality)
  firestore().collection('users').doc(userId).collection('sessions').doc(sessionId).set(sessionData),

  // Flat collection (for analytics - better performance)
  firestore().collection('sessions').doc(sessionId).set(sessionData),
]);
```

---

## Testing Your Implementation

### 1. Test Login Tracking

**Steps:**
1. Launch the app on iOS device/simulator
2. Login or authenticate
3. Check Firestore console:
   - Navigate to `users/{userId}`
   - Verify `lastLoginAt` is updated (should be recent timestamp)
   - Verify `deviceInfo.platform` = "iOS"
   - Verify `deviceInfo.osVersion` and `deviceInfo.appVersion` are populated

### 2. Test Signup Tracking

**Steps:**
1. Create a new user account
2. Check Firestore console:
   - Navigate to `users/{newUserId}`
   - Verify `createdAt` field exists (ISO string format)
   - Verify `lastLoginAt` is set
   - Verify `deviceInfo` is populated
   - Verify `signupMethod` is set correctly

### 3. Test Session Structure

**Steps:**
1. Log a training session in the app
2. Check Firestore console:
   - Navigate to `users/{userId}/sessions/{sessionId}`
   - Verify document exists with `jumps` array
   - Verify `createdAt` field exists

### 4. Verify Admin Dashboard

**Steps:**
1. Open web admin dashboard
2. Navigate to `/vault/admin/user-insights`
3. Verify:
   - DAU shows recent logins
   - User growth chart shows signups
   - Engagement metrics show session/jump data

---

## Common Issues & Troubleshooting

### Issue 1: "lastLoginAt field not found"
**Solution:** Make sure you're using `firestore.FieldValue.serverTimestamp()` not a Date object.

### Issue 2: "User growth chart is empty"
**Solution:**
- Verify `createdAt` field is set during signup
- Make sure it's an ISO string format: `new Date().toISOString()`
- Check that existing users have this field (may need data migration)

### Issue 3: "Engagement metrics show 0 sessions"
**Solution:**
- Verify sessions are stored in `users/{userId}/sessions/{sessionId}`
- Check that `jumps` field is an array
- Consider implementing flat `sessions` collection for better performance

### Issue 4: "Firebase permission denied error"
**Solution:** The Firestore security rules have been updated to allow users to write `lastLoginAt`. If you still get errors, check that:
- User is authenticated (`request.auth != null`)
- User is updating their own document (`request.auth.uid == userId`)

---

## Installation Requirements

### React Native Projects

```bash
# Core Firebase (if not already installed)
npm install @react-native-firebase/app
npm install @react-native-firebase/firestore
npm install @react-native-firebase/auth

# Device info library
npm install react-native-device-info

# iOS specific (run from ios folder)
cd ios && pod install && cd ..
```

### Native iOS Projects

```ruby
# Add to Podfile
pod 'Firebase/Firestore'
pod 'Firebase/Auth'
```

---

## Priority & Timeline

### High Priority (Required for Phase 1)
✅ **TASK 1:** Update login tracking (`lastLoginAt`, `deviceInfo`)
✅ **TASK 2:** Ensure `createdAt` is set on signup
⚠️ **TASK 3:** Verify session structure (optional optimization)

**Estimated time:** 2-4 hours for full implementation and testing

### Medium Priority (Future Phases)
- Add subscription tracking fields (Phase 2 - Revenue Analytics)
- Add ban status checking (Phase 3 - Content Moderation)
- Add FCM/APNs token storage (Phase 4 - Push Notifications)

---

## Code Review Checklist

Before marking this task as complete, verify:

- [ ] `lastLoginAt` is updated on every app launch
- [ ] `deviceInfo` is populated with platform="iOS", OS version, and app version
- [ ] `createdAt` is set during user signup (ISO string format)
- [ ] All updates use `firestore.FieldValue.serverTimestamp()` for `lastLoginAt`
- [ ] Error handling is in place (don't break app if analytics fail)
- [ ] Tested on iOS device/simulator
- [ ] Verified data appears correctly in Firestore console
- [ ] Admin dashboard shows accurate metrics

---

## Support & Questions

**Web Dashboard Documentation:**
- [PHASE_1_COMPLETED.md](./PHASE_1_COMPLETED.md) - What was built in the web dashboard
- [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) - Full implementation guide
- [ADMIN_EXPANSION_PLAN.md](./ADMIN_EXPANSION_PLAN.md) - Complete expansion plan

**Firebase Documentation:**
- [Firestore Data Model](https://firebase.google.com/docs/firestore/data-model)
- [Firestore Timestamps](https://firebase.google.com/docs/reference/js/firestore_.timestamp)
- [React Native Firebase](https://rnfirebase.io/)

**Need Help?**
- Check Firestore console to debug data structure
- Review Firebase security rules in `firestore.rules`
- Test with Firebase Emulator for faster iteration

---

## Summary

**What you need to do:**

1. **On app launch:** Update `lastLoginAt` and `deviceInfo` (platform will always be "iOS")
2. **On signup:** Set `createdAt`, `lastLoginAt`, and `deviceInfo`
3. **Test:** Verify data appears in Firestore and admin dashboard

**That's it!** These simple changes will enable powerful analytics in the admin dashboard.

---

## Example Pull Request Description

```markdown
# iOS App: Add Analytics Tracking

## Changes
- ✅ Update `lastLoginAt` timestamp on app launch
- ✅ Store device info (platform="iOS", OS version, app version) on login
- ✅ Ensure `createdAt` is set during signup
- ✅ Add error handling for analytics updates

## Testing
- [x] Tested on iOS device
- [x] Tested on iOS simulator
- [x] Verified data in Firestore console
- [x] Confirmed admin dashboard displays metrics correctly

## Firestore Changes
- Added `lastLoginAt` field (Timestamp)
- Added `deviceInfo` object (platform="iOS", osVersion, appVersion)
- Ensured `createdAt` is set on signup

## Breaking Changes
None - all changes are additive and backwards compatible

## Related Documentation
- Web dashboard: [PHASE_1_COMPLETED.md](./PHASE_1_COMPLETED.md)
- iOS app instructions: [MOBILE_APP_INTEGRATION_INSTRUCTIONS.md](./MOBILE_APP_INTEGRATION_INSTRUCTIONS.md)
```

---

**Ready to implement? Start with TASK 1 and test incrementally!** 🚀
