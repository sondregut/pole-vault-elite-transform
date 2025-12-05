import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Outlet, Link } from 'react-router-dom';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useVaultSessions } from '@/hooks/useVaultData';
import VaultSidebar from '@/components/vault/VaultSidebar';
import { FloatingChatWidget } from '@/components/vault/chat';
import { Menu } from 'lucide-react';

const VaultDashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useFirebaseAuth();
  const { isAdmin, loading: adminLoading } = useAdminAuth();
  const { subscription, loading: subscriptionLoading } = useSubscription();
  const { sessions, loading: sessionsLoading } = useVaultSessions(user);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      <div className="min-h-screen bg-gradient-to-b from-[#f5f0eb] via-[#f8f5f1] to-[#faf8f5] flex items-center justify-center font-roboto">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vault-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
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
    <div className="flex h-screen overflow-hidden font-roboto">
      {/* Desktop Sidebar - Fixed width */}
      <div className="w-64 flex-shrink-0 hidden lg:block">
        <VaultSidebar />
      </div>

      {/* Mobile Sidebar Drawer */}
      <VaultSidebar
        isMobile
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content - Scrollable */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link to="/vault" className="flex items-center gap-2">
              <img
                src="/images/vault-logo.png"
                alt="VAULT Logo"
                className="h-8 w-8 object-contain"
              />
              <span className="text-vault-primary font-bold text-xl tracking-tight">VAULT</span>
            </Link>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-[#f5f0eb] via-[#f8f5f1] to-[#faf8f5]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Floating AI Chat Widget */}
      <FloatingChatWidget />
    </div>
  );
};

export default VaultDashboardLayout;
