export interface PromoCode {
  id: string;
  code: string;
  type: 'lifetime' | 'trial_extension';
  active: boolean;
  usesRemaining: number | 'unlimited';
  usedBy: string[]; // Array of user IDs
  createdAt: string; // ISO date string
  expiresAt?: string; // Optional ISO date string
  description?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  username?: string;
  hasLifetimeAccess: boolean;
  promoCodeUsed?: string;
  createdAt: string;
  lastActive?: string;
  // Subscription details
  subscriptionTier?: 'free' | 'athlete' | 'athlete_plus' | 'lifetime';
  subscriptionStatus?: string;
  trialEndsAt?: string;
  trialDaysRemaining?: number;
  subscriptionExpiresAt?: string;
}

export type SubscriptionTier = 'free' | 'athlete' | 'athlete_plus' | 'lifetime';

export interface AdminAnalytics {
  totalUsers: number;
  lifetimeAccessUsers: number;
  activePromoCodes: number;
  totalPromoCodeRedemptions: number;
  recentRedemptions: PromoRedemption[];
  // Subscription breakdown
  freeUsers: number;
  trialUsers: number;
  athleteUsers: number;
  athletePlusUsers: number;
}

export interface PromoRedemption {
  userId: string;
  userEmail: string;
  promoCode: string;
  redeemedAt: string;
}

export interface PromoCodeFormData {
  code: string;
  type: 'lifetime' | 'trial_extension';
  active: boolean;
  usesRemaining: number | 'unlimited';
  expiresAt?: string;
  description?: string;
}
