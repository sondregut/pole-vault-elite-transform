import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { PromoCode, AdminUser, PromoCodeFormData, SubscriptionTier } from '@/types/admin';

// Helper function to calculate subscription details
const calculateSubscriptionDetails = (data: any) => {
  const status = data.subscriptionStatus;

  // Calculate trial days remaining
  let trialDaysRemaining: number | undefined;

  // If status is "trial", calculate from creation date (assume 14 day trial)
  if (status === 'trial' && !data.trialEndsAt) {
    if (data.createdAt) {
      const createdDate = new Date(data.createdAt);
      const trialEnd = new Date(createdDate.getTime() + (14 * 24 * 60 * 60 * 1000)); // Add 14 days
      const now = new Date();
      const diffTime = trialEnd.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      trialDaysRemaining = diffDays > 0 ? diffDays : 0;
    }
  } else if (data.trialEndsAt) {
    const trialEnd = new Date(data.trialEndsAt);
    const now = new Date();
    const diffTime = trialEnd.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    trialDaysRemaining = diffDays > 0 ? diffDays : 0;
  }

  // Get the tier from subscriptionTier field or tier field
  const rawTier = data.subscriptionTier || data.tier;

  // Determine subscription tier
  let subscriptionTier: SubscriptionTier = 'free';

  // Check for lifetime access first
  if (data.hasLifetimeAccess || status === 'lifetime') {
    subscriptionTier = 'lifetime';
  }
  // Check subscriptionTier field (handles: lite, athlete, athlete_plus, etc.)
  else if (rawTier) {
    const tierLower = rawTier.toLowerCase();
    if (tierLower === 'athlete_plus' || tierLower === 'athleteplus') {
      subscriptionTier = 'athlete_plus';
    } else if (tierLower === 'athlete') {
      subscriptionTier = 'athlete';
    } else if (tierLower === 'lite') {
      subscriptionTier = 'free'; // lite is the free tier!
    } else if (tierLower === 'lifetime') {
      subscriptionTier = 'lifetime';
    }
  }
  // Check status field as fallback
  else if (status === 'active' || status === 'athlete_plus' || status === 'athlete') {
    if (status === 'athlete_plus') {
      subscriptionTier = 'athlete_plus';
    } else {
      subscriptionTier = 'athlete';
    }
  }
  // Check legacy premium flags
  else if (data.isPremium || data.isSubscribed) {
    subscriptionTier = 'athlete';
  }

  // Check for lifetime access from multiple sources
  const hasLifetimeAccess = data.hasLifetimeAccess ||
                             status === 'lifetime' ||
                             subscriptionTier === 'lifetime' ||
                             false;

  return {
    hasLifetimeAccess,
    subscriptionTier,
    subscriptionStatus: status,
    isTrialing: data.isTrialing || false, // Pass through the Firestore field
    trialEndsAt: data.trialEndsAt,
    trialDaysRemaining,
    subscriptionExpiresAt: data.subscriptionExpiresAt,
  };
};

// Promo Code Operations

export const createPromoCode = async (data: PromoCodeFormData): Promise<{ success: boolean; error?: string }> => {
  try {
    const promoCodeRef = doc(db, 'promoCodes', data.code.toUpperCase());

    // Check if code already exists
    const existingDoc = await getDoc(promoCodeRef);
    if (existingDoc.exists()) {
      return { success: false, error: 'Promo code already exists' };
    }

    const promoCodeData: Omit<PromoCode, 'id'> = {
      code: data.code.toUpperCase(),
      type: data.type,
      active: data.active,
      usesRemaining: data.usesRemaining,
      usedBy: [],
      createdAt: new Date().toISOString(),
      ...(data.expiresAt && { expiresAt: data.expiresAt }),
      ...(data.description && { description: data.description }),
    };

    await setDoc(promoCodeRef, promoCodeData);
    return { success: true };
  } catch (error: any) {
    console.error('[Admin Service] Error creating promo code:', error);
    return { success: false, error: error.message };
  }
};

export const updatePromoCode = async (
  codeId: string,
  updates: Partial<PromoCode>
): Promise<{ success: boolean; error?: string }> => {
  try {
    const promoCodeRef = doc(db, 'promoCodes', codeId);
    await updateDoc(promoCodeRef, updates);
    return { success: true };
  } catch (error: any) {
    console.error('[Admin Service] Error updating promo code:', error);
    return { success: false, error: error.message };
  }
};

