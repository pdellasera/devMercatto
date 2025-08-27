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
  ChevronDown,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../design-system/theme/ThemeProvider';
import { cn } from '../../utils/cn';
import { Avatar } from '../../components/ui/Avatar';
import { SearchBar } from '../../components/ui/SearchBar';
import { Button } from '../../design-system';
import iconImage from '../../assets/icon.png';

interface MobileHeaderProps {
  onMenuToggle?: () => void;
  sidebarOpen?: boolean;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  onMenuToggle,
  sidebarOpen = false,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();
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
      {/* Diagonal split background - MANTENER DISEÑO ORIGINAL */}
      <div className="absolute inset-0">
        <div className="absolute left-0 top-0 w-3/4 h-full bg-white/95 backdrop-blur-xl"></div>
        <div className="absolute right-0 top-0 w-3/4 h-full bg-[#141414]/95 backdrop-blur-xl transform skew-x-24 origin-top-left"></div>
      </div>

      <div className="relative z-10 max-w-10xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Menu Button + Logo (White background) */}
          <div className="flex items-center space-x-3">
            {/* Menu Toggle Button */}
            <button
              onClick={onMenuToggle}
              className="p-2 rounded-md text-blue-900 hover:text-blue-700 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              title={sidebarOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-label={sidebarOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

            {/* Logo con icon.png */}
            <div className="flex items-center space-x-2">
              <img
                src={iconImage}
                alt="Mercatto"
                className="h-8 w-8 object-contain"
              />
              <span className="font-bold text-lg text-blue-900">MERCATTO</span>
            </div>
          </div>

          {/* Center - ELIMINADO SLOGAN */}

          {/* Right side - Solo botón de tema (Black background) */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-white hover:text-green-400 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
              title={resolvedTheme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
