import { useState, useCallback, useEffect } from 'react';

interface LoadingState {
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  retryCount: number;
  lastRetry: Date | null;
}

interface UseMobileLoadingOptions {
  initialLoading?: boolean;
  maxRetries?: number;
  retryDelay?: number;
  onRetry?: () => Promise<void>;
}

const useMobileLoading = (options: UseMobileLoadingOptions = {}) => {
  const {
    initialLoading = false,
    maxRetries = 3,
    retryDelay = 2000,
    onRetry,
  } = options;

  const [state, setState] = useState<LoadingState>({
    isLoading: initialLoading,
    isError: false,
    error: null,
    retryCount: 0,
    lastRetry: null,
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({
      ...prev,
      isLoading: loading,
      isError: false,
      error: null,
    }));
  }, []);

  const setError = useCallback((error: string) => {
    setState(prev => ({
      ...prev,
      isLoading: false,
      isError: true,
      error,
    }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      isError: false,
      error: null,
    }));
  }, []);

  const retry = useCallback(async () => {
    if (state.retryCount >= maxRetries) {
      setError(`Máximo de reintentos alcanzado (${maxRetries})`);
      return;
    }

    setState(prev => ({
      ...prev,
      isLoading: true,
      isError: false,
      error: null,
      retryCount: prev.retryCount + 1,
      lastRetry: new Date(),
    }));

    try {
      if (onRetry) {
        await onRetry();
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
    }
  }, [state.retryCount, maxRetries, onRetry, setError]);

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      isError: false,
      error: null,
      retryCount: 0,
      lastRetry: null,
    });
  }, []);

  // Auto-retry con delay
  useEffect(() => {
    if (state.isError && state.retryCount < maxRetries && onRetry) {
      const timer = setTimeout(() => {
        retry();
      }, retryDelay);

      return () => clearTimeout(timer);
    }
  }, [state.isError, state.retryCount, maxRetries, retryDelay, onRetry, retry]);

  return {
    // Estado
    isLoading: state.isLoading,
    isError: state.isError,
    error: state.error,
    retryCount: state.retryCount,
    lastRetry: state.lastRetry,
    canRetry: state.retryCount < maxRetries,

    // Acciones
    setLoading,
    setError,
    clearError,
    retry,
    reset,

    // Utilidades
    withLoading: async <T>(promise: Promise<T>): Promise<T> => {
      setLoading(true);
      clearError();
      
      try {
        const result = await promise;
        setLoading(false);
        return result;
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Error desconocido');
        throw error;
      }
    },
  };
};

export default useMobileLoading;
