import React from 'react';
import { cn } from '../../utils/cn';

interface MobileMetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ComponentType<{ className?: string }>;
  color?: string;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

const MobileMetricCard: React.FC<MobileMetricCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  color = 'bg-blue-500',
  trend = 'neutral',
  className,
}) => {
  const formatChange = (change: number) => {
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  };

  const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return 'text-green-400';
      case 'down':
        return 'text-red-400';
      default:
        return 'text-neutral-400';
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return '↗';
      case 'down':
        return '↘';
      default:
        return '→';
    }
  };

  return (
    <div
      className={cn(
        'bg-neutral-900/50 backdrop-blur-sm border border-white/10 rounded-mobile-lg p-mobile-lg',
        'animate-mobile-fade-in',
        className
      )}
    >
      <div className="flex items-center justify-between mb-mobile-sm">
        {Icon && (
          <div className={cn('w-8 h-8 rounded-mobile-md flex items-center justify-center', color)}>
            <Icon className="w-4 h-4 text-white" />
          </div>
        )}
        {change !== undefined && (
          <div className="text-right">
            <span className={cn('text-mobile-xs font-medium', getTrendColor(trend))}>
              {getTrendIcon(trend)} {formatChange(change)}
            </span>
          </div>
        )}
      </div>
      <div className="mb-mobile-xs">
        <div className="text-mobile-lg font-bold mobile-text-optimized">
          {value}
        </div>
        <div className="text-neutral-400 text-mobile-xs">
          {title}
        </div>
      </div>
    </div>
  );
};

export default MobileMetricCard;
