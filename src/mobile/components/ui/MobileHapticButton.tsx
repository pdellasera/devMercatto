import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import useMobileHaptic from '../../hooks/useMobileHaptic';

interface MobileHapticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  hapticType?: 'click' | 'success' | 'error' | 'warning' | 'notification' | 'none';
  soundType?: 'click' | 'success' | 'error' | 'notification' | 'none';
  hapticIntensity?: number;
  soundVolume?: number;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

const MobileHapticButton = forwardRef<HTMLButtonElement, MobileHapticButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      hapticType = 'click',
      soundType = 'click',
      hapticIntensity = 0.5,
      soundVolume = 0.5,
      disabled = false,
      loading = false,
      icon,
      children,
      className,
      onClick,
      ...props
    },
    ref
  ) => {
    const haptic = useMobileHaptic({
      enabled: true,
      soundEnabled: true,
      hapticEnabled: true,
      defaultVolume: soundVolume,
      defaultIntensity: hapticIntensity,
    });

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) return;

      // Trigger haptic feedback
      if (hapticType !== 'none') {
        switch (hapticType) {
          case 'click':
            haptic.triggerClick();
            break;
          case 'success':
            haptic.triggerSuccess();
            break;
          case 'error':
            haptic.triggerError();
            break;
          case 'warning':
            haptic.triggerWarning();
            break;
          case 'notification':
            haptic.triggerNotification();
            break;
        }
      }

      // Call original onClick
      if (onClick) {
        onClick(event);
      }
    };

    const baseClasses = cn(
      'inline-flex items-center justify-center font-medium rounded-mobile-lg transition-all duration-200 mobile-touch-feedback focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
      className
    );

    const variantClasses = {
      primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500 shadow-mobile-sm hover:shadow-mobile-md',
      secondary: 'bg-neutral-700 hover:bg-neutral-600 text-white focus:ring-neutral-500 shadow-mobile-sm hover:shadow-mobile-md',
      outline: 'border border-neutral-300 bg-transparent hover:bg-neutral-50 text-neutral-700 focus:ring-neutral-500',
      ghost: 'bg-transparent hover:bg-neutral-100 text-neutral-700 focus:ring-neutral-500',
      danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-mobile-sm hover:shadow-mobile-md',
    };

    const sizeClasses = {
      sm: 'px-mobile-sm py-mobile-xs text-mobile-xs gap-mobile-xs',
      md: 'px-mobile-md py-mobile-sm text-mobile-sm gap-mobile-sm',
      lg: 'px-mobile-lg py-mobile-md text-mobile-base gap-mobile-md',
    };

    const loadingClasses = loading ? 'opacity-75 cursor-wait' : '';

    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          loadingClasses
        )}
        onClick={handleClick}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <div className="animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : icon ? (
          <span className="flex-shrink-0">{icon}</span>
        ) : null}
        
        {children && (
          <span className={cn(loading && 'opacity-0')}>
            {children}
          </span>
        )}
      </button>
    );
  }
);

MobileHapticButton.displayName = 'MobileHapticButton';

export default MobileHapticButton;
