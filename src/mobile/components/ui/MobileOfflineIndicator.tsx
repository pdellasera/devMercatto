import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { cn } from '../../utils/cn';

interface MobileOfflineIndicatorProps {
  isOnline: boolean;
  isOffline: boolean;
  isSyncing: boolean;
  syncQueue: any[];
  lastSync: Date | null;
  syncError: string | null;
  connectionType: 'wifi' | 'cellular' | 'none' | 'unknown';
  connectionQuality: 'excellent' | 'good' | 'poor' | 'none';
  onManualSync?: () => void;
  className?: string;
  showDetails?: boolean;
}

const MobileOfflineIndicator: React.FC<MobileOfflineIndicatorProps> = ({
  isOnline,
  isOffline,
  isSyncing,
  syncQueue,
  lastSync,
  syncError,
  connectionType,
  connectionQuality,
  onManualSync,
  className,
  showDetails = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  // Mostrar notificación cuando cambia el estado
  useEffect(() => {
    if (isOffline) {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
  }, [isOffline]);

  const getConnectionIcon = () => {
    if (isOffline) return <WifiOff className="w-4 h-4" />;
    
    switch (connectionType) {
      case 'wifi':
        return <Wifi className="w-4 h-4" />;
      case 'cellular':
        return <div className="w-4 h-4 flex items-center justify-center">
          <div className="w-2 h-2 bg-current rounded-full" />
        </div>;
      default:
        return <Wifi className="w-4 h-4" />;
    }
  };

  const getConnectionColor = () => {
    if (isOffline) return 'text-red-500';
    
    switch (connectionQuality) {
      case 'excellent':
        return 'text-green-500';
      case 'good':
        return 'text-yellow-500';
      case 'poor':
        return 'text-orange-500';
      default:
        return 'text-neutral-400';
    }
  };

  const getSyncStatus = () => {
    if (isSyncing) return 'Sincronizando...';
    if (syncError) return 'Error de sincronización';
    if (syncQueue.length > 0) return `${syncQueue.length} cambios pendientes`;
    if (lastSync) return 'Sincronizado';
    return 'Sin sincronizar';
  };

  const getSyncIcon = () => {
    if (isSyncing) return <RefreshCw className="w-4 h-4 animate-spin" />;
    if (syncError) return <AlertCircle className="w-4 h-4" />;
    if (syncQueue.length > 0) return <Clock className="w-4 h-4" />;
    if (lastSync) return <CheckCircle className="w-4 h-4" />;
    return <RefreshCw className="w-4 h-4" />;
  };

  const getSyncColor = () => {
    if (isSyncing) return 'text-blue-500';
    if (syncError) return 'text-red-500';
    if (syncQueue.length > 0) return 'text-orange-500';
    if (lastSync) return 'text-green-500';
    return 'text-neutral-400';
  };

  const formatLastSync = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Ahora mismo';
    if (minutes < 60) return `Hace ${minutes} min`;
    if (hours < 24) return `Hace ${hours} h`;
    return `Hace ${days} días`;
  };

  if (!showDetails && isOnline && syncQueue.length === 0 && !syncError) {
    return null;
  }

  return (
    <>
      {/* Notificación de estado offline */}
      {showNotification && isOffline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white px-mobile-lg py-mobile-sm text-center text-mobile-sm font-medium animate-mobile-slide-down">
          Sin conexión a internet
        </div>
      )}

      {/* Indicador principal */}
      <div className={cn(
        'bg-neutral-900/90 backdrop-blur-sm border border-white/10 rounded-mobile-lg p-mobile-md',
        className
      )}>
        <div className="flex items-center justify-between">
          {/* Estado de conexión */}
          <div className="flex items-center gap-mobile-sm">
            <div className={cn('flex items-center gap-mobile-xs', getConnectionColor())}>
              {getConnectionIcon()}
              <span className="text-mobile-sm font-medium">
                {isOffline ? 'Sin conexión' : connectionType === 'wifi' ? 'WiFi' : 'Datos móviles'}
              </span>
            </div>
          </div>

          {/* Estado de sincronización */}
          <div className="flex items-center gap-mobile-sm">
            <div className={cn('flex items-center gap-mobile-xs', getSyncColor())}>
              {getSyncIcon()}
              <span className="text-mobile-sm font-medium">
                {getSyncStatus()}
              </span>
            </div>

            {/* Botón de sincronización manual */}
            {onManualSync && syncQueue.length > 0 && (
              <button
                onClick={onManualSync}
                disabled={isSyncing || isOffline}
                className="p-mobile-xs rounded-mobile-sm bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mobile-touch-feedback"
              >
                <RefreshCw className={cn('w-3 h-3', isSyncing && 'animate-spin')} />
              </button>
            )}

            {/* Botón para expandir detalles */}
            {showDetails && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-mobile-xs rounded-mobile-sm bg-neutral-800 hover:bg-neutral-700 transition-colors mobile-touch-feedback"
              >
                <span className="text-mobile-xs">
                  {isExpanded ? '▼' : '▶'}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Detalles expandidos */}
        {showDetails && isExpanded && (
          <div className="mt-mobile-md pt-mobile-md border-t border-white/10 space-y-mobile-sm">
            {/* Información de conexión */}
            <div className="flex items-center justify-between text-mobile-xs text-neutral-400">
              <span>Tipo de conexión:</span>
              <span className="capitalize">{connectionType}</span>
            </div>

            <div className="flex items-center justify-between text-mobile-xs text-neutral-400">
              <span>Calidad:</span>
              <span className="capitalize">{connectionQuality}</span>
            </div>

            {/* Información de sincronización */}
            {lastSync && (
              <div className="flex items-center justify-between text-mobile-xs text-neutral-400">
                <span>Última sincronización:</span>
                <span>{formatLastSync(lastSync)}</span>
              </div>
            )}

            {syncQueue.length > 0 && (
              <div className="flex items-center justify-between text-mobile-xs text-neutral-400">
                <span>Cambios pendientes:</span>
                <span>{syncQueue.length} items</span>
              </div>
            )}

            {syncError && (
              <div className="flex items-center gap-mobile-xs text-mobile-xs text-red-400">
                <AlertCircle className="w-3 h-3" />
                <span>{syncError}</span>
              </div>
            )}

            {/* Lista de items pendientes */}
            {syncQueue.length > 0 && (
              <div className="mt-mobile-sm">
                <div className="text-mobile-xs text-neutral-400 mb-mobile-xs">
                  Cambios pendientes:
                </div>
                <div className="space-y-mobile-xs max-h-20 overflow-y-auto">
                  {syncQueue.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-mobile-xs bg-neutral-800/50 rounded-mobile-sm p-mobile-xs">
                      <span className="capitalize">{item.action}</span>
                      <span className="text-neutral-500">{item.endpoint}</span>
                    </div>
                  ))}
                  {syncQueue.length > 3 && (
                    <div className="text-mobile-xs text-neutral-500 text-center">
                      +{syncQueue.length - 3} más...
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default MobileOfflineIndicator;
