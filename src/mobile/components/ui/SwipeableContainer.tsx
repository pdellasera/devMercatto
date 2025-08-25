import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';
import useMobileGestures from '../../hooks/useMobileGestures';

interface SwipeableContainerProps {
  children: React.ReactNode;
  sections: string[];
  currentSection: number;
  onSectionChange: (index: number) => void;
  className?: string;
  showIndicators?: boolean;
  showArrows?: boolean;
}

const SwipeableContainer: React.FC<SwipeableContainerProps> = ({
  children,
  sections,
  currentSection,
  onSectionChange,
  className,
  showIndicators = true,
  showArrows = true,
}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Configurar gestos
  const { setElement, isSwiping, deltaX } = useMobileGestures({
    swipe: {
      threshold: 50,
      velocity: 0.3,
      direction: 'horizontal',
    },
    onSwipe: (direction) => {
      if (isTransitioning) return;
      
      let newIndex = currentSection;
      if (direction === 'left' && currentSection < sections.length - 1) {
        newIndex = currentSection + 1;
      } else if (direction === 'right' && currentSection > 0) {
        newIndex = currentSection - 1;
      }
      
      if (newIndex !== currentSection) {
        handleSectionChange(newIndex);
      }
    },
  });

  // Configurar elemento para gestos
  useEffect(() => {
    if (containerRef.current) {
      setElement(containerRef.current);
    }
  }, [setElement]);

  const handleSectionChange = (index: number) => {
    setIsTransitioning(true);
    onSectionChange(index);
    
    // Resetear transición después de la animación
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  const goToPrevious = () => {
    if (currentSection > 0 && !isTransitioning) {
      handleSectionChange(currentSection - 1);
    }
  };

  const goToNext = () => {
    if (currentSection < sections.length - 1 && !isTransitioning) {
      handleSectionChange(currentSection + 1);
    }
  };

  return (
    <div className={cn('relative w-full', className)}>
      {/* Contenedor principal con gestos */}
      <div
        ref={containerRef}
        className={cn(
          'relative overflow-hidden',
          isSwiping && 'transition-none',
          !isSwiping && 'transition-transform duration-300 ease-out'
        )}
        style={{
          transform: isSwiping ? `translateX(${deltaX}px)` : 'translateX(0)',
        }}
      >
        {children}
      </div>

      {/* Indicadores de sección */}
      {showIndicators && sections.length > 1 && (
        <div className="flex items-center justify-center gap-mobile-sm mt-mobile-md">
          {sections.map((_, index) => (
            <button
              key={index}
              onClick={() => handleSectionChange(index)}
              className={cn(
                'w-2 h-2 rounded-full transition-all duration-200 mobile-touch-feedback',
                index === currentSection
                  ? 'bg-primary-500 scale-125'
                  : 'bg-neutral-600 hover:bg-neutral-500'
              )}
              disabled={isTransitioning}
            />
          ))}
        </div>
      )}

      {/* Flechas de navegación */}
      {showArrows && sections.length > 1 && (
        <>
          {/* Flecha izquierda */}
          {currentSection > 0 && (
            <button
              onClick={goToPrevious}
              disabled={isTransitioning}
              className={cn(
                'absolute left-mobile-sm top-1/2 -translate-y-1/2 z-10',
                'p-mobile-sm rounded-full bg-neutral-900/80 backdrop-blur-sm',
                'border border-white/20 text-white',
                'hover:bg-neutral-800/90 transition-colors mobile-touch-feedback',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Flecha derecha */}
          {currentSection < sections.length - 1 && (
            <button
              onClick={goToNext}
              disabled={isTransitioning}
              className={cn(
                'absolute right-mobile-sm top-1/2 -translate-y-1/2 z-10',
                'p-mobile-sm rounded-full bg-neutral-900/80 backdrop-blur-sm',
                'border border-white/20 text-white',
                'hover:bg-neutral-800/90 transition-colors mobile-touch-feedback',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </>
      )}

      {/* Indicador de progreso */}
      <div className="mt-mobile-sm">
        <div className="w-full bg-neutral-800 rounded-full h-1">
          <div
            className="bg-primary-500 h-1 rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${((currentSection + 1) / sections.length) * 100}%`,
            }}
          />
        </div>
        <div className="flex justify-between text-mobile-xs text-neutral-400 mt-mobile-xs">
          <span>{sections[currentSection]}</span>
          <span>{currentSection + 1} de {sections.length}</span>
        </div>
      </div>
    </div>
  );
};

export default SwipeableContainer;
