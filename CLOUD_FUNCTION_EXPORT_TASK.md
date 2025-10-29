# Cloud Function Task: Implement GDPR Data Export

## Objective
Create a Firebase Cloud Function that automatically processes data export requests from the `dataExportRequests` collection, generates a complete user data export, and provides a download link.

---

## What This Function Does

When a user or admin creates a data export request in Firestore, this function should:
1. Detect the new request
2. Collect ALL of the user's data from Firestore
3. Generate downloadable files (JSON and/or CSV)
4. Create a ZIP archive
5. Upload to Firebase Storage with temporary access
6. Update the request with download URL
7. Email the user (optional)
8. Auto-delete the export after 7 days

---

## Task 1: Set Up Function Trigger

### What to Implement
Create a Firestore-triggered Cloud Function that runs when a new document is created in the `dataExportRequests` collection.

### Trigger Conditions
- Collection: `dataExportRequests`
- Event: `onCreate`
- Filter: `status == 'pending'`

### Function Signature
The function should receive the request document data including:
- `userId` - ID of the user requesting data
- `userEmail` - Email to send download link to
- `requestedAt` - Timestamp of request

---

## Task 2: Collect User Data

### What Data to Export

The function must collect ALL user data from these Firestore locations:

#### 1. User Profile
- Collection: `users/{userId}`
- Include all fields except sensitive ones (password hashes handled by Firebase Auth)

#### 2. Training Sessions
- Collection: `users/{userId}/sessions/{sessionId}`
- Include all session documents
- Include ALL fields from each session
- Include the jumps array with all jump data

#### 3. Equipment (Poles)
- Collection: `users/{userId}/poles/{poleId}`
- Include all pole documents

#### 4. Locations
- Collection: `users/{userId}/locations/{locationId}`
- Include saved training locations

#### 5. Preferences
- Collection: `users/{userId}/preferences/{preferenceId}`
- Include all user preferences and settings

#### 6. Privacy Settings
- Collection: `users/{userId}/privacy/{document}`
- Include privacy preferences

#### 7. Friends
- Collection: `users/{userId}/friends/{friendId}`
- Include friend relationships

#### 8. Friend Requests
- Collection: `users/{userId}/friendRequests/{requestId}`
- Include sent and received friend requests

#### 9. Notifications
- Collection: `users/{userId}/notifications/{notificationId}`
- Include all notifications

#### 10. Social Feed Posts
- Collection: `feed`
- Filter: `where('userId', '==', userId)`
- Include all user's posts

#### 11. Promo Code Usage
- From user document: `promoCodeUsed` field
- Include details if available

#### 12. Video URLs
- Extract from sessions/jumps
- Include URLs (NOT the actual video files, just references)
- Include thumbnails

### What NOT to Include
- Other users' private data
- System-generated IDs (unless useful for the user)
- Internal tracking fields
- Encrypted passwords (handled by Firebase Auth separately)

---

## Task 3: Generate Export Files

### File Format Requirements

Generate TWO file formats:

#### Format 1: JSON (Complete Data)
```json
{
  "exportMetadata": {
    "userId": "...",
    "exportDate": "2025-01-28T10:30:00Z",
    "requestId": "...",
    "dataIncluded": ["profile", "sessions", "poles", ...]
  },
  "profile": { /* user document data */ },
  "sessions": [ /* array of all sessions with jumps */ ],
  "poles": [ /* array of all poles */ ],
  "locations": [ /* array of saved locations */ ],
  "preferences": { /* user preferences */ },
  "privacy": { /* privacy settings */ },
  "friends": [ /* friend list */ ],
  "friendRequests": [ /* friend requests */ ],
  "notifications": [ /* notifications */ ],
  "feedPosts": [ /* user's social posts */ ],
  "videoReferences": [ /* list of video URLs */ ]
}
```

#### Format 2: CSV Files (User-Friendly)
Create separate CSV files for each data type:
- `profile.csv` - User profile data
- `sessions.csv` - All training sessions (flatten jumps)
- `jumps.csv` - All individual jumps
- `poles.csv` - Equipment
- `locations.csv` - Training locations
- `feed_posts.csv` - Social posts
- `videos.csv` - Video URLs and metadata

### CSV Format Notes
- Use standard CSV with headers
- Escape special characters properly
- UTF-8 encoding
- One row per item
- For nested data (like jumps), create separate CSV

---

## Task 4: Create ZIP Archive

### What to Implement
Package all export files into a single ZIP archive.

### ZIP Contents
```
user_data_export_{userId}_{timestamp}.zip
├── README.txt (explanation of contents)
├── user_data.json (complete data in JSON)
├── profile.csv
├── sessions.csv
├── jumps.csv
├── poles.csv
├── locations.csv
├── feed_posts.csv
└── videos.csv
```

### README.txt Content
Include a plain text file explaining:
- What this export contains
- How to read the files
- Privacy notice
- When export was generated
- Expiration date (7 days)

---

## Task 5: Upload to Firebase Storage

### What to Implement
Upload the ZIP file to a temporary storage location in Firebase Storage.

### Storage Location
- Bucket: Default Firebase Storage bucket
- Path: `exports/{userId}/{requestId}.zip`
- Access: Generate a signed URL with 7-day expiration

### Security Requirements
- Set file access to private (not public)
- Generate signed download URL valid for 7 days only
- URL should require no authentication (direct download)

---

## Task 6: Update Firestore Request

### What to Update
Update the original request document in `dataExportRequests/{requestId}` with:

```typescript
{
  status: 'completed',
  completedAt: new Date().toISOString(),
  downloadUrl: signedDownloadUrl,
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
}
```

### Error Handling
If export fails at any step:

