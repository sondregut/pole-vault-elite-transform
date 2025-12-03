import { useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useVaultSessions } from '@/hooks/useVaultData';
import VaultHeader from '@/components/vault/VaultHeader';

const VaultDashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useFirebaseAuth();
  const { isAdmin, loading: adminLoading } = useAdminAuth();
  const { subscription, loading: subscriptionLoading } = useSubscription();
  const { sessions, loading: sessionsLoading } = useVaultSessions(user);

  const loading = authLoading || adminLoading || subscriptionLoading || sessionsLoading;

  useEffect(() => {
    // 1. Not authenticated - redirect to login
    if (!authLoading && !user) {
      navigate('/vault/login', { state: { from: location } });
      return;
    }

    // 2. No active subscription - redirect to checkout
    if (!authLoading && user && !subscriptionLoading && subscription && !subscription.isActive) {
      // Don't redirect admins - they may not need a subscription
      if (!adminLoading && !isAdmin) {
        navigate('/vault/checkout');
        return;
      }
    }

    // 3. Admin-only account - redirect to admin panel
    if (!authLoading && !adminLoading && user && isAdmin) {
      // Check if this is an admin-only account (no regular user data)
      // If they have no sessions, they're likely an admin-only account
      if (!sessionsLoading && sessions.length === 0) {
        // Redirect admin-only users directly to admin panel
        navigate('/vault/admin');
      }
    }
  }, [user, authLoading, adminLoading, isAdmin, subscriptionLoading, subscription, sessionsLoading, sessions, navigate, location]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-vault-bg-warm-start to-white flex items-center justify-center font-roboto">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vault-primary mx-auto mb-4"></div>
          <p className="text-vault-text-secondary">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  // If no active subscription and not admin, don't render (will redirect)
  if (!subscription?.isActive && !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f0eb] via-[#f8f5f1] to-[#faf8f5] font-roboto">
      <VaultHeader />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default VaultDashboardLayout;
