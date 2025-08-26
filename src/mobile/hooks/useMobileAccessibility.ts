import { useState, useEffect, useCallback, useRef } from 'react';

interface AccessibilitySettings {
  screenReaderEnabled: boolean;
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  voiceCommands: boolean;
  keyboardNavigation: boolean;
  focusVisible: boolean;
}

interface UseMobileAccessibilityOptions {
  enableScreenReader?: boolean;
  enableVoiceCommands?: boolean;
  enableKeyboardNavigation?: boolean;
  onSettingsChange?: (settings: AccessibilitySettings) => void;
}

interface UseMobileAccessibilityReturn {
  settings: AccessibilitySettings;
  isScreenReaderActive: boolean;
  isVoiceCommandsSupported: boolean;
  isKeyboardNavigationSupported: boolean;
  announceToScreenReader: (message: string, priority?: 'polite' | 'assertive') => void;
  setFocus: (elementId: string) => void;
  updateSettings: (newSettings: Partial<AccessibilitySettings>) => void;
  resetSettings: () => void;
  getAccessibilityClassNames: () => string;
}

const useMobileAccessibility = (
  options: UseMobileAccessibilityOptions = {}
): UseMobileAccessibilityReturn => {
  const {
    enableScreenReader = true,
    enableVoiceCommands = true,
    enableKeyboardNavigation = true,
    onSettingsChange,
  } = options;

  const [settings, setSettings] = useState<AccessibilitySettings>({
    screenReaderEnabled: true,
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    voiceCommands: false,
    keyboardNavigation: true,
    focusVisible: true,
  });

  const [isScreenReaderActive, setIsScreenReaderActive] = useState(false);
  const [isVoiceCommandsSupported, setIsVoiceCommandsSupported] = useState(false);
  const [isKeyboardNavigationSupported, setIsKeyboardNavigationSupported] = useState(false);
  
  const liveRegionRef = useRef<HTMLDivElement | null>(null);
  const focusHistoryRef = useRef<string[]>([]);
  const onSettingsChangeRef = useRef(onSettingsChange);

  // Actualizar la referencia del callback
  useEffect(() => {
    onSettingsChangeRef.current = onSettingsChange;
  }, [onSettingsChange]);

  // Verificar soporte de tecnologías de accesibilidad
  useEffect(() => {
    // Detectar screen reader
    const detectScreenReader = () => {
      const isScreenReader = 
        'speechSynthesis' in window ||
        'webkitSpeechSynthesis' in window ||
        document.querySelector('[aria-live]') !== null;
      
      setIsScreenReaderActive(isScreenReader);
    };

    // Detectar soporte de comandos de voz
    const detectVoiceCommands = () => {
      const isSupported = 
        'webkitSpeechRecognition' in window ||
        'SpeechRecognition' in window;
      
      setIsVoiceCommandsSupported(isSupported);
    };

    // Detectar navegación por teclado
    const detectKeyboardNavigation = () => {
      const isSupported = true; // Siempre soportado en navegadores modernos
      setIsKeyboardNavigationSupported(isSupported);
    };

    detectScreenReader();
    detectVoiceCommands();
    detectKeyboardNavigation();
  }, []);

  // Crear región live para anuncios
  useEffect(() => {
    if (!liveRegionRef.current) {
      const liveRegion = document.createElement('div');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.style.position = 'absolute';
      liveRegion.style.left = '-10000px';
      liveRegion.style.width = '1px';
      liveRegion.style.height = '1px';
      liveRegion.style.overflow = 'hidden';
      liveRegionRef.current = liveRegion;
      document.body.appendChild(liveRegion);
    }

    return () => {
      if (liveRegionRef.current) {
        document.body.removeChild(liveRegionRef.current);
        liveRegionRef.current = null;
      }
    };
  }, []);

  // Anunciar mensaje al screen reader
  const announceToScreenReader = useCallback((
    message: string, 
    priority: 'polite' | 'assertive' = 'polite'
  ) => {
    if (!liveRegionRef.current || !settings.screenReaderEnabled) return;

    // Limpiar mensajes anteriores
    liveRegionRef.current.innerHTML = '';
    
    // Configurar prioridad
    liveRegionRef.current.setAttribute('aria-live', priority);
    
    // Anunciar mensaje
    liveRegionRef.current.textContent = message;

    // Limpiar después de un tiempo
    setTimeout(() => {
      if (liveRegionRef.current) {
        liveRegionRef.current.innerHTML = '';
      }
    }, 1000);
  }, [settings.screenReaderEnabled]);

  // Establecer foco en elemento
  const setFocus = useCallback((elementId: string) => {
    const element = document.getElementById(elementId);
    if (element && settings.keyboardNavigation) {
      // Guardar en historial
      focusHistoryRef.current.push(elementId);
      if (focusHistoryRef.current.length > 10) {
        focusHistoryRef.current.shift();
      }
      
      // Establecer foco
      element.focus();
      
      // Anunciar al screen reader
      const label = element.getAttribute('aria-label') || 
                   element.getAttribute('title') || 
                   element.textContent || 
                   'Elemento enfocado';
      announceToScreenReader(label);
    }
  }, [settings.keyboardNavigation, announceToScreenReader]);

  // Actualizar configuraciones
  const updateSettings = useCallback((newSettings: Partial<AccessibilitySettings>) => {
    setSettings(prevSettings => {
      const updatedSettings = { ...prevSettings, ...newSettings };
      
      // Aplicar cambios inmediatamente
      if (newSettings.highContrast !== undefined) {
        document.documentElement.classList.toggle('high-contrast', newSettings.highContrast);
      }
      
      if (newSettings.largeText !== undefined) {
        document.documentElement.classList.toggle('large-text', newSettings.largeText);
      }
      
      if (newSettings.reducedMotion !== undefined) {
        document.documentElement.classList.toggle('reduced-motion', newSettings.reducedMotion);
      }
      
      if (newSettings.focusVisible !== undefined) {
        document.documentElement.classList.toggle('focus-visible', newSettings.focusVisible);
      }
      
      // Notificar cambios
      onSettingsChangeRef.current?.(updatedSettings);
      
      // Anunciar cambios al screen reader
      if (newSettings.highContrast !== undefined) {
        announceToScreenReader(
          newSettings.highContrast ? 'Alto contraste activado' : 'Alto contraste desactivado'
        );
      }
      
      if (newSettings.largeText !== undefined) {
        announceToScreenReader(
          newSettings.largeText ? 'Texto grande activado' : 'Texto grande desactivado'
        );
      }
      
      return updatedSettings;
    });
  }, [announceToScreenReader]);

  // Resetear configuraciones
  const resetSettings = useCallback(() => {
    const defaultSettings: AccessibilitySettings = {
      screenReaderEnabled: true,
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      voiceCommands: false,
      keyboardNavigation: true,
      focusVisible: true,
    };
    
    setSettings(defaultSettings);
    
    // Limpiar clases
    document.documentElement.classList.remove('high-contrast', 'large-text', 'reduced-motion', 'focus-visible');
    
    onSettingsChangeRef.current?.(defaultSettings);
    announceToScreenReader('Configuraciones de accesibilidad restablecidas');
  }, [announceToScreenReader]);

  // Obtener clases CSS para accesibilidad
  const getAccessibilityClassNames = useCallback(() => {
    const classes = [];
    
    if (settings.highContrast) classes.push('high-contrast');
    if (settings.largeText) classes.push('large-text');
    if (settings.reducedMotion) classes.push('reduced-motion');
    if (settings.focusVisible) classes.push('focus-visible');
    if (settings.keyboardNavigation) classes.push('keyboard-navigation');
    
    return classes.join(' ');
  }, [settings]);

  // Detectar preferencias del sistema (separado para evitar loop infinito)
  useEffect(() => {
    const mediaQueryReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mediaQueryHighContrast = window.matchMedia('(prefers-contrast: high)');
    
    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setSettings(prevSettings => ({
        ...prevSettings,
        reducedMotion: e.matches
      }));
    };
    
    const handleHighContrastChange = (e: MediaQueryListEvent) => {
      setSettings(prevSettings => ({
        ...prevSettings,
        highContrast: e.matches
      }));
    };
    
    // Aplicar preferencias iniciales
    setSettings(prevSettings => ({
      ...prevSettings,
      reducedMotion: mediaQueryReducedMotion.matches,
      highContrast: mediaQueryHighContrast.matches,
    }));
    
    // Escuchar cambios
    mediaQueryReducedMotion.addEventListener('change', handleReducedMotionChange);
    mediaQueryHighContrast.addEventListener('change', handleHighContrastChange);
    
    return () => {
      mediaQueryReducedMotion.removeEventListener('change', handleReducedMotionChange);
      mediaQueryHighContrast.removeEventListener('change', handleHighContrastChange);
    };
  }, []);

  return {
    settings,
    isScreenReaderActive,
    isVoiceCommandsSupported,
    isKeyboardNavigationSupported,
    announceToScreenReader,
    setFocus,
    updateSettings,
    resetSettings,
    getAccessibilityClassNames,
  };
};

export default useMobileAccessibility;