```typescript
{
  status: 'failed',
  completedAt: new Date().toISOString(),
  error: errorMessage,
}
```

---

## Task 7: Email Notification (Optional)

### What to Implement
Send an email to the user with the download link.

### Email Content
```
Subject: Your Vault Data Export is Ready

Hi {userName},

Your data export is ready to download. This link will expire in 7 days.

Download your data: {downloadUrl}

The export includes:
- Training sessions and jumps
- Equipment (poles)
- Preferences and settings
- Social feed posts
- Video references

If you have questions, reply to this email.

- The Vault Team
```

### Email Service Options
- Firebase Extensions: Trigger Email
- SendGrid
- Custom SMTP
- Mailgun

---

## Task 8: Scheduled Cleanup

### What to Implement
Create a scheduled function that runs daily to clean up expired exports.

### Cleanup Logic
- Query Firebase Storage for exports older than 7 days
- Delete the ZIP files
- Update Firestore requests to mark download URL as expired (optional)

### Schedule
- Runs: Daily at 2 AM
- Uses: Cloud Scheduler
- Function timeout: 540 seconds (9 minutes)

---

## Success Criteria

Your implementation is complete when:

1. **Function Triggers Correctly:**
   - New export request created in Firestore
   - Function executes automatically
   - Status changes to 'processing'

2. **Data Collection Works:**
   - All user data is collected from Firestore
   - Data is complete and accurate
   - Handles missing subcollections gracefully

3. **Files Generate Properly:**
   - JSON file contains all data
   - CSV files are properly formatted
   - ZIP archive contains all files
   - README.txt is included

4. **Upload Succeeds:**
   - ZIP uploaded to Firebase Storage
   - Signed URL generated (7-day expiration)
   - URL is accessible

5. **Firestore Updates:**
   - Request status updated to 'completed'
   - Download URL saved
   - Completion timestamp recorded

6. **User Can Download:**
   - Admin dashboard shows "Ready to download"
   - Download link works
   - ZIP file contains expected data

7. **Error Handling Works:**
   - Failed exports marked as 'failed'
   - Error messages logged
   - Function doesn't crash on errors

8. **Cleanup Works:**
   - Old exports deleted after 7 days
   - Storage doesn't accumulate unused files

---

## Important Requirements

### Performance
- Handle users with large datasets (1000+ sessions)
- Use batched operations for Firestore queries
- Stream data to ZIP (don't load all in memory)
- Function timeout: Set to 540 seconds minimum

### Security
- Verify the function is triggered by Firestore (not direct HTTP call)
- Don't log sensitive user data
- Ensure only the user or admins can access export
- Use signed URLs, not public access

### Privacy
- Include ONLY the user's own data
- Don't include other users' data (even from shared sessions)
- Anonymize references to other users if needed
- Include privacy settings in export

### Error Handling
- Don't fail entire export if one subcollection fails
- Log errors but continue processing
- Provide detailed error messages in request document
- Allow retry if function fails

### Data Format
- JSON must be valid and parseable
- CSV must open in Excel/Google Sheets
- Use UTF-8 encoding
- Escape special characters in CSV

---

## Testing Steps

1. **Create test export request in Firestore:**
   - Manually add document to `dataExportRequests`
   - Set `userId` to test user
   - Set `status: 'pending'`

2. **Verify function triggers:**
   - Check Cloud Functions logs
   - See status change to 'processing'

3. **Wait for completion:**
   - Monitor logs for progress
   - Check for errors

4. **Download and verify export:**
   - Get download URL from Firestore
   - Download ZIP file
   - Extract and verify contents
   - Check JSON is valid
   - Open CSV files in spreadsheet

5. **Test error scenarios:**
   - User with no data
   - User with missing subcollections
   - Invalid user ID
   - Storage upload failure

6. **Test cleanup:**
   - Wait 7+ days (or manually set old timestamp)
   - Run cleanup function
   - Verify old exports deleted

---

## File Structure in Functions Directory

```
functions/
├── src/
│   ├── index.ts (export the function)
│   ├── gdpr/
│   │   ├── processDataExport.ts (main export function)
│   │   ├── dataCollector.ts (collect user data)
│   │   ├── fileGenerator.ts (generate JSON/CSV)
│   │   └── cleanupExpiredExports.ts (scheduled cleanup)
│   └── utils/
│       ├── zipUtil.ts (create ZIP files)
│       └── emailUtil.ts (send emails)
└── package.json (include dependencies: archiver, csv-writer)
```

---

## Required Dependencies

```json
{
  "dependencies": {
    "firebase-admin": "^12.0.0",
    "firebase-functions": "^5.0.0",
    "archiver": "^6.0.0",
    "csv-writer": "^1.6.0"
  }
}
```

Install with:
```bash
cd functions
npm install archiver csv-writer
```

---

## Deploy Command

```bash
# Deploy all GDPR functions
firebase deploy --only functions:processDataExport,functions:cleanupExpiredExports

# Or deploy all functions
firebase deploy --only functions
```

---

## Estimated Time
4-6 hours for complete implementation and testing

---

## Quick Summary

**What:** Cloud Function to export all user data
**Where:** Firebase Functions (backend)
**Trigger:** New document in `dataExportRequests` with status 'pending'
**Output:** ZIP file with JSON + CSV files
**Upload:** Firebase Storage with 7-day signed URL
**Update:** Mark request as completed with download URL
**Cleanup:** Delete exports after 7 days

**Key Requirements:**
1. Collect all user data from Firestore
2. Generate JSON and CSV files
3. Create ZIP archive
4. Upload to Storage with temporary URL
5. Update request status
6. Handle errors gracefully
7. Clean up old exports
