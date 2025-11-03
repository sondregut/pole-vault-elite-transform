import { useEffect } from 'react';
import { useNavigate, useLocation, Outlet, Link } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Shield, BarChart3, Ticket, Users, TrendingUp, DollarSign, Flag, Bell, Activity, Video, Target, Trash2, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const VaultAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, loading, signOut } = useAdminAuth();

  console.log('[VaultAdmin] Auth state:', { user: !!user, isAdmin, loading, path: location.pathname });

  useEffect(() => {
    console.log('[VaultAdmin] useEffect:', { loading, user: !!user, isAdmin });
    if (!loading && !user) {
      console.log('[VaultAdmin] No user, redirecting to login');
      navigate('/vault/login', { state: { from: location } });
    } else if (!loading && user && !isAdmin) {
      console.log('[VaultAdmin] User is not admin, redirecting to dashboard');
      navigate('/vault/dashboard');
    }
  }, [user, isAdmin, loading, navigate, location]);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error('Failed to sign out');
    } else {
      toast.success('Signed out successfully');
      navigate('/vault/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00A6FF]"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const currentPath = location.pathname;

  const tabs = [
    { name: 'Overview', path: '/vault/admin', icon: BarChart3 },
    { name: 'User Insights', path: '/vault/admin/user-insights', icon: TrendingUp },
    { name: 'Revenue', path: '/vault/admin/revenue', icon: DollarSign },
    { name: 'Training Analytics', path: '/vault/admin/training-analytics', icon: Target },
    { name: 'Moderation', path: '/vault/admin/moderation', icon: Flag },
    { name: 'Notifications', path: '/vault/admin/notifications', icon: Bell },
    { name: 'System Health', path: '/vault/admin/system-health', icon: Activity },
    { name: 'Videos', path: '/vault/admin/videos', icon: Video },
    { name: 'Data Management', path: '/vault/admin/data-management', icon: Shield },
    { name: 'Data Cleanup', path: '/vault/admin/data-cleanup', icon: Trash2 },
    { name: 'Promo Codes', path: '/vault/admin/promo-codes', icon: Ticket },
    { name: 'Users', path: '/vault/admin/users', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-[#00A6FF]" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-sm text-gray-600">Vault App Management</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/vault/dashboard"
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Back to Dashboard
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <nav className="flex gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentPath === tab.path;

              return (
                <Link
                  key={tab.path}
                  to={tab.path}
                  className={`
                    flex items-center gap-2 px-4 py-3 text-sm font-medium
                    border-b-2 transition-colors
                    ${
                      isActive
                        ? 'border-[#00A6FF] text-gray-900'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <Outlet />
      </div>
    </div>
  );
};

export default VaultAdmin;
