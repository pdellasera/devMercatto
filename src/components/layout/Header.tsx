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
import { Avatar } from '../ui/Avatar';
import { SearchBar } from '../ui/SearchBar';
import { Button } from '../../design-system';
import { Logo } from '../ui/Logo';

interface HeaderProps {
  onMenuToggle?: () => void;
  onSearch?: (query: string) => void;
  onAddProspect?: () => void;
  showSearch?: boolean;
  showAddButton?: boolean;
  sidebarOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onMenuToggle,
  onSearch,
  onAddProspect,
  showSearch = true,
  showAddButton = true,
  sidebarOpen = false,
}) => {
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
    <header className="relative h-20 bg-white/95 backdrop-blur-xl shadow-lg overflow-hidden border-b border-white/10">
      {/* Diagonal split background */}
      <div className="absolute inset-0">
        <div className="absolute left-0 top-0 w-3/4 h-full bg-white/95 backdrop-blur-xl"></div>
        <div className="absolute right-0 top-0 w-3/4 h-full bg-[#141414]/95 backdrop-blur-xl transform skew-x-24 origin-top-left"></div>
      </div>

      <div className="relative z-10 max-w-10xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left side - Logo (White background) */}
          <div className="flex items-center space-x-4">
            {onMenuToggle && (
              <button
                onClick={onMenuToggle}
                className="p-2 rounded-md text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <div className="flex items-center space-x-3">
              <Logo size="5xl" showText={true} variant="header" />
            </div>
          </div>

          {/* Center - Slogan (Black background) */}
          <div className="hidden lg:flex items-center justify-center flex-1">
            <div className="text-center">
              <p className="text-sm font-semibold tracking-wide">
                <span className="text-white">Encuentra al próximo </span>
                <span className="text-green-400 font-bold">crack</span>
                <span className="text-white">: scouting deportivo más </span>
                <span className="text-green-400 font-bold">preciso</span>
                <span className="text-white"> y </span>
                <span className="text-green-400 font-bold">eficiente</span>
                <span className="text-white">.</span>
              </p>
            </div>
          </div>

          {/* Right side - Controls (Black background) */}
          <div className="flex items-center justify-end space-x-6 text-white">
         
            {/* Go to Panel Button and Email - Only show when authenticated */}
            {isAuthenticated && (
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 rounded-lg px-4 py-2 transition-colors">
                  <Bell className="w-4 h-4 text-white" />
                  <span className="text-sm font-medium">Ir a Panel</span>
                </button>
                
                {/* Divider */}
                <div className="w-px h-6 bg-gray-600"></div>
                
                {/* Email */}
                <span className="text-sm text-gray-300">
                  {user?.email || 'placement@prospect1.app'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
