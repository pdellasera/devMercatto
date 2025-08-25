// Tipos para breakpoints
export interface BreakpointState {
  current: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
  height: number;
}

// Tipos para gestos
export interface GestureState {
  isSwiping: boolean;
  isPinching: boolean;
  isPulling: boolean;
  direction: 'left' | 'right' | 'up' | 'down' | null;
  distance: number;
  velocity: number;
}

export interface TouchPoint {
  x: number;
  y: number;
  timestamp: number;
}

export interface SwipeConfig {
  threshold?: number;
  velocity?: number;
  direction?: 'horizontal' | 'vertical' | 'both';
}

export interface PinchConfig {
  threshold?: number;
  minScale?: number;
  maxScale?: number;
}

export interface PullToRefreshConfig {
  threshold?: number;
  resistance?: number;
}

// Tipos para navegación
export interface NavigationState {
  currentRoute: string;
  previousRoute: string | null;
  isTransitioning: boolean;
  direction: 'forward' | 'backward' | null;
  canGoBack: boolean;
}

export interface NavigationOptions {
  enableSwipeBack?: boolean;
  enablePullToRefresh?: boolean;
  transitionDuration?: number;
  swipeThreshold?: number;
}

// Tipos para performance
export interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  loadTime: number;
  renderTime: number;
}

export interface PerformanceOptions {
  enableMonitoring?: boolean;
  enableLazyLoading?: boolean;
  enableVirtualization?: boolean;
  enableMemoization?: boolean;
  throttleInterval?: number;
}

// Tipos para lazy loading
export interface LazyLoadOptions {
  pageSize?: number;
  threshold?: number;
}

export interface LazyLoadResult<T> {
  visibleItems: T[];
  hasMore: boolean;
  loadingRef: React.RefObject<HTMLDivElement>;
  loadMore: () => void;
}

// Tipos para virtualización
export interface VirtualizationOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export interface VirtualizationResult<T> {
  visibleItems: T[];
  totalHeight: number;
  offsetY: number;
  containerRef: React.RefObject<HTMLDivElement>;
  handleScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  visibleRange: { startIndex: number; endIndex: number };
}

// Tipos para memoización
export interface MemoizationOptions {
  maxCacheSize?: number;
}

// Tipos para animaciones
export type AnimationType = 'slide-left' | 'slide-right' | 'fade' | 'scale';

// Tipos para eventos personalizados
export interface MobileSwipeEvent {
  direction: 'left' | 'right' | 'up' | 'down';
  distance: number;
  velocity: number;
  start: TouchPoint;
  end: TouchPoint;
}

export interface MobilePinchEvent {
  scale: number;
  distance: number;
}

export interface MobilePullRefreshEvent {
  distance: number;
}
