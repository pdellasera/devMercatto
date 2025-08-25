import React from 'react';
import { cn } from '../../utils/cn';

interface MobileLoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'white' | 'custom';
  className?: string;
  text?: string;
  showText?: boolean;
  animated?: boolean;
}

const MobileLoadingSpinner: React.FC<MobileLoadingSpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  className,
  text,
  showText = false,
  animated = true,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const variantClasses = {
    primary: 'text-primary-500',
    secondary: 'text-neutral-400',
    white: 'text-white',
    custom: '',
  };

  const spinnerClasses = cn(
    'animate-spin',
    sizeClasses[size],
    variantClasses[variant],
    !animated && 'animate-none',
    className
  );

  const renderSpinner = () => {
    switch (variant) {
      case 'custom':
        return (
          <div className={cn('relative', sizeClasses[size])}>
            <div className="absolute inset-0 border-2 border-neutral-700 rounded-full" />
            <div className="absolute inset-0 border-2 border-transparent border-t-primary-500 rounded-full animate-spin" />
          </div>
        );
      
      default:
        return (
          <svg
            className={spinnerClasses}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        );
    }
  };

  if (showText || text) {
    return (
      <div className="flex flex-col items-center justify-center gap-mobile-sm">
        {renderSpinner()}
        {text && (
          <span className="text-mobile-sm text-neutral-400 text-center">
            {text}
          </span>
        )}
      </div>
    );
  }

  return renderSpinner();
};

export default MobileLoadingSpinner;
