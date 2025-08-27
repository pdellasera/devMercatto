import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const avatarVariants = cva(
  'avatar relative flex items-center justify-center overflow-hidden transition-colors',
  {
    variants: {
      size: {
        sm: 'avatar-small',
        md: 'avatar-medium',
        lg: 'avatar-large',
        xl: 'avatar-xlarge',
      },
      shape: {
        circle: 'rounded-full',
        square: 'rounded-md',
      },
    },
    defaultVariants: {
      size: 'md',
      shape: 'circle',
    },
  }
);

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  fallback?: string;
  onClick?: () => void;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size, shape, src, alt, fallback, onClick, ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false);
    const shouldShowFallback = !src || imageError;

    const handleImageError = () => {
      setImageError(true);
    };

    const getInitials = (name: string) => {
      return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    };

    return (
      <div
        className={cn(
          avatarVariants({ size, shape, className }),
          onClick && 'cursor-pointer hover:scale-105 transition-transform'
        )}
        ref={ref}
        onClick={onClick}
        {...props}
      >
        {shouldShowFallback ? (
          <div className="flex items-center justify-center w-full h-full bg-background-alt text-text-secondary font-medium">
            {fallback ? getInitials(fallback) : 'U'}
          </div>
        ) : (
          <img
            src={src}
            alt={alt || 'Avatar'}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export { Avatar, avatarVariants };
