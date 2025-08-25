import { useState, useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  fcp: number | null; // First Contentful Paint
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  ttfb: number | null; // Time to First Byte
  domLoad: number | null; // DOM Content Loaded
  windowLoad: number | null; // Window Load
  memoryUsage: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  } | null;
  networkInfo: {
    effectiveType: string;
    downlink: number;
    rtt: number;
  } | null;
}

interface UseMobilePerformanceMetricsOptions {
  enableMemoryMonitoring?: boolean;
  enableNetworkMonitoring?: boolean;
  enableWebVitals?: boolean;
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
}

interface UseMobilePerformanceMetricsReturn {
  metrics: PerformanceMetrics;
  isMonitoring: boolean;
  startMonitoring: () => void;
  stopMonitoring: () => void;
  resetMetrics: () => void;
  getLighthouseScore: () => Promise<number>;
}

const useMobilePerformanceMetrics = (
  options: UseMobilePerformanceMetricsOptions = {}
): UseMobilePerformanceMetricsReturn => {
  const {
    enableMemoryMonitoring = true,
    enableNetworkMonitoring = true,
    enableWebVitals = true,
    onMetricsUpdate,
  } = options;

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    domLoad: null,
    windowLoad: null,
    memoryUsage: null,
    networkInfo: null,
  });

  const [isMonitoring, setIsMonitoring] = useState(false);
  const observerRef = useRef<PerformanceObserver | null>(null);
  const memoryIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const networkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Función para obtener métricas de memoria
  const getMemoryMetrics = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
      };
    }
    return null;
  }, []);

  // Función para obtener información de red
  const getNetworkInfo = useCallback(() => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      return {
        effectiveType: connection.effectiveType || 'unknown',
        downlink: connection.downlink || 0,
        rtt: connection.rtt || 0,
      };
    }
    return null;
  }, []);

  // Función para obtener métricas básicas de performance
  const getBasicMetrics = useCallback(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');

    const fcp = paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || null;
    const ttfb = navigation?.responseStart - navigation?.requestStart || null;
    const domLoad = navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart || null;
    const windowLoad = navigation?.loadEventEnd - navigation?.loadEventStart || null;

    return { fcp, ttfb, domLoad, windowLoad };
  }, []);

  // Función para configurar Web Vitals
  const setupWebVitals = useCallback(() => {
    if (!enableWebVitals) return;

    try {
      // Largest Contentful Paint
      observerRef.current = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        setMetrics(prev => ({
          ...prev,
          lcp: lastEntry.startTime,
        }));
      });
      
      observerRef.current.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay
      observerRef.current = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const firstInput = entries[0];
        
        setMetrics(prev => ({
          ...prev,
          fid: firstInput.processingStart - firstInput.startTime,
        }));
      });
      
      observerRef.current.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift
      observerRef.current = new PerformanceObserver((list) => {
        let cls = 0;
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            cls += (entry as any).value;
          }
        }
        
        setMetrics(prev => ({
          ...prev,
          cls,
        }));
      });
      
      observerRef.current.observe({ entryTypes: ['layout-shift'] });

    } catch (error) {
      console.warn('Web Vitals not supported:', error);
    }
  }, [enableWebVitals]);

  // Función para monitorear memoria
  const startMemoryMonitoring = useCallback(() => {
    if (!enableMemoryMonitoring) return;

    memoryIntervalRef.current = setInterval(() => {
      const memoryUsage = getMemoryMetrics();
      setMetrics(prev => ({
        ...prev,
        memoryUsage,
      }));
    }, 5000); // Cada 5 segundos
  }, [enableMemoryMonitoring, getMemoryMetrics]);

  // Función para monitorear red
  const startNetworkMonitoring = useCallback(() => {
    if (!enableNetworkMonitoring) return;

    networkIntervalRef.current = setInterval(() => {
      const networkInfo = getNetworkInfo();
      setMetrics(prev => ({
        ...prev,
        networkInfo,
      }));
    }, 10000); // Cada 10 segundos
  }, [enableNetworkMonitoring, getNetworkInfo]);

  // Función para iniciar monitoreo
  const startMonitoring = useCallback(() => {
    setIsMonitoring(true);
    
    // Obtener métricas básicas
    const basicMetrics = getBasicMetrics();
    setMetrics(prev => ({
      ...prev,
      ...basicMetrics,
    }));

    // Configurar Web Vitals
    setupWebVitals();
    
    // Iniciar monitoreo de memoria y red
    startMemoryMonitoring();
    startNetworkMonitoring();
  }, [getBasicMetrics, setupWebVitals, startMemoryMonitoring, startNetworkMonitoring]);

  // Función para detener monitoreo
  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
    
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    
    if (memoryIntervalRef.current) {
      clearInterval(memoryIntervalRef.current);
      memoryIntervalRef.current = null;
    }
    
    if (networkIntervalRef.current) {
      clearInterval(networkIntervalRef.current);
      networkIntervalRef.current = null;
    }
  }, []);

  // Función para resetear métricas
  const resetMetrics = useCallback(() => {
    setMetrics({
      fcp: null,
      lcp: null,
      fid: null,
      cls: null,
      ttfb: null,
      domLoad: null,
      windowLoad: null,
      memoryUsage: null,
      networkInfo: null,
    });
  }, []);

  // Función para obtener Lighthouse Score (simulado)
  const getLighthouseScore = useCallback(async (): Promise<number> => {
    // En un entorno real, esto se conectaría con Lighthouse CI
    // Por ahora, calculamos un score basado en las métricas disponibles
    
    let score = 100;
    
    if (metrics.fcp && metrics.fcp > 1800) score -= 20;
    if (metrics.lcp && metrics.lcp > 2500) score -= 25;
    if (metrics.fid && metrics.fid > 100) score -= 20;
    if (metrics.cls && metrics.cls > 0.1) score -= 15;
    if (metrics.ttfb && metrics.ttfb > 600) score -= 20;
    
    return Math.max(0, score);
  }, [metrics]);

  // Notificar cambios en métricas
  useEffect(() => {
    if (onMetricsUpdate) {
      onMetricsUpdate(metrics);
    }
  }, [metrics, onMetricsUpdate]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      stopMonitoring();
    };
  }, [stopMonitoring]);

  return {
    metrics,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    resetMetrics,
    getLighthouseScore,
  };
};

export default useMobilePerformanceMetrics;
