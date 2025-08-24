import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Users, 
  Video, 
  BarChart3, 
  Settings, 
  Calendar,
  Star,
  TrendingUp,
  FileText,
  UserCheck,
  LogIn,
  UserPlus,
  Eye
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../utils/cn';
import { Logo } from '../ui/Logo';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  badge?: number;
  requiresAuth?: boolean;
}

const authenticatedMenuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    icon: Home,
    path: '/dashboard',
  },
  {
    label: 'Prospects',
    icon: Users,
    path: '/prospects',
    requiresAuth: true,
  },
  {
    label: 'Videos',
    icon: Video,
    path: '/videos',
    requiresAuth: true,
  },
  {
    label: 'Analytics',
    icon: BarChart3,
    path: '/analytics',
    requiresAuth: true,
  },
  {
    label: 'Tryouts',
    icon: Calendar,
    path: '/tryouts',
    requiresAuth: true,
  },
  {
    label: 'Top Rated',
    icon: Star,
    path: '/top-rated',
  },
  {
    label: 'Trending',
    icon: TrendingUp,
    path: '/trending',
  },
  {
    label: 'Reports',
    icon: FileText,
    path: '/reports',
    requiresAuth: true,
  },
  {
    label: 'Scouts',
    icon: UserCheck,
    path: '/scouts',
    requiresAuth: true,
  },
  {
    label: 'Settings',
    icon: Settings,
    path: '/settings',
    requiresAuth: true,
  },
];

const publicMenuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    icon: Home,
    path: '/dashboard',
  },
  {
    label: 'Browse Prospects',
    icon: Eye,
    path: '/prospects',
  },
  {
    label: 'Top Rated',
    icon: Star,
    path: '/top-rated',
  },
  {
    label: 'Trending',
    icon: TrendingUp,
    path: '/trending',
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleNavigation = (path: string, requiresAuth?: boolean) => {
    if (requiresAuth && !isAuthenticated) {
      // Redirect to login if authentication is required
      window.location.href = '/login';
      return;
    }
    navigate(path);
    onClose();
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Filter menu items based on authentication status
  const menuItems = isAuthenticated 
    ? authenticatedMenuItems 
    : publicMenuItems;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 bg-opacity-10 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={cn(
          'fixed left-0 top-0 h-full w-64 bg-white border-r border-neutral-200 shadow-lg z-50',
          'lg:shadow-2xl'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <div className="flex items-center space-x-3">
              <Logo size="10xl" showText={true} variant="header" className='h-10' />
            </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <motion.button
                  key={item.path}
                  onClick={() => handleNavigation(item.path, item.requiresAuth)}
                  className={cn(
                    'flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                    active
                      ? 'bg-primary-50 text-primary-700 border border-primary-200'
                      : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon
                    className={cn(
                      'w-5 h-5 mr-3',
                      active ? 'text-primary-600' : 'text-neutral-500'
                    )}
                  />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {item.badge}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-neutral-200">
            {isAuthenticated ? (
              /* Authenticated user footer */
              <div className="bg-neutral-50 rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">M</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 truncate">
                      Mercatto Pro
                    </p>
                    <p className="text-xs text-neutral-500">
                      Professional Plan
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* Non-authenticated user footer */
              <div className="space-y-3">
                <div className="bg-primary-50 rounded-lg p-3 border border-primary-200">
                  <div className="flex items-center space-x-3">
                    <UserPlus className="w-5 h-5 text-primary-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-primary-800">
                        Join as Scout
                      </p>
                      <p className="text-xs text-primary-700">
                        Access advanced features
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      window.location.href = '/login';
                      onClose();
                    }}
                    className="flex-1 px-3 py-2 text-sm font-medium text-primary-600 border border-primary-300 rounded-lg hover:bg-primary-50 transition-colors"
                  >
                    <LogIn className="w-4 h-4 mr-2 inline" />
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      window.location.href = '/login';
                      onClose();
                    }}
                    className="flex-1 px-3 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <UserPlus className="w-4 h-4 mr-2 inline" />
                    Join
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  );
};
