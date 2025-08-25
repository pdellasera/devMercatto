import React from 'react';
import { RefreshCw, ArrowDown } from 'lucide-react';
import { cn } from '../../utils/cn';

interface PullToRefreshIndicatorProps {
  progress: number;
  isRefreshing: boolean;
  className?: string;
}

const PullToRefreshIndicator: React.FC<PullToRefreshIndicatorProps> = ({
  progress,
  isRefreshing,
  className,
}) => {
  const rotation = progress * 180; // Rotar de 0 a 180 grados
  const scale = Math.min(progress, 1); // Escalar de 0 a 1

  return (
    <div
      className={cn(
        'flex items-center justify-center w-full py-mobile-lg transition-all duration-200',
        progress > 0 ? 'opacity-100' : 'opacity-0',
        className
      )}
    >
      <div className="flex items-center gap-mobile-sm">
        {isRefreshing ? (
          <RefreshCw className="w-5 h-5 text-primary-500 animate-spin" />
        ) : (
          <ArrowDown
            className={cn(
              'w-5 h-5 text-neutral-400 transition-all duration-200',
              progress >= 1 && 'text-primary-500'
            )}
            style={{
              transform: `rotate(${rotation}deg) scale(${scale})`,
            }}
          />
        )}
        <span
          className={cn(
            'text-mobile-sm font-medium transition-colors duration-200',
            progress >= 1 ? 'text-primary-500' : 'text-neutral-400'
          )}
        >
          {isRefreshing
            ? 'Actualizando...'
            : progress >= 1
            ? 'Suelta para actualizar'
            : 'Desliza hacia abajo para actualizar'}
        </span>
      </div>
    </div>
  );
};

export default PullToRefreshIndicator;
