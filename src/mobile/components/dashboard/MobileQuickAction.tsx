import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../utils/cn';

interface MobileQuickActionProps {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  color: string;
  className?: string;
}

const MobileQuickAction: React.FC<MobileQuickActionProps> = ({
  title,
  description,
  icon: Icon,
  path,
  color,
  className,
}) => {
  return (
    <Link
      to={path}
      className={cn(
        'block bg-neutral-900/50 backdrop-blur-sm border border-white/10 rounded-mobile-lg p-mobile-lg',
        'hover:bg-neutral-800/50 transition-all duration-200 mobile-touch-feedback',
        'animate-mobile-slide-up',
        className
      )}
    >
      <div className="flex items-center gap-mobile-md">
        <div className={cn('w-10 h-10 rounded-mobile-lg flex items-center justify-center', color)}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-mobile-base font-medium mobile-text-optimized">
            {title}
          </h3>
          <p className="text-neutral-400 text-mobile-sm">
            {description}
          </p>
        </div>
        <ArrowRight className="w-4 h-4 text-neutral-400" />
      </div>
    </Link>
  );
};

export default MobileQuickAction;