export const deletePromoCode = async (codeId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const promoCodeRef = doc(db, 'promoCodes', codeId);
    await deleteDoc(promoCodeRef);
    return { success: true };
  } catch (error: any) {
    console.error('[Admin Service] Error deleting promo code:', error);
    return { success: false, error: error.message };
  }
};

export const getAllPromoCodes = async (): Promise<PromoCode[]> => {
  try {
    const promoCodesRef = collection(db, 'promoCodes');
    const snapshot = await getDocs(promoCodesRef);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as PromoCode[];
  } catch (error) {
    console.error('[Admin Service] Error fetching promo codes:', error);
    return [];
  }
};

export const getPromoCode = async (codeId: string): Promise<PromoCode | null> => {
  try {
    const promoCodeRef = doc(db, 'promoCodes', codeId);
    const docSnap = await getDoc(promoCodeRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as PromoCode;
    }
    return null;
  } catch (error) {
    console.error('[Admin Service] Error fetching promo code:', error);
    return null;
  }
};

// User Management Operations

export const getAllUsers = async (): Promise<AdminUser[]> => {
  try {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);

    return snapshot.docs.map(doc => {
      const data = doc.data();
      const subscriptionDetails = calculateSubscriptionDetails(data);

      return {
        id: doc.id,
        email: data.email || '',
        username: data.username,
        ...subscriptionDetails,
        promoCodeUsed: data.promoCodeUsed,
        createdAt: data.createdAt || '',
        lastActive: data.lastActive,
      };
    }) as AdminUser[];
  } catch (error) {
    console.error('[Admin Service] Error fetching users:', error);
    return [];
  }
};

export const searchUsers = async (searchTerm: string): Promise<AdminUser[]> => {
  try {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);

    const allUsers = snapshot.docs.map(doc => {
      const data = doc.data();
      const subscriptionDetails = calculateSubscriptionDetails(data);

      return {
        id: doc.id,
        email: data.email || '',
        username: data.username,
        ...subscriptionDetails,
        promoCodeUsed: data.promoCodeUsed,
        createdAt: data.createdAt || '',
        lastActive: data.lastActive,
      };
    }) as AdminUser[];

    // Filter by email or username
    const lowerSearchTerm = searchTerm.toLowerCase();
    return allUsers.filter(user =>
      user.email.toLowerCase().includes(lowerSearchTerm) ||
      (user.username && user.username.toLowerCase().includes(lowerSearchTerm))
    );
  } catch (error) {
    console.error('[Admin Service] Error searching users:', error);
    return [];
  }
};

export const toggleUserLifetimeAccess = async (
  userId: string,
  hasLifetimeAccess: boolean
): Promise<{ success: boolean; error?: string }> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      hasLifetimeAccess,
      ...(hasLifetimeAccess && { lifetimeAccessGrantedAt: new Date().toISOString() }),
    });
    return { success: true };
  } catch (error: any) {
    console.error('[Admin Service] Error toggling lifetime access:', error);
    return { success: false, error: error.message };
  }
};

export const getUser = async (userId: string): Promise<AdminUser | null> => {
  try {
    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const subscriptionDetails = calculateSubscriptionDetails(data);

      return {
        id: docSnap.id,
        email: data.email || '',
        username: data.username,
        ...subscriptionDetails,
        promoCodeUsed: data.promoCodeUsed,
        createdAt: data.createdAt || '',
        lastActive: data.lastActive,
      };
    }
    return null;
  } catch (error) {
    console.error('[Admin Service] Error fetching user:', error);
    return null;
  }
};

// Analytics Operations

