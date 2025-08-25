import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import useMobileImageLazy from '../../hooks/useMobileImageLazy';

interface MobileLazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  placeholderSrc?: string;
  threshold?: number;
  rootMargin?: string;
  onLoad?: () => void;
  onError?: () => void;
  className?: string;
  containerClassName?: string;
  showLoadingIndicator?: boolean;
  showErrorIndicator?: boolean;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape' | 'auto';
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

const MobileLazyImage = forwardRef<HTMLImageElement, MobileLazyImageProps>(
  (
    {
      src,
      alt,
      fallbackSrc = '/images/placeholder-avatar.png',
      placeholderSrc = '/images/placeholder-blur.png',
      threshold = 0.1,
      rootMargin = '50px',
      onLoad,
      onError,
      className,
      containerClassName,
      showLoadingIndicator = true,
      showErrorIndicator = true,
      aspectRatio = 'auto',
      objectFit = 'cover',
      ...props
    },
    ref
  ) => {
    const {
      ref: imgRef,
      src: currentSrc,
      isLoading,
      hasError,
      isLoaded,
      retry,
    } = useMobileImageLazy(src, {
      threshold,
      rootMargin,
      fallbackSrc,
      placeholderSrc,
      onLoad,
      onError,
    });

    // Combinar refs
    const combinedRef = (node: HTMLImageElement | null) => {
      if (ref) {
        if (typeof ref === 'function') {
          ref(node);
        } else {
          ref.current = node;
        }
      }
      imgRef.current = node;
    };

    const aspectRatioClasses = {
      square: 'aspect-square',
      video: 'aspect-video',
      portrait: 'aspect-[3/4]',
      landscape: 'aspect-[4/3]',
      auto: '',
    };

    const objectFitClasses = {
      cover: 'object-cover',
      contain: 'object-contain',
      fill: 'object-fill',
      none: 'object-none',
      'scale-down': 'object-scale-down',
    };

    return (
      <div
        className={cn(
          'relative overflow-hidden bg-neutral-800',
          aspectRatioClasses[aspectRatio],
          containerClassName
        )}
      >
        {/* Imagen principal */}
        <img
          ref={combinedRef}
          src={currentSrc}
          alt={alt}
          className={cn(
            'w-full h-full transition-all duration-300',
            objectFitClasses[objectFit],
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
            className
          )}
          {...props}
        />

        {/* Loading indicator */}
        {showLoadingIndicator && isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-800/50">
            <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Error indicator */}
        {showErrorIndicator && hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-800/50">
            <div className="w-8 h-8 mb-2 text-neutral-400">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <button
              onClick={retry}
              className="px-2 py-1 text-xs bg-primary-600 hover:bg-primary-700 text-white rounded transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Placeholder blur */}
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-700 to-neutral-800 animate-pulse" />
        )}
      </div>
    );
  }
);

MobileLazyImage.displayName = 'MobileLazyImage';

export default MobileLazyImage;
