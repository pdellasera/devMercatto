import React from 'react';
import { cn } from '../../utils/cn';
import MobileLoadingSpinner from './MobileLoadingSpinner';

interface MobileLoadingOverlayProps {
  isVisible: boolean;
  text?: string;
  variant?: 'fullscreen' | 'overlay' | 'inline';
  backdrop?: boolean;
  blur?: boolean;
  className?: string;
  spinnerSize?: 'sm' | 'md' | 'lg' | 'xl';
  spinnerVariant?: 'primary' | 'secondary' | 'white' | 'custom';
}

const MobileLoadingOverlay: React.FC<MobileLoadingOverlayProps> = ({
  isVisible,
  text,
  variant = 'overlay',
  backdrop = true,
  blur = true,
  className,
  spinnerSize = 'lg',
  spinnerVariant = 'primary',
}) => {
  if (!isVisible) return null;

  const overlayClasses = cn(
    'flex items-center justify-center',
    backdrop && 'bg-black/50',
    blur && 'backdrop-blur-sm',
    variant === 'fullscreen' && 'fixed inset-0 z-50',
    variant === 'overlay' && 'absolute inset-0 z-40',
    variant === 'inline' && 'relative w-full h-full min-h-[200px]',
    className
  );

  const contentClasses = cn(
    'flex flex-col items-center justify-center gap-mobile-md p-mobile-lg',
    variant === 'fullscreen' && 'bg-neutral-900/90 rounded-mobile-lg border border-white/10',
    variant === 'overlay' && 'bg-neutral-900/80 rounded-mobile-lg border border-white/10',
    variant === 'inline' && 'bg-transparent'
  );

  return (
    <div className={overlayClasses}>
      <div className={contentClasses}>
        <MobileLoadingSpinner
          size={spinnerSize}
          variant={spinnerVariant}
          text={text}
          showText={!!text}
        />
      </div>
    </div>
  );
};

export default MobileLoadingOverlay;
