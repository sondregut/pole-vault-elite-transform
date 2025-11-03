# Firebase Storage Video Playback Setup

## Problem

Videos uploaded to Firebase Storage from the mobile app cannot be played on the web dashboard. The video URLs are valid, but playback fails due to security and CORS configuration.

## Root Causes

1. **Firebase Storage Security Rules** - May be blocking web access
2. **CORS Configuration** - Firebase Storage needs CORS headers to allow browser video playback
3. **Missing Content-Type Headers** - Videos must be served with correct MIME types

## Solutions

### Solution 1: Configure Firebase Storage Security Rules

The storage rules must allow authenticated users to read their own videos.

**Steps:**

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `pvt-app-440c9`
3. Go to **Storage** → **Rules**
4. Update the rules to:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow users to read and write their own videos
    match /videos/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Allow users to read and write their own thumbnails
    match /thumbnails/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // For development: Allow public read access (REMOVE IN PRODUCTION)
    // match /{allPaths=**} {
    //   allow read: if true;
    //   allow write: if request.auth != null;
    // }
  }
}
```

5. Click **Publish**

### Solution 2: Configure CORS for Firebase Storage

Firebase Storage needs CORS headers to allow video playback in browsers.

**Option A: Using Google Cloud Console (Recommended)**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: `pvt-app-440c9`
3. Go to **Cloud Storage** → **Browser**
4. Find your bucket: `pvt-app-440c9.appspot.com` or `pvt-app-440c9.firebasestorage.app`
5. Click on the bucket name
6. Go to **Configuration** → **CORS**
7. Add this configuration:

```json
[
  {
    "origin": ["*"],
    "method": ["GET", "HEAD"],
    "maxAgeSeconds": 3600
  }
]
```

For production, replace `"*"` with your specific domains:
```json
[
  {
    "origin": [
      "https://yourdomain.com",
      "http://localhost:5173",
      "http://localhost:3000"
    ],
    "method": ["GET", "HEAD"],
    "maxAgeSeconds": 3600
  }
]
```

**Option B: Using gsutil Command Line Tool**

1. Install Google Cloud SDK: https://cloud.google.com/sdk/docs/install

2. Create a file named `cors.json`:

```json
[
  {
    "origin": ["*"],
    "method": ["GET", "HEAD"],
    "maxAgeSeconds": 3600
  }
]
```

3. Run this command:

```bash
gsutil cors set cors.json gs://pvt-app-440c9.firebasestorage.app
```

4. Verify CORS configuration:

```bash
gsutil cors get gs://pvt-app-440c9.firebasestorage.app
```

### Solution 3: Use Firebase Storage Download URLs

Ensure your mobile app is generating proper download URLs with tokens.

In your mobile app, use:

```typescript
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

const storage = getStorage();
const videoRef = ref(storage, 'videos/userId/sessionId/video.mp4');

// This generates a URL with a token that allows access
const url = await getDownloadURL(videoRef);
```

### Solution 4: Test Video Access

Use the diagnostic tool to test if videos can be accessed:

1. Navigate to `/vault/video-test` in your dashboard
2. Paste a Firebase Storage video URL
3. Click **Test URL**
4. Review the results to see what's blocking playback

## Verification Steps

After applying the fixes:

1. **Clear browser cache** (important!)
2. Navigate to `/vault/videos`
3. Click on a video thumbnail
4. The video should play in the modal

If it still doesn't work:

1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for error messages starting with `[VideoPlayer]`
4. Check Network tab for failed requests to Firebase Storage
5. Share error details for further troubleshooting

## Common Error Codes

### CORS Errors
```
Access to video at 'https://firebasestorage.googleapis.com/...' from origin 'https://yourdomain.com'
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present
```
**Fix:** Configure CORS (Solution 2)

### Permission Denied
```
FirebaseError: Permission denied
```
**Fix:** Update Storage Rules (Solution 1)

### Network Error (Code 2)
```
Video error: MEDIA_ERR_NETWORK (code 2)
```
**Fix:** Check CORS and Storage Rules

### Format Not Supported (Code 4)
```
Video error: MEDIA_ERR_SRC_NOT_SUPPORTED (code 4)
```
**Fix:** Ensure video is in H.264/AAC format (MP4)

## For Production

1. **Restrict CORS origins** to only your production domains
2. **Use authenticated storage rules** (not public read)
3. **Set up proper token refresh** for long video playback sessions
4. **Consider CDN** for better video delivery performance
5. **Monitor Storage costs** in Firebase Console

## Additional Resources

- [Firebase Storage Security Rules](https://firebase.google.com/docs/storage/security)
- [Configure CORS for Cloud Storage](https://cloud.google.com/storage/docs/configuring-cors)
- [Firebase Storage Best Practices](https://firebase.google.com/docs/storage/best-practices)
- [Video Formats for Web](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Video_codecs)
