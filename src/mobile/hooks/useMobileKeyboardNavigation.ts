import { useState, useEffect, useCallback, useRef } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  action: () => void;
  description: string;
  category: string;
}

interface UseMobileKeyboardNavigationOptions {
  enabled?: boolean;
  onShortcutTriggered?: (shortcut: KeyboardShortcut) => void;
  onError?: (error: string) => void;
}

interface UseMobileKeyboardNavigationReturn {
  isEnabled: boolean;
  shortcuts: KeyboardShortcut[];
  addShortcut: (shortcut: KeyboardShortcut) => void;
  removeShortcut: (key: string) => void;
  clearShortcuts: () => void;
  getShortcutsByCategory: (category: string) => KeyboardShortcut[];
  enableNavigation: () => void;
  disableNavigation: () => void;
}

const useMobileKeyboardNavigation = (
  options: UseMobileKeyboardNavigationOptions = {}
): UseMobileKeyboardNavigationReturn => {
  const {
    enabled = true,
    onShortcutTriggered,
    onError,
  } = options;

  const [isEnabled, setIsEnabled] = useState(enabled);
  const [shortcuts, setShortcuts] = useState<KeyboardShortcut[]>([]);
  
  const isListeningRef = useRef(false);

  // Verificar si las teclas coinciden
  const keysMatch = useCallback((event: KeyboardEvent, shortcut: KeyboardShortcut): boolean => {
    return (
      event.key.toLowerCase() === shortcut.key.toLowerCase() &&
      !!event.ctrlKey === !!shortcut.ctrlKey &&
      !!event.shiftKey === !!shortcut.shiftKey &&
      !!event.altKey === !!shortcut.altKey &&
      !!event.metaKey === !!shortcut.metaKey
    );
  }, []);

  // Manejar evento de teclado
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isEnabled || !isListeningRef.current) return;

    // Evitar shortcuts en campos de entrada
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.tagName === 'SELECT' ||
      target.contentEditable === 'true'
    ) {
      return;
    }

    // Buscar shortcut que coincida
    const matchedShortcut = shortcuts.find(shortcut => keysMatch(event, shortcut));
    
    if (matchedShortcut) {
      event.preventDefault();
      event.stopPropagation();
      
      try {
        matchedShortcut.action();
        onShortcutTriggered?.(matchedShortcut);
      } catch (error) {
        onError?.(`Error ejecutando shortcut ${matchedShortcut.key}: ${error}`);
      }
    }
  }, [isEnabled, shortcuts, keysMatch, onShortcutTriggered, onError]);

  // Configurar event listeners
  useEffect(() => {
    if (isEnabled) {
      document.addEventListener('keydown', handleKeyDown, true);
      isListeningRef.current = true;
    } else {
      document.removeEventListener('keydown', handleKeyDown, true);
      isListeningRef.current = false;
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      isListeningRef.current = false;
    };
  }, [isEnabled, handleKeyDown]);

  // Agregar shortcut
  const addShortcut = useCallback((shortcut: KeyboardShortcut) => {
    setShortcuts(prev => {
      // Evitar duplicados
      const exists = prev.some(s => 
        s.key === shortcut.key &&
        s.ctrlKey === shortcut.ctrlKey &&
        s.shiftKey === shortcut.shiftKey &&
        s.altKey === shortcut.altKey &&
        s.metaKey === shortcut.metaKey
      );
      
      if (exists) return prev;
      
      return [...prev, shortcut];
    });
  }, []);

  // Remover shortcut
  const removeShortcut = useCallback((key: string) => {
    setShortcuts(prev => prev.filter(s => s.key !== key));
  }, []);

  // Limpiar shortcuts
  const clearShortcuts = useCallback(() => {
    setShortcuts([]);
  }, []);

  // Obtener shortcuts por categoría
  const getShortcutsByCategory = useCallback((category: string) => {
    return shortcuts.filter(s => s.category === category);
  }, [shortcuts]);

  // Habilitar navegación
  const enableNavigation = useCallback(() => {
    setIsEnabled(true);
  }, []);

  // Deshabilitar navegación
  const disableNavigation = useCallback(() => {
    setIsEnabled(false);
  }, []);

  // Shortcuts por defecto
  useEffect(() => {
    if (shortcuts.length === 0) {
      const defaultShortcuts: KeyboardShortcut[] = [
        {
          key: 'h',
          action: () => {
            window.location.href = '/mobile';
          },
          description: 'Ir al inicio',
          category: 'navegación',
        },
        {
          key: 'p',
          action: () => {
            window.location.href = '/mobile/prospects';
          },
          description: 'Ir a prospectos',
          category: 'navegación',
        },
        {
          key: 'f',
          action: () => {
            const searchInput = document.querySelector('input[type="search"], input[placeholder*="buscar"]') as HTMLInputElement;
            if (searchInput) {
              searchInput.focus();
            }
          },
          description: 'Enfocar búsqueda',
          category: 'navegación',
        },
        {
          key: 'Escape',
          action: () => {
            // Cerrar modales o dropdowns
            const modals = document.querySelectorAll('[role="dialog"], [data-modal]');
            modals.forEach(modal => {
              const closeButton = modal.querySelector('[aria-label*="cerrar"], [aria-label*="close"]') as HTMLElement;
              if (closeButton) {
                closeButton.click();
              }
            });
          },
          description: 'Cerrar modal/dropdown',
          category: 'sistema',
        },
        {
          key: '?',
          action: () => {
            // Mostrar ayuda de shortcuts
            const helpText = shortcuts.map(s => `${s.key}: ${s.description}`).join('\n');
            console.log('Shortcuts disponibles:', helpText);
          },
          description: 'Mostrar ayuda',
          category: 'sistema',
        },
        {
          key: 'Tab',
          action: () => {
            // Navegación por tab ya está manejada por el navegador
          },
          description: 'Navegar por elementos',
          category: 'navegación',
        },
        {
          key: 'Enter',
          action: () => {
            // Activar elemento enfocado
            const focusedElement = document.activeElement as HTMLElement;
            if (focusedElement && focusedElement.click) {
              focusedElement.click();
            }
          },
          description: 'Activar elemento',
          category: 'navegación',
        },
        {
          key: ' ',
          action: () => {
            // Espacio para activar botones
            const focusedElement = document.activeElement as HTMLElement;
            if (focusedElement && focusedElement.tagName === 'BUTTON') {
              focusedElement.click();
            }
          },
          description: 'Activar botón',
          category: 'navegación',
        },
      ];
      
      defaultShortcuts.forEach(shortcut => addShortcut(shortcut));
    }
  }, [shortcuts.length, addShortcut]);

  return {
    isEnabled,
    shortcuts,
    addShortcut,
    removeShortcut,
    clearShortcuts,
    getShortcutsByCategory,
    enableNavigation,
    disableNavigation,
  };
};

export default useMobileKeyboardNavigation;
