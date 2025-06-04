
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, cleanupAuthState } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('Starting sign in process...');
    
    try {
      // Clean up any existing state first
      cleanupAuthState();
      
      // Attempt to sign out any existing session
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.log('Global signout failed (expected):', err);
      }
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
        toast.error(error.message);
      } else {
        console.log('Sign in successful');
        toast.success('Successfully signed in!');
      }
      
      return { error };
    } catch (err) {
      console.error('Unexpected sign in error:', err);
      toast.error('An unexpected error occurred');
      return { error: err };
    }
  };

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Check your email to confirm your account!');
    }
    
    return { error };
  };

  const signOut = async () => {
    console.log('Starting sign out process...');
    
    try {
      // Check if we have a valid session before attempting server-side logout
      const currentSession = session || (await supabase.auth.getSession()).data.session;
      
      if (currentSession) {
        console.log('Valid session found, attempting server-side logout...');
        
        // Try to sign out on the server
        const { error } = await supabase.auth.signOut({ scope: 'global' });
        
        if (error) {
          console.warn('Server-side logout failed:', error.message);
          // Don't show error to user, just continue with cleanup
        } else {
          console.log('Server-side logout successful');
        }
      } else {
        console.log('No valid session found, skipping server-side logout');
      }
      
      // Always clean up local state regardless of server response
      console.log('Cleaning up local auth state...');
      cleanupAuthState();
      
      // Clear React state
      setSession(null);
      setUser(null);
      
      console.log('Sign out completed successfully');
      toast.success('Successfully signed out!');
      
      // Force page refresh to ensure clean state
      setTimeout(() => {
        window.location.href = '/auth';
      }, 100);
      
    } catch (error: any) {
      console.error('Sign out error:', error);
      
      // Even if there's an error, clean up local state
      console.log('Performing emergency cleanup...');
      cleanupAuthState();
      setSession(null);
      setUser(null);
      
      // Show success message since we cleaned up locally
      toast.success('Signed out locally');
      
      // Force page refresh
      setTimeout(() => {
        window.location.href = '/auth';
      }, 100);
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
