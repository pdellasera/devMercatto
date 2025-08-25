import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  loadTime: number;
  renderTime: number;
}

interface PerformanceOptions {
  enableMonitoring?: boolean;
  enableLazyLoading?: boolean;
  enableVirtualization?: boolean;
  enableMemoization?: boolean;
  throttleInterval?: number;
}

export const useMobilePerformance = (options?: PerformanceOptions) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memoryUsage: 0,
    loadTime: 0,
    renderTime: 0,
  });

  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const animationFrameRef = useRef<number>();

  const config = {
    enableMonitoring: true,
    enableLazyLoading: true,
    enableVirtualization: true,
    enableMemoization: true,
    throttleInterval: 16, // ~60fps
    ...options,
  };

  // Monitorear FPS
  const monitorFPS = useCallback(() => {
    if (!config.enableMonitoring) return;

    const currentTime = performance.now();
    frameCountRef.current++;

    if (currentTime - lastTimeRef.current >= 1000) {
      const fps = Math.round((frameCountRef.current * 1000) / (currentTime - lastTimeRef.current));
      
      setMetrics(prev => ({
        ...prev,
        fps,
      }));

      // Detectar rendimiento bajo
      if (fps < 30) {
        setIsLowPerformance(true);
      } else if (fps > 45) {
        setIsLowPerformance(false);
      }

      frameCountRef.current = 0;
      lastTimeRef.current = currentTime;
    }

    animationFrameRef.current = requestAnimationFrame(monitorFPS);
  }, [config.enableMonitoring]);

  // Monitorear uso de memoria
  const monitorMemory = useCallback(() => {
    if (!config.enableMonitoring || !('memory' in performance)) return;

    const memory = (performance as any).memory;
    const memoryUsage = memory ? memory.usedJSHeapSize / memory.jsHeapSizeLimit : 0;

    setMetrics(prev => ({
      ...prev,
      memoryUsage: Math.round(memoryUsage * 100),
    }));

    // Detectar uso alto de memoria
    if (memoryUsage > 0.8) {
      console.warn('High memory usage detected:', memoryUsage);
    }
  }, [config.enableMonitoring]);

  // Medir tiempo de carga
  const measureLoadTime = useCallback(() => {
    if (!config.enableMonitoring) return;

    const loadTime = performance.now();
    
    setMetrics(prev => ({
      ...prev,
      loadTime: Math.round(loadTime),
    }));
  }, [config.enableMonitoring]);

  // Medir tiempo de renderizado
  const measureRenderTime = useCallback(() => {
    if (!config.enableMonitoring) return;

    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      setMetrics(prev => ({
        ...prev,
        renderTime: Math.round(renderTime),
      }));
    };
  }, [config.enableMonitoring]);

  // Throttle para optimizar performance
  const throttle = useCallback(<T extends (...args: any[]) => any>(
    func: T,
    delay: number = config.throttleInterval
  ): T => {
    let lastCall = 0;
    return ((...args: any[]) => {
      const now = performance.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        return func(...args);
      }
    }) as T;
  }, [config.throttleInterval]);

  // Debounce para optimizar performance
  const debounce = useCallback(<T extends (...args: any[]) => any>(
    func: T,
    delay: number = 300
  ): T => {
    let timeoutId: NodeJS.Timeout;
    return ((...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    }) as T;
  }, []);

  // Lazy loading hook
  const useLazyLoad = useCallback((
    items: any[],
    pageSize: number = 10,
    threshold: number = 0.8
  ) => {
    const [visibleItems, setVisibleItems] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadingRef = useRef<HTMLDivElement>(null);

    const loadMore = useCallback(() => {
      if (!hasMore) return;

      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const newItems = items.slice(startIndex, endIndex);

      setVisibleItems(prev => [...prev, ...newItems]);
      setCurrentPage(prev => prev + 1);
      setHasMore(endIndex < items.length);
    }, [items, currentPage, pageSize, hasMore]);

    useEffect(() => {
      if (!config.enableLazyLoading) {
        setVisibleItems(items);
        return;
      }

      loadMore();
    }, [items, config.enableLazyLoading, loadMore]);

    useEffect(() => {
      if (!config.enableLazyLoading || !loadingRef.current) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            loadMore();
          }
        },
        { threshold }
      );

      observerRef.current.observe(loadingRef.current);

      return () => {
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
      };
    }, [config.enableLazyLoading, hasMore, loadMore, threshold]);

    return {
      visibleItems,
      hasMore,
      loadingRef,
      loadMore,
    };
  }, [config.enableLazyLoading]);

  // Virtualización hook
  const useVirtualization = useCallback((
    items: any[],
    itemHeight: number,
    containerHeight: number,
    overscan: number = 5
  ) => {
    const [scrollTop, setScrollTop] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const visibleRange = useMemo(() => {
      const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
      const endIndex = Math.min(
        items.length - 1,
        Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
      );

      return { startIndex, endIndex };
    }, [scrollTop, itemHeight, containerHeight, overscan, items.length]);

    const visibleItems = useMemo(() => {
      return items.slice(visibleRange.startIndex, visibleRange.endIndex + 1);
    }, [items, visibleRange]);

    const totalHeight = items.length * itemHeight;
    const offsetY = visibleRange.startIndex * itemHeight;

    const handleScroll = throttle((e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(e.currentTarget.scrollTop);
    });

    return {
      visibleItems,
      totalHeight,
      offsetY,
      containerRef,
      handleScroll,
      visibleRange,
    };
  }, [throttle]);

  // Memoización hook
  const useMemoization = useCallback(<T>(
    factory: () => T,
    deps: React.DependencyList,
    maxCacheSize: number = 100
  ) => {
    const cacheRef = useRef<Map<string, T>>(new Map());

    return useMemo(() => {
      if (!config.enableMemoization) {
        return factory();
      }

      const key = JSON.stringify(deps);
      const cached = cacheRef.current.get(key);

      if (cached !== undefined) {
        return cached;
      }

      const result = factory();
      
      // Limpiar cache si es muy grande
      if (cacheRef.current.size >= maxCacheSize) {
        const firstKey = cacheRef.current.keys().next().value;
        cacheRef.current.delete(firstKey);
      }

      cacheRef.current.set(key, result);
      return result;
    }, deps);
  }, [config.enableMemoization]);

  // Optimizar imágenes
  const optimizeImage = useCallback((src: string, width: number, quality: number = 0.8) => {
    if (!config.enableLazyLoading) return src;

    // Usar WebP si está disponible
    const supportsWebP = document.createElement('canvas')
      .toDataURL('image/webp')
      .indexOf('data:image/webp') === 0;

    const format = supportsWebP ? 'webp' : 'jpeg';
    
    // Crear URL con parámetros de optimización
    const url = new URL(src, window.location.origin);
    url.searchParams.set('w', width.toString());
    url.searchParams.set('q', quality.toString());
    url.searchParams.set('f', format);

    return url.toString();
  }, [config.enableLazyLoading]);

  // Setup monitoring
  useEffect(() => {
    if (config.enableMonitoring) {
      monitorFPS();
      monitorMemory();
      measureLoadTime();

      const memoryInterval = setInterval(monitorMemory, 5000);

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        clearInterval(memoryInterval);
      };
    }
  }, [config.enableMonitoring, monitorFPS, monitorMemory, measureLoadTime]);

  return {
    metrics,
    isLowPerformance,
    throttle,
    debounce,
    useLazyLoad,
    useVirtualization,
    useMemoization,
    optimizeImage,
    measureRenderTime,
  };
};
