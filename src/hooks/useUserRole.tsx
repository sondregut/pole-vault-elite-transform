
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export const useUserRole = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const checkRole = async () => {
      console.log('useUserRole: Starting role check for user:', user?.id);
      
      if (!user) {
        console.log('useUserRole: No user found');
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        console.log('useUserRole: Calling has_role function for user:', user.id);
        
        const { data, error } = await supabase.rpc('has_role', {
          _user_id: user.id,
          _role: 'admin'
        });

        if (error) {
          console.error('useUserRole: Error checking role:', error);
          setIsAdmin(false);
        } else {
          console.log('useUserRole: Role check result:', data);
          setIsAdmin(data || false);
        }
      } catch (err) {
        console.error('useUserRole: Exception checking user role:', err);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkRole();
  }, [user]);

  return { isAdmin, loading };
};
