# Coding Agent Task: Add Analytics Tracking to iOS App

## Objective
Enable the web admin dashboard to track user activity metrics including Daily/Weekly/Monthly Active Users, user growth over time, and engagement statistics.

**Platform:** iOS only (React Native)

---

## Task 1: Track User Login Activity

### What to Implement
Create a function that updates user analytics data every time the app launches and the user is authenticated.

### Required Fields to Update
Update the user's Firestore document with:
- `lastLoginAt` - Set to Firestore server timestamp (not a JavaScript Date)

### When to Call
- After successful user authentication
- On every app launch when user is already authenticated
- In the authentication initialization code or app startup sequence

### Error Handling
- Wrap in try-catch to prevent app crashes if analytics update fails
- Log errors but don't throw them - analytics failures should not break the app

### Where to Add
Find your authentication initialization code (likely in App.tsx, AuthContext.tsx, or AuthService.ts) and add this tracking there.

---

## Task 2: Track User Signup

### What to Implement
Ensure that when a new user signs up, their Firestore document is created with all required analytics fields.

### Required Fields to Set
When creating the user document, include:
- `createdAt` - Current date/time as an ISO string format (critical for user growth tracking)
- `lastLoginAt` - Set to Firestore server timestamp
- All existing user fields you already create

### When to Call
During the user registration/signup flow, when creating the user document in Firestore.

### Critical Requirement
The `createdAt` field MUST be an ISO string (not a Firestore timestamp). This is essential for the analytics dashboard to track user growth over time.

### Where to Modify
Find your signup/registration function (likely in SignupScreen.tsx, RegisterScreen.tsx, or AuthService.ts) and add these fields to the user document creation.

---

## Task 3: Update TypeScript Types

### What to Update
Add the new analytics fields to your User interface/type definition:
- `lastLoginAt` (optional Firestore Timestamp)
- `createdAt` (required string - ISO date format)
- `signupMethod` (optional string: email, google, apple, or phone)

### Where to Update
Find your User type definition file (likely types/User.ts, models/User.ts, or interfaces.ts).

---

## Success Criteria

Your implementation is complete when:

1. **App Launch Tracking Works:**
   - Launch the iOS app and authenticate
   - Check Firestore console - the user document should show:
     - Updated `lastLoginAt` timestamp (recent)

2. **Signup Tracking Works:**
   - Create a new user account in the app
   - Check Firestore console - the new user document should have:
     - `createdAt` field (ISO string format like "2025-01-28T10:30:00.000Z")
     - `lastLoginAt` timestamp

3. **Admin Dashboard Shows Data:**
   - Open the web admin dashboard at `/vault/admin/user-insights`
   - DAU/WAU/MAU metrics display correctly
   - User growth chart shows signup data

4. **App Stability:**
   - No crashes or errors when analytics tracking runs
   - App works normally if Firestore updates fail
   - Console logs are clean (no error spam)

---

## Important Notes

### Timestamp vs ISO String
- `lastLoginAt` must be a Firestore server timestamp (use FieldValue.serverTimestamp())
- `createdAt` must be an ISO string (use new Date().toISOString())
- Do NOT mix these up - the dashboard expects specific formats

### Error Handling Philosophy
Analytics tracking is "nice to have" - it should NEVER break core app functionality. If updating analytics fails, log it and move on. Don't throw errors to the user.

### Testing Locations
Test on both:
- iOS Simulator (for quick testing)
- Real iOS device (to verify real device data)

---

## Files You'll Need to Find and Modify

1. **Authentication initialization** - Where user auth state is managed
2. **Signup/registration handler** - Where new users are created
3. **User type definitions** - Where the User interface is defined

Search your codebase for:
- `onAuthStateChanged` or `useAuth` (for Task 1)
- `createUserWithEmailAndPassword` or similar (for Task 2)
- `interface User` or `type User` (for Task 4)

---

## Estimated Time
2-4 hours for implementation and testing

---

## Quick Summary

**What:** Add analytics tracking to iOS app
**Where:** Authentication and signup code
**How:** Update Firestore user documents with login timestamps
**Why:** Enable admin dashboard to show DAU/WAU/MAU and user growth metrics
**Time:** 1-2 hours

**Key Requirements:**
1. Track every app launch with timestamp
2. Set analytics fields on user signup (createdAt as ISO string)
3. Don't break the app if analytics fail
