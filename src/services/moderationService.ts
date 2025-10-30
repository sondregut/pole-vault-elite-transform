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
  addDoc,
  Timestamp,
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

          // For comment reports - fetch the comment text
          let commentText = null;
          if (reportData.type === 'comment' && reportData.postId && reportData.commentId) {
            try {
              const postRef = doc(db, 'feed', reportData.postId);
              const postSnapshot = await getDoc(postRef);

              if (postSnapshot.exists()) {
                const postData = postSnapshot.data();
                const comments = postData.comments || [];
                const comment = comments.find((c: any) => c.id === reportData.commentId);
                if (comment) {
                  commentText = comment.text;
                }
              }
            } catch (error) {
              console.error('Error fetching comment for report:', error);
            }
          }

          return {
            id: reportDoc.id,
            ...reportData,
            post,
            commentText,
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
        orderBy('sharedAt', 'desc'),
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
      const postDoc = await getDoc(postRef);

      if (postDoc.exists()) {
        const postData = postDoc.data();

        // Log the deletion for moderation tracking
        await addDoc(collection(db, 'moderationLogs'), {
          action: 'delete_post',
          postId: postId,
          userId: postData.userId,
          postText: postData.postText || postData.caption || '',
          deletedAt: Timestamp.now(),
          deletedBy: 'admin'
        });
      }

      await deleteDoc(postRef);
      return { success: true };
    } catch (error: any) {
      console.error('[Moderation Service] Error deleting post:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete a comment from a post
   */
  async deleteComment(postId: string, commentId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const postRef = doc(db, 'feed', postId);
      const postDoc = await getDoc(postRef);

      if (!postDoc.exists()) {
        return { success: false, error: 'Post not found' };
      }

      const postData = postDoc.data();
      const comments = postData.comments || [];

      // Find and remove the comment
      const updatedComments = comments.filter((c: any) => c.id !== commentId);

      // Log the deletion
      const deletedComment = comments.find((c: any) => c.id === commentId);
      if (deletedComment) {
        await addDoc(collection(db, 'moderationLogs'), {
          action: 'delete_comment',
          postId: postId,
          commentId: commentId,
          userId: deletedComment.userId,
          commentText: deletedComment.text || '',
          deletedAt: Timestamp.now(),
          deletedBy: 'admin'
        });
      }

      // Update the post with the comment removed
      await updateDoc(postRef, {
        comments: updatedComments
      });

      return { success: true };
    } catch (error: any) {
      console.error('[Moderation Service] Error deleting comment:', error);
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
   * Get hidden posts
   */
  async getHiddenPosts(limitCount: number = 50): Promise<FeedPost[]> {
    try {
      const feedRef = collection(db, 'feed');
      const q = query(
        feedRef,
        where('isHidden', '==', true),
        orderBy('hiddenAt', 'desc'),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);

      const posts = await Promise.all(
        snapshot.docs.map(async (postDoc) => {
          const postData = postDoc.data();

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
            console.error('Error fetching user for hidden post:', error);
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
      console.error('[Moderation Service] Error fetching hidden posts:', error);
      return [];
    }
  }

  /**
   * Unhide a post
   */
  async unhidePost(postId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const postRef = doc(db, 'feed', postId);
      await updateDoc(postRef, {
        isHidden: false,
        unhiddenAt: new Date().toISOString(),
      });
      return { success: true };
    } catch (error: any) {
      console.error('[Moderation Service] Error unhiding post:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get moderation action logs (deleted posts/comments)
   */
  async getModerationLogs(limitCount: number = 50): Promise<any[]> {
    try {
      const logsRef = collection(db, 'moderationLogs');
      const q = query(
        logsRef,
        orderBy('deletedAt', 'desc'),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('[Moderation Service] Error fetching moderation logs:', error);
      return [];
    }
  }

  /**
   * Get moderation dashboard data (all in one call)
   */
  async getModerationDashboard() {
    try {
      const [reports, recentPosts, hiddenPosts, bannedUsers, moderationLogs] = await Promise.all([
        this.getReportedPosts(),
        this.getRecentPosts(50),
        this.getHiddenPosts(50),
        this.getBannedUsers(),
        this.getModerationLogs(50),
      ]);

      console.log('[Moderation Service] Dashboard data:', {
        totalReports: reports.length,
        postReports: reports.filter(r => r.type === 'post').length,
        commentReports: reports.filter(r => r.type === 'comment').length,
        recentPosts: recentPosts.length,
        hiddenPosts: hiddenPosts.length,
        bannedUsers: bannedUsers.length,
        moderationLogs: moderationLogs.length
      });

      return {
        reports,
        recentPosts,
        hiddenPosts,
        bannedUsers,
        moderationLogs,
      };
    } catch (error) {
      console.error('[Moderation Service] Error fetching moderation dashboard:', error);
      throw error;
    }
  }
}

export const moderationService = new ModerationService();
