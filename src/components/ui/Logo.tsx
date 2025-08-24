import React from 'react';
import { cn } from '../../utils/cn';

export interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl' | '10xl';
  className?: string;
  showText?: boolean;
  variant?: 'default' | 'header' | 'footer';
}

const Logo: React.FC<LogoProps> = ({
  size = 'md',
  className,
  showText = true,
  variant = 'default'
}) => {
  const sizeClasses = {
    sm: 'h-8 w-auto',
    md: 'h-12 w-auto',
    lg: 'h-16 w-auto',
    xl: 'h-20 w-auto',
    '2xl': 'h-24 w-auto',
    '3xl': 'h-32 w-auto',
    '4xl': 'h-40 w-auto',
    '5xl': 'h-48 w-auto',
    '6xl': 'h-56 w-auto',
    '7xl': 'h-64 w-auto',
    '8xl': 'h-72 w-auto',
    '9xl': 'h-80 w-auto',
    '10xl': 'h-88 w-auto',
  };

  const getTextContent = () => {
    if (variant === 'header') {
      return (
        <div className="flex flex-col">
          <span className="font-bold text-2xl text-blue-900">MERCATTO</span>
          <div className="flex items-center">
            <span className="text-xs text-gray-500 mr-1">by</span>
            <span className="text-sm font-medium text-green-500">PROSPECT</span>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col">
        <span className="font-bold text-xl text-primary">Mercatto</span>
        <span className="text-xs text-text-secondary">Prospectos Deportivos</span>
      </div>
    );
  };

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <img
        src="/src/assets/logo.png"
        alt="Mercatto Logo"
        className={cn(
          'object-contain',
          sizeClasses[size]
        )}
      />
     
    </div>
  );
};

Logo.displayName = 'Logo';
export { Logo };
