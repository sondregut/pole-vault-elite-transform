import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Wrench,
  BarChart3,
  Video,
  Settings,
  LogOut,
  Shield,
  X,
  Sparkles,
} from 'lucide-react';

// DEV FLAG: Set to true locally to show AI Chat, false before pushing
const SHOW_AI_CHAT = true;
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { toast } from 'sonner';

interface VaultSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isMobile?: boolean;
}

const VaultSidebar = ({ isOpen = true, onClose, isMobile = false }: VaultSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useFirebaseAuth();
  const { isAdmin } = useAdminAuth();

  const currentPath = location.pathname;

  const baseNavItems = [
    { name: 'Dashboard', path: '/vault/dashboard', icon: LayoutDashboard },
    { name: 'Training', path: '/vault/sessions', icon: Calendar },
    { name: 'Videos', path: '/vault/videos', icon: Video },
    { name: 'Equipment', path: '/vault/equipment', icon: Wrench },
    { name: 'Analytics', path: '/vault/analytics', icon: BarChart3 },
  ];

  // Conditionally add AI Chat based on dev flag
  const navItems = SHOW_AI_CHAT
    ? [...baseNavItems, { name: 'AI Chat', path: '/vault/chat', icon: Sparkles }]
    : baseNavItems;

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error('Failed to sign out');
    } else {
      toast.success('Signed out successfully');
      navigate('/vault/login');
    }
  };

  const handleNavClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  // Mobile drawer with overlay
  if (isMobile) {
    return (
      <>
        {/* Mobile Overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}

        {/* Mobile Drawer */}
        <aside
          className={`
            fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-200 z-50
            transform transition-transform duration-300 ease-in-out
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <SidebarContent
            navItems={navItems}
            currentPath={currentPath}
            user={user}
            isAdmin={isAdmin}
            handleNavClick={handleNavClick}
            handleSignOut={handleSignOut}
            showCloseButton
            onClose={onClose}
          />
        </aside>
      </>
    );
  }

  // Desktop sidebar - always visible
  return (
    <div className="hidden lg:flex lg:flex-col h-full bg-white border-r border-gray-200">
      <SidebarContent
        navItems={navItems}
        currentPath={currentPath}
        user={user}
        isAdmin={isAdmin}
        handleNavClick={handleNavClick}
        handleSignOut={handleSignOut}
      />
    </div>
  );
};

// Extracted sidebar content for reuse
interface SidebarContentProps {
  navItems: { name: string; path: string; icon: any }[];
  currentPath: string;
  user: any;
  isAdmin: boolean;
  handleNavClick: () => void;
  handleSignOut: () => void;
  showCloseButton?: boolean;
  onClose?: () => void;
}

const SidebarContent = ({
  navItems,
  currentPath,
  user,
  isAdmin,
  handleNavClick,
  handleSignOut,
  showCloseButton,
  onClose,
}: SidebarContentProps) => {
  return (
    <div className="flex flex-col h-full">
      {/* Logo/Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <Link to="/vault" className="flex items-center gap-3">
            <img
              src="/images/vault-logo.png"
              alt="VAULT Logo"
              className="h-10 w-10 object-contain"
            />
            <div>
              <h1 className="text-lg font-bold text-vault-primary">VAULT</h1>
              <p className="text-xs text-gray-600">Pole Vault Training</p>
            </div>
          </Link>
          {showCloseButton && onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path || currentPath.startsWith(item.path + '/');

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${
                  isActive
                    ? 'bg-vault-primary/10 text-vault-primary font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-vault-primary' : 'text-gray-500'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-200 space-y-1">
        <Link
          to="/vault/profile"
          onClick={handleNavClick}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Settings className="w-5 h-5 text-gray-500" />
          <span>Settings</span>
        </Link>

        {isAdmin && (
          <Link
            to="/vault/admin"
            onClick={handleNavClick}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Shield className="w-5 h-5 text-gray-500" />
            <span>Admin Panel</span>
          </Link>
        )}

        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <LogOut className="w-5 h-5 text-gray-500" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default VaultSidebar;
