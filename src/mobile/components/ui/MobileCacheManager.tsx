import React, { useState } from 'react';
import { Database, Trash2, RefreshCw, Download, Upload, Settings, Info, Clock } from 'lucide-react';
import { cn } from '../../utils/cn';

interface CacheStats {
  size: number;
  items: number;
  oldestItem: Date | null;
  newestItem: Date | null;
  expiredItems: number;
}

interface MobileCacheManagerProps {
  cacheSize: number;
  syncQueue: any[];
  isSyncing: boolean;
  lastSync: Date | null;
  syncError: string | null;
  onClearCache: () => void;
  onPerformSync: () => void;
  onShowCacheDetails?: () => void;
  className?: string;
  showAdvanced?: boolean;
}

const MobileCacheManager: React.FC<MobileCacheManagerProps> = ({
  cacheSize,
  syncQueue,
  isSyncing,
  lastSync,
  syncError,
  onClearCache,
  onPerformSync,
  onShowCacheDetails,
  className,
  showAdvanced = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const formatCacheSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatLastSync = (date: Date | null) => {
    if (!date) return 'Nunca';
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

  const handleClearCache = () => {
    setShowConfirmClear(false);
    onClearCache();
  };

  return (
    <div className={cn(
      'bg-neutral-900/90 backdrop-blur-sm border border-white/10 rounded-mobile-lg p-mobile-md',
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between mb-mobile-md">
        <div className="flex items-center gap-mobile-sm">
          <Database className="w-5 h-5 text-primary-500" />
          <h3 className="text-mobile-base font-semibold">Gestión de Datos</h3>
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-mobile-xs rounded-mobile-sm bg-neutral-800 hover:bg-neutral-700 transition-colors mobile-touch-feedback"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Estadísticas básicas */}
      <div className="grid grid-cols-2 gap-mobile-sm mb-mobile-md">
        <div className="bg-neutral-800/50 rounded-mobile-sm p-mobile-sm">
          <div className="flex items-center gap-mobile-xs mb-mobile-xs">
            <Database className="w-3 h-3 text-neutral-400" />
            <span className="text-mobile-xs text-neutral-400">Cache</span>
          </div>
          <div className="text-mobile-sm font-medium">
            {formatCacheSize(cacheSize)}
          </div>
        </div>

        <div className="bg-neutral-800/50 rounded-mobile-sm p-mobile-sm">
          <div className="flex items-center gap-mobile-xs mb-mobile-xs">
            <Upload className="w-3 h-3 text-neutral-400" />
            <span className="text-mobile-xs text-neutral-400">Pendientes</span>
          </div>
          <div className="text-mobile-sm font-medium">
            {syncQueue.length}
          </div>
        </div>
      </div>

      {/* Acciones principales */}
      <div className="flex items-center gap-mobile-sm mb-mobile-md">
        <button
          onClick={onPerformSync}
          disabled={isSyncing || syncQueue.length === 0}
          className="flex-1 flex items-center justify-center gap-mobile-xs px-mobile-md py-mobile-sm bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-mobile-sm transition-colors mobile-touch-feedback"
        >
          <RefreshCw className={cn('w-4 h-4', isSyncing && 'animate-spin')} />
          <span className="text-mobile-sm font-medium">
            {isSyncing ? 'Sincronizando...' : 'Sincronizar'}
          </span>
        </button>

        <button
          onClick={() => setShowConfirmClear(true)}
          className="flex items-center justify-center gap-mobile-xs px-mobile-md py-mobile-sm bg-red-600 hover:bg-red-700 rounded-mobile-sm transition-colors mobile-touch-feedback"
        >
          <Trash2 className="w-4 h-4" />
          <span className="text-mobile-sm font-medium">Limpiar</span>
        </button>
      </div>

      {/* Detalles expandidos */}
      {isExpanded && (
        <div className="space-y-mobile-sm pt-mobile-md border-t border-white/10">
          {/* Estado de sincronización */}
          <div className="flex items-center justify-between text-mobile-xs">
            <span className="text-neutral-400">Última sincronización:</span>
            <span className={cn(
              'font-medium',
              lastSync ? 'text-green-400' : 'text-neutral-500'
            )}>
              {formatLastSync(lastSync)}
            </span>
          </div>

          {/* Error de sincronización */}
          {syncError && (
            <div className="flex items-center gap-mobile-xs text-mobile-xs text-red-400 bg-red-900/20 rounded-mobile-sm p-mobile-sm">
              <Info className="w-3 h-3" />
              <span>{syncError}</span>
            </div>
          )}

          {/* Items pendientes */}
          {syncQueue.length > 0 && (
            <div className="bg-neutral-800/50 rounded-mobile-sm p-mobile-sm">
              <div className="flex items-center gap-mobile-xs mb-mobile-xs">
                <Clock className="w-3 h-3 text-neutral-400" />
                <span className="text-mobile-xs text-neutral-400">Cambios pendientes</span>
              </div>
              <div className="space-y-mobile-xs max-h-24 overflow-y-auto">
                {syncQueue.slice(0, 5).map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-mobile-xs bg-neutral-700/50 rounded-mobile-sm p-mobile-xs">
                    <span className="capitalize">{item.action}</span>
                    <span className="text-neutral-500">{item.endpoint}</span>
                  </div>
                ))}
                {syncQueue.length > 5 && (
                  <div className="text-mobile-xs text-neutral-500 text-center">
                    +{syncQueue.length - 5} más...
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Acciones avanzadas */}
          {showAdvanced && onShowCacheDetails && (
            <button
              onClick={onShowCacheDetails}
              className="w-full flex items-center justify-center gap-mobile-xs px-mobile-md py-mobile-sm bg-neutral-800 hover:bg-neutral-700 rounded-mobile-sm transition-colors mobile-touch-feedback"
            >
              <Info className="w-4 h-4" />
              <span className="text-mobile-sm font-medium">Ver detalles del cache</span>
            </button>
          )}
        </div>
      )}

      {/* Modal de confirmación para limpiar cache */}
      {showConfirmClear && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-mobile-lg">
          <div className="bg-neutral-900 border border-white/10 rounded-mobile-lg p-mobile-lg max-w-sm w-full">
            <h3 className="text-mobile-lg font-semibold mb-mobile-sm">
              Limpiar Cache
            </h3>
            <p className="text-mobile-sm text-neutral-400 mb-mobile-lg">
              ¿Estás seguro de que quieres limpiar todo el cache? Esta acción no se puede deshacer.
            </p>
            <div className="flex items-center gap-mobile-sm">
              <button
                onClick={() => setShowConfirmClear(false)}
                className="flex-1 px-mobile-md py-mobile-sm bg-neutral-800 hover:bg-neutral-700 rounded-mobile-sm transition-colors mobile-touch-feedback"
              >
                Cancelar
              </button>
              <button
                onClick={handleClearCache}
                className="flex-1 px-mobile-md py-mobile-sm bg-red-600 hover:bg-red-700 rounded-mobile-sm transition-colors mobile-touch-feedback"
              >
                Limpiar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileCacheManager;
