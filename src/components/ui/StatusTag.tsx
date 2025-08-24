import React from 'react';
import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const statusTagVariants = cva(
  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors',
  {
    variants: {
      status: {
        default: 'status-tag-default',
        active: 'status-tag-active',
        activo: 'status-tag-active',
        inactive: 'status-tag-default',
        inactivo: 'status-tag-default',
        pending: 'status-tag-warning',
        pendiente: 'status-tag-warning',
        scouted: 'status-tag-active',
        observado: 'status-tag-warning',
        error: 'bg-danger text-white',
        success: 'status-tag-active',
        warning: 'status-tag-warning',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
        lg: 'px-3 py-1.5 text-base',
      },
    },
    defaultVariants: {
      status: 'default',
      size: 'md',
    },
  }
);

export interface StatusTagProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusTagVariants> {
  children: React.ReactNode;
  status?: 'default' | 'active' | 'activo' | 'inactive' | 'inactivo' | 'pending' | 'pendiente' | 'scouted' | 'observado' | 'error' | 'success' | 'warning';
}

const StatusTag = React.forwardRef<HTMLSpanElement, StatusTagProps>(
  ({ className, status, size, children, ...props }, ref) => {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span
          className={cn(statusTagVariants({ status, size, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </span>
      </motion.div>
    );
  }
);

StatusTag.displayName = 'StatusTag';

export { StatusTag, statusTagVariants };
