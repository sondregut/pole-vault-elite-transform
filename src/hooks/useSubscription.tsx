import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { useFirebaseAuth } from './useFirebaseAuth';

export type SubscriptionTier = 'pro' | 'lite';
export type SubscriptionStatus = 'active' | 'trialing' | 'free' | 'expired' | 'pending';

export interface Subscription {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  isActive: boolean;
  isTrialing: boolean;
  trialEndsAt: string | null;
  expiresAt: string | null;
  hasLifetimeAccess: boolean;
  hasHadSubscription: boolean;
}

interface UseSubscriptionReturn {
  subscription: Subscription | null;
  loading: boolean;
}

/**
 * Hook to check user's subscription status from Firestore
 * Matches mobile app's SubscriptionContext logic
 */
export const useSubscription = (): UseSubscriptionReturn => {
  const { user, loading: authLoading } = useFirebaseAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If auth is still loading, wait
    if (authLoading) {
      return;
    }

    // If no user, no subscription
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    // Listen to user document in real-time
    const userRef = doc(db, 'users', user.uid);

    const unsubscribe = onSnapshot(
      userRef,
      (docSnapshot) => {
        if (!docSnapshot.exists()) {
          // User doc doesn't exist yet (new user)
          setSubscription({
            tier: 'lite',
            status: 'pending',
            isActive: false,
            isTrialing: false,
            trialEndsAt: null,
            expiresAt: null,
            hasLifetimeAccess: false,
            hasHadSubscription: false,
          });
          setLoading(false);
          return;
        }

        const data = docSnapshot.data();
        const subscriptionData = determineSubscriptionStatus(data);
        setSubscription(subscriptionData);
        setLoading(false);
      },
      (error) => {
        console.error('Error listening to user subscription:', error);
        // On error, assume no active subscription
        setSubscription({
          tier: 'lite',
          status: 'free',
          isActive: false,
          isTrialing: false,
          trialEndsAt: null,
          expiresAt: null,
          hasLifetimeAccess: false,
          hasHadSubscription: false,
        });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, authLoading]);

  return { subscription, loading };
};

/**
 * Determine subscription status from Firestore user data
 * Matches mobile app's determineSubscriptionStatus logic
 */
function determineSubscriptionStatus(userData: any): Subscription {
  const hasLifetimeAccess = userData.hasLifetimeAccess === true;
  const hasHadSubscription = userData.hasHadSubscription === true;
  const subscriptionStatus = userData.subscriptionStatus;
  const subscriptionTier = userData.subscriptionTier;
  const isTrialing = userData.isTrialing === true;
  const trialEndsAt = userData.trialEndsAt || null;
  const expiresAt = userData.subscriptionExpiresAt || null;

  // 1. Lifetime Access = PRO active
  if (hasLifetimeAccess) {
    return {
      tier: 'pro',
      status: 'active',
      isActive: true,
      isTrialing: false,
      trialEndsAt: null,
      expiresAt: null,
      hasLifetimeAccess: true,
      hasHadSubscription: true,
    };
  }

  // 2. Active subscription = PRO active
  if (subscriptionStatus === 'active') {
    // Check tier - map various formats to pro/lite
    const isPro = subscriptionTier === 'pro' ||
                  subscriptionTier === 'athlete' ||
                  subscriptionTier === 'athlete_plus' ||
                  subscriptionTier === 'athletePlus';

    return {
      tier: isPro ? 'pro' : 'lite',
      status: 'active',
      isActive: true,
      isTrialing: false,
      trialEndsAt,
      expiresAt,
      hasLifetimeAccess: false,
      hasHadSubscription: true,
    };
  }

  // 3. Trialing with future end date = PRO active
  if (isTrialing && trialEndsAt) {
    const trialEndDate = new Date(trialEndsAt);
    const now = new Date();

    if (trialEndDate > now) {
      return {
        tier: 'pro',
        status: 'trialing',
        isActive: true,
        isTrialing: true,
        trialEndsAt,
        expiresAt,
        hasLifetimeAccess: false,
        hasHadSubscription: true,
      };
    }
  }

  // 4. Cancelled subscriber with hasHadSubscription = Lite access
  if (hasHadSubscription) {
    return {
      tier: 'lite',
      status: 'free',
      isActive: true, // Allow access with Lite tier
      isTrialing: false,
      trialEndsAt,
      expiresAt,
      hasLifetimeAccess: false,
      hasHadSubscription: true,
    };
  }

  // 5. Default = No access (new user who never subscribed)
  return {
    tier: 'lite',
    status: subscriptionStatus === 'pending' ? 'pending' : 'free',
    isActive: false,
    isTrialing: false,
    trialEndsAt,
    expiresAt,
    hasLifetimeAccess: false,
    hasHadSubscription: false,
  };
}

export default useSubscription;
