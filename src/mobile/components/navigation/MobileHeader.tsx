import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Search, X, Bell, User, Settings } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useMobileBreakpoint } from '../../hooks';
import MobileButton from '../ui/MobileButton';

interface MobileHeaderProps {
  title?: string;
  showSearch?: boolean;
  showMenu?: boolean;
  showNotifications?: boolean;
  showProfile?: boolean;
  onSearch?: (query: string) => void;
  onMenuToggle?: (isOpen: boolean) => void;
  className?: string;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  title = 'Mercatto',
  showSearch = true,
  showMenu = true,
  showNotifications = true,
  showProfile = true,
  onSearch,
  onMenuToggle,
  className,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isMobile } = useMobileBreakpoint();
  const location = useLocation();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar menú al cambiar de ruta
  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Focus en input de búsqueda cuando se abre
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleMenuToggle = () => {
    const newState = !isMenuOpen;
    setIsMenuOpen(newState);
    onMenuToggle?.(newState);
  };

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      setSearchQuery('');
      onSearch?.('');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
    setIsSearchOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <>
      {/* Header principal */}
      <header
        className={cn(
          'sticky top-0 z-50 bg-neutral-950/95 backdrop-blur-md border-b border-white/10',
          'mobile-safe-area',
          className
        )}
      >
        <div className="flex items-center justify-between h-14 px-mobile-lg">
          {/* Logo y título */}
          <div className="flex items-center gap-mobile-md">
            {showMenu && (
              <button
                onClick={handleMenuToggle}
                className="p-mobile-sm rounded-mobile-md hover:bg-white/10 transition-colors mobile-touch-feedback"
                aria-label="Abrir menú"
              >
                <Menu className="w-5 h-5 text-white" />
              </button>
            )}
            
            <Link to="/mobile" className="flex items-center gap-mobile-sm">
              <div className="w-8 h-8 bg-primary-600 rounded-mobile-md flex items-center justify-center">
                <span className="text-white font-bold text-mobile-sm">M</span>
              </div>
              <span className="text-white font-semibold text-mobile-base mobile-text-optimized">
                {title}
              </span>
            </Link>
          </div>

          {/* Acciones del lado derecho */}
          <div className="flex items-center gap-mobile-sm">
            {showSearch && (
              <button
                onClick={handleSearchToggle}
                className="p-mobile-sm rounded-mobile-md hover:bg-white/10 transition-colors mobile-touch-feedback"
                aria-label="Buscar"
              >
                <Search className="w-5 h-5 text-white" />
              </button>
            )}

            {showNotifications && (
              <button className="p-mobile-sm rounded-mobile-md hover:bg-white/10 transition-colors mobile-touch-feedback relative">
                <Bell className="w-5 h-5 text-white" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            )}

            {showProfile && (
              <Link
                to="/mobile/profile"
                className="p-mobile-sm rounded-mobile-md hover:bg-white/10 transition-colors mobile-touch-feedback"
              >
                <User className="w-5 h-5 text-white" />
              </Link>
            )}
          </div>
        </div>

        {/* Barra de búsqueda expandible */}
        {showSearch && isSearchOpen && (
          <div className="px-mobile-lg pb-mobile-md animate-mobile-slide-up">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Buscar prospectos..."
                className="w-full h-10 px-mobile-lg pr-12 bg-neutral-900 border border-white/20 rounded-mobile-lg text-white placeholder-neutral-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 mobile-text-optimized"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-mobile-sm text-neutral-400 hover:text-white transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Menú lateral */}
      {isMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40 animate-mobile-fade-in"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Menú */}
          <div
            ref={menuRef}
            className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-neutral-950 border-r border-white/10 z-50 animate-mobile-slide-up"
          >
            {/* Header del menú */}
            <div className="flex items-center justify-between p-mobile-lg border-b border-white/10">
              <h2 className="text-white font-semibold text-mobile-lg">Menú</h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-mobile-sm rounded-mobile-md hover:bg-white/10 transition-colors mobile-touch-feedback"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Navegación del menú */}
            <nav className="flex-1 p-mobile-lg">
              <div className="space-y-mobile-sm">
                <Link
                  to="/mobile"
                  className="flex items-center gap-mobile-md p-mobile-md rounded-mobile-lg hover:bg-white/10 transition-colors mobile-touch-feedback"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="w-6 h-6 bg-primary-600 rounded-mobile-sm flex items-center justify-center">
                    <span className="text-white text-mobile-xs font-bold">M</span>
                  </div>
                  <span className="text-white mobile-text-optimized">Dashboard</span>
                </Link>

                <Link
                  to="/mobile/prospects"
                  className="flex items-center gap-mobile-md p-mobile-md rounded-mobile-lg hover:bg-white/10 transition-colors mobile-touch-feedback"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="w-6 h-6 bg-blue-600 rounded-mobile-sm flex items-center justify-center">
                    <span className="text-white text-mobile-xs">👥</span>
                  </div>
                  <span className="text-white mobile-text-optimized">Prospectos</span>
                </Link>

                <Link
                  to="/mobile/filters"
                  className="flex items-center gap-mobile-md p-mobile-md rounded-mobile-lg hover:bg-white/10 transition-colors mobile-touch-feedback"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="w-6 h-6 bg-green-600 rounded-mobile-sm flex items-center justify-center">
                    <span className="text-white text-mobile-xs">🔍</span>
                  </div>
                  <span className="text-white mobile-text-optimized">Filtros</span>
                </Link>

                <Link
                  to="/mobile/favorites"
                  className="flex items-center gap-mobile-md p-mobile-md rounded-mobile-lg hover:bg-white/10 transition-colors mobile-touch-feedback"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="w-6 h-6 bg-red-600 rounded-mobile-sm flex items-center justify-center">
                    <span className="text-white text-mobile-xs">❤️</span>
                  </div>
                  <span className="text-white mobile-text-optimized">Favoritos</span>
                </Link>
              </div>

              {/* Separador */}
              <div className="my-mobile-xl border-t border-white/10" />

              {/* Configuración */}
              <div className="space-y-mobile-sm">
                <Link
                  to="/mobile/settings"
                  className="flex items-center gap-mobile-md p-mobile-md rounded-mobile-lg hover:bg-white/10 transition-colors mobile-touch-feedback"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Settings className="w-5 h-5 text-neutral-400" />
                  <span className="text-neutral-300 mobile-text-optimized">Configuración</span>
                </Link>

                <Link
                  to="/mobile/profile"
                  className="flex items-center gap-mobile-md p-mobile-md rounded-mobile-lg hover:bg-white/10 transition-colors mobile-touch-feedback"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-5 h-5 text-neutral-400" />
                  <span className="text-neutral-300 mobile-text-optimized">Perfil</span>
                </Link>
              </div>
            </nav>

            {/* Footer del menú */}
            <div className="p-mobile-lg border-t border-white/10">
              <div className="text-center">
                <p className="text-neutral-400 text-mobile-xs">
                  Mercatto Mobile v1.0
                </p>
                <p className="text-neutral-500 text-mobile-xs mt-mobile-xs">
                  Scouting deportivo
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MobileHeader;
