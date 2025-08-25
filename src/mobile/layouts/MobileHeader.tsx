import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  User, 
  Settings, 
  LogOut, 
  Bell,
  Search,
  Plus,
  LogIn,
  UserPlus,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Avatar } from '../../components/ui/Avatar';
import { SearchBar } from '../../components/ui/SearchBar';
import { Button } from '../../design-system';
import { Logo } from '../../components/ui/Logo';

export const MobileHeader: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [ageFilter, setAgeFilter] = useState('Mayor');
  const [levelFilter, setLevelFilter] = useState('Todos');

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const userMenuItems = [
    {
      icon: User,
      label: 'Profile',
      onClick: () => {
        setShowUserMenu(false);
        // Navigate to profile page
      },
    },
    {
      icon: Settings,
      label: 'Settings',
      onClick: () => {
        setShowUserMenu(false);
        // Navigate to settings page
      },
    },
    {
      icon: LogOut,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <header className="relative h-16 bg-white/95 backdrop-blur-xl shadow-lg overflow-hidden border-b border-white/10">
      {/* Diagonal split background */}
      <div className="absolute inset-0">
        <div className="absolute left-0 top-0 w-3/4 h-full bg-white/95 backdrop-blur-xl"></div>
        <div className="absolute right-0 top-0 w-3/4 h-full bg-[#141414]/95 backdrop-blur-xl transform skew-x-24 origin-top-left"></div>
      </div>

      <div className="relative z-10 max-w-10xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo (White background) */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Logo size="4xl" showText={true} variant="header" />
            </div>
          </div>

          {/* Center - Slogan (Black background) */}
          <div className="flex-1 flex justify-center">
            <div className="text-center">
              <p className="text-xs font-medium text-white leading-tight">
                Encuentra al próximo crack:
              </p>
              <p className="text-xs font-bold text-green-500 leading-tight">
                scouting deportivo más preciso y eficiente.
              </p>
            </div>
          </div>

          {/* Right side - User menu (Black background) */}
          <div className="flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-md text-white hover:text-green-400 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <Bell className="w-4 h-4" />
                </button>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 rounded-md text-white hover:text-green-400 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <Avatar
                      src={user?.avatar}
                      fallback={user?.name?.charAt(0) || 'U'}
                      size="sm"
                    />
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-xl rounded-lg shadow-lg border border-white/20 py-2 z-50"
                      >
                        {userMenuItems.map((item, index) => (
                          <button
                            key={index}
                            onClick={item.onClick}
                            className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                          >
                            <item.icon className="w-4 h-4" />
                            <span>{item.label}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-white hidden sm:block">
                  {user?.email || 'usuario@ejemplo.com'}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <LogIn className="w-3 h-3 mr-1" />
                  Ir a Panel
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
