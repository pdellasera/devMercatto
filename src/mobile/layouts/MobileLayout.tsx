import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { cn } from '../utils/cn';
import MobileHeader from '../components/navigation/MobileHeader';
import MobileNavigation from '../components/navigation/MobileNavigation';

interface MobileLayoutProps {
  showHeader?: boolean;
  showNavigation?: boolean;
  className?: string;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  showHeader = true,
  showNavigation = true,
  className,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className={cn('min-h-screen bg-neutral-950 text-neutral-100', className)}>
      {/* Header */}
      {showHeader && (
        <MobileHeader
          onMenuToggle={setIsMenuOpen}
          onSearch={(query) => {
            console.log('Search query:', query);
            // Implementar lógica de búsqueda
          }}
        />
      )}

      {/* Contenido principal */}
      <main
        className={cn(
          'flex-1 overflow-auto',
          showHeader ? 'pt-14' : '', // Espacio para header
          showNavigation ? 'pb-20' : '', // Espacio para navegación inferior
          'mobile-gesture-area'
        )}
      >
        <Outlet />
      </main>

      {/* Navegación inferior */}
      {showNavigation && (
        <MobileNavigation
          onTabChange={(tabId) => {
            console.log('Tab changed to:', tabId);
            // Implementar lógica de cambio de tab
          }}
        />
      )}
    </div>
  );
};

export default MobileLayout;


