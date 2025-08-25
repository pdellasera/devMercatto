import { useState, useRef, useCallback, useEffect } from 'react';

interface GestureState {
  isSwiping: boolean;
  isPulling: boolean;
  startY: number;
  startX: number;
  currentY: number;
  currentX: number;
  deltaY: number;
  deltaX: number;
  velocity: number;
}

interface SwipeConfig {
  threshold: number;
  velocity: number;
  direction: 'horizontal' | 'vertical' | 'both';
}

interface PullToRefreshConfig {
  threshold: number;
  maxPull: number;
  resistance: number;
}

interface UseMobileGesturesOptions {
  swipe?: SwipeConfig;
  pullToRefresh?: PullToRefreshConfig;
  onSwipe?: (direction: 'left' | 'right' | 'up' | 'down') => void;
  onPullToRefresh?: () => Promise<void>;
  enabled?: boolean;
}

const useMobileGestures = (options: UseMobileGesturesOptions = {}) => {
  const {
    swipe = { threshold: 50, velocity: 0.3, direction: 'both' },
    pullToRefresh = { threshold: 80, maxPull: 150, resistance: 0.6 },
    onSwipe,
    onPullToRefresh,
    enabled = true,
  } = options;

  const [gestureState, setGestureState] = useState<GestureState>({
    isSwiping: false,
    isPulling: false,
    startY: 0,
    startX: 0,
    currentY: 0,
    currentX: 0,
    deltaY: 0,
    deltaX: 0,
    velocity: 0,
  });

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullProgress, setPullProgress] = useState(0);
  
  const startTime = useRef<number>(0);
  const lastTime = useRef<number>(0);
  const lastY = useRef<number>(0);
  const lastX = useRef<number>(0);
  const velocityTracker = useRef<number[]>([]);
  const elementRef = useRef<HTMLElement | null>(null);

  // Detectar si el elemento está en la parte superior para pull-to-refresh
  const isAtTop = useCallback(() => {
    if (!elementRef.current) return false;
    return elementRef.current.scrollTop <= 0;
  }, []);

  // Calcular velocidad del gesto
  const calculateVelocity = useCallback((current: number, last: number, time: number) => {
    const deltaTime = time - lastTime.current;
    if (deltaTime === 0) return 0;
    
    const delta = current - last;
    const velocity = delta / deltaTime;
    
    velocityTracker.current.push(velocity);
    if (velocityTracker.current.length > 5) {
      velocityTracker.current.shift();
    }
    
    return velocityTracker.current.reduce((sum, v) => sum + v, 0) / velocityTracker.current.length;
  }, []);

  // Manejar inicio del gesto
  const handleTouchStart = useCallback((event: TouchEvent) => {
    if (!enabled) return;
    
    const touch = event.touches[0];
    const now = Date.now();
    
    startTime.current = now;
    lastTime.current = now;
    lastY.current = touch.clientY;
    lastX.current = touch.clientX;
    velocityTracker.current = [];
    
    setGestureState(prev => ({
      ...prev,
      isSwiping: true,
      startY: touch.clientY,
      startX: touch.clientX,
      currentY: touch.clientY,
      currentX: touch.clientX,
      deltaY: 0,
      deltaX: 0,
      velocity: 0,
    }));
  }, [enabled]);

  // Manejar movimiento del gesto
  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (!enabled || !gestureState.isSwiping) return;
    
    const touch = event.touches[0];
    const now = Date.now();
    const deltaY = touch.clientY - gestureState.startY;
    const deltaX = touch.clientX - gestureState.startX;
    
    // Calcular velocidad
    const velocityY = calculateVelocity(touch.clientY, lastY.current, now);
    const velocityX = calculateVelocity(touch.clientX, lastX.current, now);
    const velocity = Math.abs(velocityY) > Math.abs(velocityX) ? velocityY : velocityX;
    
    lastTime.current = now;
    lastY.current = touch.clientY;
    lastX.current = touch.clientX;
    
    // Detectar pull-to-refresh
    const isPullingDown = isAtTop() && deltaY > 0;
    const pullAmount = isPullingDown ? Math.min(deltaY * pullToRefresh.resistance, pullToRefresh.maxPull) : 0;
    const progress = Math.min(pullAmount / pullToRefresh.threshold, 1);
    
    setPullProgress(progress);
    setGestureState(prev => ({
      ...prev,
      currentY: touch.clientY,
      currentX: touch.clientX,
      deltaY,
      deltaX,
      velocity,
      isPulling: isPullingDown,
    }));
    
    // Prevenir scroll durante pull-to-refresh
    if (isPullingDown && pullAmount > 10) {
      event.preventDefault();
    }
  }, [enabled, gestureState.isSwiping, gestureState.startY, gestureState.startX, isAtTop, pullToRefresh, calculateVelocity]);

  // Manejar fin del gesto
  const handleTouchEnd = useCallback(async (event: TouchEvent) => {
    if (!enabled || !gestureState.isSwiping) return;
    
    const { deltaY, deltaX, velocity, isPulling } = gestureState;
    const now = Date.now();
    const duration = now - startTime.current;
    
    // Detectar swipe
    if (Math.abs(deltaX) > swipe.threshold || Math.abs(deltaY) > swipe.threshold) {
      const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);
      const isFastEnough = Math.abs(velocity) > swipe.velocity;
      
      if (isFastEnough || Math.abs(deltaX) > swipe.threshold * 2 || Math.abs(deltaY) > swipe.threshold * 2) {
        let direction: 'left' | 'right' | 'up' | 'down' | null = null;
        
        if (isHorizontal && swipe.direction !== 'vertical') {
          direction = deltaX > 0 ? 'right' : 'left';
        } else if (!isHorizontal && swipe.direction !== 'horizontal') {
          direction = deltaY > 0 ? 'down' : 'up';
        }
        
        if (direction && onSwipe) {
          onSwipe(direction);
        }
      }
    }
    
    // Manejar pull-to-refresh
    if (isPulling && pullProgress >= 1 && onPullToRefresh) {
      setIsRefreshing(true);
      try {
        await onPullToRefresh();
      } catch (error) {
        console.error('Pull to refresh failed:', error);
      } finally {
        setIsRefreshing(false);
      }
    }
    
    // Resetear estado
    setGestureState(prev => ({
      ...prev,
      isSwiping: false,
      isPulling: false,
      deltaY: 0,
      deltaX: 0,
      velocity: 0,
    }));
    setPullProgress(0);
  }, [enabled, gestureState, swipe, pullProgress, onSwipe, onPullToRefresh]);

  // Configurar event listeners
  useEffect(() => {
    if (!elementRef.current) return;
    
    const element = elementRef.current;
    
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });
    
    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Hook para configurar el elemento
  const setElement = useCallback((element: HTMLElement | null) => {
    elementRef.current = element;
  }, []);

  return {
    setElement,
    isSwiping: gestureState.isSwiping,
    isPulling: gestureState.isPulling,
    isRefreshing,
    pullProgress,
    deltaY: gestureState.deltaY,
    deltaX: gestureState.deltaX,
    velocity: gestureState.velocity,
  };
};

export default useMobileGestures;
