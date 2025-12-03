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
  // Check subscriptionTier field
  else if (rawTier) {
    const tierLower = rawTier.toLowerCase().replace(/[_-]/g, '');
    if (tierLower === 'pro' || tierLower === 'athleteplus') {
      subscriptionTier = 'athlete_plus'; // Map pro/athletePlus to athlete_plus for admin display
    } else if (tierLower === 'athlete' || tierLower === 'plus') {
      subscriptionTier = 'athlete';
    } else if (tierLower === 'lite' || tierLower === 'free') {
      subscriptionTier = 'free';
    } else if (tierLower === 'lifetime') {
      subscriptionTier = 'lifetime';
    }
  }
  // Check status field as fallback
  else if (status === 'active') {
    subscriptionTier = 'athlete_plus'; // Active subscriptions map to Pro (displayed as athlete_plus)
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
        email: data.email,
        phoneNumber: data.phone_number, // Firestore stores as phone_number
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
        email: data.email,
        phoneNumber: data.phone_number, // Firestore stores as phone_number
        username: data.username,
        ...subscriptionDetails,
        promoCodeUsed: data.promoCodeUsed,
        createdAt: data.createdAt || '',
        lastActive: data.lastActive,
      };
    }) as AdminUser[];

    // Filter by email, phone number, or username
    const lowerSearchTerm = searchTerm.toLowerCase();
    return allUsers.filter(user =>
      (user.email && user.email.toLowerCase().includes(lowerSearchTerm)) ||
      (user.phoneNumber && user.phoneNumber.includes(searchTerm)) ||
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
        // Stripe-specific fields for web subscriptions
        stripeCustomerId: data.stripeCustomerId,
        stripeSubscriptionId: data.stripeSubscriptionId,
        subscriptionPlatform: data.subscriptionPlatform,
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

    // Count users on passes (free access, not paying)
    const passUsers = allUsers.filter(user =>
      !user.hasLifetimeAccess &&
      (user.subscriptionStatus === 'onboarding_pass' ||
       user.subscriptionStatus === 'extended_trial' ||
       user.subscriptionStatus === 'pro_day_pass')
    ).length;

    // Count PAYING Pro users (exclude passes, lifetime, expired)
    const proUsers = allUsers.filter(user =>
      user.subscriptionTier === 'athlete_plus' && // Pro users are mapped to athlete_plus for display
      !user.hasLifetimeAccess &&
      user.subscriptionStatus === 'active'
    ).length;

    // No separate athlete tier in new structure
    const athleteUsers = 0;
    const athletePlusUsers = proUsers;

    // Debug logging
    console.log('[Admin Service] User counts breakdown:', {
      total: allUsers.length,
      free: freeUsers,
      passes: passUsers,  // Onboarding, Extended Trial, Pro Day
      proPaying: proUsers,
      lifetime: lifetimeAccessUsers.length
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
        userEmail: user.email || user.phoneNumber || 'Unknown',
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
      trialUsers: passUsers,  // Passes (Onboarding, Extended Trial, Pro Day)
      athleteUsers: 0,         // Deprecated in new structure
      athletePlusUsers,         // Pro paying users
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
