import React from 'react';
import { cn } from '../../utils/cn';

interface MobileProspectCardProps {
  id: string;
  name: string;
  ovr: number;
  age: number;
  position: string;
  club?: string;
  avatar?: string;
  className?: string;
}

const MobileProspectCard: React.FC<MobileProspectCardProps> = ({
  name,
  ovr,
  age,
  position,
  club,
  avatar,
  className,
}) => {
  const getOvrColor = (ovr: number) => {
    if (ovr >= 90) return 'text-green-400';
    if (ovr >= 80) return 'text-blue-400';
    if (ovr >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div
      className={cn(
        'bg-neutral-900/50 backdrop-blur-sm border border-white/10 rounded-mobile-lg p-mobile-lg',
        'animate-mobile-slide-up',
        className
      )}
    >
      <div className="flex items-center gap-mobile-md">
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="w-12 h-12 rounded-mobile-lg object-cover"
          />
        ) : (
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-mobile-lg flex items-center justify-center">
            <span className="text-white font-bold text-mobile-sm">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-mobile-base font-medium mobile-text-optimized">
            {name}
          </h3>
          <p className="text-neutral-400 text-mobile-sm">
            OVR: {ovr} • Edad: {age} • {position}
            {club && ` • ${club}`}
          </p>
        </div>
        <div className="text-right">
          <div className={cn('text-mobile-sm font-bold', getOvrColor(ovr))}>
            {ovr}
          </div>
          <div className="text-neutral-500 text-mobile-xs">
            OVR
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileProspectCard;
