import { AdminUser } from '@/types/admin';

export interface UserOverviewStats {
  totalUsers: number;
  activeUsers: number;
  payingUsers: number;
  trialUsers: number;
  lifetimeUsers: number;
  freeUsers: number;
}

export interface SubscriptionDistribution {
  tier: string;
  count: number;
  percentage: number;
}

export interface UserGrowthData {
  month: string;
  newUsers: number;
  cumulative: number;
}

/**
 * Calculate overall user statistics
 */
export const calculateUserOverview = (users: AdminUser[]): UserOverviewStats => {
  const totalUsers = users.length;

  // Active users (logged in within last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const activeUsers = users.filter(user => {
    if (!user.lastActive) return false;
    return new Date(user.lastActive) >= thirtyDaysAgo;
  }).length;

  // Lifetime users (comp access)
  const lifetimeUsers = users.filter(user => user.hasLifetimeAccess).length;

  // Trial users (currently on trial)
  const trialUsers = users.filter(user => {
    if (user.hasLifetimeAccess) return false; // Exclude comp users
    return user.isTrialing === true || (user.trialDaysRemaining && user.trialDaysRemaining > 0);
  }).length;

  // Paying users - must match revenue logic EXACTLY
  const payingUsers = users.filter(user => {
    // EXCLUDE comp/lifetime (no recurring revenue)
    if (user.hasLifetimeAccess === true) return false;

    // EXCLUDE trial users (not paying yet)
    if (user.isTrialing === true) return false;

    // EXCLUDE if not a paid tier
    if (user.subscriptionTier !== 'athlete' && user.subscriptionTier !== 'athlete_plus') return false;

    // Only count users with active subscriptions OR users with paid tiers (backwards compatibility)
    const status = user.subscriptionStatus?.toLowerCase();
    const tier = user.subscriptionTier?.toLowerCase();
    const isActive = status === 'active' ||
                    (!status && (tier === 'athlete' || tier === 'athlete_plus' || tier === 'athleteplus'));

    if (!isActive) return false;

    // EXCLUDE if subscription has expired
    if (user.subscriptionExpiresAt) {
      const expiresAt = new Date(user.subscriptionExpiresAt);
      if (expiresAt < new Date()) return false;
    }

    return true;
  }).length;

  // Free users (not paying, not on trial, not lifetime)
  const freeUsers = totalUsers - payingUsers - trialUsers - lifetimeUsers;

  return {
    totalUsers,
    activeUsers,
    payingUsers,
    trialUsers,
    lifetimeUsers,
    freeUsers,
  };
};

/**
 * Calculate subscription tier distribution
 */
export const calculateSubscriptionDistribution = (users: AdminUser[]): SubscriptionDistribution[] => {
  const tierCounts = new Map<string, number>();

  users.forEach(user => {
    let tier = 'Free';

    if (user.hasLifetimeAccess) {
      tier = 'Lifetime (Comp)';
    } else if (user.isTrialing || (user.trialDaysRemaining && user.trialDaysRemaining > 0)) {
      tier = 'Trial';
    } else if (user.subscriptionTier === 'athlete_plus') {
      tier = 'Pro';
    } else if (user.subscriptionTier === 'athlete') {
      tier = 'Pro';
    }

    tierCounts.set(tier, (tierCounts.get(tier) || 0) + 1);
  });

  const total = users.length;
  const distribution: SubscriptionDistribution[] = [];

  tierCounts.forEach((count, tier) => {
    distribution.push({
      tier,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
    });
  });

  // Sort by count descending
  return distribution.sort((a, b) => b.count - a.count);
};

/**
 * Calculate user growth over time (last 6 months)
 */
export const calculateUserGrowth = (users: AdminUser[]): UserGrowthData[] => {
  const monthlyData = new Map<string, number>();

  // Sort users by creation date
  const sortedUsers = [...users].sort((a, b) =>
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  // Get last 6 months
  const now = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(now.getMonth() - 6);

  // Count users by month
  sortedUsers.forEach(user => {
    const createdDate = new Date(user.createdAt);
    if (createdDate >= sixMonthsAgo) {
      const monthKey = createdDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      monthlyData.set(monthKey, (monthlyData.get(monthKey) || 0) + 1);
    }
  });

  // Build array with cumulative counts
  const growthData: UserGrowthData[] = [];
  let cumulative = sortedUsers.filter(u => new Date(u.createdAt) < sixMonthsAgo).length;

  // Generate data for last 6 months
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(now.getMonth() - i);
    const monthKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });

    const newUsers = monthlyData.get(monthKey) || 0;
    cumulative += newUsers;

    growthData.push({
      month: monthKey,
      newUsers,
      cumulative,
    });
  }

  return growthData;
};

/**
 * Get most active users (by last active date)
 */
export const getMostActiveUsers = (users: AdminUser[], limit: number = 10): AdminUser[] => {
  return [...users]
    .filter(user => user.lastActive)
    .sort((a, b) => {
      const dateA = new Date(a.lastActive || 0).getTime();
      const dateB = new Date(b.lastActive || 0).getTime();
      return dateB - dateA;
    })
    .slice(0, limit);
};

/**
 * Get recently joined users
 */
export const getRecentlyJoinedUsers = (users: AdminUser[], limit: number = 10): AdminUser[] => {
  return [...users]
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    })
    .slice(0, limit);
};
