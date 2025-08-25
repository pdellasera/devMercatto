import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

interface UseMobileVirtualScrollOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
  threshold?: number;
  enableInfiniteScroll?: boolean;
  onLoadMore?: () => void;
}

interface UseMobileVirtualScrollReturn<T> {
  virtualItems: Array<{
    index: number;
    data: T;
    style: React.CSSProperties;
    isVisible: boolean;
  }>;
  totalHeight: number;
  startIndex: number;
  endIndex: number;
  containerRef: React.RefObject<HTMLDivElement>;
  scrollToIndex: (index: number) => void;
  scrollToTop: () => void;
  isScrolling: boolean;
}

const useMobileVirtualScroll = <T>(
  items: T[],
  options: UseMobileVirtualScrollOptions
): UseMobileVirtualScrollReturn<T> => {
  const {
    itemHeight,
    containerHeight,
    overscan = 5,
    threshold = 0.8,
    enableInfiniteScroll = false,
    onLoadMore,
  } = options;

  const [scrollTop, setScrollTop] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Calcular índices visibles
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.floor((scrollTop + containerHeight) / itemHeight) + overscan
  );

  // Calcular altura total
  const totalHeight = items.length * itemHeight;

  // Generar items virtuales
  const virtualItems = useMemo(() => {
    const visibleItems: Array<{
      index: number;
      data: T;
      style: React.CSSProperties;
      isVisible: boolean;
    }> = [];

    for (let i = startIndex; i <= endIndex; i++) {
      if (i >= 0 && i < items.length) {
        visibleItems.push({
          index: i,
          data: items[i],
          style: {
            position: 'absolute',
            top: i * itemHeight,
            height: itemHeight,
            width: '100%',
            transform: `translateY(${i * itemHeight}px)`,
          },
          isVisible: true,
        });
      }
    }

    return visibleItems;
  }, [items, startIndex, endIndex, itemHeight]);

  // Manejar scroll
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    const newScrollTop = target.scrollTop;
    
    setScrollTop(newScrollTop);
    setIsScrolling(true);

    // Limpiar timeout anterior
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Detectar cuando se detiene el scroll
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);

    // Infinite scroll
    if (enableInfiniteScroll && onLoadMore) {
      const scrollPercentage = newScrollTop / (totalHeight - containerHeight);
      if (scrollPercentage >= threshold) {
        onLoadMore();
      }
    }
  }, [enableInfiniteScroll, onLoadMore, totalHeight, containerHeight, threshold]);

  // Scroll a índice específico
  const scrollToIndex = useCallback((index: number) => {
    if (containerRef.current && index >= 0 && index < items.length) {
      const targetScrollTop = index * itemHeight;
      containerRef.current.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth',
      });
    }
  }, [items.length, itemHeight]);

  // Scroll al inicio
  const scrollToTop = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, []);

  // Configurar event listener para scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScrollEvent = (event: Event) => {
      const target = event.target as HTMLDivElement;
      const newScrollTop = target.scrollTop;
      
      setScrollTop(newScrollTop);
      setIsScrolling(true);

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    container.addEventListener('scroll', handleScrollEvent, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScrollEvent);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return {
    virtualItems,
    totalHeight,
    startIndex,
    endIndex,
    containerRef,
    scrollToIndex,
    scrollToTop,
    isScrolling,
  };
};

export default useMobileVirtualScroll;
