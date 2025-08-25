import { useState, useEffect, useCallback, useRef } from 'react';

interface OfflineState {
  isOnline: boolean;
  isOffline: boolean;
  lastOnline: Date | null;
  lastOffline: Date | null;
  connectionType: 'wifi' | 'cellular' | 'none' | 'unknown';
  connectionQuality: 'excellent' | 'good' | 'poor' | 'none';
}

interface CacheItem<T = any> {
  key: string;
  data: T;
  timestamp: number;
  expiresAt?: number;
  version?: string;
}

interface SyncQueueItem {
  id: string;
  action: 'create' | 'update' | 'delete';
  endpoint: string;
  data: any;
  timestamp: number;
  retries: number;
}

interface UseMobileOfflineOptions {
  cacheExpiry?: number; // en milisegundos
  maxCacheSize?: number; // número máximo de items
  syncRetryAttempts?: number;
  syncRetryDelay?: number;
  enableAutoSync?: boolean;
}

const useMobileOffline = (options: UseMobileOfflineOptions = {}) => {
  const {
    cacheExpiry = 24 * 60 * 60 * 1000, // 24 horas por defecto
    maxCacheSize = 100,
    syncRetryAttempts = 3,
    syncRetryDelay = 5000,
    enableAutoSync = true,
  } = options;

  const [offlineState, setOfflineState] = useState<OfflineState>({
    isOnline: navigator.onLine,
    isOffline: !navigator.onLine,
    lastOnline: null,
    lastOffline: null,
    connectionType: 'unknown',
    connectionQuality: 'unknown',
  });

  const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  const cacheRef = useRef<Map<string, CacheItem>>(new Map());
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Detectar cambios de conectividad
  useEffect(() => {
    const handleOnline = () => {
      setOfflineState(prev => ({
        ...prev,
        isOnline: true,
        isOffline: false,
        lastOnline: new Date(),
        connectionType: getConnectionType(),
        connectionQuality: getConnectionQuality(),
      }));
      
      if (enableAutoSync) {
        scheduleSync();
      }
    };

    const handleOffline = () => {
      setOfflineState(prev => ({
        ...prev,
        isOnline: false,
        isOffline: true,
        lastOffline: new Date(),
        connectionType: 'none',
        connectionQuality: 'none',
      }));
    };

    const handleVisibilityChange = () => {
      if (!document.hidden && navigator.onLine && enableAutoSync) {
        scheduleSync();
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enableAutoSync]);

  // Detectar tipo de conexión
  const getConnectionType = (): 'wifi' | 'cellular' | 'none' | 'unknown' => {
    if (!navigator.onLine) return 'none';
    
    // @ts-ignore - navigator.connection no está en todos los navegadores
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (connection) {
      switch (connection.effectiveType) {
        case 'wifi':
          return 'wifi';
        case '4g':
        case '3g':
        case '2g':
        case 'slow-2g':
          return 'cellular';
        default:
          return 'unknown';
      }
    }
    
    return 'unknown';
  };

  // Detectar calidad de conexión
  const getConnectionQuality = (): 'excellent' | 'good' | 'poor' | 'none' => {
    if (!navigator.onLine) return 'none';
    
    // @ts-ignore
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (connection) {
      const downlink = connection.downlink || 0;
      const rtt = connection.rtt || 0;
      
      if (downlink > 10 && rtt < 50) return 'excellent';
      if (downlink > 5 && rtt < 100) return 'good';
      return 'poor';
    }
    
    return 'unknown';
  };

  // Cache management
  const setCache = useCallback(<T>(key: string, data: T, options?: { expiresAt?: number; version?: string }) => {
    const now = Date.now();
    const expiresAt = options?.expiresAt || (now + cacheExpiry);
    
    // Limpiar cache si excede el tamaño máximo
    if (cacheRef.current.size >= maxCacheSize) {
      const oldestKey = Array.from(cacheRef.current.keys())[0];
      cacheRef.current.delete(oldestKey);
    }
    
    cacheRef.current.set(key, {
      key,
      data,
      timestamp: now,
      expiresAt,
      version: options?.version,
    });
    
    // Persistir en localStorage
    try {
      const cacheData = Array.from(cacheRef.current.entries());
      localStorage.setItem('mobile-cache', JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Error saving cache to localStorage:', error);
    }
  }, [cacheExpiry, maxCacheSize]);

  const getCache = useCallback(<T>(key: string): T | null => {
    const item = cacheRef.current.get(key);
    
    if (!item) return null;
    
    // Verificar expiración
    if (item.expiresAt && Date.now() > item.expiresAt) {
      cacheRef.current.delete(key);
      return null;
    }
    
    return item.data as T;
  }, []);

  const removeCache = useCallback((key: string) => {
    cacheRef.current.delete(key);
    
    // Actualizar localStorage
    try {
      const cacheData = Array.from(cacheRef.current.entries());
      localStorage.setItem('mobile-cache', JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Error updating cache in localStorage:', error);
    }
  }, []);

  const clearCache = useCallback(() => {
    cacheRef.current.clear();
    localStorage.removeItem('mobile-cache');
  }, []);

  // Cargar cache desde localStorage al inicializar
  useEffect(() => {
    try {
      const cached = localStorage.getItem('mobile-cache');
      if (cached) {
        const cacheData = JSON.parse(cached) as [string, CacheItem][];
        const now = Date.now();
        
        // Filtrar items expirados
        const validItems = cacheData.filter(([_, item]) => 
          !item.expiresAt || now < item.expiresAt
        );
        
        cacheRef.current = new Map(validItems);
      }
    } catch (error) {
      console.warn('Error loading cache from localStorage:', error);
    }
  }, []);

  // Sync queue management
  const addToSyncQueue = useCallback((item: Omit<SyncQueueItem, 'id' | 'timestamp' | 'retries'>) => {
    const syncItem: SyncQueueItem = {
      ...item,
      id: `${item.action}-${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      retries: 0,
    };
    
    setSyncQueue(prev => [...prev, syncItem]);
    
    // Persistir queue en localStorage
    try {
      const currentQueue = JSON.parse(localStorage.getItem('mobile-sync-queue') || '[]');
      currentQueue.push(syncItem);
      localStorage.setItem('mobile-sync-queue', JSON.stringify(currentQueue));
    } catch (error) {
      console.warn('Error saving sync queue to localStorage:', error);
    }
  }, []);

  const removeFromSyncQueue = useCallback((id: string) => {
    setSyncQueue(prev => prev.filter(item => item.id !== id));
    
    // Actualizar localStorage
    try {
      const currentQueue = JSON.parse(localStorage.getItem('mobile-sync-queue') || '[]');
      const updatedQueue = currentQueue.filter((item: SyncQueueItem) => item.id !== id);
      localStorage.setItem('mobile-sync-queue', JSON.stringify(updatedQueue));
    } catch (error) {
      console.warn('Error updating sync queue in localStorage:', error);
    }
  }, []);

  // Cargar sync queue desde localStorage
  useEffect(() => {
    try {
      const queueData = localStorage.getItem('mobile-sync-queue');
      if (queueData) {
        const queue = JSON.parse(queueData) as SyncQueueItem[];
        setSyncQueue(queue);
      }
    } catch (error) {
      console.warn('Error loading sync queue from localStorage:', error);
    }
  }, []);

  // Sincronización
  const scheduleSync = useCallback(() => {
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }
    
    syncTimeoutRef.current = setTimeout(() => {
      performSync();
    }, 1000);
  }, []);

  const performSync = useCallback(async () => {
    if (!navigator.onLine || isSyncing || syncQueue.length === 0) return;
    
    setIsSyncing(true);
    setSyncError(null);
    
    try {
      const itemsToSync = [...syncQueue];
      
      for (const item of itemsToSync) {
        if (item.retries >= syncRetryAttempts) {
          console.warn(`Max retries reached for sync item: ${item.id}`);
          removeFromSyncQueue(item.id);
          continue;
        }
        
        try {
          // Aquí iría la lógica real de sincronización con el servidor
          await syncItem(item);
          removeFromSyncQueue(item.id);
        } catch (error) {
          console.error(`Sync failed for item ${item.id}:`, error);
          
          // Incrementar contador de reintentos
          setSyncQueue(prev => prev.map(queueItem => 
            queueItem.id === item.id 
              ? { ...queueItem, retries: queueItem.retries + 1 }
              : queueItem
          ));
        }
      }
      
      setLastSync(new Date());
    } catch (error) {
      setSyncError(error instanceof Error ? error.message : 'Sync failed');
    } finally {
      setIsSyncing(false);
    }
  }, [syncQueue, isSyncing, syncRetryAttempts, removeFromSyncQueue]);

  // Función placeholder para sincronización real
  const syncItem = async (item: SyncQueueItem): Promise<void> => {
    // Simular llamada a API
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.8) {
          reject(new Error('Network error'));
        } else {
          resolve(true);
        }
      }, 1000);
    });
  };

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, []);

  return {
    // Estado offline
    ...offlineState,
    
    // Cache
    setCache,
    getCache,
    removeCache,
    clearCache,
    cacheSize: cacheRef.current.size,
    
    // Sync queue
    syncQueue,
    addToSyncQueue,
    removeFromSyncQueue,
    isSyncing,
    lastSync,
    syncError,
    
    // Acciones
    performSync,
    scheduleSync,
  };
};

export default useMobileOffline;
