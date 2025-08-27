import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isSystemTheme: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

// Función para detectar el tema del sistema
const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light'; // Fallback por defecto
};

// Función para obtener el tema resuelto (system -> light/dark)
const getResolvedTheme = (theme: Theme): 'light' | 'dark' => {
  if (theme === 'system') {
    return getSystemTheme();
  }
  return theme;
};

// Función para obtener el tema inicial (localStorage > system > default)
const getInitialTheme = (defaultTheme: Theme): Theme => {
  if (typeof window === 'undefined') {
    return defaultTheme; // SSR fallback
  }
  
  const savedTheme = localStorage.getItem('theme') as Theme;
  
  // Si existe una configuración guardada y es válida, la usamos
  if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
    return savedTheme;
  }
  
  // Si no existe localStorage, detectamos automáticamente y guardamos
  const detectedTheme = getSystemTheme();
  const systemTheme: Theme = 'system';
  
  // Guardamos la detección automática como 'system'
  localStorage.setItem('theme', systemTheme);
  
  return systemTheme;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'system', // Cambiado a 'system' para detectar automáticamente
}) => {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(getResolvedTheme(defaultTheme));
  const [isInitialized, setIsInitialized] = useState(false);

  // Inicializar tema al montar (localStorage > system > default)
  useEffect(() => {
    const initialTheme = getInitialTheme(defaultTheme);
    setThemeState(initialTheme);
    
    const resolved = getResolvedTheme(initialTheme);
    setResolvedTheme(resolved);
    
    // Aplicar tema inmediatamente
    document.documentElement.setAttribute('data-theme', resolved);
    
    // Marcar como inicializado
    setIsInitialized(true);
  }, [defaultTheme]);

  // Escuchar cambios en la preferencia del sistema
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      const newResolvedTheme = getSystemTheme();
      setResolvedTheme(newResolvedTheme);
      document.documentElement.setAttribute('data-theme', newResolvedTheme);
    };

    // Escuchar cambios en la preferencia del sistema
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Aplicar tema cuando cambie (solo después de la inicialización)
  useEffect(() => {
    if (!isInitialized) return; // No ejecutar durante la inicialización
    
    const resolved = getResolvedTheme(theme);
    setResolvedTheme(resolved);
    document.documentElement.setAttribute('data-theme', resolved);
    
    // Guardar la selección del usuario en localStorage (solo cambios manuales)
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
  }, [theme, isInitialized]);

  const toggleTheme = () => {
    setThemeState(prev => {
      if (prev === 'system') return 'light';
      if (prev === 'light') return 'dark';
      return 'system';
    });
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      resolvedTheme, 
      toggleTheme, 
      setTheme,
      isSystemTheme: theme === 'system'
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
