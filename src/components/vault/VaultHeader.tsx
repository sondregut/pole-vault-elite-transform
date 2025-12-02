import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  Video,
  Menu,
  X
} from 'lucide-react';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { toast } from 'sonner';

const VaultHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useFirebaseAuth();
  const { isAdmin } = useAdminAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 font-roboto ${
        isScrolled ? 'bg-white shadow-vault' : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Links to Vault Landing Page */}
          <Link to="/vault" className="flex items-center gap-2">
            <img
              src="/images/vault-logo.png"
              alt="VAULT Logo"
              className="h-8 w-8 object-contain"
            />
            <span className="text-vault-primary font-bold text-xl tracking-tight">VAULT</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path || currentPath.startsWith(item.path + '/');

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all
                    ${
                      isActive
                        ? 'bg-vault-primary text-white'
                        : 'text-vault-text-secondary hover:text-vault-primary hover:bg-vault-primary-muted'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Right: User Menu */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/vault"
              className="text-sm text-vault-text-secondary font-medium hover:text-vault-primary transition-colors"
            >
              About Vault
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="gap-2 bg-vault-primary/10 text-vault-primary font-semibold rounded-lg border border-vault-primary/20 hover:bg-vault-primary hover:text-white transition-all"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden lg:inline">{user?.email?.split('@')[0]}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white border border-vault-border shadow-vault-lg rounded-xl">
                <div className="px-3 py-2 text-sm font-medium text-vault-text">
                  {user?.email}
                </div>
                <DropdownMenuSeparator className="bg-vault-border" />
                <DropdownMenuItem asChild>
                  <Link to="/vault/profile" className="cursor-pointer flex items-center text-vault-text-secondary hover:text-vault-primary hover:bg-vault-primary-muted">
                    <Settings className="mr-2 h-4 w-4" />
                    Profile & Settings
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator className="bg-vault-border" />
                    <DropdownMenuItem asChild>
                      <Link to="/vault/admin" className="cursor-pointer flex items-center text-vault-text-secondary hover:text-vault-primary hover:bg-vault-primary-muted">
                        <Shield className="mr-2 h-4 w-4" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator className="bg-vault-border" />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer text-vault-error hover:bg-red-50"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-vault-text-secondary hover:bg-vault-primary-muted transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-vault-border shadow-vault-lg">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path || currentPath.startsWith(item.path + '/');

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all
                    ${
                      isActive
                        ? 'bg-vault-primary text-white'
                        : 'text-vault-text-secondary hover:text-vault-primary hover:bg-vault-primary-muted'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}

            <div className="pt-3 mt-3 border-t border-vault-border space-y-2">
              <Link
                to="/vault/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-vault-text-secondary hover:text-vault-primary hover:bg-vault-primary-muted rounded-lg transition-all"
              >
                <Settings className="w-5 h-5" />
                Profile & Settings
              </Link>
              {isAdmin && (
                <Link
                  to="/vault/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-vault-text-secondary hover:text-vault-primary hover:bg-vault-primary-muted rounded-lg transition-all"
                >
                  <Shield className="w-5 h-5" />
                  Admin Panel
                </Link>
              )}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleSignOut();
                }}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-vault-error hover:bg-red-50 rounded-lg transition-all"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default VaultHeader;
