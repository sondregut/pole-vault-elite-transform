import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '@/utils/firebase';

export interface RevenueMetrics {
  mrr: number;
  arr: number;
  arpu: number;
  totalPaidUsers: number;
}

export interface RevenueByTier {
  athlete: number;
  athlete_plus: number;
}

export interface ConversionFunnel {
  totalUsers: number;
  freeUsers: number;
  trialUsers: number;
  paidUsers: number;
  conversionRate: number;
  trialToAthleteRate: number;
  trialToAthletePlusRate: number;
}

export interface ChurnData {
  churnRate: number;
  cancelledThisMonth: number;
  activePaidUsers: number;
}

export interface RevenueEvent {
  id: string;
  type: string;
  userId: string;
  productId?: string;
  price: number;
  currency: string;
  timestamp: any;
  store?: string;
}

// Subscription tier pricing - matches RevenueCat monthly prices
const PRICING = {
  athlete: 7.49,        // athlete_monthly
  athlete_plus: 11.99,  // athlete_plus_monthly
};

class RevenueService {
  /**
   * Calculate Monthly Recurring Revenue (MRR)
   * Uses actual subscription status and prices from RevenueCat
   */
  async calculateMRR(): Promise<number> {
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);

      let mrr = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        const tier = data.subscriptionTier?.toLowerCase();
        const status = data.subscriptionStatus?.toLowerCase();

        // EXCLUDE comp/lifetime accounts (no recurring revenue)
        if (data.hasLifetimeAccess === true) {
          return;
        }

        // EXCLUDE trial users (not paying yet)
        if (data.isTrialing === true) {
          return;
        }

        // Only count users with ACTIVE subscriptions OR users with paid tiers (backwards compatibility)
        const isActive = status === 'active' ||
                        (!status && (tier === 'athlete' || tier === 'athlete_plus' || tier === 'athleteplus'));

        if (!isActive) return;

        // EXCLUDE if subscription has expired
        if (data.subscriptionExpiresAt) {
          const expiresAt = new Date(data.subscriptionExpiresAt);
          if (expiresAt < new Date()) {
            return; // Subscription expired, don't count
          }
        }

        // Use actual subscription price if available (from RevenueCat)
        const actualPrice = data.lastSubscriptionPrice;

