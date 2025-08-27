import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Home, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  User,
  Bell,
  Search,
  Filter,
  Calendar,
  FileText,
  Star,
  TrendingUp,
  Video
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../design-system/theme/ThemeProvider';
import { cn } from '../../utils/cn';
import { Avatar } from '../../components/ui/Avatar';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { resolvedTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navigationItems = [
    {
      icon: Home,
      label: 'Dashboard',
      href: '/mobile/dashboard',
      active: true,
    },
    {
      icon: Users,
      label: 'Prospectos',
      href: '/mobile/prospects',
      active: false,
    },
    {
      icon: BarChart3,
      label: 'Análisis',
      href: '/mobile/analytics',
      active: false,
    },
    {
      icon: Video,
      label: 'Videos',
      href: '/mobile/videos',
      active: false,
    },
    {
      icon: Calendar,
      label: 'Calendario',
      href: '/mobile/calendar',
      active: false,
    },
    {
      icon: FileText,
      label: 'Reportes',
      href: '/mobile/reports',
      active: false,
    },
    {
      icon: Star,
      label: 'Favoritos',
      href: '/mobile/favorites',
      active: false,
    },
    {
      icon: TrendingUp,
      label: 'Tendencias',
      href: '/mobile/trends',
      active: false,
    },
  ];

  const secondaryItems = [
    {
      icon: Settings,
      label: 'Configuración',
      href: '/mobile/settings',
    },
    {
      icon: Bell,
      label: 'Notificaciones',
      href: '/mobile/notifications',
    },
    {
      icon: Search,
      label: 'Búsqueda Avanzada',
      href: '/mobile/search',
    },
    {
      icon: Filter,
      label: 'Filtros',
      href: '/mobile/filters',
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 200 
            }}
            className={cn(
              "fixed left-0 top-0 h-full w-80 max-w-[85vw] z-50",
              "bg-white/95 backdrop-blur-xl shadow-2xl",
              resolvedTheme === 'light' 
                ? "bg-white/95 border-r border-gray-200" 
                : "bg-gray-900/95 border-r border-gray-700"
            )}
          >
            {/* Header */}
            <div className={cn(
              "flex items-center justify-between p-4 border-b",
              resolvedTheme === 'light' ? "border-gray-200" : "border-gray-700"
            )}>
              <div className="flex items-center space-x-3">
                <Avatar
                  src={user?.avatar}
                  fallback={user?.name?.charAt(0) || 'U'}
                  size="md"
                />
                <div>
                  <p className={cn(
                    "font-semibold text-sm",
                    resolvedTheme === 'light' ? "text-gray-900" : "text-white"
                  )}>
                    {user?.name || 'Usuario'}
                  </p>
                  <p className={cn(
                    "text-xs",
                    resolvedTheme === 'light' ? "text-gray-500" : "text-gray-400"
                  )}>
                    {user?.email || 'usuario@ejemplo.com'}
                  </p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  resolvedTheme === 'light'
                    ? "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                )}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-4">
              {/* Main Navigation */}
              <div className="px-4 mb-6">
                <h3 className={cn(
                  "text-xs font-semibold uppercase tracking-wider mb-3",
                  resolvedTheme === 'light' ? "text-gray-500" : "text-gray-400"
                )}>
                  Navegación
                </h3>
                <nav className="space-y-1">
                  {navigationItems.map((item) => (
                    <motion.a
                      key={item.label}
                      href={item.href}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                        item.active
                          ? resolvedTheme === 'light'
                            ? "bg-blue-50 text-blue-700 border-r-2 border-blue-500"
                            : "bg-blue-900/20 text-blue-300 border-r-2 border-blue-400"
                          : resolvedTheme === 'light'
                            ? "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                            : "text-gray-300 hover:text-white hover:bg-gray-800"
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </motion.a>
                  ))}
                </nav>
              </div>

              {/* Secondary Navigation */}
              <div className="px-4 mb-6">
                <h3 className={cn(
                  "text-xs font-semibold uppercase tracking-wider mb-3",
                  resolvedTheme === 'light' ? "text-gray-500" : "text-gray-400"
                )}>
                  Herramientas
                </h3>
                <nav className="space-y-1">
                  {secondaryItems.map((item) => (
                    <motion.a
                      key={item.label}
                      href={item.href}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                        resolvedTheme === 'light'
                          ? "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                          : "text-gray-400 hover:text-white hover:bg-gray-800"
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </motion.a>
                  ))}
                </nav>
              </div>
            </div>

            {/* Footer */}
            <div className={cn(
              "p-4 border-t",
              resolvedTheme === 'light' ? "border-gray-200" : "border-gray-700"
            )}>
              <button
                onClick={handleLogout}
                className={cn(
                  "flex items-center space-x-3 w-full px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                  resolvedTheme === 'light'
                    ? "text-red-600 hover:text-red-700 hover:bg-red-50"
                    : "text-red-400 hover:text-red-300 hover:bg-red-900/20"
                )}
              >
                <LogOut className="w-5 h-5" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
