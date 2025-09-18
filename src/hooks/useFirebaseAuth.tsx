import { useState, useEffect } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { firebaseAuth } from '@/utils/firebase';

export const useFirebaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      console.log('[Firebase Auth] State changed:', user?.email || 'No user');
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(firebaseAuth, email, password);
      console.log('[Firebase Auth] Sign in successful:', result.user.email);
      return { user: result.user, error: null };
    } catch (error: any) {
      console.error('[Firebase Auth] Sign in error:', error);
      return { user: null, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(firebaseAuth);
      console.log('[Firebase Auth] Sign out successful');
      return { error: null };
    } catch (error: any) {
      console.error('[Firebase Auth] Sign out error:', error);
      return { error: error.message };
    }
  };

  return {
    user,
    loading,
    signIn,
    signOut
  };
};