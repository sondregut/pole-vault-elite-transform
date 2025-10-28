# Vault Admin Panel Setup Guide

## Creating Admin-Only Accounts

Admin-only accounts are lightweight accounts that can **only access the admin panel** and don't need regular user data like sessions, poles, or stats.

---

## Step-by-Step: Create an Admin-Only Account

### 1. Create Firebase Auth Account

First, create the account in Firebase Authentication:

**Option A: Using Firebase Console (Recommended)**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click **Authentication** in the left sidebar
4. Click **Users** tab
5. Click **Add user**
6. Enter:
   - Email: `admin@stavhopp.no`
   - Password: (choose a strong password)
7. Click **Add user**

**Option B: Using the Vault Login Page**
1. Go to `http://localhost:8080/vault/login` (or your production URL)
2. Click "Sign up" or "Create account"
3. Enter email: `admin@stavhopp.no`
4. Choose a password
5. Complete signup

---

### 2. Create Minimal User Document in Firestore

Now create a lightweight user document with only the essential fields:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click **Firestore Database** in the left sidebar
4. Navigate to the **`users`** collection
5. You should see a document with the user's UID (if they signed up via the app) OR you need to create one:

**If document EXISTS (user signed up via app):**
   - Click on the user document
   - Add/Update these fields:
     - `isAdmin`: `true` (boolean)
     - `email`: `admin@stavhopp.no` (string)
   - Delete any unnecessary fields if you want to keep it minimal

**If document DOESN'T EXIST (user added via Firebase Console):**
   - Click **Add document**
   - Document ID: **Use the UID from Firebase Authentication Users tab**
     - Go to Authentication > Users
     - Find `admin@stavhopp.no`
     - Copy the **User UID**
   - Add these fields:
     | Field Name | Type    | Value                |
     |------------|---------|----------------------|
     | email      | string  | admin@stavhopp.no    |
     | isAdmin    | boolean | true                 |
     | createdAt  | string  | 2025-01-28T00:00:00Z |
   - Click **Save**

---

### 3. Test the Admin Account

1. **Log out** of any current session
2. Go to `http://localhost:8080/vault/login`
3. Log in with:
   - Email: `admin@stavhopp.no`
   - Password: (the password you set)
4. You should be **automatically redirected** to `/vault/admin`
5. You now have access to:
   - Analytics Dashboard
   - Promo Code Management
   - User Management

---

## Minimal User Document Structure

For admin-only accounts, you only need these fields:

```json
{
  "email": "admin@stavhopp.no",
  "isAdmin": true,
  "createdAt": "2025-01-28T00:00:00.000Z"
}
```

**Optional fields you can add:**
- `username`: Display name for the admin
- `lastActive`: Last login timestamp (automatically updated)

**Fields you DON'T need:**
- `hasLifetimeAccess` - Not needed for admins
- `promoCodeUsed` - Admins don't use promo codes
- `sessions` subcollection - Admin-only accounts don't track training
- `poles` subcollection - Admin-only accounts don't need equipment data

---

## How It Works

### Auto-Redirect Logic

When an admin-only user logs in:

1. System checks if user is authenticated ✓
2. System checks if user has `isAdmin: true` ✓
3. System checks if user has any sessions (training data)
4. **If no sessions** → User is redirected to `/vault/admin`
5. **If has sessions** → User sees regular dashboard with "Admin Panel" button

This means:
- **Admin-only accounts** → Auto-redirect to admin panel
- **Regular users with admin privileges** → Can access both dashboard and admin panel

---

## Security Notes

1. **Firebase Auth handles authentication** - admins must log in with email/password
2. **All admin routes are protected** - non-admin users are redirected
3. **Admin status is checked server-side** via Firestore (not just client-side)
4. **Change passwords regularly** for admin accounts
5. **Monitor admin activity** by checking Firestore logs

---

## Adding Multiple Admin Accounts

To add more admin accounts, repeat the process:

1. Create Firebase Auth user
2. Create minimal Firestore document with `isAdmin: true`
3. Done!

Example admin emails you might create:
- `admin@stavhopp.no` - Primary admin
- `support@stavhopp.no` - Support team admin
- `moderator@stavhopp.no` - Moderator access

---

## Removing Admin Access

To revoke admin privileges:

1. Go to Firestore Database
2. Find the user document
3. Change `isAdmin` from `true` to `false` (or delete the field)
4. User will no longer see admin panel on next login

---

## Troubleshooting

**Admin button doesn't appear:**
- Check that `isAdmin: true` is set in Firestore user document
- Verify the field type is `boolean`, not `string`
- Try logging out and back in

**Admin redirected to regular dashboard:**
- This means they have session data in their account
- Either delete the sessions subcollection, or they can manually go to `/vault/admin`

**Can't access admin panel:**
- Verify user is logged in
- Check `isAdmin` field exists and is `true`
- Check browser console for errors

---

## Quick Reference

| Action                    | URL/Location                          |
|---------------------------|---------------------------------------|
| Admin Login               | `/vault/login`                        |
| Admin Panel               | `/vault/admin`                        |
| Promo Codes               | `/vault/admin/promo-codes`            |
| User Management           | `/vault/admin/users`                  |
| Firebase Console          | https://console.firebase.google.com   |
| Firestore Users Collection| Firestore Database → `users`          |

---

## Current Admin Accounts

Add your admin accounts here for reference:

- `admin@stavhopp.no` - Primary admin account

---

**Last Updated:** January 28, 2025