        if (actualPrice && actualPrice > 0) {
          // If we have actual price from RevenueCat, use it
          // For yearly subscriptions, convert to monthly
          const productId = data.productId?.toLowerCase() || '';
          if (productId.includes('yearly') || productId.includes('annual')) {
            mrr += actualPrice / 12;
          } else {
            mrr += actualPrice;
          }
        } else {
          // Fallback to estimated pricing if no actual price available
          if (tier === 'athlete') {
            mrr += PRICING.athlete;
          } else if (tier === 'athlete_plus' || tier === 'athleteplus') {
            mrr += PRICING.athlete_plus;
          }
        }
      });

      return Math.round(mrr * 100) / 100; // Round to 2 decimal places
    } catch (error) {
      console.error('[Revenue Service] Error calculating MRR:', error);
      return 0;
    }
  }

  /**
   * Calculate Annual Recurring Revenue (ARR)
   */
  async calculateARR(): Promise<number> {
    const mrr = await this.calculateMRR();
    return mrr * 12;
  }

  /**
   * Get revenue breakdown by subscription tier
   * Uses actual subscription status and prices from RevenueCat
   */
  async getRevenueByTier(): Promise<RevenueByTier> {
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);

      let athleteRevenue = 0;
      let athletePlusRevenue = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        const tier = data.subscriptionTier?.toLowerCase();
        const status = data.subscriptionStatus?.toLowerCase();

        // EXCLUDE comp/lifetime accounts (no recurring revenue)
        if (data.hasLifetimeAccess === true) {
          return;
        }

        // EXCLUDE trial users (not paying yet)
        if (data.isTrialing === true) {
          return;
        }

        // Only count active users or users with paid tiers (backwards compatibility)
        const isActive = status === 'active' ||
                        (!status && (tier === 'athlete' || tier === 'athlete_plus' || tier === 'athleteplus'));

        if (!isActive) return;

        // EXCLUDE if subscription has expired
        if (data.subscriptionExpiresAt) {
          const expiresAt = new Date(data.subscriptionExpiresAt);
          if (expiresAt < new Date()) {
            return;
          }
        }

        const actualPrice = data.lastSubscriptionPrice;

        let monthlyPrice = 0;

        if (actualPrice && actualPrice > 0) {
          // Convert yearly to monthly if needed
          const productId = data.productId?.toLowerCase() || '';
          if (productId.includes('yearly') || productId.includes('annual')) {
            monthlyPrice = actualPrice / 12;
          } else {
            monthlyPrice = actualPrice;
          }
        } else {
          // Fallback to estimated pricing
          if (tier === 'athlete') {
            monthlyPrice = PRICING.athlete;
          } else if (tier === 'athlete_plus' || tier === 'athleteplus') {
            monthlyPrice = PRICING.athlete_plus;
          }
        }

        // Add to appropriate tier
        if (tier === 'athlete') {
          athleteRevenue += monthlyPrice;
        } else if (tier === 'athlete_plus' || tier === 'athleteplus') {
          athletePlusRevenue += monthlyPrice;
        }
      });

      return {
        athlete: Math.round(athleteRevenue * 100) / 100,
        athlete_plus: Math.round(athletePlusRevenue * 100) / 100,
      };
    } catch (error) {
      console.error('[Revenue Service] Error calculating revenue by tier:', error);
      return {
        athlete: 0,
        athlete_plus: 0,
      };
    }
  }

  /**
   * Get conversion funnel metrics (free → trial → paid)
   * Uses actual subscription status from RevenueCat
   */
  async getConversionFunnel(): Promise<ConversionFunnel> {
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);

      let totalUsers = 0;
      let freeUsers = 0;
      let trialUsers = 0;
      let athleteUsers = 0;
      let athletePlusUsers = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        const tier = data.subscriptionTier?.toLowerCase();
        const status = data.subscriptionStatus?.toLowerCase();
        const isTrialing = data.isTrialing;
        const hasLifetimeAccess = data.hasLifetimeAccess === true;

        totalUsers++;

        // Lifetime/comp users don't count in funnel (they didn't go through trial/payment flow)
        if (hasLifetimeAccess) {
          return;
        }

        // Check if user is actively trialing (NOT paying yet)
        if (isTrialing && data.trialEndDate) {
          const trialEnd = new Date(data.trialEndDate);
          if (trialEnd > new Date()) {
            trialUsers++;
            return;
          }
        }

        // Count by tier, but only if subscription is ACTIVE and PAYING
        const isActive = status === 'active' ||
                        (!status && (tier === 'athlete' || tier === 'athlete_plus' || tier === 'athleteplus'));

        // EXCLUDE if subscription has expired
        if (isActive && data.subscriptionExpiresAt) {
          const expiresAt = new Date(data.subscriptionExpiresAt);
          if (expiresAt < new Date()) {
            freeUsers++;
            return;
          }
        }

        if (isActive) {
          if (tier === 'athlete') {
            athleteUsers++;
          } else if (tier === 'athlete_plus' || tier === 'athleteplus') {
            athletePlusUsers++;
          }
        } else if (tier === 'lite' || !tier || tier === 'free') {
          freeUsers++;
        } else {
          // Inactive paid users count as free
          freeUsers++;
        }
      });

      const paidUsers = athleteUsers + athletePlusUsers;
      const conversionRate = totalUsers > 0 ? (paidUsers / totalUsers) * 100 : 0;
      const trialToAthleteRate = paidUsers > 0 ? (athleteUsers / paidUsers) * 100 : 0;
      const trialToAthletePlusRate = paidUsers > 0 ? (athletePlusUsers / paidUsers) * 100 : 0;

      return {
        totalUsers,
        freeUsers,
        trialUsers,
        paidUsers,
        conversionRate,
        trialToAthleteRate,
        trialToAthletePlusRate,
      };
    } catch (error) {
      console.error('[Revenue Service] Error calculating conversion funnel:', error);
      return {
        totalUsers: 0,
        freeUsers: 0,
        trialUsers: 0,
        paidUsers: 0,
        conversionRate: 0,
        trialToAthleteRate: 0,
        trialToAthletePlusRate: 0,
      };
    }
  }

  /**
   * Calculate churn rate (cancelled subscriptions)
   * Uses actual subscription status from RevenueCat
   */
  async getChurnRate(): Promise<ChurnData> {
    try {
      const now = new Date();
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);

      let cancelledThisMonth = 0;
      let activePaidUsers = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        const tier = data.subscriptionTier?.toLowerCase();
        const status = data.subscriptionStatus?.toLowerCase();
        const cancelledAt = data.subscriptionCancelledAt;

        // EXCLUDE comp/lifetime accounts (no recurring revenue)
        if (data.hasLifetimeAccess === true) {
          return;
        }

        // EXCLUDE trial users (not paying yet)
        if (data.isTrialing === true) {
          return;
        }

        // Count active paid users (with backwards compatibility)
        const isActive = status === 'active' ||
                        (!status && (tier === 'athlete' || tier === 'athlete_plus' || tier === 'athleteplus'));

        // EXCLUDE if subscription has expired
        if (data.subscriptionExpiresAt) {
          const expiresAt = new Date(data.subscriptionExpiresAt);
          if (expiresAt < new Date()) {
            // Count as cancelled if expired
            if (cancelledAt) {
              const cancelDate = cancelledAt instanceof Timestamp
                ? cancelledAt.toDate()
                : new Date(cancelledAt);
              if (cancelDate >= monthAgo) {
                cancelledThisMonth++;
              }
            }
            return;
          }
        }

        if (isActive && (tier === 'athlete' || tier === 'athlete_plus' || tier === 'athleteplus')) {
          activePaidUsers++;
        }

        // Count cancellations in last 30 days
        if (cancelledAt) {
          const cancelDate = cancelledAt instanceof Timestamp
            ? cancelledAt.toDate()
            : new Date(cancelledAt);

          if (cancelDate >= monthAgo) {
            cancelledThisMonth++;
          }
        }
      });

      const totalPaidBase = activePaidUsers + cancelledThisMonth;
      const churnRate = totalPaidBase > 0 ? (cancelledThisMonth / totalPaidBase) * 100 : 0;

      return {
        churnRate: Math.round(churnRate * 10) / 10,
        cancelledThisMonth,
        activePaidUsers,
      };
    } catch (error) {
      console.error('[Revenue Service] Error calculating churn rate:', error);
      return {
        churnRate: 0,
        cancelledThisMonth: 0,
        activePaidUsers: 0,
      };
    }
  }

  /**
   * Calculate Average Revenue Per User (ARPU)
   */
  async getARPU(): Promise<number> {
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);

      const totalUsers = snapshot.size;
      const mrr = await this.calculateMRR();

      return totalUsers > 0 ? mrr / totalUsers : 0;
    } catch (error) {
      console.error('[Revenue Service] Error calculating ARPU:', error);
      return 0;
    }
  }

  /**
   * Get revenue metrics (all key metrics in one call)
   * Uses actual subscription status from RevenueCat
   */
  async getRevenueMetrics(): Promise<RevenueMetrics> {
    const [mrr, arr, arpu] = await Promise.all([
      this.calculateMRR(),
      this.calculateARR(),
      this.getARPU(),
    ]);

    // Count total active PAYING users (with backwards compatibility)
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    let totalPaidUsers = 0;

    snapshot.forEach((doc) => {
      const data = doc.data();
      const tier = data.subscriptionTier?.toLowerCase();
      const status = data.subscriptionStatus?.toLowerCase();

      // EXCLUDE comp/lifetime accounts (no recurring revenue)
      if (data.hasLifetimeAccess === true) {
        return;
      }

      // EXCLUDE trial users (not paying yet)
      if (data.isTrialing === true) {
        return;
      }

      // Count users with active status OR paid tier (backwards compatibility)
      const isActive = status === 'active' ||
                      (!status && (tier === 'athlete' || tier === 'athlete_plus' || tier === 'athleteplus'));

      // EXCLUDE if subscription has expired
      if (data.subscriptionExpiresAt) {
        const expiresAt = new Date(data.subscriptionExpiresAt);
        if (expiresAt < new Date()) {
          return;
        }
      }

      if (isActive && (tier === 'athlete' || tier === 'athlete_plus' || tier === 'athleteplus')) {
        totalPaidUsers++;
      }
    });

    return {
      mrr,
      arr,
      arpu,
      totalPaidUsers,
    };
  }

  /**
   * Get recent revenue events (if using webhooks)
   */
  async getRevenueEvents(days: number = 30): Promise<RevenueEvent[]> {
    try {
      const eventsRef = collection(db, 'revenueEvents');
      const now = new Date();
      const daysAgo = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

      const q = query(
        eventsRef,
        where('timestamp', '>=', Timestamp.fromDate(daysAgo)),
        orderBy('timestamp', 'desc'),
        limit(100)
      );

      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as RevenueEvent[];
    } catch (error) {
      console.error('[Revenue Service] Error fetching revenue events:', error);
      // If collection doesn't exist yet, return empty array
      return [];
    }
  }

  /**
   * Get revenue over time (for charts)
   */
  async getRevenueOverTime(months: number = 6): Promise<Array<{ month: string; revenue: number }>> {
    try {
      // This is a simplified version
      // In production, you'd query cached monthly revenue data
      const mrr = await this.calculateMRR();

      // Generate sample data for the last N months
      const data = [];
      const now = new Date();

      for (let i = months - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

        // For now, show current MRR for all months
        // TODO: Replace with actual historical data from metrics collection
        data.push({
          month: monthName,
          revenue: mrr,
        });
      }

      return data;
    } catch (error) {
      console.error('[Revenue Service] Error calculating revenue over time:', error);
      return [];
    }
  }

  /**
   * Get comprehensive revenue dashboard data
   */
  async getDashboardData() {
    try {
      const [metrics, tierRevenue, funnel, churn, revenueOverTime, events] = await Promise.all([
        this.getRevenueMetrics(),
        this.getRevenueByTier(),
        this.getConversionFunnel(),
        this.getChurnRate(),
        this.getRevenueOverTime(6),
        this.getRevenueEvents(30),
      ]);

      return {
        metrics,
        tierRevenue,
        funnel,
        churn,
        revenueOverTime,
        events,
      };
    } catch (error) {
      console.error('[Revenue Service] Error fetching dashboard data:', error);
      throw error;
    }
  }
}

export const revenueService = new RevenueService();
