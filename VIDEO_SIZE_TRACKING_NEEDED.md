# Video Size Tracking - Mobile App Update Needed

**Issue:** The Video Management dashboard shows 0 videos or can't calculate storage costs

**Root Cause:** Video file sizes are not being saved to Firestore

---

## Current Situation

### What's Working ✅
- Videos ARE being uploaded to Firebase Storage
- Video URLs ARE being saved to Firestore in `users/{userId}/sessions/{sessionId}`
- Videos are in the `jumps` array with `videoUrl` and `thumbnailUrl`
- The web dashboard can now find and display videos

### What's Missing ❌
- **Video file sizes** are NOT being saved to Firestore
- During upload, the app tracks `originalSize` and `compressedSize`
- But these values are not written to the jump document

---

## Where to Fix

**File:** `/Users/simenguttormsen/Documents/Business/Vault/src/services/videoUploadQueue.ts`

**Line:** 374-379 (in the `updateSessionWithVideo` method)

### Current Code (Missing Size Data):
```typescript
return {
  ...jump,
  videoUrl: task.videoUrl,
  thumbnailUrl: task.thumbnailUrl,
  videoUploadStatus: 'completed',
};
```

### Fixed Code (Includes Size Data):
```typescript
return {
  ...jump,
  videoUrl: task.videoUrl,
  thumbnailUrl: task.thumbnailUrl,
  videoUploadStatus: 'completed',
  compressedSize: task.compressedSize,      // Add this
  originalSize: task.originalSize,          // Add this
};
```

---

## What This Enables

Once video sizes are saved to Firestore, the admin dashboard will show:

### Accurate Storage Tracking
- ✅ Total storage used (in GB)
- ✅ Monthly Firebase Storage cost
- ✅ Average video size
- ✅ Largest videos (for optimization)
- ✅ Storage usage by user

### Cost Management
- ✅ Real-time cost estimates
- ✅ Free tier tracking (first 5GB free)
- ✅ Billable storage calculation
- ✅ Cost projections

### Optimization
- ✅ Identify large videos to compress
- ✅ Find users using most storage
- ✅ Track storage growth over time

---

## Implementation Steps

### Step 1: Update videoUploadQueue.ts

```typescript
// Around line 374-379
const updatedJumps = jumps.map((jump: any) => {
  if (jump.id === task.jumpId) {
    jumpFound = true;
    console.log(`[VideoUploadQueue] Found jump ${task.jumpId}, updating with video URL`);
    return {
      ...jump,
      videoUrl: task.videoUrl,
      thumbnailUrl: task.thumbnailUrl,
      videoUploadStatus: 'completed',
      compressedSize: task.compressedSize,    // NEW: Add this
      originalSize: task.originalSize,        // NEW: Add this
    };
  }
  return jump;
});
```

### Step 2: Update Jump Type Definition

**File:** `src/types/sessions.ts`

Add to the Jump interface:
```typescript
export interface Jump {
  // ... existing fields
  videoUrl?: string;
  thumbnailUrl?: string;

  // ADD THESE:
  compressedSize?: number;  // Size in bytes after compression
  originalSize?: number;     // Original video file size in bytes
}
```

### Step 3: Test

1. Upload a new video from the app
2. Check Firestore console
3. Verify the jump now has `compressedSize` and/or `originalSize` fields
4. Refresh the admin dashboard at `/vault/admin/videos`
5. Verify storage stats now show correctly

---

## Why This Matters

### Current Dashboard Behavior (Without Sizes)
- Shows video count correctly ✅
- Shows video URLs correctly ✅
- Cannot calculate storage usage ❌
- Cannot estimate costs ❌
- Cannot identify largest videos ❌

### After Fix (With Sizes)
- Shows video count correctly ✅
- Shows video URLs correctly ✅
- Calculates accurate storage usage ✅
- Estimates monthly costs ✅
- Identifies optimization targets ✅

---

## Alternative: Use Firebase Admin SDK

If you set up Firebase Cloud Functions, you can:

1. **Create a storage calculator function:**
   - Runs daily
   - Lists all files in Firebase Storage
   - Calculates actual storage used
   - Stores in metrics collection

2. **Benefits:**
   - More accurate (actual file sizes from Storage)
   - No mobile app changes needed
   - Can find orphaned videos

3. **Downside:**
   - Requires backend setup
   - More complex implementation

---

## Estimated Time

**Quick Fix (Recommended):**
- Update videoUploadQueue.ts: 5 minutes
- Update Jump type: 2 minutes
- Test: 5 minutes
- **Total: ~15 minutes**

**Backend Alternative:**
- Set up Cloud Function: 2-3 hours
- More robust but takes longer

---

## Summary

**The fix is simple:**

Just add 2 fields when updating the jump after video upload:
- `compressedSize: task.compressedSize`
- `originalSize: task.originalSize`

These values are already being tracked - just not saved to Firestore!

---

**Once fixed, the Video Management dashboard will show accurate storage and cost data.** 📹💰
