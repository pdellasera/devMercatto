import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Card, CardContent } from '../../design-system/components/Card/Card';
import { Button } from '../../design-system';
import { cn } from '../../utils/cn';

interface DismissibleNoticeProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
  onDismiss?: () => void;
}

const variantStyles = {
  primary: {
    card: 'border-green-400/30 bg-green-500/10 backdrop-blur-glass',
    icon: 'text-green-400',
    title: 'text-white',
    message: 'text-white/80',
    glow: 'shadow-green-500/20',
  },
  success: {
    card: 'border-green-400/30 bg-green-500/10 backdrop-blur-glass',
    icon: 'text-green-400',
    title: 'text-white',
    message: 'text-white/80',
    glow: 'shadow-green-500/20',
  },
  warning: {
    card: 'border-yellow-400/30 bg-yellow-500/10 backdrop-blur-glass',
    icon: 'text-yellow-400',
    title: 'text-white',
    message: 'text-white/80',
    glow: 'shadow-yellow-500/20',
  },
  error: {
    card: 'border-red-400/30 bg-red-500/10 backdrop-blur-glass',
    icon: 'text-red-400',
    title: 'text-white',
    message: 'text-white/80',
    glow: 'shadow-red-500/20',
  },
  info: {
    card: 'border-blue-400/30 bg-blue-500/10 backdrop-blur-glass',
    icon: 'text-blue-400',
    title: 'text-white',
    message: 'text-white/80',
    glow: 'shadow-blue-500/20',
  },
};

export const DismissibleNotice: React.FC<DismissibleNoticeProps> = ({
  title,
  message,
  icon,
  actionText,
  onAction,
  variant = 'primary',
  className,
  onDismiss,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const styles = variantStyles[variant];

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className={cn('overflow-hidden', className)}
        >
          <motion.div
            className={cn(
              'relative overflow-hidden rounded-lg border backdrop-blur-xl shadow-lg',
              styles.card,
              styles.glow
            )}
            whileHover={{ y: -1 }}
            transition={{ duration: 0.2 }}
          >
            {/* Subtle background gradient */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            />

            <div className="relative z-10 px-4 py-3">
              <div className="flex items-center space-x-3">
                {icon && (
                  <motion.div 
                    className="flex-shrink-0"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className={cn('w-5 h-5', styles.icon)}>
                      {icon}
                    </div>
                  </motion.div>
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className={cn('text-sm font-semibold leading-tight', styles.title)}>
                        {title}
                      </h3>
                      {message && (
                        <p className={cn('text-xs mt-0.5 leading-tight', styles.message)}>
                          {message}
                        </p>
                      )}
                    </div>
                    
                    <motion.button
                      onClick={handleDismiss}
                      className="flex-shrink-0 ml-2 p-1 rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                      aria-label="Cerrar notificación"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <X className="w-3.5 h-3.5" />
                    </motion.button>
                  </div>
                  
                  {actionText && onAction && (
                    <motion.div 
                      className="mt-2"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: 0.1 }}
                    >
                      <motion.div
                        whileHover={{ 
                          scale: 1.05,
                          transition: { duration: 0.2 }
                        }}
                        whileTap={{ 
                          scale: 0.95,
                          transition: { duration: 0.1 }
                        }}
                        className="inline-block"
                      >
                        <Button
                          onClick={onAction}
                          variant="primary"
                          size="sm"
                          className="glass-button bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-lg shadow-blue-500/25 text-xs px-4 py-2 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/30"
                        >
                          {actionText}
                        </Button>
                      </motion.div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
