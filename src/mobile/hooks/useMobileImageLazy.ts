import { useState, useEffect, useRef, useCallback } from 'react';

interface UseMobileImageLazyOptions {
  threshold?: number;
  rootMargin?: string;
  fallbackSrc?: string;
  placeholderSrc?: string;
  onLoad?: () => void;
  onError?: () => void;
}

interface UseMobileImageLazyReturn {
  ref: React.RefObject<HTMLImageElement>;
  src: string;
  isLoading: boolean;
  hasError: boolean;
  isLoaded: boolean;
  retry: () => void;
}

const useMobileImageLazy = (
  imageSrc: string,
  options: UseMobileImageLazyOptions = {}
): UseMobileImageLazyReturn => {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    fallbackSrc = '/images/placeholder-avatar.png',
    placeholderSrc = '/images/placeholder-blur.png',
    onLoad,
    onError,
  } = options;

  const [src, setSrc] = useState<string>(placeholderSrc);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);
  
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Función para cargar la imagen
  const loadImage = useCallback(async () => {
    if (!imageSrc || isLoaded) return;

    setIsLoading(true);
    setHasError(false);

    try {
      // Crear una nueva imagen para pre-cargar
      const img = new Image();
      
      img.onload = () => {
        setSrc(imageSrc);
        setIsLoading(false);
        setIsLoaded(true);
        onLoad?.();
      };

      img.onerror = () => {
        setSrc(fallbackSrc);
        setIsLoading(false);
        setHasError(true);
        onError?.();
      };

      img.src = imageSrc;
    } catch (error) {
      setSrc(fallbackSrc);
      setIsLoading(false);
      setHasError(true);
      onError?.();
    }
  }, [imageSrc, fallbackSrc, isLoaded, onLoad, onError]);

  // Función para reintentar carga
  const retry = useCallback(() => {
    setIsLoaded(false);
    setHasError(false);
    setSrc(placeholderSrc);
    loadImage();
  }, [loadImage, placeholderSrc]);

  // Configurar Intersection Observer
  useEffect(() => {
    if (!imgRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsIntersecting(true);
            loadImage();
            // Desconectar observer una vez que la imagen está en vista
            if (observerRef.current) {
              observerRef.current.disconnect();
            }
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observerRef.current.observe(imgRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [threshold, rootMargin, loadImage]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return {
    ref: imgRef,
    src,
    isLoading,
    hasError,
    isLoaded,
    retry,
  };
};

export default useMobileImageLazy;
