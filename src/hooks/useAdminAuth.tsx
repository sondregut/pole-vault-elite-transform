import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { useFirebaseAuth } from './useFirebaseAuth';

export const useAdminAuth = () => {
  const { user, loading: authLoading, signIn, signOut } = useFirebaseAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (authLoading) {
        return;
      }

      if (!user) {
        setIsAdmin(false);
        setAdminLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setIsAdmin(userData.isAdmin === true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('[Admin Auth] Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setAdminLoading(false);
      }
    };

    checkAdminStatus();
  }, [user, authLoading]);

  return {
    user,
    isAdmin,
    loading: authLoading || adminLoading,
    signIn,
    signOut
  };
};
