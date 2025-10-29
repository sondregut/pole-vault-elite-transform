import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '@/utils/firebase';

export interface Report {
  id: string;
  postId: string;
  reportedBy: string;
  reportedUserId: string;
  reason: string;
  additionalInfo?: string;
  timestamp: any;
  status: 'pending' | 'handled' | 'dismissed';
  post?: FeedPost | null;
}

export interface FeedPost {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  caption?: string;
  postText?: string;
  videoUrl?: string;
  imageUrl?: string;
  sessionId?: string;
  timestamp: any;
  sharedAt?: any;
  likes?: string[];
  comments?: any[];
  isHidden?: boolean;
}

export interface BannedUser {
  userId: string;
  userName?: string;
  userEmail?: string;
  bannedAt: string;
  banReason?: string;
}

class ModerationService {
  /**
   * Get all reported posts with pending status
   */
  async getReportedPosts(): Promise<Report[]> {
    try {
      const reportsRef = collection(db, 'reports');
      const q = query(
        reportsRef,
        where('status', '==', 'pending'),
        orderBy('timestamp', 'desc')
      );

      const snapshot = await getDocs(q);

      // Fetch post details for each report
      const reports = await Promise.all(
        snapshot.docs.map(async (reportDoc) => {
          const reportData = reportDoc.data();

          // Get the actual post from feed collection
          let post: FeedPost | null = null;
          try {
            const postRef = doc(db, 'feed', reportData.postId);
            const postSnapshot = await getDoc(postRef);

            if (postSnapshot.exists()) {
              const postData = postSnapshot.data();

              // Get user info for the post
              const userRef = doc(db, 'users', postData.userId);
              const userSnapshot = await getDoc(userRef);
              const userData = userSnapshot.exists() ? userSnapshot.data() : {};

              post = {
                id: postSnapshot.id,
                ...postData,
                userName: userData.username || userData.displayName || 'Unknown User',
                userEmail: userData.email || '',
              } as FeedPost;
            }
          } catch (error) {
            console.error('Error fetching post for report:', error);
          }

          return {
            id: reportDoc.id,
            ...reportData,
            post,
          } as Report;
        })
      );

      return reports;
    } catch (error) {
      console.error('[Moderation Service] Error fetching reported posts:', error);
      return [];
    }
  }

  /**
   * Get recent posts from feed for monitoring
   */
  async getRecentPosts(limitCount: number = 50): Promise<FeedPost[]> {
    try {
      const feedRef = collection(db, 'feed');
      const q = query(
        feedRef,
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);

      // Fetch user info for each post
      const posts = await Promise.all(
        snapshot.docs.map(async (postDoc) => {
          const postData = postDoc.data();

          // Get user info
          let userName = 'Unknown User';
          let userEmail = '';

          try {
            const userRef = doc(db, 'users', postData.userId);
            const userSnapshot = await getDoc(userRef);

            if (userSnapshot.exists()) {
              const userData = userSnapshot.data();
              userName = userData.username || userData.displayName || 'Unknown User';
              userEmail = userData.email || '';
            }
          } catch (error) {
            console.error('Error fetching user for post:', error);
          }

          return {
            id: postDoc.id,
            ...postData,
            userName,
            userEmail,
          } as FeedPost;
        })
      );

      return posts;
    } catch (error) {
      console.error('[Moderation Service] Error fetching recent posts:', error);
      return [];
    }
  }

  /**
   * Delete a post permanently from the feed
   */
  async deletePost(postId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const postRef = doc(db, 'feed', postId);
      await deleteDoc(postRef);
      return { success: true };
    } catch (error: any) {
      console.error('[Moderation Service] Error deleting post:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Hide a post (soft delete - keeps the post but marks it as hidden)
   */
  async hidePost(postId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const postRef = doc(db, 'feed', postId);
      await updateDoc(postRef, {
        isHidden: true,
        hiddenAt: new Date().toISOString(),
      });
      return { success: true };
    } catch (error: any) {
      console.error('[Moderation Service] Error hiding post:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Ban a user from social features
   */
  async banUser(userId: string, reason: string): Promise<{ success: boolean; error?: string }> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        isBanned: true,
        bannedAt: new Date().toISOString(),
        banReason: reason,
      });
      return { success: true };
    } catch (error: any) {
      console.error('[Moderation Service] Error banning user:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Unban a user (restore social features access)
   */
  async unbanUser(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        isBanned: false,
        unbannedAt: new Date().toISOString(),
      });
      return { success: true };
    } catch (error: any) {
      console.error('[Moderation Service] Error unbanning user:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Dismiss a report (mark as not requiring action)
   */
  async dismissReport(reportId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const reportRef = doc(db, 'reports', reportId);
      await updateDoc(reportRef, {
        status: 'dismissed',
        dismissedAt: new Date().toISOString(),
      });
      return { success: true };
    } catch (error: any) {
      console.error('[Moderation Service] Error dismissing report:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Mark a report as handled (action was taken)
   */
  async markReportHandled(reportId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const reportRef = doc(db, 'reports', reportId);
      await updateDoc(reportRef, {
        status: 'handled',
        handledAt: new Date().toISOString(),
      });
      return { success: true };
    } catch (error: any) {
      console.error('[Moderation Service] Error marking report as handled:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get all banned users
   */
  async getBannedUsers(): Promise<BannedUser[]> {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('isBanned', '==', true));

      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          userId: doc.id,
          userName: data.username || data.displayName,
          userEmail: data.email,
          bannedAt: data.bannedAt,
          banReason: data.banReason,
        };
      });
    } catch (error) {
      console.error('[Moderation Service] Error fetching banned users:', error);
      return [];
    }
  }

  /**
   * Get moderation dashboard data (all in one call)
   */
  async getModerationDashboard() {
    try {
      const [reports, recentPosts, bannedUsers] = await Promise.all([
        this.getReportedPosts(),
        this.getRecentPosts(50),
        this.getBannedUsers(),
      ]);

      return {
        reports,
        recentPosts,
        bannedUsers,
      };
    } catch (error) {
      console.error('[Moderation Service] Error fetching moderation dashboard:', error);
      throw error;
    }
  }
}

export const moderationService = new ModerationService();
