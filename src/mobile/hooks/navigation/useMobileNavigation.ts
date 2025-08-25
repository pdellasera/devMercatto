import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavigationState {
  currentRoute: string;
  previousRoute: string | null;
  isTransitioning: boolean;
  direction: 'forward' | 'backward' | null;
  canGoBack: boolean;
}

interface NavigationOptions {
  enableSwipeBack?: boolean;
  enablePullToRefresh?: boolean;
  transitionDuration?: number;
  swipeThreshold?: number;
}

export const useMobileNavigation = (options?: NavigationOptions) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [navigationState, setNavigationState] = useState<NavigationState>({
    currentRoute: location.pathname,
    previousRoute: null,
    isTransitioning: false,
    direction: null,
    canGoBack: false,
  });

  const navigationHistoryRef = useRef<string[]>([]);
  const isTransitioningRef = useRef(false);

  const config = {
    enableSwipeBack: true,
    enablePullToRefresh: true,
    transitionDuration: 300,
    swipeThreshold: 100,
    ...options,
  };

  // Actualizar historial de navegación
  useEffect(() => {
    const currentPath = location.pathname;
    
    if (currentPath !== navigationState.currentRoute) {
      setNavigationState(prev => ({
        currentRoute: currentPath,
        previousRoute: prev.currentRoute,
        isTransitioning: true,
        direction: 'forward',
        canGoBack: navigationHistoryRef.current.length > 0,
      }));

      navigationHistoryRef.current.push(currentPath);

      // Reset transition state
      setTimeout(() => {
        setNavigationState(prev => ({
          ...prev,
          isTransitioning: false,
          direction: null,
        }));
        isTransitioningRef.current = false;
      }, config.transitionDuration);
    }
  }, [location.pathname, navigationState.currentRoute, config.transitionDuration]);

  // Navegar a una ruta
  const navigateTo = useCallback((path: string, direction: 'forward' | 'backward' = 'forward') => {
    if (isTransitioningRef.current) return;

    isTransitioningRef.current = true;
    setNavigationState(prev => ({
      ...prev,
      isTransitioning: true,
      direction,
    }));

    navigate(path);
  }, [navigate]);

  // Navegar hacia atrás
  const goBack = useCallback(() => {
    if (isTransitioningRef.current || !navigationState.canGoBack) return;

    isTransitioningRef.current = true;
    setNavigationState(prev => ({
      ...prev,
      isTransitioning: true,
      direction: 'backward',
    }));

    navigate(-1);
  }, [navigate, navigationState.canGoBack]);

  // Navegar hacia adelante
  const goForward = useCallback(() => {
    if (isTransitioningRef.current) return;

    isTransitioningRef.current = true;
    setNavigationState(prev => ({
      ...prev,
      isTransitioning: true,
      direction: 'forward',
    }));

    navigate(1);
  }, [navigate]);

  // Navegar a la ruta anterior
  const goToPrevious = useCallback(() => {
    if (isTransitioningRef.current || !navigationState.previousRoute) return;

    isTransitioningRef.current = true;
    setNavigationState(prev => ({
      ...prev,
      isTransitioning: true,
      direction: 'backward',
    }));

    navigate(navigationState.previousRoute);
  }, [navigate, navigationState.previousRoute]);

  // Navegar a la raíz
  const goToRoot = useCallback(() => {
    if (isTransitioningRef.current) return;

    isTransitioningRef.current = true;
    setNavigationState(prev => ({
      ...prev,
      isTransitioning: true,
      direction: 'backward',
    }));

    navigate('/');
  }, [navigate]);

  // Navegar a una ruta específica con animación
  const navigateWithAnimation = useCallback((
    path: string, 
    animation: 'slide-left' | 'slide-right' | 'fade' | 'scale' = 'slide-left'
  ) => {
    if (isTransitioningRef.current) return;

    isTransitioningRef.current = true;
    setNavigationState(prev => ({
      ...prev,
      isTransitioning: true,
      direction: 'forward',
    }));

    // Aplicar clase de animación al body
    document.body.classList.add(`mobile-nav-${animation}`);

    setTimeout(() => {
      navigate(path);
      document.body.classList.remove(`mobile-nav-${animation}`);
    }, 50);
  }, [navigate]);

  // Hook para swipe back
  const useSwipeBack = useCallback((elementRef: React.RefObject<HTMLElement>) => {
    useEffect(() => {
      if (!config.enableSwipeBack) return;

      const element = elementRef.current;
      if (!element) return;

      let startX = 0;
      let currentX = 0;
      let isSwiping = false;

      const handleTouchStart = (e: TouchEvent) => {
        const touch = e.touches[0];
        startX = touch.clientX;
        isSwiping = true;
      };

      const handleTouchMove = (e: TouchEvent) => {
        if (!isSwiping) return;

        const touch = e.touches[0];
        currentX = touch.clientX;
        const deltaX = currentX - startX;

        // Solo permitir swipe desde el borde izquierdo
        if (startX <= 50 && deltaX > 0) {
          e.preventDefault();
          
          // Aplicar transformación visual
          const progress = Math.min(deltaX / config.swipeThreshold!, 1);
          element.style.transform = `translateX(${progress * 100}%)`;
          element.style.opacity = `${1 - progress * 0.3}`;
        }
      };

      const handleTouchEnd = (e: TouchEvent) => {
        if (!isSwiping) return;

        const deltaX = currentX - startX;
        
        if (deltaX >= config.swipeThreshold! && startX <= 50) {
          // Swipe completado, ir hacia atrás
          goBack();
        } else {
          // Reset transformación
          element.style.transform = '';
          element.style.opacity = '';
        }

        isSwiping = false;
      };

      element.addEventListener('touchstart', handleTouchStart, { passive: false });
      element.addEventListener('touchmove', handleTouchMove, { passive: false });
      element.addEventListener('touchend', handleTouchEnd, { passive: false });

      return () => {
        element.removeEventListener('touchstart', handleTouchStart);
        element.removeEventListener('touchmove', handleTouchMove);
        element.removeEventListener('touchend', handleTouchEnd);
      };
    }, [config.enableSwipeBack, config.swipeThreshold, goBack]);
  }, [config.enableSwipeBack, config.swipeThreshold, goBack]);

  // Hook para pull to refresh
  const usePullToRefresh = useCallback((
    elementRef: React.RefObject<HTMLElement>,
    onRefresh?: () => void | Promise<void>
  ) => {
    useEffect(() => {
      if (!config.enablePullToRefresh) return;

      const element = elementRef.current;
      if (!element) return;

      let startY = 0;
      let currentY = 0;
      let isPulling = false;
      let refreshIndicator: HTMLElement | null = null;

      const createRefreshIndicator = () => {
        const indicator = document.createElement('div');
        indicator.className = 'mobile-pull-refresh-indicator';
        indicator.innerHTML = `
          <div class="mobile-pull-refresh-content">
            <div class="mobile-pull-refresh-spinner"></div>
            <span class="mobile-pull-refresh-text">Desliza para actualizar</span>
          </div>
        `;
        return indicator;
      };

      const handleTouchStart = (e: TouchEvent) => {
        const touch = e.touches[0];
        startY = touch.clientY;
        isPulling = false;
      };

      const handleTouchMove = (e: TouchEvent) => {
        const touch = e.touches[0];
        currentY = touch.clientY;
        const deltaY = currentY - startY;

        // Solo permitir pull desde el top
        if (element.scrollTop <= 0 && deltaY > 0) {
          e.preventDefault();
          isPulling = true;

          if (!refreshIndicator) {
            refreshIndicator = createRefreshIndicator();
            element.insertBefore(refreshIndicator, element.firstChild);
          }

          const progress = Math.min(deltaY / 150, 1);
          refreshIndicator.style.transform = `translateY(${progress * 100}%)`;
          refreshIndicator.style.opacity = `${progress}`;
        }
      };

      const handleTouchEnd = async (e: TouchEvent) => {
        if (!isPulling) return;

        const deltaY = currentY - startY;
        
        if (deltaY >= 100) {
          // Pull completado, ejecutar refresh
          if (refreshIndicator) {
            refreshIndicator.querySelector('.mobile-pull-refresh-text')!.textContent = 'Actualizando...';
          }

          try {
            if (onRefresh) {
              await onRefresh();
            }
          } catch (error) {
            console.error('Error during pull to refresh:', error);
          }
        }

        // Reset indicator
        if (refreshIndicator) {
          refreshIndicator.style.transform = '';
          refreshIndicator.style.opacity = '';
          setTimeout(() => {
            if (refreshIndicator && refreshIndicator.parentNode) {
              refreshIndicator.parentNode.removeChild(refreshIndicator);
            }
            refreshIndicator = null;
          }, 300);
        }

        isPulling = false;
      };

      element.addEventListener('touchstart', handleTouchStart, { passive: false });
      element.addEventListener('touchmove', handleTouchMove, { passive: false });
      element.addEventListener('touchend', handleTouchEnd, { passive: false });

      return () => {
        element.removeEventListener('touchstart', handleTouchStart);
        element.removeEventListener('touchmove', handleTouchMove);
        element.removeEventListener('touchend', handleTouchEnd);
      };
    }, [config.enablePullToRefresh, onRefresh]);
  }, [config.enablePullToRefresh]);

  return {
    navigationState,
    navigateTo,
    goBack,
    goForward,
    goToPrevious,
    goToRoot,
    navigateWithAnimation,
    useSwipeBack,
    usePullToRefresh,
    isTransitioning: navigationState.isTransitioning,
    canGoBack: navigationState.canGoBack,
    currentRoute: navigationState.currentRoute,
    previousRoute: navigationState.previousRoute,
  };
};
