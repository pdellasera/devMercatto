import { useState, useEffect } from 'react';

// Definir breakpoints que coinciden con Tailwind config
const BREAKPOINTS = {
  xs: 375,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

type Breakpoint = keyof typeof BREAKPOINTS;

interface BreakpointState {
  current: Breakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
  height: number;
}

export const useMobileBreakpoint = (): BreakpointState => {
  const [breakpointState, setBreakpointState] = useState<BreakpointState>({
    current: 'xs',
    isMobile: true,
    isTablet: false,
    isDesktop: false,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Determinar breakpoint actual
      let current: Breakpoint = 'xs';
      
      if (width >= BREAKPOINTS['2xl']) current = '2xl';
      else if (width >= BREAKPOINTS.xl) current = 'xl';
      else if (width >= BREAKPOINTS.lg) current = 'lg';
      else if (width >= BREAKPOINTS.md) current = 'md';
      else if (width >= BREAKPOINTS.sm) current = 'sm';
      else current = 'xs';

      // Determinar categorías de dispositivo
      const isMobile = width < BREAKPOINTS.md;
      const isTablet = width >= BREAKPOINTS.md && width < BREAKPOINTS.lg;
      const isDesktop = width >= BREAKPOINTS.lg;

      setBreakpointState({
        current,
        isMobile,
        isTablet,
        isDesktop,
        width,
        height,
      });
    };

    // Actualizar inmediatamente
    updateBreakpoint();

    // Escuchar cambios de tamaño
    window.addEventListener('resize', updateBreakpoint);
    window.addEventListener('orientationchange', updateBreakpoint);

    return () => {
      window.removeEventListener('resize', updateBreakpoint);
      window.removeEventListener('orientationchange', updateBreakpoint);
    };
  }, []);

  return breakpointState;
};

// Hook para detectar si estamos en un dispositivo móvil real
export const useIsMobileDevice = (): boolean => {
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    const checkMobileDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      setIsMobileDevice(isMobile || isTouchDevice);
    };

    checkMobileDevice();
  }, []);

  return isMobileDevice;
};

// Hook para detectar orientación del dispositivo
export const useOrientation = (): 'portrait' | 'landscape' => {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    const updateOrientation = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };

    updateOrientation();
    window.addEventListener('resize', updateOrientation);
    window.addEventListener('orientationchange', updateOrientation);

    return () => {
      window.removeEventListener('resize', updateOrientation);
      window.removeEventListener('orientationchange', updateOrientation);
    };
  }, []);

  return orientation;
};

// Hook para detectar si el dispositivo está en modo oscuro
export const useDarkMode = (): boolean => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const updateDarkMode = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsDarkMode(e.matches);
    };

    updateDarkMode(mediaQuery);
    mediaQuery.addEventListener('change', updateDarkMode);

    return () => {
      mediaQuery.removeEventListener('change', updateDarkMode);
    };
  }, []);

  return isDarkMode;
};

// Hook para detectar si el usuario prefiere movimiento reducido
export const useReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const updateReducedMotion = (e: MediaQueryListEvent | MediaQueryList) => {
      setPrefersReducedMotion(e.matches);
    };

    updateReducedMotion(mediaQuery);
    mediaQuery.addEventListener('change', updateReducedMotion);

    return () => {
      mediaQuery.removeEventListener('change', updateReducedMotion);
    };
  }, []);

  return prefersReducedMotion;
};

// Utilidades para breakpoints
export const isBreakpoint = (breakpoint: Breakpoint): boolean => {
  const { current } = useMobileBreakpoint();
  const breakpointOrder: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
  const currentIndex = breakpointOrder.indexOf(current);
  const targetIndex = breakpointOrder.indexOf(breakpoint);
  
  return currentIndex >= targetIndex;
};

export const isBreakpointUp = (breakpoint: Breakpoint): boolean => {
  return isBreakpoint(breakpoint);
};

export const isBreakpointDown = (breakpoint: Breakpoint): boolean => {
  const { current } = useMobileBreakpoint();
  const breakpointOrder: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
  const currentIndex = breakpointOrder.indexOf(current);
  const targetIndex = breakpointOrder.indexOf(breakpoint);
  
  return currentIndex < targetIndex;
};

export const isBreakpointBetween = (start: Breakpoint, end: Breakpoint): boolean => {
  return isBreakpointUp(start) && isBreakpointDown(end);
};
