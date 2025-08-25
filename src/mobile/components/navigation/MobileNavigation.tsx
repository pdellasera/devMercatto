import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Search, Heart, User } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useMobileGestures } from '../../hooks';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  badge?: number;
}

const navigationItems: NavigationItem[] = [
  {
    id: 'home',
    label: 'Inicio',
    icon: Home,
    path: '/mobile',
  },
  {
    id: 'prospects',
    label: 'Prospectos',
    icon: Users,
    path: '/mobile/prospects',
    badge: 12,
  },
  {
    id: 'search',
    label: 'Buscar',
    icon: Search,
    path: '/mobile/search',
  },
  {
    id: 'favorites',
    label: 'Favoritos',
    icon: Heart,
    path: '/mobile/favorites',
    badge: 3,
  },
  {
    id: 'profile',
    label: 'Perfil',
    icon: User,
    path: '/mobile/profile',
  },
];

interface MobileNavigationProps {
  className?: string;
  onTabChange?: (tabId: string) => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  className,
  onTabChange,
}) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    const currentPath = location.pathname;
    const item = navigationItems.find(item => item.path === currentPath);
    return item?.id || 'home';
  });

  const handleTabClick = (item: NavigationItem) => {
    setActiveTab(item.id);
    onTabChange?.(item.id);
  };

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-md border-t border-white/10',
        'mobile-safe-area',
        className
      )}
    >
      <div className="flex items-center justify-around px-mobile-sm py-mobile-sm">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isCurrentPath = location.pathname === item.path;

          return (
            <Link
              key={item.id}
              to={item.path}
              onClick={() => handleTabClick(item)}
              className={cn(
                'flex flex-col items-center justify-center gap-mobile-xs p-mobile-sm rounded-mobile-lg transition-all duration-200 mobile-touch-feedback relative',
                'min-h-[44px] min-w-[44px]',
                isActive || isCurrentPath
                  ? 'text-primary-500 bg-primary-500/10'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              )}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    'w-5 h-5 transition-transform duration-200',
                    isActive || isCurrentPath ? 'scale-110' : 'scale-100'
                  )}
                />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-mobile-xs rounded-full flex items-center justify-center font-medium">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  'text-mobile-xs font-medium transition-colors duration-200 mobile-text-optimized',
                  isActive || isCurrentPath ? 'text-primary-500' : 'text-neutral-400'
                )}
              >
                {item.label}
              </span>
              
              {/* Indicador activo */}
              {(isActive || isCurrentPath) && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary-500 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNavigation;
