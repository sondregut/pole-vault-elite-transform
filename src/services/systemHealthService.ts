import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/utils/firebase';

export interface ErrorLog {
  id: string;
  userId?: string;
  error: string;
  stackTrace?: string;
  timestamp: any;
  screen?: string;
  appVersion?: string;
  platform?: string;
}

export interface ErrorRate {
  hour: string;
  count: number;
}

export interface APIHealthStatus {
  service: string;
  status: 'healthy' | 'degraded' | 'down';
  lastChecked: Date;
  responseTime?: number;
  message?: string;
}

export interface StorageUsage {
  totalBytes: number;
  totalGB: number;
  estimatedCostPerMonth: number;
  videoCount: number;
}

export interface PerformanceMetrics {
  avgAppLoadTime: number;
  avgAPIResponseTime: number;
  avgVideoUploadTime: number;
  totalSamples: number;
}

export interface SystemHealthDashboard {
  errorLogs: ErrorLog[];
  errorRate: ErrorRate[];
  apiHealth: APIHealthStatus[];
  recentErrors: ErrorLog[];
  errorCount24h: number;
  errorCountThisWeek: number;
}

class SystemHealthService {
  /**
   * Get recent error logs
   */
  async getErrorLogs(hours: number = 24, limitCount: number = 100): Promise<ErrorLog[]> {
    try {
      const logsRef = collection(db, 'errorLogs');
      const hoursAgo = new Date(Date.now() - hours * 60 * 60 * 1000);

      const q = query(
        logsRef,
        where('timestamp', '>=', Timestamp.fromDate(hoursAgo)),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ErrorLog[];
    } catch (error) {
      console.error('[System Health] Error fetching error logs:', error);
      // Collection might not exist yet
      return [];
    }
  }

  /**
   * Calculate error rate over time (last 24 hours, grouped by hour)
   */
  async getErrorRate(hours: number = 24): Promise<ErrorRate[]> {
    try {
      const logs = await this.getErrorLogs(hours, 1000);

      // Group by hour
      const hourlyMap = new Map<string, number>();

      logs.forEach((log) => {
        const timestamp = log.timestamp?.toDate?.() || new Date(log.timestamp);
        const hourKey = timestamp.toISOString().substring(0, 13); // "2025-01-28T10"
        hourlyMap.set(hourKey, (hourlyMap.get(hourKey) || 0) + 1);
      });

      // Generate continuous hourly data
      const now = new Date();
      const result: ErrorRate[] = [];

      for (let i = hours - 1; i >= 0; i--) {
        const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
        const hourKey = hour.toISOString().substring(0, 13);
        const count = hourlyMap.get(hourKey) || 0;

        result.push({
          hour: hour.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          count,
        });
      }

      return result;
    } catch (error) {
      console.error('[System Health] Error calculating error rate:', error);
      return [];
    }
  }

  /**
   * Get API health status
   * Note: In production, this should check cached health status from Cloud Functions
   */
  async getAPIHealth(): Promise<APIHealthStatus[]> {
    const healthStatuses: APIHealthStatus[] = [];

    // Check Firebase (basic connectivity)
    try {
      const testQuery = await getDocs(query(collection(db, 'users'), limit(1)));
      healthStatuses.push({
        service: 'Firebase Firestore',
        status: 'healthy',
        lastChecked: new Date(),
        responseTime: 100, // Simulated
        message: 'Connected',
      });
    } catch (error) {
      healthStatuses.push({
        service: 'Firebase Firestore',
        status: 'down',
        lastChecked: new Date(),
        message: 'Connection failed',
      });
    }

    // Check cached API health from apiHealth collection (if exists)
    try {
      const apiHealthRef = collection(db, 'apiHealth');
      const snapshot = await getDocs(apiHealthRef);

      snapshot.forEach((doc) => {
        const data = doc.data();
        healthStatuses.push({
          service: data.service || doc.id,
          status: data.status || 'healthy',
          lastChecked: data.lastChecked?.toDate?.() || new Date(),
          responseTime: data.responseTime,
          message: data.message,
        });
      });
    } catch (error) {
      // apiHealth collection doesn't exist yet
      console.log('[System Health] apiHealth collection not found (expected until Cloud Functions are set up)');
    }

    // Add placeholder statuses for services that should be monitored
    if (!healthStatuses.find((h) => h.service === 'RevenueCat')) {
      healthStatuses.push({
        service: 'RevenueCat',
        status: 'healthy',
        lastChecked: new Date(),
        message: 'Not monitored yet',
      });
    }

    return healthStatuses;
  }

  /**
   * Get storage usage (Firebase Storage)
   * Note: Actual calculation requires Cloud Function
   */
  async getStorageUsage(): Promise<StorageUsage> {
    try {
      // In production, this would be cached by a Cloud Function
      // For now, return placeholder data
      return {
        totalBytes: 0,
        totalGB: 0,
        estimatedCostPerMonth: 0,
        videoCount: 0,
      };
    } catch (error) {
      console.error('[System Health] Error fetching storage usage:', error);
      return {
        totalBytes: 0,
        totalGB: 0,
        estimatedCostPerMonth: 0,
        videoCount: 0,
      };
    }
  }

  /**
   * Get performance metrics
   * Note: Requires mobile app to track and log performance data
   */
  async getPerformanceMetrics(): Promise<PerformanceMetrics> {
    try {
      const metricsRef = collection(db, 'performanceMetrics');
      const snapshot = await getDocs(query(metricsRef, limit(100)));

      if (snapshot.empty) {
        return {
          avgAppLoadTime: 0,
          avgAPIResponseTime: 0,
          avgVideoUploadTime: 0,
          totalSamples: 0,
        };
      }

      let totalLoadTime = 0;
      let totalAPITime = 0;
      let totalUploadTime = 0;
      let loadSamples = 0;
      let apiSamples = 0;
      let uploadSamples = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.appLoadTime) {
          totalLoadTime += data.appLoadTime;
          loadSamples++;
        }
        if (data.apiResponseTime) {
          totalAPITime += data.apiResponseTime;
          apiSamples++;
        }
        if (data.videoUploadTime) {
          totalUploadTime += data.videoUploadTime;
          uploadSamples++;
        }
      });

