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
  pro: number;
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
  pro: 9.99,  // pro_monthly ($9.99/mo) or pro_yearly ($79/yr ÷ 12 = $6.58/mo)
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

        // EXCLUDE passes (not paying - free passes)
        if (data.subscriptionStatus === 'onboarding_pass' ||
            data.subscriptionStatus === 'extended_trial' ||
            data.subscriptionStatus === 'pro_day_pass') {
          return;
        }

        // EXCLUDE trial users (old structure)
        if (data.isTrialing === true) {
          return;
        }

        // Only count users with tier='pro' and active status
        if (tier !== 'pro') return;
        if (status !== 'active' && status !== undefined) return;

        // EXCLUDE if subscription has expired
        if (data.subscriptionExpiresAt) {
          const expiresAt = new Date(data.subscriptionExpiresAt);
          if (expiresAt < new Date()) {
            return;
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
          // Fallback to estimated pricing
          mrr += PRICING.pro;
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

      let proRevenue = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        const tier = data.subscriptionTier?.toLowerCase();
        const status = data.subscriptionStatus?.toLowerCase();

        // EXCLUDE comp/lifetime accounts
        if (data.hasLifetimeAccess === true) {
          return;
        }

        // EXCLUDE passes (free, not paying)
        if (status === 'onboarding_pass' ||
            status === 'extended_trial' ||
            status === 'pro_day_pass') {
          return;
        }

        // EXCLUDE trial users (old structure)
        if (data.isTrialing === true) {
          return;
        }

        // Only count pro tier with active status
        if (tier !== 'pro') return;
        if (status !== 'active' && status !== undefined) return;

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
          monthlyPrice = PRICING.pro;
        }

        proRevenue += monthlyPrice;
      });

      return {
        pro: Math.round(proRevenue * 100) / 100,
      };
    } catch (error) {
      console.error('[Revenue Service] Error calculating revenue by tier:', error);
      return {
        pro: 0,
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
      let passUsers = 0;  // Onboarding Pass, Extended Trial, Pro Day Pass
      let paidUsers = 0;  // Paying Pro subscribers

      snapshot.forEach((doc) => {
        const data = doc.data();
        const tier = data.subscriptionTier?.toLowerCase();
        const status = data.subscriptionStatus?.toLowerCase();
        const hasLifetimeAccess = data.hasLifetimeAccess === true;

        totalUsers++;

        // Lifetime/comp users don't count in funnel
        if (hasLifetimeAccess) {
          return;
        }

        // Count users on passes (free access, not paying)
        if (status === 'onboarding_pass' ||
            status === 'extended_trial' ||
            status === 'pro_day_pass') {
          passUsers++;
          return;
        }

        // Count paying Pro subscribers
        if (tier === 'pro' && status === 'active') {
          // EXCLUDE if subscription has expired
          if (data.subscriptionExpiresAt) {
            const expiresAt = new Date(data.subscriptionExpiresAt);
            if (expiresAt < new Date()) {
              freeUsers++;
              return;
            }
          }
          paidUsers++;
          return;
        }

        // Everyone else is free
        freeUsers++;
      });

      const conversionRate = totalUsers > 0 ? (paidUsers / totalUsers) * 100 : 0;
      const passToProRate = passUsers > 0 ? (paidUsers / (passUsers + paidUsers)) * 100 : 0;

      return {
        totalUsers,
        freeUsers,
        trialUsers: passUsers,  // Renamed: passes are the new "trial"
        paidUsers,
        conversionRate,
        trialToAthleteRate: passToProRate,      // Renamed but keeps old key for compatibility
        trialToAthletePlusRate: 0,              // Deprecated
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

        // EXCLUDE comp/lifetime accounts
        if (data.hasLifetimeAccess === true) {
          return;
        }

        // EXCLUDE passes (free, not paying)
        if (status === 'onboarding_pass' ||
            status === 'extended_trial' ||
            status === 'pro_day_pass') {
          return;
        }

        // Only count Pro tier paying customers
        if (tier === 'pro' && status === 'active') {
          // EXCLUDE if subscription has expired
          if (data.subscriptionExpiresAt) {
            const expiresAt = new Date(data.subscriptionExpiresAt);
            if (expiresAt < new Date()) {
              return;
            }
          }
          activePaidUsers++;
        }

        // Count cancellations in last 30 days (churn tracking)
        if (cancelledAt || data.lastChurnDate) {
          const churnDate = data.lastChurnDate ? new Date(data.lastChurnDate) :
                           (cancelledAt instanceof Timestamp ? cancelledAt.toDate() : new Date(cancelledAt));

          if (churnDate >= monthAgo) {
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

    // Count total active PAYING Pro users
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    let totalPaidUsers = 0;

    snapshot.forEach((doc) => {
      const data = doc.data();
      const tier = data.subscriptionTier?.toLowerCase();
      const status = data.subscriptionStatus?.toLowerCase();

      // EXCLUDE comp/lifetime accounts
      if (data.hasLifetimeAccess === true) {
        return;
      }

      // EXCLUDE passes (not paying)
      if (status === 'onboarding_pass' ||
          status === 'extended_trial' ||
          status === 'pro_day_pass') {
        return;
      }

      // Only count Pro tier with active status
      if (tier === 'pro' && status === 'active') {
        // EXCLUDE if subscription has expired
        if (data.subscriptionExpiresAt) {
          const expiresAt = new Date(data.subscriptionExpiresAt);
          if (expiresAt < new Date()) {
            return;
          }
        }
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
