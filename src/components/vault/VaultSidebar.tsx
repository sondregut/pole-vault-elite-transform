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
  PanelLeftClose,
  PanelLeft,
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
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const VaultSidebar = ({ isOpen = true, onClose, isMobile = false, collapsed = false, onToggleCollapse }: VaultSidebarProps) => {
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
        collapsed={collapsed}
        onToggleCollapse={onToggleCollapse}
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
  collapsed?: boolean;
  onToggleCollapse?: () => void;
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
  collapsed = false,
  onToggleCollapse,
}: SidebarContentProps) => {
  return (
    <div className="flex flex-col h-full">
      {/* Logo/Header */}
      <div className={`border-b border-gray-200 ${collapsed ? 'p-3' : 'p-6'}`}>
        <div className="flex items-center justify-between">
          <Link to="/vault" className={`flex items-center ${collapsed ? '' : 'gap-3'}`}>
            <img
              src="/images/vault-logo.png"
              alt="VAULT Logo"
              className={`object-contain ${collapsed ? 'h-8 w-8' : 'h-10 w-10'}`}
            />
            {!collapsed && (
              <div>
                <h1 className="text-lg font-bold text-vault-primary">VAULT</h1>
                <p className="text-xs text-gray-600">Pole Vault Training</p>
              </div>
            )}
          </Link>
          {/* Collapse toggle - Desktop only */}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              {collapsed ? (
                <PanelLeft className="w-5 h-5" />
              ) : (
                <PanelLeftClose className="w-5 h-5" />
              )}
            </button>
          )}
          {/* Close button - Mobile only */}
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
      <nav className={`flex-1 space-y-1 ${collapsed ? 'p-2' : 'p-4'}`}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path || currentPath.startsWith(item.path + '/');

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              title={collapsed ? item.name : undefined}
              className={`
                flex items-center rounded-lg transition-colors
                ${collapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'}
                ${
                  isActive
                    ? 'bg-vault-primary/10 text-vault-primary font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-vault-primary' : 'text-gray-500'}`} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className={`border-t border-gray-200 space-y-1 ${collapsed ? 'p-2' : 'p-4'}`}>
        <Link
          to="/vault/profile"
          onClick={handleNavClick}
          title={collapsed ? 'Settings' : undefined}
          className={`
            flex items-center rounded-lg text-gray-700 hover:bg-gray-50 transition-colors
            ${collapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'}
          `}
        >
          <Settings className="w-5 h-5 text-gray-500" />
          {!collapsed && <span>Settings</span>}
        </Link>

        {isAdmin && (
          <Link
            to="/vault/admin"
            onClick={handleNavClick}
            title={collapsed ? 'Admin Panel' : undefined}
            className={`
              flex items-center rounded-lg text-gray-700 hover:bg-gray-50 transition-colors
              ${collapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'}
            `}
          >
            <Shield className="w-5 h-5 text-gray-500" />
            {!collapsed && <span>Admin Panel</span>}
          </Link>
        )}

        <button
          onClick={handleSignOut}
          title={collapsed ? 'Sign Out' : undefined}
          className={`
            w-full flex items-center rounded-lg text-gray-700 hover:bg-gray-50 transition-colors
            ${collapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'}
          `}
        >
          <LogOut className="w-5 h-5 text-gray-500" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );
};

export default VaultSidebar;
