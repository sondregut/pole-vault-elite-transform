import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  writeBatch,
  Unsubscribe
} from 'firebase/firestore';
import { firebaseDb } from '@/utils/firebase';
import { Session, UserStats, Jump, Pole, isFirestoreTimestamp } from '@/types/vault';

export const useVaultSessions = (user: User | null) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setSessions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    let unsubscribe: Unsubscribe;

    const fetchSessions = async () => {
      try {
        // Query sessions collection for the current user
        const sessionsRef = collection(firebaseDb, 'users', user.uid, 'sessions');
        const q = query(
          sessionsRef,
          orderBy('date', 'desc'),
          limit(20) // Get last 20 sessions
        );

        // Set up real-time listener
        unsubscribe = onSnapshot(q, (snapshot) => {
          const sessionData: Session[] = [];

          snapshot.forEach((doc) => {
            const data = doc.data();

            // Convert Firestore timestamp to date
            let date = data.date;
            if (isFirestoreTimestamp(date)) {
              date = date.toDate().toISOString();
            }

            sessionData.push({
              id: doc.id,
              ...data,
              date,
              jumps: data.jumps || []
            } as Session);
          });

          setSessions(sessionData);
          setLoading(false);
        }, (err) => {
          console.error('Error fetching sessions:', err);
          setError('Failed to load sessions');
          setLoading(false);
        });

      } catch (err) {
        console.error('Error setting up sessions listener:', err);
        setError('Failed to load sessions');
        setLoading(false);
      }
    };

    fetchSessions();

    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  return { sessions, loading, error };
};

export const useVaultStats = (user: User | null, sessions: Session[]) => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setStats(null);
      setLoading(false);
      return;
    }

    if (sessions.length === 0) {
      // No sessions yet, show empty stats
      setStats({
        totalSessions: 0,
        totalJumps: 0,
        personalBest: '0.00',
        personalBestUnits: 'm',
        activePoles: 0,
        totalVideos: 0,
        recentSessionsCount: 0,
        thisWeekSessions: 0,
        thisMonthPBImprovement: '0.00'
      });
      setLoading(false);
      return;
    }

    // Calculate stats from sessions data
    const calculateStats = () => {
      const totalSessions = sessions.length;
      const allJumps: Jump[] = sessions.flatMap(session => session.jumps || []);
      const totalJumps = allJumps.length;

      // Calculate personal best (highest successful jump)
      const successfulJumps = allJumps.filter(jump => jump.result === 'make');
      let personalBest = '0.00';
      let personalBestUnits: 'm' | 'ft' = 'm';

      if (successfulJumps.length > 0) {
        const heights = successfulJumps.map(jump => ({
          height: parseFloat(jump.height) || 0,
          units: jump.barUnits || 'm'
        }));

        // Find highest jump (convert all to meters for comparison)
        const bestJump = heights.reduce((max, current) => {
          const currentMeters = current.units === 'ft' ? current.height * 0.3048 : current.height;
          const maxMeters = max.units === 'ft' ? max.height * 0.3048 : max.height;
          return currentMeters > maxMeters ? current : max;
        });

        personalBest = bestJump.height.toFixed(2);
        personalBestUnits = bestJump.units;
      }

      // Count unique poles
      const uniquePoles = new Set(allJumps.map(jump => jump.pole).filter(Boolean));
      const activePoles = uniquePoles.size;

      // Count videos
      const totalVideos = allJumps.filter(jump => jump.videoUrl || jump.videoLocalUri).length;

      // Calculate this week's sessions
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const thisWeekSessions = sessions.filter(session => {
        const sessionDate = new Date(session.date);
        return sessionDate >= oneWeekAgo;
      }).length;

      // Recent sessions (last 5)
      const recentSessionsCount = Math.min(sessions.length, 5);

      const calculatedStats: UserStats = {
        totalSessions,
        totalJumps,
        personalBest,
        personalBestUnits,
        activePoles,
        totalVideos,
        recentSessionsCount,
        thisWeekSessions,
        thisMonthPBImprovement: '0.00' // TODO: Calculate actual improvement
      };

      setStats(calculatedStats);
      setLoading(false);
    };

    calculateStats();
  }, [user, sessions]);

  return { stats, loading };
};

