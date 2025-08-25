import React from 'react';
import { cn } from '../../utils/cn';

interface MobileSkeletonProps {
  variant?: 'text' | 'avatar' | 'card' | 'button' | 'input' | 'list-item' | 'prospect-card';
  className?: string;
  width?: string | number;
  height?: string | number;
  lines?: number;
  animated?: boolean;
}

const MobileSkeleton: React.FC<MobileSkeletonProps> = ({
  variant = 'text',
  className,
  width,
  height,
  lines = 1,
  animated = true,
}) => {
  const baseClasses = cn(
    'bg-neutral-800 rounded-mobile-sm',
    animated && 'mobile-skeleton',
    className
  );

  const renderSkeleton = () => {
    switch (variant) {
      case 'text':
        return (
          <div className="space-y-mobile-xs">
            {Array.from({ length: lines }).map((_, index) => (
              <div
                key={index}
                className={cn(
                  baseClasses,
                  'h-4',
                  index === lines - 1 ? 'w-3/4' : 'w-full'
                )}
                style={{ width: width }}
              />
            ))}
          </div>
        );

      case 'avatar':
        return (
          <div
            className={cn(baseClasses, 'rounded-full')}
            style={{
              width: width || '48px',
              height: height || '48px',
            }}
          />
        );

      case 'card':
        return (
          <div className={cn(baseClasses, 'p-mobile-lg space-y-mobile-md')}>
            <div className="flex items-center gap-mobile-md">
              <div className={cn(baseClasses, 'w-12 h-12 rounded-full')} />
              <div className="flex-1 space-y-mobile-xs">
                <div className={cn(baseClasses, 'h-4 w-3/4')} />
                <div className={cn(baseClasses, 'h-3 w-1/2')} />
              </div>
            </div>
            <div className="space-y-mobile-xs">
              <div className={cn(baseClasses, 'h-3 w-full')} />
              <div className={cn(baseClasses, 'h-3 w-2/3')} />
            </div>
          </div>
        );

      case 'button':
        return (
          <div
            className={cn(baseClasses, 'h-10')}
            style={{ width: width || '120px' }}
          />
        );

      case 'input':
        return (
          <div
            className={cn(baseClasses, 'h-12')}
            style={{ width: width || '100%' }}
          />
        );

      case 'list-item':
        return (
          <div className={cn(baseClasses, 'p-mobile-md')}>
            <div className="flex items-center gap-mobile-md">
              <div className={cn(baseClasses, 'w-12 h-12 rounded-mobile-lg')} />
              <div className="flex-1 space-y-mobile-xs">
                <div className={cn(baseClasses, 'h-4 w-3/4')} />
                <div className={cn(baseClasses, 'h-3 w-1/2')} />
                <div className={cn(baseClasses, 'h-3 w-2/3')} />
              </div>
              <div className={cn(baseClasses, 'w-8 h-8 rounded')} />
            </div>
          </div>
        );

      case 'prospect-card':
        return (
          <div className={cn(baseClasses, 'p-mobile-lg space-y-mobile-md')}>
            {/* Header con avatar y info */}
            <div className="flex items-center gap-mobile-md">
              <div className={cn(baseClasses, 'w-12 h-12 rounded-mobile-lg')} />
              <div className="flex-1 space-y-mobile-xs">
                <div className="flex items-center gap-mobile-sm">
                  <div className={cn(baseClasses, 'h-4 w-2/3')} />
                  <div className={cn(baseClasses, 'w-4 h-4 rounded')} />
                </div>
                <div className="flex items-center gap-mobile-sm">
                  <div className={cn(baseClasses, 'h-3 w-16')} />
                  <div className={cn(baseClasses, 'w-1 h-3')} />
                  <div className={cn(baseClasses, 'h-3 w-12')} />
                  <div className={cn(baseClasses, 'w-1 h-3')} />
                  <div className={cn(baseClasses, 'h-3 w-20')} />
                </div>
                <div className="flex items-center gap-mobile-sm">
                  <div className={cn(baseClasses, 'h-3 w-16')} />
                  <div className={cn(baseClasses, 'w-1 h-3')} />
                  <div className={cn(baseClasses, 'h-3 w-24')} />
                </div>
              </div>
              <div className={cn(baseClasses, 'w-12 h-12 rounded-mobile-lg')} />
            </div>

            {/* Estadísticas */}
            <div className="pt-mobile-md border-t border-white/10">
              <div className="grid grid-cols-3 gap-mobile-sm text-center">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="space-y-mobile-xs">
                    <div className={cn(baseClasses, 'h-3 w-12 mx-auto')} />
                    <div className={cn(baseClasses, 'h-4 w-8 mx-auto')} />
                  </div>
                ))}
              </div>
            </div>

            {/* Acciones */}
            <div className="flex items-center gap-mobile-sm">
              <div className={cn(baseClasses, 'flex-1 h-10 rounded-mobile-lg')} />
              <div className={cn(baseClasses, 'flex-1 h-10 rounded-mobile-lg')} />
            </div>
          </div>
        );

      default:
        return (
          <div
            className={baseClasses}
            style={{
              width: width || '100%',
              height: height || '20px',
            }}
          />
        );
    }
  };

  return renderSkeleton();
};

export default MobileSkeleton;
