import React from 'react';
import { Play, Loader2, Video } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const videoIconVariants = cva(
  'video-icon relative inline-flex items-center justify-center transition-all duration-300 group',
  {
    variants: {
      size: {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
        xl: 'w-20 h-20',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export interface VideoIconProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof videoIconVariants> {
  src?: string;
  alt?: string;
  loading?: boolean;
  error?: boolean;
  onClick?: () => void;
}

const VideoIcon = React.forwardRef<HTMLDivElement, VideoIconProps>(
  ({ 
    className, 
    size, 
    src, 
    alt = 'Video thumbnail', 
    loading = false,
    error = false,
    onClick,
    ...props 
  }, ref) => {
    const [imageError, setImageError] = React.useState(false);
    const shouldShowFallback = !src || imageError || error;

    const handleImageError = () => {
      setImageError(true);
    };

    return (
      <div
        className={cn(
          videoIconVariants({ size, className }),
          onClick && 'cursor-pointer hover:scale-110 active:scale-95'
        )}
        ref={ref}
        onClick={onClick}
        {...props}
      >
        {shouldShowFallback ? (
          <div className="w-full h-full bg-gradient-to-br from-gray-700/50 to-gray-800/50 backdrop-blur-sm rounded-xl border border-white/10 flex items-center justify-center shadow-lg">
            {loading ? (
              <Loader2 className="w-1/2 h-1/2 animate-spin text-blue-400" />
            ) : (
              <div className="flex flex-col items-center space-y-1">
                <Video className="w-1/2 h-1/2 text-gray-400 group-hover:text-blue-400 transition-colors" />
                <div className="w-2 h-2 bg-blue-500 rounded-full opacity-60"></div>
              </div>
            )}
          </div>
        ) : (
          <div className="relative w-full h-full group">
            <img
              src={src}
              alt={alt}
              className="w-full h-full object-cover rounded-xl border border-white/10"
              onError={handleImageError}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 border border-white/20">
                <Play className="w-4 h-4 text-white fill-white" />
              </div>
            </div>
            <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
          </div>
        )}
      </div>
    );
  }
);

VideoIcon.displayName = 'VideoIcon';

export { VideoIcon, videoIconVariants };