export const getAnalyticsData = async () => {
  try {
    const [allUsers, allPromoCodes] = await Promise.all([
      getAllUsers(),
      getAllPromoCodes(),
    ]);

    const lifetimeAccessUsers = allUsers.filter(user => user.hasLifetimeAccess);
    const activePromoCodes = allPromoCodes.filter(code => code.active);

    // Calculate subscription breakdown - ONLY count actual paying customers
    const freeUsers = allUsers.filter(user =>
      user.subscriptionTier === 'free' ||
      (!user.subscriptionTier && !user.hasLifetimeAccess)
    ).length;

    // Count ALL trial users (both active and expired trials) - they're not paying
    const trialUsers = allUsers.filter(user =>
      !user.hasLifetimeAccess &&
      (
        // Active trial with days remaining
        (user.trialDaysRemaining && user.trialDaysRemaining > 0) ||
        // OR has trial status in Firestore (includes expired trials)
        user.subscriptionStatus === 'trial' ||
        user.isTrialing === true
      )
    ).length;

    // Only count PAYING athlete users (exclude trials, lifetime, expired)
    const athleteUsers = allUsers.filter(user =>
      user.subscriptionTier === 'athlete' &&
      !user.hasLifetimeAccess &&
      user.isTrialing !== true && // Check Firestore field directly!
      (user.subscriptionStatus === 'active' || !user.subscriptionStatus) // Active or no status (backwards compat)
    ).length;

    // Only count PAYING athlete+ users (exclude trials, lifetime, expired)
    const athletePlusUsers = allUsers.filter(user =>
      user.subscriptionTier === 'athlete_plus' &&
      !user.hasLifetimeAccess &&
      user.isTrialing !== true && // Check Firestore field directly!
      (user.subscriptionStatus === 'active' || !user.subscriptionStatus) // Active or no status (backwards compat)
    ).length;

    // Debug logging to help diagnose discrepancies
    console.log('[Admin Service] User counts breakdown:', {
      total: allUsers.length,
      free: freeUsers,
      trial: trialUsers,
      athlete: athleteUsers,
      athletePlus: athletePlusUsers,
      lifetime: lifetimeAccessUsers.length
    });

    // Log users with athlete_plus tier to see who's being counted
    const athletePlusUsersList = allUsers.filter(user => user.subscriptionTier === 'athlete_plus');
    console.log('[Admin Service] All users with athlete_plus tier:', athletePlusUsersList.length);
    console.log('[Admin Service] Breakdown:', {
      withLifetime: athletePlusUsersList.filter(u => u.hasLifetimeAccess).length,
      inTrial: athletePlusUsersList.filter(u => u.trialDaysRemaining && u.trialDaysRemaining > 0).length,
      paying: athletePlusUsers,
      withExpiredStatus: athletePlusUsersList.filter(u => u.subscriptionStatus === 'expired' || u.subscriptionStatus === 'cancelled').length,
      withNoStatus: athletePlusUsersList.filter(u => !u.subscriptionStatus).length
    });

    // Log detailed status breakdown
    console.log('[Admin Service] Athlete+ users by status:', {
      active: athletePlusUsersList.filter(u => u.subscriptionStatus === 'active').length,
      expired: athletePlusUsersList.filter(u => u.subscriptionStatus === 'expired').length,
      cancelled: athletePlusUsersList.filter(u => u.subscriptionStatus === 'cancelled').length,
      trial: athletePlusUsersList.filter(u => u.subscriptionStatus === 'trial').length,
      noStatus: athletePlusUsersList.filter(u => !u.subscriptionStatus).length
    });

    // Calculate total redemptions
    let totalRedemptions = 0;
    const recentRedemptions: Array<{
      userId: string;
      userEmail: string;
      promoCode: string;
      redeemedAt: string;
    }> = [];

    allPromoCodes.forEach(code => {
      totalRedemptions += code.usedBy.length;
    });

    // Get recent redemptions (users who used promo codes)
    const usersWithCodes = allUsers.filter(user => user.promoCodeUsed);
    usersWithCodes.slice(0, 10).forEach(user => {
      recentRedemptions.push({
        userId: user.id,
        userEmail: user.email,
        promoCode: user.promoCodeUsed || '',
        redeemedAt: user.createdAt, // Approximation
      });
    });

    return {
      totalUsers: allUsers.length,
      lifetimeAccessUsers: lifetimeAccessUsers.length,
      activePromoCodes: activePromoCodes.length,
      totalPromoCodeRedemptions: totalRedemptions,
      recentRedemptions,
      freeUsers,
      trialUsers,
      athleteUsers,
      athletePlusUsers,
    };
  } catch (error) {
    console.error('[Admin Service] Error fetching analytics:', error);
    return {
      totalUsers: 0,
      lifetimeAccessUsers: 0,
      activePromoCodes: 0,
      totalPromoCodeRedemptions: 0,
      recentRedemptions: [],
      freeUsers: 0,
      trialUsers: 0,
      athleteUsers: 0,
      athletePlusUsers: 0,
    };
  }
};
