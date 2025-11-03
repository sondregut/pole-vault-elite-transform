import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  LayoutDashboard,
  Calendar,
  Wrench,
  BarChart3,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Shield,
  Video
} from 'lucide-react';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const VaultHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useFirebaseAuth();
  const { isAdmin } = useAdminAuth();

  const currentPath = location.pathname;

  const navItems = [
    { name: 'Dashboard', path: '/vault/dashboard', icon: LayoutDashboard },
    { name: 'Training', path: '/vault/sessions', icon: Calendar },
    { name: 'Videos', path: '/vault/videos', icon: Video },
    { name: 'Equipment', path: '/vault/equipment', icon: Wrench },
    { name: 'Analytics', path: '/vault/analytics', icon: BarChart3 },
  ];

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error('Failed to sign out');
    } else {
      toast.success('Signed out successfully');
      navigate('/vault/login');
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      {/* Main Header */}
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between py-4">
          {/* Left: Logo/Brand */}
          <div className="flex items-center gap-3">
            <div className="h-8 w-8">
              <img
                src="/lovable-uploads/d8bb7de8-16df-4057-b550-54a2932ea222.png"
                alt="Vault Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900 block">Vault</span>
              <p className="text-xs text-gray-600">Training Dashboard</p>
            </div>
          </div>

          {/* Center: Navigation (Desktop) */}
          <nav className="hidden md:flex items-center gap-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-2 px-5 py-3 text-sm font-medium
                    border-b-2 transition-colors
                    ${
                      isActive
                        ? 'border-[#3176FF] text-gray-900'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right: User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <User className="w-4 h-4" />
                <span className="hidden md:inline">{user?.email?.split('@')[0]}</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5 text-sm font-medium text-gray-900">
                {user?.email}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/vault/profile" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Profile & Settings
                </Link>
              </DropdownMenuItem>
              {isAdmin && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/vault/admin" className="cursor-pointer">
                      <Shield className="mr-2 h-4 w-4" />
                      Admin Panel
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200">
        <nav className="container mx-auto px-4 flex overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex flex-col items-center gap-1 px-4 py-4 text-xs font-medium
                  border-b-2 transition-colors whitespace-nowrap min-h-[44px]
                  ${
                    isActive
                      ? 'border-[#3176FF] text-[#3176FF]'
                      : 'border-transparent text-gray-600'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default VaultHeader;
