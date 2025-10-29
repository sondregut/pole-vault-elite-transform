import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db } from '@/utils/firebase';

export interface NotificationPayload {
  title: string;
  body: string;
  deepLink?: string;
  imageUrl?: string;
}

export interface NotificationTarget {
  type: 'all' | 'segment' | 'user';
  tiers?: string[]; // For segment targeting
  userId?: string; // For individual user targeting
}

export interface ScheduledNotification {
  id?: string;
  title: string;
  body: string;
  deepLink?: string;
  target: NotificationTarget;
  scheduledFor: Date | string;
  status: 'pending' | 'sent' | 'failed';
  createdAt: string;
  createdBy: string;
  sentAt?: string;
}

export interface NotificationLog {
  id: string;
  title: string;
  body: string;
  target: NotificationTarget;
  sentAt: any;
  deliveredCount: number;
  failedCount: number;
  openedCount?: number;
  createdBy: string;
}

export interface NotificationStats {
  totalSent: number;
  totalDelivered: number;
  totalOpened: number;
  deliveryRate: number;
  openRate: number;
}

class NotificationService {
  /**
   * Send notification to all users
   * Note: In production, this should be handled by a Cloud Function
   */
  async sendToAllUsers(payload: NotificationPayload, createdBy: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Create a scheduled notification document (to be processed by Cloud Function)
      const notification = {
        title: payload.title,
        body: payload.body,
        deepLink: payload.deepLink,
        target: {
          type: 'all' as const,
        },
        scheduledFor: new Date().toISOString(),
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
        createdBy,
      };

      await addDoc(collection(db, 'scheduledNotifications'), notification);

      // In production, a Cloud Function would:
      // 1. Pick up this scheduled notification
      // 2. Get all user FCM tokens
      // 3. Send via Firebase Cloud Messaging
      // 4. Log results to notificationLogs

      return { success: true };
    } catch (error: any) {
      console.error('[Notification Service] Error scheduling notification:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send notification to specific user segment (by subscription tier)
   */
  async sendToSegment(
    payload: NotificationPayload,
    tiers: string[],
    createdBy: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const notification = {
        title: payload.title,
        body: payload.body,
        deepLink: payload.deepLink,
        target: {
          type: 'segment' as const,
          tiers,
        },
        scheduledFor: new Date().toISOString(),
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
        createdBy,
      };

      await addDoc(collection(db, 'scheduledNotifications'), notification);

      return { success: true };
    } catch (error: any) {
      console.error('[Notification Service] Error scheduling segment notification:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send notification to specific user
   */
  async sendToUser(
    payload: NotificationPayload,
    userId: string,
    createdBy: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const notification = {
        title: payload.title,
        body: payload.body,
        deepLink: payload.deepLink,
        target: {
          type: 'user' as const,
          userId,
        },
        scheduledFor: new Date().toISOString(),
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
        createdBy,
      };

      await addDoc(collection(db, 'scheduledNotifications'), notification);

      return { success: true };
    } catch (error: any) {
      console.error('[Notification Service] Error scheduling user notification:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Schedule notification for future delivery
   */
  async scheduleNotification(
    payload: NotificationPayload,
    target: NotificationTarget,
    scheduledFor: Date,
    createdBy: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const notification = {
        title: payload.title,
        body: payload.body,
        deepLink: payload.deepLink,
        target,
        scheduledFor: scheduledFor.toISOString(),
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
        createdBy,
      };

      await addDoc(collection(db, 'scheduledNotifications'), notification);

      return { success: true };
    } catch (error: any) {
      console.error('[Notification Service] Error scheduling notification:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get notification history (sent notifications)
   */
  async getNotificationHistory(limitCount: number = 50): Promise<NotificationLog[]> {
    try {
      const logsRef = collection(db, 'notificationLogs');
      const q = query(
        logsRef,
        orderBy('sentAt', 'desc'),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as NotificationLog[];
    } catch (error) {
      console.error('[Notification Service] Error fetching notification history:', error);
      // If collection doesn't exist yet, return empty array
      return [];
    }
  }

  /**
   * Get scheduled notifications (pending sends)
   */
  async getScheduledNotifications(): Promise<ScheduledNotification[]> {
    try {
      const scheduledRef = collection(db, 'scheduledNotifications');
      const q = query(
        scheduledRef,
        where('status', '==', 'pending'),
        orderBy('scheduledFor', 'asc')
      );

      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ScheduledNotification[];
    } catch (error) {
      console.error('[Notification Service] Error fetching scheduled notifications:', error);
      return [];
    }
  }

  /**
   * Get notification statistics
   */
  async getNotificationStats(): Promise<NotificationStats> {
    try {
      const logsRef = collection(db, 'notificationLogs');
      const snapshot = await getDocs(logsRef);

      let totalSent = 0;
      let totalDelivered = 0;
      let totalOpened = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        totalSent++;
        totalDelivered += data.deliveredCount || 0;
        totalOpened += data.openedCount || 0;
      });

      const deliveryRate = totalSent > 0 ? (totalDelivered / totalSent) * 100 : 0;
      const openRate = totalDelivered > 0 ? (totalOpened / totalDelivered) * 100 : 0;

      return {
        totalSent,
        totalDelivered,
        totalOpened,
        deliveryRate,
        openRate,
      };
    } catch (error) {
      console.error('[Notification Service] Error calculating notification stats:', error);
      return {
        totalSent: 0,
        totalDelivered: 0,
        totalOpened: 0,
        deliveryRate: 0,
        openRate: 0,
      };
    }
  }

  /**
   * Estimate audience size for a target
   */
  async estimateAudienceSize(target: NotificationTarget): Promise<number> {
    try {
      const usersRef = collection(db, 'users');

      if (target.type === 'all') {
        const snapshot = await getDocs(usersRef);
        return snapshot.size;
      }

      if (target.type === 'segment' && target.tiers) {
        let totalCount = 0;

        for (const tier of target.tiers) {
          const q = query(usersRef, where('subscriptionTier', '==', tier));
          const snapshot = await getDocs(q);
          totalCount += snapshot.size;
        }

        return totalCount;
      }

      if (target.type === 'user') {
        return 1;
      }

      return 0;
    } catch (error) {
      console.error('[Notification Service] Error estimating audience size:', error);
      return 0;
    }
  }

  /**
   * Get dashboard data for notifications page
   */
  async getDashboardData() {
    try {
      const [history, scheduled, stats] = await Promise.all([
        this.getNotificationHistory(50),
        this.getScheduledNotifications(),
        this.getNotificationStats(),
      ]);

      return {
        history,
        scheduled,
        stats,
      };
    } catch (error) {
      console.error('[Notification Service] Error fetching notification dashboard:', error);
      throw error;
    }
  }
}

export const notificationService = new NotificationService();
