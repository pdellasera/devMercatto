import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, X, Volume2 } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ErrorMessage {
  id: string;
  message: string;
  type: 'error' | 'warning' | 'info' | 'success';
  priority: 'polite' | 'assertive';
  timestamp: number;
  autoDismiss?: boolean;
  dismissTimeout?: number;
}

interface MobileErrorAnnouncerProps {
  className?: string;
  onErrorAnnounced?: (error: ErrorMessage) => void;
  onErrorDismissed?: (errorId: string) => void;
}

const MobileErrorAnnouncer: React.FC<MobileErrorAnnouncerProps> = ({
  className,
  onErrorAnnounced,
  onErrorDismissed,
}) => {
  const [errors, setErrors] = useState<ErrorMessage[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const liveRegionRef = useRef<HTMLDivElement | null>(null);
  const errorCounterRef = useRef(0);

  // Crear región live para anuncios
  useEffect(() => {
    if (!liveRegionRef.current) {
      const liveRegion = document.createElement('div');
      liveRegion.setAttribute('aria-live', 'assertive');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.style.position = 'absolute';
      liveRegion.style.left = '-10000px';
      liveRegion.style.width = '1px';
      liveRegion.style.height = '1px';
      liveRegion.style.overflow = 'hidden';
      liveRegionRef.current = liveRegion;
      document.body.appendChild(liveRegion);
    }

    return () => {
      if (liveRegionRef.current) {
        document.body.removeChild(liveRegionRef.current);
        liveRegionRef.current = null;
      }
    };
  }, []);

  // Función para anunciar error
  const announceError = (
    message: string,
    type: ErrorMessage['type'] = 'error',
    priority: 'polite' | 'assertive' = 'assertive',
    autoDismiss: boolean = true,
    dismissTimeout: number = 5000
  ) => {
    const errorId = `error-${++errorCounterRef.current}`;
    const newError: ErrorMessage = {
      id: errorId,
      message,
      type,
      priority,
      timestamp: Date.now(),
      autoDismiss,
      dismissTimeout,
    };

    setErrors(prev => [...prev, newError]);
    setIsVisible(true);
    onErrorAnnounced?.(newError);

    // Anunciar al screen reader
    if (liveRegionRef.current) {
      liveRegionRef.current.setAttribute('aria-live', priority);
      liveRegionRef.current.textContent = message;
      
      // Limpiar después de un tiempo
      setTimeout(() => {
        if (liveRegionRef.current) {
          liveRegionRef.current.textContent = '';
        }
      }, 1000);
    }

    // Auto-dismiss si está habilitado
    if (autoDismiss) {
      setTimeout(() => {
        dismissError(errorId);
      }, dismissTimeout);
    }
  };

  // Función para descartar error
  const dismissError = (errorId: string) => {
    setErrors(prev => prev.filter(error => error.id !== errorId));
    onErrorDismissed?.(errorId);
    
    // Ocultar si no hay más errores
    if (errors.length <= 1) {
      setIsVisible(false);
      setIsExpanded(false);
    }
  };

  // Función para limpiar todos los errores
  const clearAllErrors = () => {
    setErrors([]);
    setIsVisible(false);
    setIsExpanded(false);
  };

  // Función para obtener icono según tipo
  const getErrorIcon = (type: ErrorMessage['type']) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'info':
        return <Volume2 className="w-4 h-4 text-blue-400" />;
      case 'success':
        return <AlertTriangle className="w-4 h-4 text-green-400" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
    }
  };

  // Función para obtener color de fondo según tipo
  const getErrorBgColor = (type: ErrorMessage['type']) => {
    switch (type) {
      case 'error':
        return 'bg-red-500/20 border-red-500/30';
      case 'warning':
        return 'bg-yellow-500/20 border-yellow-500/30';
      case 'info':
        return 'bg-blue-500/20 border-blue-500/30';
      case 'success':
        return 'bg-green-500/20 border-green-500/30';
      default:
        return 'bg-red-500/20 border-red-500/30';
    }
  };

  // Función para obtener color de texto según tipo
  const getErrorTextColor = (type: ErrorMessage['type']) => {
    switch (type) {
      case 'error':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      case 'info':
        return 'text-blue-400';
      case 'success':
        return 'text-green-400';
      default:
        return 'text-red-400';
    }
  };

  // Función para formatear timestamp
  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) return 'Ahora';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    return `${Math.floor(diff / 3600000)}h`;
  };

  if (!isVisible || errors.length === 0) return null;

  return (
    <div className={cn(
      'fixed bottom-0 left-0 right-0 z-50 bg-neutral-900/95 backdrop-blur-sm border-t border-white/10',
      className
    )}>
      <div className="p-mobile-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-mobile-sm">
          <div className="flex items-center gap-mobile-sm">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <h2 className="text-mobile-base font-semibold text-white">
              Errores y alertas
            </h2>
            <span className="px-mobile-xs py-mobile-xs bg-red-500 text-white text-mobile-xs rounded-full">
              {errors.length}
            </span>
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
              onClick={clearAllErrors}
              className="p-mobile-xs rounded-mobile-sm bg-neutral-800 hover:bg-neutral-700 transition-colors"
              aria-label="Limpiar todos los errores"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Error List */}
        <div className={cn(
          'space-y-mobile-xs transition-all duration-300',
          isExpanded ? 'max-h-96 overflow-y-auto' : 'max-h-20 overflow-hidden'
        )}>
          {errors.map((error) => (
            <div
              key={error.id}
              className={cn(
                'flex items-start gap-mobile-sm p-mobile-sm rounded-mobile-sm border transition-colors',
                getErrorBgColor(error.type)
              )}
            >
              <div className="flex-shrink-0 mt-mobile-xs">
                {getErrorIcon(error.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className={cn(
                  'text-mobile-sm font-medium',
                  getErrorTextColor(error.type)
                )}>
                  {error.message}
                </div>
                {isExpanded && (
                  <div className="flex items-center gap-mobile-sm mt-mobile-xs">
                    <span className="text-mobile-xs text-neutral-400">
                      {formatTimestamp(error.timestamp)}
                    </span>
                    <span className="text-mobile-xs text-neutral-400">
                      Prioridad: {error.priority}
                    </span>
                    {error.autoDismiss && (
                      <span className="text-mobile-xs text-neutral-400">
                        Auto-dismiss: {error.dismissTimeout ? `${error.dismissTimeout / 1000}s` : 'Sí'}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <button
                onClick={() => dismissError(error.id)}
                className="flex-shrink-0 p-mobile-xs rounded-mobile-sm bg-neutral-800/50 hover:bg-neutral-700/50 transition-colors"
                aria-label="Descartar error"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Instructions */}
        {isExpanded && (
          <div className="mt-mobile-sm p-mobile-sm bg-neutral-800/50 rounded-mobile-sm">
            <div className="text-mobile-xs text-neutral-400">
              <strong>Información:</strong> Los errores se anuncian automáticamente a los lectores de pantalla. 
              Los errores se descartan automáticamente después de 5 segundos.
            </div>
          </div>
        )}
      </div>

      {/* Exponer función global para uso externo */}
      {(window as any).announceError = announceError}
    </div>
  );
};

export default MobileErrorAnnouncer;