      return {
        avgAppLoadTime: loadSamples > 0 ? totalLoadTime / loadSamples : 0,
        avgAPIResponseTime: apiSamples > 0 ? totalAPITime / apiSamples : 0,
        avgVideoUploadTime: uploadSamples > 0 ? totalUploadTime / uploadSamples : 0,
        totalSamples: snapshot.size,
      };
    } catch (error) {
      console.error('[System Health] Error fetching performance metrics:', error);
      return {
        avgAppLoadTime: 0,
        avgAPIResponseTime: 0,
        avgVideoUploadTime: 0,
        totalSamples: 0,
      };
    }
  }

  /**
   * Get comprehensive system health dashboard
   */
  async getSystemHealthDashboard(): Promise<SystemHealthDashboard> {
    try {
      const [errorLogs24h, errorLogs7d, errorRate, apiHealth] = await Promise.all([
        this.getErrorLogs(24, 100),
        this.getErrorLogs(168, 1000), // 7 days
        this.getErrorRate(24),
        this.getAPIHealth(),
      ]);

      return {
        errorLogs: errorLogs24h,
        errorRate,
        apiHealth,
        recentErrors: errorLogs24h.slice(0, 10),
        errorCount24h: errorLogs24h.length,
        errorCountThisWeek: errorLogs7d.length,
      };
    } catch (error) {
      console.error('[System Health] Error fetching system health dashboard:', error);
      throw error;
    }
  }

  /**
   * Get error breakdown by type/screen
   */
  async getErrorBreakdown(): Promise<{ screen: string; count: number }[]> {
    try {
      const logs = await this.getErrorLogs(168, 1000); // Last 7 days

      const screenMap = new Map<string, number>();

      logs.forEach((log) => {
        const screen = log.screen || 'Unknown';
        screenMap.set(screen, (screenMap.get(screen) || 0) + 1);
      });

      return Array.from(screenMap.entries())
        .map(([screen, count]) => ({ screen, count }))
        .sort((a, b) => b.count - a.count);
    } catch (error) {
      console.error('[System Health] Error getting error breakdown:', error);
      return [];
    }
  }
}

export const systemHealthService = new SystemHealthService();
