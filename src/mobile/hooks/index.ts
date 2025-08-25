// Hooks de breakpoints y responsive
export { 
  useMobileBreakpoint, 
  useIsMobileDevice, 
  useOrientation, 
  useDarkMode, 
  useReducedMotion,
  isBreakpoint,
  isBreakpointUp,
  isBreakpointDown,
  isBreakpointBetween
} from './useMobileBreakpoint';

// Hooks de gestos
export { useMobileGestures } from './gestures/useMobileGestures';

// Hooks de navegación
export { useMobileNavigation } from './navigation/useMobileNavigation';

// Hooks de performance
export { useMobilePerformance } from './performance/useMobilePerformance';

// Hooks de loading
export { default as useMobileLoading } from './useMobileLoading';

// Hooks de offline
export { default as useMobileOffline } from './useMobileOffline';

// Hooks de haptic
export { default as useMobileHaptic } from './useMobileHaptic';

// Tipos comunes
export type {
  BreakpointState,
  GestureState,
  NavigationState,
  PerformanceMetrics,
} from './types';
