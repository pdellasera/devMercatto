import React, { useState, useEffect } from 'react';
import { SkipForward, Home, Users, Search, Settings, X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SkipLink {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

interface MobileSkipLinksProps {
  className?: string;
  onSkip?: (linkId: string) => void;
}

const MobileSkipLinks: React.FC<MobileSkipLinksProps> = ({
  className,
  onSkip,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const skipLinks: SkipLink[] = [
    {
      id: 'main-content',
      label: 'Contenido principal',
      href: '#main-content',
      icon: Home,
      description: 'Saltar al contenido principal de la página',
    },
    {
      id: 'prospects-list',
      label: 'Lista de prospectos',
      href: '#prospects-list',
      icon: Users,
      description: 'Ir directamente a la lista de prospectos',
    },
    {
      id: 'search',
      label: 'Búsqueda',
      href: '#search',
      icon: Search,
      description: 'Ir al campo de búsqueda',
    },
    {
      id: 'accessibility-settings',
      label: 'Accesibilidad',
      href: '#accessibility-settings',
      icon: Settings,
      description: 'Abrir configuración de accesibilidad',
    },
  ];

  // Mostrar skip links cuando se presiona Tab
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab' && !isVisible) {
        setIsVisible(true);
        // Ocultar después de 5 segundos
        setTimeout(() => setIsVisible(false), 5000);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);

  const handleSkip = (link: SkipLink) => {
    const targetElement = document.getElementById(link.id);
    if (targetElement) {
      targetElement.focus();
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Anunciar al screen reader
      const liveRegion = document.querySelector('[aria-live]') as HTMLElement;
      if (liveRegion) {
        liveRegion.textContent = `Saltado a ${link.label}`;
      }
    }
    
    onSkip?.(link.id);
    setIsVisible(false);
    setIsExpanded(false);
  };

  const handleClose = () => {
    setIsVisible(false);
    setIsExpanded(false);
  };

  if (!isVisible) return null;

  return (
    <div className={cn(
      'fixed top-0 left-0 right-0 z-50 bg-neutral-900/95 backdrop-blur-sm border-b border-white/10',
      className
    )}>
      <div className="p-mobile-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-mobile-sm">
          <div className="flex items-center gap-mobile-sm">
            <SkipForward className="w-5 h-5 text-primary-500" />
            <h2 className="text-mobile-base font-semibold text-white">
              Navegación rápida
            </h2>
          </div>
          <div className="flex items-center gap-mobile-xs">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-mobile-xs rounded-mobile-sm bg-neutral-800 hover:bg-neutral-700 transition-colors text-mobile-xs"
              aria-label={isExpanded ? 'Contraer' : 'Expandir'} 
              aria-expanded={isExpanded}
            >
              {isExpanded ? '▼' : '▶'}
            </button>
            <button
              onClick={handleClose}
              className="p-mobile-xs rounded-mobile-sm bg-neutral-800 hover:bg-neutral-700 transition-colors"
              aria-label="Cerrar navegación rápida"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Skip Links */}
        <div className={cn(
          'grid gap-mobile-xs transition-all duration-300',
          isExpanded ? 'grid-cols-1' : 'grid-cols-2'
        )}>
          {skipLinks.map((link) => {
            const Icon = link.icon;
            return (
              <button
                key={link.id}
                onClick={() => handleSkip(link)}
                className={cn(
                  'flex items-center gap-mobile-sm p-mobile-sm rounded-mobile-sm text-left transition-colors',
                  'bg-neutral-800 hover:bg-neutral-700 text-white',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-neutral-900'
                )}
                aria-label={link.description}
              >
                <Icon className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-mobile-sm font-medium truncate">
                    {link.label}
                  </div>
                  {isExpanded && (
                    <div className="text-mobile-xs text-neutral-400 mt-mobile-xs">
                      {link.description}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Instructions */}
        {isExpanded && (
          <div className="mt-mobile-sm p-mobile-sm bg-neutral-800/50 rounded-mobile-sm">
            <div className="text-mobile-xs text-neutral-400">
              <strong>Instrucciones:</strong> Usa Tab para navegar entre elementos. 
              Presiona Enter o Espacio para activar. Usa Escape para cerrar modales.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileSkipLinks;
