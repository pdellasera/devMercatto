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

// Hooks de performance
export { default as useMobileImageLazy } from './useMobileImageLazy';
export { default as useMobileDebounce, useMobileDebouncedCallback } from './useMobileDebounce';
export { default as useMobileVirtualScroll } from './useMobileVirtualScroll';
export { default as useMobilePerformanceMetrics } from './useMobilePerformanceMetrics';

// Hooks de accesibilidad
export { default as useMobileAccessibility } from './useMobileAccessibility';
export { default as useMobileVoiceCommands } from './useMobileVoiceCommands';
export { default as useMobileKeyboardNavigation } from './useMobileKeyboardNavigation';

// Tipos comunes
export type {
  BreakpointState,
  GestureState,
  NavigationState,
  PerformanceMetrics,
} from './types';
