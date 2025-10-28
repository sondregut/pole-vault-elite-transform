import { useState, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { PromoCode, AdminAnalytics } from '@/types/admin';
import { getAllPromoCodes, getAnalyticsData } from '@/services/adminService';

export const usePromoCodes = () => {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const promoCodesRef = collection(db, 'promoCodes');
    const q = query(promoCodesRef);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const codes = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as PromoCode[];

        setPromoCodes(codes);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('[usePromoCodes] Error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const refresh = async () => {
    setLoading(true);
    const codes = await getAllPromoCodes();
    setPromoCodes(codes);
    setLoading(false);
  };

  return {
    promoCodes,
    loading,
    error,
    refresh,
  };
};

export const useAdminAnalytics = () => {
  const [analytics, setAnalytics] = useState<AdminAnalytics>({
    totalUsers: 0,
    lifetimeAccessUsers: 0,
    activePromoCodes: 0,
    totalPromoCodeRedemptions: 0,
    recentRedemptions: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const data = await getAnalyticsData();
        setAnalytics(data);
        setError(null);
      } catch (err: any) {
        console.error('[useAdminAnalytics] Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();

    // Refresh analytics every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000);

    return () => clearInterval(interval);
  }, []);

  const refresh = async () => {
    setLoading(true);
    const data = await getAnalyticsData();
    setAnalytics(data);
    setLoading(false);
  };

  return {
    analytics,
    loading,
    error,
    refresh,
  };
};
