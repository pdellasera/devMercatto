import { useState, useEffect, useCallback, useRef } from 'react';

interface UseMobileDebounceOptions {
  delay?: number;
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
}

function useMobileDebounce<T>(
  value: T,
  options: UseMobileDebounceOptions = {}
): T {
  const {
    delay = 300,
    leading = false,
    trailing = true,
    maxWait,
  } = options;

  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastCallTimeRef = useRef<number>(0);
  const lastValueRef = useRef<T>(value);

  const clearTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const setDebouncedValueWithTimeout = useCallback(
    (newValue: T) => {
      const now = Date.now();
      const timeSinceLastCall = now - lastCallTimeRef.current;

      // Si es la primera llamada y leading es true, actualizar inmediatamente
      if (leading && lastCallTimeRef.current === 0) {
        setDebouncedValue(newValue);
        lastValueRef.current = newValue;
      }

      // Limpiar timeout anterior
      clearTimeout();

      // Verificar maxWait
      if (maxWait && timeSinceLastCall >= maxWait) {
        setDebouncedValue(newValue);
        lastValueRef.current = newValue;
        lastCallTimeRef.current = now;
        return;
      }

      // Configurar nuevo timeout
      timeoutRef.current = setTimeout(() => {
        if (trailing) {
          setDebouncedValue(newValue);
          lastValueRef.current = newValue;
        }
        lastCallTimeRef.current = Date.now();
      }, delay);
    },
    [delay, leading, trailing, maxWait, clearTimeout]
  );

  useEffect(() => {
    if (value !== lastValueRef.current) {
      setDebouncedValueWithTimeout(value);
    }

    return () => {
      clearTimeout();
    };
  }, [value, setDebouncedValueWithTimeout, clearTimeout]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      clearTimeout();
    };
  }, [clearTimeout]);

  return debouncedValue;
}

// Hook para funciones debounced
function useMobileDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  options: UseMobileDebounceOptions = {}
): T {
  const {
    delay = 300,
    leading = false,
    trailing = true,
    maxWait,
  } = options;

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastCallTimeRef = useRef<number>(0);
  const lastArgsRef = useRef<Parameters<T> | null>(null);

  const clearTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastCall = now - lastCallTimeRef.current;

      lastArgsRef.current = args;

      // Si es la primera llamada y leading es true, ejecutar inmediatamente
      if (leading && lastCallTimeRef.current === 0) {
        callback(...args);
        lastCallTimeRef.current = now;
      }

      // Limpiar timeout anterior
      clearTimeout();

      // Verificar maxWait
      if (maxWait && timeSinceLastCall >= maxWait) {
        callback(...args);
        lastCallTimeRef.current = now;
        return;
      }

      // Configurar nuevo timeout
      timeoutRef.current = setTimeout(() => {
        if (trailing && lastArgsRef.current) {
          callback(...lastArgsRef.current);
          lastArgsRef.current = null;
        }
        lastCallTimeRef.current = Date.now();
      }, delay);
    },
    [callback, delay, leading, trailing, maxWait, clearTimeout]
  ) as T;

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      clearTimeout();
    };
  }, [clearTimeout]);

  return debouncedCallback;
}

export { useMobileDebounce, useMobileDebouncedCallback };
export default useMobileDebounce;
