import React from 'react';
import { cn } from '../../utils/cn';

interface MobileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const MobileButton: React.FC<MobileButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  icon,
  iconPosition = 'left',
  className,
  disabled,
  ...props
}) => {
  const baseClasses = cn(
    // Base styles
    'inline-flex items-center justify-center font-medium transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'mobile-touch-feedback mobile-optimized',
    
    // Size variants
    {
      'px-mobile-sm py-mobile-xs text-mobile-xs min-h-[32px]': size === 'xs',
      'px-mobile-md py-mobile-sm text-mobile-sm min-h-[36px]': size === 'sm',
      'px-mobile-lg py-mobile-md text-mobile-base min-h-[44px]': size === 'md',
      'px-mobile-xl py-mobile-lg text-mobile-lg min-h-[48px]': size === 'lg',
      'px-mobile-2xl py-mobile-xl text-mobile-xl min-h-[52px]': size === 'xl',
    },
    
    // Width
    {
      'w-full': fullWidth,
    },
    
    // Variant styles
    {
      // Primary
      'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 active:bg-primary-800': 
        variant === 'primary',
      
      // Secondary
      'bg-neutral-200 text-neutral-900 hover:bg-neutral-300 focus:ring-neutral-500 active:bg-neutral-400': 
        variant === 'secondary',
      
      // Outline
      'border border-neutral-300 bg-transparent text-neutral-700 hover:bg-neutral-50 focus:ring-neutral-500 active:bg-neutral-100': 
        variant === 'outline',
      
      // Ghost
      'bg-transparent text-neutral-700 hover:bg-neutral-100 focus:ring-neutral-500 active:bg-neutral-200': 
        variant === 'ghost',
      
      // Danger
      'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 active:bg-red-800': 
        variant === 'danger',
    },
    
    // Border radius
    'rounded-mobile-lg',
    
    // Shadow
    'shadow-mobile-sm hover:shadow-mobile-md',
    
    className
  );

  const iconClasses = cn(
    'flex-shrink-0',
    {
      'mr-mobile-sm': icon && iconPosition === 'left' && children,
      'ml-mobile-sm': icon && iconPosition === 'right' && children,
    }
  );

  return (
    <button
      className={baseClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className={cn('animate-spin', iconClasses)}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
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
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <span className={iconClasses}>{icon}</span>
      )}
      
      {children && (
        <span className="mobile-text-optimized">{children}</span>
      )}
      
      {!loading && icon && iconPosition === 'right' && (
        <span className={iconClasses}>{icon}</span>
      )}
    </button>
  );
};

export default MobileButton;
