import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '@/utils/firebase';

export interface VideoMetadata {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  sessionId?: string;
  url: string;
  storagePath?: string;
  uploadedAt: any;
  sizeBytes?: number;
  sizeMB?: number;
  duration?: number;
  thumbnailUrl?: string;
  isEstimated?: boolean; // True if size is estimated, not actual
}

export interface StorageStats {
  totalVideos: number;
  totalSizeGB: number;
  totalSizeMB: number;
  estimatedMonthlyCost: number;
  averageVideoSizeMB: number;
  largestVideoMB: number;
}

export interface UserStorageUsage {
  userId: string;
  userName: string;
  userEmail?: string;
  videoCount: number;
  totalSizeMB: number;
}

// Firebase Storage pricing (as of 2025)
// First 5GB free, then $0.026 per GB/month
const STORAGE_COST_PER_GB = 0.026;
const FREE_TIER_GB = 5;

// Estimated video size for videos without size metadata (in MB)
// Based on actual video uploads: ~20MB average for mobile videos
const ESTIMATED_VIDEO_SIZE_MB = 20;

class VideoManagementService {
  /**
   * Get all videos with metadata
   * Note: This requires videos to be tracked in Firestore
   */
  async getAllVideos(limitCount: number = 100): Promise<VideoMetadata[]> {
    try {
      // Try to get videos from sessions subcollections
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);

      const allVideos: VideoMetadata[] = [];

      // Fetch sessions for each user and extract video URLs
      for (const userDoc of usersSnapshot.docs) {
        const userId = userDoc.id;
        const userData = userDoc.data();

        try {
          const sessionsRef = collection(db, 'users', userId, 'sessions');
          const sessionsSnapshot = await getDocs(query(sessionsRef, limit(50)));

          sessionsSnapshot.forEach((sessionDoc) => {
            const sessionData = sessionDoc.data();

            // Videos are stored in jumps array
            if (sessionData.jumps && Array.isArray(sessionData.jumps)) {
              sessionData.jumps.forEach((jump: any, index: number) => {
                if (jump.videoUrl) {
                  // Try to get video size from compressedSize, originalSize, or videoSize
                  // If no size data available, use estimated size
                  const sizeBytes = jump.compressedSize || jump.originalSize || jump.videoSize || (ESTIMATED_VIDEO_SIZE_MB * 1024 * 1024);
                  const isEstimated = !jump.compressedSize && !jump.originalSize && !jump.videoSize;

                  allVideos.push({
                    id: `${userId}_${sessionDoc.id}_jump${index}_${jump.id || index}`,
                    userId,
                    userName: userData.username || userData.displayName,
                    userEmail: userData.email,
                    sessionId: sessionDoc.id,
                    url: jump.videoUrl,
                    thumbnailUrl: jump.thumbnailUrl,
                    uploadedAt: sessionData.createdAt || sessionData.timestamp,
                    sizeBytes: sizeBytes,
                    sizeMB: sizeBytes / (1024 * 1024),
                    isEstimated,
                  });
                }
              });
            }
          });
        } catch (error) {
          console.log(`No sessions for user ${userId}`);
        }
      }

      // Sort by upload date (newest first)
      allVideos.sort((a, b) => {
        const dateA = a.uploadedAt?.toDate?.() || new Date(a.uploadedAt);
        const dateB = b.uploadedAt?.toDate?.() || new Date(b.uploadedAt);
        return dateB.getTime() - dateA.getTime();
      });

      return allVideos.slice(0, limitCount);
    } catch (error) {
      console.error('[Video Management] Error fetching videos:', error);
      return [];
    }
  }

  /**
   * Get videos for specific user
   */
  async getVideosByUser(userId: string): Promise<VideoMetadata[]> {
    try {
      const sessionsRef = collection(db, 'users', userId, 'sessions');
      const sessionsSnapshot = await getDocs(sessionsRef);

      const videos: VideoMetadata[] = [];

      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.exists() ? userDoc.data() : {};

      sessionsSnapshot.forEach((sessionDoc) => {
        const sessionData = sessionDoc.data();

        if (sessionData.jumps && Array.isArray(sessionData.jumps)) {
          sessionData.jumps.forEach((jump: any, index: number) => {
            if (jump.videoUrl) {
              const sizeBytes = jump.compressedSize || jump.originalSize || jump.videoSize || (ESTIMATED_VIDEO_SIZE_MB * 1024 * 1024);
              const isEstimated = !jump.compressedSize && !jump.originalSize && !jump.videoSize;

              videos.push({
                id: `${userId}_${sessionDoc.id}_jump${index}_${jump.id || index}`,
                userId,
                userName: userData.username || userData.displayName,
                userEmail: userData.email,
                sessionId: sessionDoc.id,
                url: jump.videoUrl,
                thumbnailUrl: jump.thumbnailUrl,
                uploadedAt: sessionData.createdAt || sessionData.timestamp,
                sizeBytes: sizeBytes,
                sizeMB: sizeBytes / (1024 * 1024),
                isEstimated,
              });
            }
          });
        }
      });

      return videos;
    } catch (error) {
      console.error('[Video Management] Error fetching user videos:', error);
      return [];
    }
  }

  /**
   * Calculate storage statistics
   */
  async getStorageStats(): Promise<StorageStats> {
    try {
      const videos = await this.getAllVideos(1000); // Get more for accurate stats

      let totalSizeBytes = 0;
      let largestVideoBytes = 0;

      videos.forEach((video) => {
        const size = video.sizeBytes || 0;
        totalSizeBytes += size;
        if (size > largestVideoBytes) {
          largestVideoBytes = size;
        }
      });

      const totalSizeMB = totalSizeBytes / (1024 * 1024);
      const totalSizeGB = totalSizeMB / 1024;

      // Calculate cost (first 5GB free, then $0.026/GB/month)
      const billableGB = Math.max(0, totalSizeGB - FREE_TIER_GB);
      const estimatedMonthlyCost = billableGB * STORAGE_COST_PER_GB;

      const averageVideoSizeMB = videos.length > 0 ? totalSizeMB / videos.length : 0;
      const largestVideoMB = largestVideoBytes / (1024 * 1024);

      return {
        totalVideos: videos.length,
        totalSizeGB,
        totalSizeMB,
        estimatedMonthlyCost,
        averageVideoSizeMB,
        largestVideoMB,
      };
    } catch (error) {
      console.error('[Video Management] Error calculating storage stats:', error);
      return {
        totalVideos: 0,
        totalSizeGB: 0,
        totalSizeMB: 0,
        estimatedMonthlyCost: 0,
        averageVideoSizeMB: 0,
        largestVideoMB: 0,
      };
    }
  }

  /**
   * Get storage usage by user
   */
  async getUserStorageUsage(): Promise<UserStorageUsage[]> {
    try {
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);

      const userUsage: UserStorageUsage[] = [];

      for (const userDoc of usersSnapshot.docs) {
        const userId = userDoc.id;
        const userData = userDoc.data();
        const videos = await this.getVideosByUser(userId);

        if (videos.length > 0) {
          const totalSizeBytes = videos.reduce((sum, v) => sum + (v.sizeBytes || 0), 0);
          const totalSizeMB = totalSizeBytes / (1024 * 1024);

          userUsage.push({
            userId,
            userName: userData.username || userData.displayName || 'Unknown',
            userEmail: userData.email,
            videoCount: videos.length,
            totalSizeMB,
          });
        }
      }

      // Sort by size (largest first)
      return userUsage.sort((a, b) => b.totalSizeMB - a.totalSizeMB);
    } catch (error) {
      console.error('[Video Management] Error calculating user storage:', error);
      return [];
    }
  }

  /**
   * Delete video (placeholder - actual deletion requires Firebase Storage access)
   */
  async deleteVideo(videoId: string, storagePath?: string): Promise<{ success: boolean; error?: string }> {
    try {
      // In production, this would:
      // 1. Delete file from Firebase Storage
      // 2. Update/delete session document
      // 3. Remove video URL reference

      console.warn('[Video Management] Video deletion requires Cloud Function implementation');
      return { success: false, error: 'Video deletion not yet implemented' };
    } catch (error: any) {
      console.error('[Video Management] Error deleting video:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get largest videos (for cleanup)
   */
  async getLargestVideos(limitCount: number = 20): Promise<VideoMetadata[]> {
    try {
      const videos = await this.getAllVideos(500);

      // Filter videos with size data and sort by size
      return videos
        .filter((v) => v.sizeBytes && v.sizeBytes > 0)
        .sort((a, b) => (b.sizeBytes || 0) - (a.sizeBytes || 0))
        .slice(0, limitCount);
    } catch (error) {
      console.error('[Video Management] Error fetching largest videos:', error);
      return [];
    }
  }

  /**
   * Get dashboard data for video management page
   */
  async getDashboardData() {
    try {
      const [stats, videos, userUsage, largestVideos] = await Promise.all([
        this.getStorageStats(),
        this.getAllVideos(50),
        this.getUserStorageUsage(),
        this.getLargestVideos(20),
      ]);

      return {
        stats,
        videos,
        userUsage,
        largestVideos,
      };
    } catch (error) {
      console.error('[Video Management] Error fetching dashboard data:', error);
      throw error;
    }
  }
}

export const videoManagementService = new VideoManagementService();
