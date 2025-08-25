import { useState, useEffect, useRef, useCallback } from 'react';

interface TouchPoint {
  x: number;
  y: number;
  timestamp: number;
}

interface GestureState {
  isSwiping: boolean;
  isPinching: boolean;
  isPulling: boolean;
  direction: 'left' | 'right' | 'up' | 'down' | null;
  distance: number;
  velocity: number;
}

interface SwipeConfig {
  threshold?: number;
  velocity?: number;
  direction?: 'horizontal' | 'vertical' | 'both';
}

interface PinchConfig {
  threshold?: number;
  minScale?: number;
  maxScale?: number;
}

interface PullToRefreshConfig {
  threshold?: number;
  resistance?: number;
}

export const useMobileGestures = (
  elementRef: React.RefObject<HTMLElement>,
  options?: {
    swipe?: SwipeConfig;
    pinch?: PinchConfig;
    pullToRefresh?: PullToRefreshConfig;
  }
) => {
  const [gestureState, setGestureState] = useState<GestureState>({
    isSwiping: false,
    isPinching: false,
    isPulling: false,
    direction: null,
    distance: 0,
    velocity: 0,
  });

  const touchStartRef = useRef<TouchPoint | null>(null);
  const touchEndRef = useRef<TouchPoint | null>(null);
  const initialDistanceRef = useRef<number>(0);
  const currentDistanceRef = useRef<number>(0);
  const isGestureActiveRef = useRef(false);

  // Configuración por defecto
  const swipeConfig = {
    threshold: 50,
    velocity: 0.3,
    direction: 'both' as const,
    ...options?.swipe,
  };

  const pinchConfig = {
    threshold: 10,
    minScale: 0.5,
    maxScale: 3,
    ...options?.pinch,
  };

  const pullToRefreshConfig = {
    threshold: 80,
    resistance: 0.5,
    ...options?.pullToRefresh,
  };

  // Calcular distancia entre dos puntos
  const getDistance = useCallback((point1: TouchPoint, point2: TouchPoint): number => {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  // Calcular dirección del gesto
  const getDirection = useCallback((start: TouchPoint, end: TouchPoint): 'left' | 'right' | 'up' | 'down' => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (absDx > absDy) {
      return dx > 0 ? 'right' : 'left';
    } else {
      return dy > 0 ? 'down' : 'up';
    }
  }, []);

  // Calcular velocidad del gesto
  const getVelocity = useCallback((start: TouchPoint, end: TouchPoint): number => {
    const distance = getDistance(start, end);
    const time = end.timestamp - start.timestamp;
    return time > 0 ? distance / time : 0;
  }, [getDistance]);

  // Detectar swipe
  const detectSwipe = useCallback((start: TouchPoint, end: TouchPoint) => {
    const distance = getDistance(start, end);
    const velocity = getVelocity(start, end);
    const direction = getDirection(start, end);

    const isHorizontal = direction === 'left' || direction === 'right';
    const isVertical = direction === 'up' || direction === 'down';

    const isValidSwipe = 
      distance >= swipeConfig.threshold! &&
      velocity >= swipeConfig.velocity! &&
      ((swipeConfig.direction === 'horizontal' && isHorizontal) ||
       (swipeConfig.direction === 'vertical' && isVertical) ||
       (swipeConfig.direction === 'both'));

    if (isValidSwipe) {
      setGestureState(prev => ({
        ...prev,
        isSwiping: true,
        direction,
        distance,
        velocity,
      }));

      // Disparar evento personalizado
      const swipeEvent = new CustomEvent('mobile-swipe', {
        detail: { direction, distance, velocity, start, end }
      });
      elementRef.current?.dispatchEvent(swipeEvent);
    }
  }, [getDistance, getVelocity, getDirection, swipeConfig, elementRef]);

  // Detectar pinch
  const detectPinch = useCallback((touches: TouchList) => {
    if (touches.length !== 2) return;

    const touch1 = touches[0];
    const touch2 = touches[1];
    
    const currentDistance = getDistance(
      { x: touch1.clientX, y: touch1.clientY, timestamp: Date.now() },
      { x: touch2.clientX, y: touch2.clientY, timestamp: Date.now() }
    );

    if (initialDistanceRef.current === 0) {
      initialDistanceRef.current = currentDistance;
    }

    const scale = currentDistance / initialDistanceRef.current;
    const clampedScale = Math.max(pinchConfig.minScale!, Math.min(pinchConfig.maxScale!, scale));

    if (Math.abs(scale - 1) >= pinchConfig.threshold! / 100) {
      setGestureState(prev => ({
        ...prev,
        isPinching: true,
        distance: currentDistance,
      }));

      // Disparar evento personalizado
      const pinchEvent = new CustomEvent('mobile-pinch', {
        detail: { scale: clampedScale, distance: currentDistance }
      });
      elementRef.current?.dispatchEvent(pinchEvent);
    }
  }, [getDistance, pinchConfig, elementRef]);

  // Detectar pull-to-refresh
  const detectPullToRefresh = useCallback((start: TouchPoint, current: TouchPoint) => {
    const scrollTop = elementRef.current?.scrollTop || 0;
    
    if (scrollTop <= 0 && current.y > start.y) {
      const pullDistance = (current.y - start.y) * pullToRefreshConfig.resistance!;
      
      if (pullDistance >= pullToRefreshConfig.threshold!) {
        setGestureState(prev => ({
          ...prev,
          isPulling: true,
          direction: 'down',
          distance: pullDistance,
        }));

        // Disparar evento personalizado
        const pullEvent = new CustomEvent('mobile-pull-refresh', {
          detail: { distance: pullDistance }
        });
        elementRef.current?.dispatchEvent(pullEvent);
      }
    }
  }, [pullToRefreshConfig, elementRef]);

  // Event handlers
  const handleTouchStart = useCallback((e: TouchEvent) => {
    e.preventDefault();
    
    const touch = e.touches[0];
    const touchPoint: TouchPoint = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now(),
    };

    touchStartRef.current = touchPoint;
    isGestureActiveRef.current = true;

    // Reset pinch
    if (e.touches.length === 2) {
      initialDistanceRef.current = 0;
    }

    setGestureState(prev => ({
      ...prev,
      isSwiping: false,
      isPinching: false,
      isPulling: false,
      direction: null,
      distance: 0,
      velocity: 0,
    }));
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isGestureActiveRef.current || !touchStartRef.current) return;

    const touch = e.touches[0];
    const currentPoint: TouchPoint = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now(),
    };

    // Detectar pinch
    if (e.touches.length === 2) {
      detectPinch(e.touches);
      return;
    }

    // Detectar pull-to-refresh
    detectPullToRefresh(touchStartRef.current, currentPoint);

    // Actualizar estado de swipe
    setGestureState(prev => ({
      ...prev,
      distance: getDistance(touchStartRef.current!, currentPoint),
      direction: getDirection(touchStartRef.current!, currentPoint),
    }));
  }, [detectPinch, detectPullToRefresh, getDistance, getDirection]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!isGestureActiveRef.current || !touchStartRef.current) return;

    const touch = e.changedTouches[0];
    const endPoint: TouchPoint = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now(),
    };

    touchEndRef.current = endPoint;

    // Detectar swipe
    detectSwipe(touchStartRef.current, endPoint);

    // Reset
    touchStartRef.current = null;
    touchEndRef.current = null;
    initialDistanceRef.current = 0;
    isGestureActiveRef.current = false;

    // Reset state después de un delay
    setTimeout(() => {
      setGestureState(prev => ({
        ...prev,
        isSwiping: false,
        isPinching: false,
        isPulling: false,
        direction: null,
        distance: 0,
        velocity: 0,
      }));
    }, 300);
  }, [detectSwipe]);

  // Setup event listeners
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [elementRef, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    gestureState,
    isSwiping: gestureState.isSwiping,
    isPinching: gestureState.isPinching,
    isPulling: gestureState.isPulling,
    direction: gestureState.direction,
    distance: gestureState.distance,
    velocity: gestureState.velocity,
  };
};
