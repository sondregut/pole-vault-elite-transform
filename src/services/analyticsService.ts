import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  Query,
  DocumentData,
} from 'firebase/firestore';
import { db } from '@/utils/firebase';

export interface AnalyticsMetrics {
  dau: number;
  wau: number;
  mau: number;
}

export interface UserGrowthData {
  date: string;
  count: number;
  cumulative: number;
}


export interface EngagementMetrics {
  avgSessionsPerUser: number;
  avgJumpsPerSession: number;
  totalSessions: number;
  totalUsers: number;
}

class AnalyticsService {
  /**
   * Calculate Daily Active Users
   */
  async calculateDAU(date: Date = new Date()): Promise<number> {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const usersRef = collection(db, 'users');
      const q = query(
        usersRef,
        where('lastLoginAt', '>=', Timestamp.fromDate(startOfDay)),
        where('lastLoginAt', '<=', Timestamp.fromDate(endOfDay))
      );

      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error) {
      console.error('[Analytics Service] Error calculating DAU:', error);
      return 0;
    }
  }

  /**
   * Calculate Weekly Active Users (last 7 days)
   */
  async calculateWAU(): Promise<number> {
    try {
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const usersRef = collection(db, 'users');
      const q = query(
        usersRef,
        where('lastLoginAt', '>=', Timestamp.fromDate(weekAgo))
      );

      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error) {
      console.error('[Analytics Service] Error calculating WAU:', error);
      return 0;
    }
  }

  /**
   * Calculate Monthly Active Users (last 30 days)
   */
  async calculateMAU(): Promise<number> {
    try {
      const now = new Date();
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const usersRef = collection(db, 'users');
      const q = query(
        usersRef,
        where('lastLoginAt', '>=', Timestamp.fromDate(monthAgo))
      );

      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error) {
      console.error('[Analytics Service] Error calculating MAU:', error);
      return 0;
    }
  }

  /**
   * Get all active user metrics at once
   */
  async getActiveUserMetrics(): Promise<AnalyticsMetrics> {
    const [dau, wau, mau] = await Promise.all([
      this.calculateDAU(),
      this.calculateWAU(),
      this.calculateMAU(),
    ]);

    return { dau, wau, mau };
  }

  /**
   * Get user growth data (signups over time)
   */
  async getUserGrowthData(daysBack: number = 30): Promise<UserGrowthData[]> {
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);

      // Group users by signup date
      const growthMap = new Map<string, number>();

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.createdAt) {
          const date = new Date(data.createdAt).toISOString().split('T')[0];
          growthMap.set(date, (growthMap.get(date) || 0) + 1);
        }
      });

      // Generate continuous date range for last N days
      const today = new Date();
      const result: UserGrowthData[] = [];
      let cumulative = 0;

      // Calculate cumulative total up to the start date
      const startDate = new Date(today);
      startDate.setDate(startDate.getDate() - daysBack);
      const startDateStr = startDate.toISOString().split('T')[0];

      // Get all users before the start date for initial cumulative count
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.createdAt) {
          const userDate = new Date(data.createdAt).toISOString().split('T')[0];
          if (userDate < startDateStr) {
            cumulative++;
          }
        }
      });

      // Create entry for each day in the range
      for (let i = daysBack - 1; i >= 0; i--) {
        const currentDate = new Date(today);
        currentDate.setDate(currentDate.getDate() - i);
        const dateStr = currentDate.toISOString().split('T')[0];

        const count = growthMap.get(dateStr) || 0;
        cumulative += count;

        result.push({
          date: dateStr,
          count,
          cumulative,
        });
      }

      return result;
    } catch (error) {
      console.error('[Analytics Service] Error fetching user growth data:', error);
      return [];
    }
  }


  /**
   * Get engagement metrics (sessions, jumps, etc.)
   */
  async getEngagementMetrics(): Promise<EngagementMetrics> {
    try {
      // Get all users
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      const totalUsers = usersSnapshot.size;

      // Get all sessions (we'll need to query across all user subcollections)
      // Note: This is a simplified version. In production, you might want to
      // use a flat sessions collection or aggregate this data periodically
      let totalSessions = 0;
      let totalJumps = 0;

      // For now, we'll estimate based on what we have
      // You may want to restructure to have a flat 'sessions' collection
      // for better querying performance

      const sessionsPromises = usersSnapshot.docs.map(async (userDoc) => {
        try {
          const sessionsRef = collection(db, 'users', userDoc.id, 'sessions');
          const sessionsSnapshot = await getDocs(sessionsRef);

          sessionsSnapshot.forEach((sessionDoc) => {
            const sessionData = sessionDoc.data();
            totalSessions++;
            // Assuming jumps are stored in an array
            if (sessionData.jumps && Array.isArray(sessionData.jumps)) {
              totalJumps += sessionData.jumps.length;
            }
          });
        } catch (error) {
          // User might not have sessions subcollection
          console.log(`No sessions for user ${userDoc.id}`);
        }
      });

      await Promise.all(sessionsPromises);

      const avgSessionsPerUser = totalUsers > 0 ? totalSessions / totalUsers : 0;
      const avgJumpsPerSession = totalSessions > 0 ? totalJumps / totalSessions : 0;

      return {
        avgSessionsPerUser,
        avgJumpsPerSession,
        totalSessions,
        totalUsers,
      };
    } catch (error) {
      console.error('[Analytics Service] Error fetching engagement metrics:', error);
      return {
        avgSessionsPerUser: 0,
        avgJumpsPerSession: 0,
        totalSessions: 0,
        totalUsers: 0,
      };
    }
  }

  /**
   * Get comprehensive analytics dashboard data
   */
  async getDashboardAnalytics() {
    try {
      const [metrics, growthData, engagement] = await Promise.all([
        this.getActiveUserMetrics(),
        this.getUserGrowthData(30),
        this.getEngagementMetrics(),
      ]);

      return {
        activeUsers: metrics,
        userGrowth: growthData,
        engagement,
      };
    } catch (error) {
      console.error('[Analytics Service] Error fetching dashboard analytics:', error);
      throw error;
    }
  }

  /**
   * Check if metrics are cached (for performance)
   */
  async getMetricsFromCache(date: string): Promise<any | null> {
    try {
      const metricsRef = collection(db, 'metrics');
      const q = query(metricsRef, where('date', '==', date));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        return snapshot.docs[0].data();
      }

      return null;
    } catch (error) {
      console.error('[Analytics Service] Error fetching cached metrics:', error);
      return null;
    }
  }
}

export const analyticsService = new AnalyticsService();
