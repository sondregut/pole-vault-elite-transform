
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface SubscriptionStatus {
  subscribed: boolean;
  subscription_tier: string;
  subscription_end: string | null;
  loading: boolean;
  error: string | null;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionStatus>({
    subscribed: false,
    subscription_tier: 'free',
    subscription_end: null,
    loading: true,
    error: null
  });

  const checkSubscription = async () => {
    if (!user) {
      setSubscription({
        subscribed: false,
        subscription_tier: 'free',
        subscription_end: null,
        loading: false,
        error: null
      });
      return;
    }

    try {
      setSubscription(prev => ({ ...prev, loading: true, error: null }));
      
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) throw error;
      
      setSubscription({
        subscribed: data.subscribed || false,
        subscription_tier: data.subscription_tier || 'free',
        subscription_end: data.subscription_end,
        loading: false,
        error: null
      });
    } catch (error: any) {
      console.error('Error checking subscription:', error);
      setSubscription(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to check subscription'
      }));
    }
  };

  const createCheckout = async () => {
    if (!user) {
      toast.error('Please sign in to subscribe');
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout');
      
      if (error) throw error;
      
      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      console.error('Error creating checkout:', error);
      toast.error('Failed to create checkout session');
    }
  };

  const manageSubscription = async () => {
    if (!user) {
      toast.error('Please sign in to manage subscription');
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;
      
      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      console.error('Error opening customer portal:', error);
      toast.error('Failed to open subscription management');
    }
  };

  useEffect(() => {
    checkSubscription();
  }, [user]);

  return {
    ...subscription,
    checkSubscription,
    createCheckout,
    manageSubscription
  };
};