export const useVaultPoles = (user: User | null) => {
  const [poles, setPoles] = useState<Pole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setPoles([]);
      setLoading(false);
      return;
    }

    let unsubscribe: Unsubscribe;

    const fetchPoles = async () => {
      try {
        const polesRef = collection(firebaseDb, 'users', user.uid, 'poles');
        const q = query(polesRef, orderBy('name'));

        // Set up real-time listener
        unsubscribe = onSnapshot(q, (snapshot) => {
          const polesData: Pole[] = [];

          snapshot.forEach((doc) => {
            polesData.push({
              id: doc.id,
              ...doc.data()
            } as Pole);
          });

          setPoles(polesData);
          setLoading(false);
        }, (err) => {
          console.error('Error fetching poles:', err);
          setError('Failed to load equipment');
          setLoading(false);
        });

      } catch (err) {
        console.error('Error setting up poles listener:', err);
        setError('Failed to load equipment');
        setLoading(false);
      }
    };

    fetchPoles();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  const addPole = async (poleData: Omit<Pole, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const polesRef = collection(firebaseDb, 'users', user.uid, 'poles');
      const newPole = {
        ...poleData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await addDoc(polesRef, newPole);
      return { success: true, error: null };
    } catch (err: any) {
      console.error('Error adding pole:', err);
      return { success: false, error: err.message };
    }
  };

  const updatePole = async (poleId: string, poleData: Partial<Pole>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const poleRef = doc(firebaseDb, 'users', user.uid, 'poles', poleId);
      await updateDoc(poleRef, {
        ...poleData,
        updatedAt: new Date().toISOString()
      });
      return { success: true, error: null };
    } catch (err: any) {
      console.error('Error updating pole:', err);
      return { success: false, error: err.message };
    }
  };

  const deletePole = async (poleId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const poleRef = doc(firebaseDb, 'users', user.uid, 'poles', poleId);
      await deleteDoc(poleRef);
      return { success: true, error: null };
    } catch (err: any) {
      console.error('Error deleting pole:', err);
      return { success: false, error: err.message };
    }
  };

  const bulkImportPoles = async (polesData: Omit<Pole, 'id' | 'createdAt' | 'updatedAt'>[]) => {
    if (!user) {
      console.error('[BulkImport] User not authenticated');
      throw new Error('User not authenticated');
    }

    console.log('[BulkImport] Starting bulk import for user:', user.uid);
    console.log('[BulkImport] Importing', polesData.length, 'poles:', polesData);

    try {
      const batch = writeBatch(firebaseDb);
      const polesRef = collection(firebaseDb, 'users', user.uid, 'poles');

      console.log('[BulkImport] Creating batch operations...');

      polesData.forEach((poleData, index) => {
        const newPoleRef = doc(polesRef);
        const poleDoc = {
          ...poleData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        console.log(`[BulkImport] Adding pole ${index + 1}:`, poleDoc);
        batch.set(newPoleRef, poleDoc);
      });

      console.log('[BulkImport] Committing batch...');
      await batch.commit();

      console.log('[BulkImport] ✅ Batch commit successful!');
      return { success: true, error: null, count: polesData.length };
    } catch (err: any) {
      console.error('[BulkImport] ❌ Error during bulk import:', err);
      console.error('[BulkImport] Error details:', {
        code: err.code,
        message: err.message,
        stack: err.stack
      });

      let userFriendlyError = 'Failed to import poles';

      if (err.code === 'permission-denied') {
        userFriendlyError = 'Permission denied. Please check your login status.';
      } else if (err.code === 'unavailable') {
        userFriendlyError = 'Firebase service unavailable. Please try again.';
      } else if (err.message) {
        userFriendlyError = err.message;
      }

      return { success: false, error: userFriendlyError, count: 0 };
    }
  };

  return {
    poles,
    loading,
    error,
    addPole,
    updatePole,
    deletePole,
    bulkImportPoles
  };
};