import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '@/utils/firebase';

export interface SessionStats {
  totalSessions: number;
  avgSessionsPerUser: number;
  totalJumps: number;
  avgJumpsPerSession: number;
}

export interface HeightDistribution {
  height: string;
  attempts: number;
  makes: number;
  successRate: number;
}

export interface RatingDistribution {
  rating: string;
  count: number;
  percentage: number;
}

export interface EquipmentTrend {
  pole: string;
  usage: number;
  percentage: number;
}

export interface WeatherImpact {
  weather: string;
  sessionCount: number;
  avgRating: number;
}

export interface SessionActivityHeatmap {
  dayOfWeek: string;
  hour: number;
  count: number;
}

class TrainingAnalyticsService {
  /**
   * Get all sessions across all users (for analytics)
   */
  private async getAllSessions(maxSessions: number = 1000): Promise<any[]> {
    try {
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);

      const allSessions: any[] = [];

      for (const userDoc of usersSnapshot.docs) {
        const userId = userDoc.id;

        try {
          const sessionsRef = collection(db, 'users', userId, 'sessions');
          const sessionsSnapshot = await getDocs(query(sessionsRef, limit(50)));

          sessionsSnapshot.forEach((sessionDoc) => {
            allSessions.push({
              id: sessionDoc.id,
              userId,
              ...sessionDoc.data(),
            });
          });
        } catch (error) {
          // User might not have sessions
        }
      }

      return allSessions.slice(0, maxSessions);
    } catch (error) {
      console.error('[Training Analytics] Error fetching sessions:', error);
      return [];
    }
  }

  /**
   * Get session statistics
   */
  async getSessionStats(): Promise<SessionStats> {
    try {
      const sessions = await this.getAllSessions();
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);

      let totalJumps = 0;
      sessions.forEach((session) => {
        if (session.jumps && Array.isArray(session.jumps)) {
          totalJumps += session.jumps.length;
        }
      });

      return {
        totalSessions: sessions.length,
        avgSessionsPerUser: usersSnapshot.size > 0 ? sessions.length / usersSnapshot.size : 0,
        totalJumps,
        avgJumpsPerSession: sessions.length > 0 ? totalJumps / sessions.length : 0,
      };
    } catch (error) {
      console.error('[Training Analytics] Error calculating session stats:', error);
      return {
        totalSessions: 0,
        avgSessionsPerUser: 0,
        totalJumps: 0,
        avgJumpsPerSession: 0,
      };
    }
  }

  /**
   * Get height distribution (most attempted heights)
   */
  async getHeightDistribution(): Promise<HeightDistribution[]> {
    try {
      const sessions = await this.getAllSessions();
      const heightMap = new Map<string, { attempts: number; makes: number }>();

      sessions.forEach((session) => {
        if (session.jumps && Array.isArray(session.jumps)) {
          session.jumps.forEach((jump: any) => {
            const height = jump.height || 'Unknown';
            const result = jump.result;

            const current = heightMap.get(height) || { attempts: 0, makes: 0 };
            current.attempts++;
            if (result === 'make') {
              current.makes++;
            }
            heightMap.set(height, current);
          });
        }
      });

      // Convert to array and calculate success rates
      const distribution: HeightDistribution[] = [];
      heightMap.forEach((data, height) => {
        distribution.push({
          height,
          attempts: data.attempts,
          makes: data.makes,
          successRate: data.attempts > 0 ? (data.makes / data.attempts) * 100 : 0,
        });
      });

      // Sort by height (convert to number for sorting)
      return distribution.sort((a, b) => {
        const heightA = parseFloat(a.height) || 0;
        const heightB = parseFloat(b.height) || 0;
        return heightA - heightB;
      });
    } catch (error) {
      console.error('[Training Analytics] Error calculating height distribution:', error);
      return [];
    }
  }

  /**
   * Get rating distribution
   */
  async getRatingDistribution(): Promise<RatingDistribution[]> {
    try {
      const sessions = await this.getAllSessions();
      const ratingMap = new Map<string, number>();
      let totalJumps = 0;

      sessions.forEach((session) => {
        if (session.jumps && Array.isArray(session.jumps)) {
          session.jumps.forEach((jump: any) => {
            const rating = jump.rating || 'Unknown';
            ratingMap.set(rating, (ratingMap.get(rating) || 0) + 1);
            totalJumps++;
          });
        }
      });

      const distribution: RatingDistribution[] = [];
      ratingMap.forEach((count, rating) => {
        distribution.push({
          rating,
          count,
          percentage: totalJumps > 0 ? (count / totalJumps) * 100 : 0,
        });
      });

      // Sort by count (most common first)
      return distribution.sort((a, b) => b.count - a.count);
    } catch (error) {
      console.error('[Training Analytics] Error calculating rating distribution:', error);
      return [];
    }
  }

  /**
   * Get equipment trends (popular poles)
   */
  async getEquipmentTrends(): Promise<EquipmentTrend[]> {
    try {
      const sessions = await this.getAllSessions();
      const poleMap = new Map<string, number>();
      let totalJumps = 0;

      sessions.forEach((session) => {
        if (session.jumps && Array.isArray(session.jumps)) {
          session.jumps.forEach((jump: any) => {
            const pole = jump.pole || 'Unknown';
            poleMap.set(pole, (poleMap.get(pole) || 0) + 1);
            totalJumps++;
          });
        }
      });

      const trends: EquipmentTrend[] = [];
      poleMap.forEach((usage, pole) => {
        trends.push({
          pole,
          usage,
          percentage: totalJumps > 0 ? (usage / totalJumps) * 100 : 0,
        });
      });

      // Sort by usage (most popular first)
      return trends.sort((a, b) => b.usage - a.usage).slice(0, 10);
    } catch (error) {
      console.error('[Training Analytics] Error calculating equipment trends:', error);
      return [];
    }
  }

  /**
   * Get weather impact on training
   */
  async getWeatherImpact(): Promise<WeatherImpact[]> {
    try {
      const sessions = await this.getAllSessions();
      const weatherMap = new Map<string, { count: number; totalRating: number }>();

      sessions.forEach((session) => {
        const weather = session.weather || 'Unknown';
        const rating = session.postSession?.rating;

        const current = weatherMap.get(weather) || { count: 0, totalRating: 0 };
        current.count++;
        if (rating !== undefined) {
          current.totalRating += rating;
        }
        weatherMap.set(weather, current);
      });

      const impact: WeatherImpact[] = [];
      weatherMap.forEach((data, weather) => {
        impact.push({
          weather,
          sessionCount: data.count,
          avgRating: data.count > 0 ? data.totalRating / data.count : 0,
        });
      });

      // Sort by session count (most common first)
      return impact.sort((a, b) => b.sessionCount - a.sessionCount);
    } catch (error) {
      console.error('[Training Analytics] Error calculating weather impact:', error);
      return [];
    }
  }

  /**
   * Get session activity heatmap (day of week + hour)
   */
  async getSessionActivityHeatmap(): Promise<SessionActivityHeatmap[]> {
    try {
      const sessions = await this.getAllSessions();
      const heatmapMap = new Map<string, number>();

      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

      sessions.forEach((session) => {
        const date = session.date;
        if (date) {
          const dateObj = date.toDate ? date.toDate() : new Date(date);
          const dayOfWeek = dayNames[dateObj.getDay()];
          const hour = dateObj.getHours();

          const key = `${dayOfWeek}_${hour}`;
          heatmapMap.set(key, (heatmapMap.get(key) || 0) + 1);
        }
      });

      const heatmap: SessionActivityHeatmap[] = [];

      // Generate full grid (7 days × 24 hours)
      dayNames.forEach((day) => {
        for (let hour = 0; hour < 24; hour++) {
          const key = `${day}_${hour}`;
          heatmap.push({
            dayOfWeek: day,
            hour,
            count: heatmapMap.get(key) || 0,
          });
        }
      });

      return heatmap;
    } catch (error) {
      console.error('[Training Analytics] Error calculating activity heatmap:', error);
      return [];
    }
  }

  /**
   * Get success rate by height
   */
  async getSuccessRateByHeight(): Promise<{ height: string; rate: number }[]> {
    try {
      const distribution = await this.getHeightDistribution();

      return distribution
        .filter((d) => d.attempts >= 5) // Only heights with 5+ attempts
        .map((d) => ({
          height: d.height,
          rate: d.successRate,
        }))
        .sort((a, b) => {
          const heightA = parseFloat(a.height) || 0;
          const heightB = parseFloat(b.height) || 0;
          return heightA - heightB;
        });
    } catch (error) {
      console.error('[Training Analytics] Error calculating success rate by height:', error);
      return [];
    }
  }

  /**
   * Get comprehensive training analytics dashboard
   */
  async getDashboardAnalytics() {
    try {
      const [
        sessionStats,
        heightDistribution,
        ratingDistribution,
        equipmentTrends,
        weatherImpact,
        activityHeatmap,
        successByHeight,
      ] = await Promise.all([
        this.getSessionStats(),
        this.getHeightDistribution(),
        this.getRatingDistribution(),
        this.getEquipmentTrends(),
        this.getWeatherImpact(),
        this.getSessionActivityHeatmap(),
        this.getSuccessRateByHeight(),
      ]);

      return {
        sessionStats,
        heightDistribution,
        ratingDistribution,
        equipmentTrends,
        weatherImpact,
        activityHeatmap,
        successByHeight,
      };
    } catch (error) {
      console.error('[Training Analytics] Error fetching dashboard analytics:', error);
      throw error;
    }
  }
}

export const trainingAnalyticsService = new TrainingAnalyticsService();
