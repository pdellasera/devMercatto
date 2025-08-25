import { useState, useEffect, useCallback, useRef } from 'react';

interface GeolocationPosition {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
  timestamp: number;
}

interface GeolocationError {
  code: number;
  message: string;
}

interface UseMobileGeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  watchPosition?: boolean;
  onSuccess?: (position: GeolocationPosition) => void;
  onError?: (error: GeolocationError) => void;
}

interface UseMobileGeolocationReturn {
  position: GeolocationPosition | null;
  error: GeolocationError | null;
  isLoading: boolean;
  isSupported: boolean;
  isWatching: boolean;
  getCurrentPosition: () => Promise<GeolocationPosition>;
  startWatching: () => void;
  stopWatching: () => void;
  clearPosition: () => void;
}

const useMobileGeolocation = (
  options: UseMobileGeolocationOptions = {}
): UseMobileGeolocationReturn => {
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 60000,
    watchPosition = false,
    onSuccess,
    onError,
  } = options;

  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<GeolocationError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isWatching, setIsWatching] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  
  const watchIdRef = useRef<number | null>(null);

  // Verificar soporte de geolocalización
  useEffect(() => {
    setIsSupported('geolocation' in navigator);
  }, []);

  // Función para convertir posición del navegador a nuestro formato
  const convertPosition = useCallback((geolocationPosition: GeolocationPosition): GeolocationPosition => {
    return {
      latitude: geolocationPosition.coords.latitude,
      longitude: geolocationPosition.coords.longitude,
      accuracy: geolocationPosition.coords.accuracy,
      altitude: geolocationPosition.coords.altitude,
      altitudeAccuracy: geolocationPosition.coords.altitudeAccuracy,
      heading: geolocationPosition.coords.heading,
      speed: geolocationPosition.coords.speed,
      timestamp: geolocationPosition.timestamp,
    };
  }, []);

  // Función para manejar éxito de geolocalización
  const handleSuccess = useCallback((geolocationPosition: GeolocationPosition) => {
    const convertedPosition = convertPosition(geolocationPosition);
    setPosition(convertedPosition);
    setError(null);
    setIsLoading(false);
    onSuccess?.(convertedPosition);
  }, [convertPosition, onSuccess]);

  // Función para manejar error de geolocalización
  const handleError = useCallback((geolocationError: GeolocationPositionError) => {
    const error: GeolocationError = {
      code: geolocationError.code,
      message: geolocationError.message,
    };
    setError(error);
    setIsLoading(false);
    setIsWatching(false);
    onError?.(error);
  }, [onError]);

  // Obtener posición actual
  const getCurrentPosition = useCallback((): Promise<GeolocationPosition> => {
    if (!isSupported) {
      return Promise.reject(new Error('Geolocalización no soportada'));
    }

    setIsLoading(true);
    setError(null);

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (geolocationPosition) => {
          const convertedPosition = convertPosition(geolocationPosition);
          handleSuccess(geolocationPosition);
          resolve(convertedPosition);
        },
        (geolocationError) => {
          handleError(geolocationError);
          reject(geolocationError);
        },
        {
          enableHighAccuracy,
          timeout,
          maximumAge,
        }
      );
    });
  }, [isSupported, enableHighAccuracy, timeout, maximumAge, convertPosition, handleSuccess, handleError]);

  // Iniciar watching de posición
  const startWatching = useCallback(() => {
    if (!isSupported || isWatching) return;

    setIsLoading(true);
    setError(null);
    setIsWatching(true);

    watchIdRef.current = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      {
        enableHighAccuracy,
        timeout,
        maximumAge,
      }
    );
  }, [isSupported, isWatching, enableHighAccuracy, timeout, maximumAge, handleSuccess, handleError]);

  // Detener watching de posición
  const stopWatching = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      setIsWatching(false);
    }
  }, []);

  // Limpiar posición
  const clearPosition = useCallback(() => {
    setPosition(null);
    setError(null);
    setIsLoading(false);
  }, []);

  // Iniciar watching automáticamente si está habilitado
  useEffect(() => {
    if (watchPosition && isSupported && !isWatching) {
      startWatching();
    }

    return () => {
      stopWatching();
    };
  }, [watchPosition, isSupported, isWatching, startWatching, stopWatching]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      stopWatching();
    };
  }, [stopWatching]);

  return {
    position,
    error,
    isLoading,
    isSupported,
    isWatching,
    getCurrentPosition,
    startWatching,
    stopWatching,
    clearPosition,
  };
};

export default useMobileGeolocation;
