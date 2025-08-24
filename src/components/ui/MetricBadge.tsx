import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const metricBadgeVariants = cva(
  'inline-flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-background border-border text-text-primary',
        primary: 'bg-primary text-white border-primary',
        success: 'bg-success text-white border-success',
        warning: 'bg-warning text-text-primary border-warning',
        error: 'bg-danger text-white border-danger',
        info: 'bg-blue-100 border-blue-300 text-blue-800',
      },
      size: {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-2 text-sm',
        lg: 'px-4 py-3 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface MetricBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof metricBadgeVariants> {
  label?: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    period?: string;
  };
  onClick?: () => void;
}

const MetricBadge = React.forwardRef<HTMLDivElement, MetricBadgeProps>(
  ({ 
    className, 
    variant, 
    size, 
    label, 
    value, 
    icon, 
    trend,
    onClick,
    ...props 
  }, ref) => {
    const getTrendIcon = () => {
      if (!trend) return null;
      
      switch (trend.direction) {
        case 'up':
          return <TrendingUp className="w-4 h-4 text-success" />;
        case 'down':
          return <TrendingDown className="w-4 h-4 text-danger" />;
        case 'neutral':
          return <Minus className="w-4 h-4 text-text-secondary" />;
        default:
          return null;
      }
    };

    const getTrendText = () => {
      if (!trend) return null;
      
      const sign = trend.direction === 'up' ? '+' : trend.direction === 'down' ? '-' : '';
      const period = trend.period ? ` ${trend.period}` : '';
      return `${sign}${trend.value}%${period}`;
    };

    return (
      <div
        className={cn(
          metricBadgeVariants({ variant, size, className }),
          onClick && 'cursor-pointer hover:scale-105 transition-transform'
        )}
        ref={ref}
        onClick={onClick}
        {...props}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        
        <div className="flex flex-col min-w-0">
          {label && (
            <span className="text-xs font-medium opacity-80 truncate">
              {label}
            </span>
          )}
          <span className="font-semibold truncate">
            {value}
          </span>
        </div>

        {trend && (
          <div className="flex items-center gap-1 ml-auto">
            {getTrendIcon()}
            <span className="text-xs font-medium">
              {getTrendText()}
            </span>
          </div>
        )}
      </div>
    );
  }
);

MetricBadge.displayName = 'MetricBadge';

export { MetricBadge, metricBadgeVariants };
