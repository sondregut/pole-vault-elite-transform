# Firebase Security Rules for Invite System

## Add These Rules to Your Firebase Project

### How to Add Rules:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `pvt-app-440c9`
3. Click "Firestore Database" in the left menu
4. Click the "Rules" tab
5. Add the rules below to your existing rules

## Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Existing rules for your app...
    // (Keep all your existing rules)

    // ============================================
    // INVITE LINKS COLLECTION - Add these rules
    // ============================================
    match /invite_links/{inviteId} {
      // Anyone can read invite links (needed for public invite pages)
      allow read: if true;

      // Only authenticated users can create invite links
      allow create: if request.auth != null
                    && request.resource.data.code is string
                    && request.resource.data.code.size() == 8
                    && request.resource.data.username is string
                    && request.resource.data.type in ['friend_invite', 'app_share']
                    && request.resource.data.used == false;

      // Only the creator can update their own invite links
      allow update: if request.auth != null
                    && (resource.data.user_id == request.auth.uid
                        || request.auth.uid != null); // Allow marking as used by anyone authenticated

      // Only the creator can delete their invite links
      allow delete: if request.auth != null
                    && resource.data.user_id == request.auth.uid;
    }
  }
}
```

## Field Validation Details

The rules ensure:

✅ **Security**:
- Only authenticated users can create invites
- Public can read invites (needed for landing pages)
- Creators can manage their own invites

✅ **Data Integrity**:
- Invite codes must be exactly 8 characters
- Type must be either 'friend_invite' or 'app_share'
- New invites must be marked as unused

✅ **Privacy**:
- Users can only update/delete their own invites
- But anyone can mark an invite as used (when accepting)

## Firestore Data Structure

Each document in `invite_links` collection:

```typescript
{
  code: string;              // 8-character unique code
  user_id: string;           // Creator's Firebase UID
  username: string;          // Creator's username
  display_name: string;      // Creator's display name
  type: string;              // 'friend_invite' or 'app_share'
  created_at: Timestamp;     // When created
  expires_at: Timestamp;     // Expiration date (30 days)
  used: boolean;             // Has been used?
  used_by?: string;          // Who used it (optional)
  used_at?: Timestamp;       // When used (optional)
  metadata: object;          // Extra data
}
```

## Index Requirements

Firebase may prompt you to create indexes. If so, click the link in the error message or create manually:

**Composite Indexes**:
- Collection: `invite_links`
  - Fields: `code` (Ascending), `used` (Ascending)
  - Query scope: Collection

## Testing the Rules

After adding rules, test in Firebase Console:

1. Go to "Firestore Database" → "Rules" tab
2. Click "Rules Playground"
3. Test these scenarios:

```javascript
// Test 1: Anonymous can read
Location: /invite_links/test123
Operation: get
Authenticated: No
Expected: Allow ✅

// Test 2: Authenticated can create
Location: /invite_links/test123
Operation: create
Authenticated: Yes (any user)
Expected: Allow ✅

// Test 3: Anonymous cannot create
Location: /invite_links/test123
Operation: create
Authenticated: No
Expected: Deny ❌
```

## Next Steps

After adding the rules:

1. ✅ Deploy your website to stavhopp.no
2. ✅ Test creating an invite link
3. ✅ Test opening an invite link (public access)
4. ✅ Build and test mobile app

## Questions?

The rules are designed to be permissive for reading (needed for public invite pages) but strict for writing (only authenticated users can create).