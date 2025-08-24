import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const searchBarVariants = cva(
  'search-bar flex items-center relative transition-all duration-200',
  {
    variants: {
      size: {
        sm: 'h-8 text-sm',
        md: 'h-10 text-base',
        lg: 'h-12 text-lg',
      },
      variant: {
        default: 'focus-within:ring-2 focus-within:ring-primary focus-within:border-primary',
        filled: 'bg-background-alt',
        outline: 'border-2',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
);

export interface SearchBarProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof searchBarVariants> {
  onSearch?: (query: string) => void;
  onClear?: () => void;
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
}

const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ 
    className, 
    size, 
    variant, 
    onSearch, 
    onClear, 
    placeholder = 'Search...', 
    loading = false,
    disabled = false,
    value,
    onChange,
    ...props 
  }, ref) => {
    const [inputValue, setInputValue] = useState(value ? String(value) : '');
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (value !== undefined) {
        setInputValue(String(value));
      }
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      onChange?.(e);
      onSearch?.(newValue);
    };

    const handleClear = () => {
      setInputValue('');
      onClear?.();
      onSearch?.('');
      inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        onSearch?.(inputValue);
      }
    };

    return (
      <motion.div
        className={cn(searchBarVariants({ size, variant, className }))}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        whileFocus={{ scale: 1.02 }}
      >
        <Search 
          className={cn(
            'absolute left-3 text-white/60',
            size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'
          )} 
        />
        
        <input
          ref={ref || inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled || loading}
          className={cn(
            'w-full bg-transparent border-none outline-none placeholder-white/40 text-white/95',
            'pl-10 pr-10',
            size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          {...props}
        />

        <AnimatePresence>
          {inputValue && !disabled && (
            <motion.button
              type="button"
              onClick={handleClear}
              className="absolute right-3 p-1 rounded-full hover:bg-white/10 transition-colors"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X 
                className={cn(
                  'text-white/60',
                  size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'
                )} 
              />
            </motion.button>
          )}
        </AnimatePresence>

        {loading && (
          <motion.div
            className="absolute right-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="animate-spin rounded-full border-2 border-white/40 border-t-transparent w-4 h-4" />
          </motion.div>
        )}
      </motion.div>
    );
  }
);

SearchBar.displayName = 'SearchBar';

export { SearchBar, searchBarVariants };
