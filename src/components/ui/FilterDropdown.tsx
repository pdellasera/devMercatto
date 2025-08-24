import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X, Search } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const filterDropdownVariants = cva(
  'relative w-full',
  {
    variants: {
      size: {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export interface FilterOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface FilterDropdownProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof filterDropdownVariants> {
  options: FilterOption[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  label?: string;
  multiple?: boolean;
  searchable?: boolean;
  disabled?: boolean;
  error?: string;
}

const FilterDropdown = React.forwardRef<HTMLDivElement, FilterDropdownProps>(
  ({ 
    className, 
    size, 
    options, 
    value, 
    onChange, 
    placeholder = 'Select option...',
    label,
    multiple = false,
    searchable = false,
    disabled = false,
    error,
    ...props 
  }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
      if (isOpen && searchable && searchRef.current) {
        searchRef.current.focus();
      }
    }, [isOpen, searchable]);

    const filteredOptions = options.filter(option =>
      searchable && searchQuery
        ? option.label.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    );

    const selectedOptions = multiple
      ? (Array.isArray(value) ? value : [value]).filter(Boolean)
      : [value].filter(Boolean);

    const handleOptionClick = (optionValue: string) => {
      if (multiple) {
        const newValues = selectedOptions.includes(optionValue)
          ? selectedOptions.filter(v => v !== optionValue)
          : [...selectedOptions, optionValue];
        onChange(newValues as string[]);
      } else {
        onChange(optionValue);
        setIsOpen(false);
      }
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange(multiple ? [] : '');
    };

    const getDisplayText = () => {
      if (selectedOptions.length === 0) return placeholder;
      if (multiple) {
        if (selectedOptions.length === 1) {
          return options.find(opt => opt.value === selectedOptions[0])?.label || placeholder;
        }
        return `${selectedOptions.length} selected`;
      }
      return options.find(opt => opt.value === selectedOptions[0])?.label || placeholder;
    };

    return (
      <div
        ref={ref || dropdownRef}
        className={cn(filterDropdownVariants({ size, className }))}
        {...props}
      >
        {label && (
          <label className="block text-sm font-medium text-text-primary mb-2">
            {label}
          </label>
        )}

        <div className="relative">
          <div
            className={cn(
              'flex items-center justify-between w-full px-3 py-2 border border-border rounded-md bg-background cursor-pointer transition-colors',
              'hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
              isOpen && 'ring-2 ring-primary ring-offset-2',
              disabled && 'opacity-50 cursor-not-allowed',
              error && 'border-danger focus:ring-danger'
            )}
            onClick={() => !disabled && setIsOpen(!isOpen)}
          >
            <span className={cn(
              'truncate',
              selectedOptions.length === 0 && 'text-text-secondary'
            )}>
              {getDisplayText()}
            </span>
            
            <div className="flex items-center space-x-2">
              {selectedOptions.length > 0 && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1 hover:bg-background-alt rounded-full transition-colors"
                >
                  <X className="w-3 h-3 text-text-secondary" />
                </button>
              )}
              <ChevronDown 
                className={cn(
                  'w-4 h-4 text-text-secondary transition-transform',
                  isOpen && 'rotate-180'
                )} 
              />
            </div>
          </div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-hidden"
              >
                {searchable && (
                  <div className="p-2 border-b border-border">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
                      <input
                        ref={searchRef}
                        type="text"
                        placeholder="Search options..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                )}

                <div className="max-h-48 overflow-y-auto">
                  {filteredOptions.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-text-secondary">
                      No options found
                    </div>
                  ) : (
                    filteredOptions.map((option) => (
                      <div
                        key={option.value}
                        className={cn(
                          'px-3 py-2 text-sm cursor-pointer transition-colors',
                          'hover:bg-background-alt',
                          selectedOptions.includes(option.value) && 'bg-primary text-white hover:bg-primary-hover',
                          option.disabled && 'opacity-50 cursor-not-allowed hover:bg-transparent'
                        )}
                        onClick={() => !option.disabled && handleOptionClick(option.value)}
                      >
                        {option.label}
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {error && (
          <p className="mt-1 text-sm text-danger">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FilterDropdown.displayName = 'FilterDropdown';

export { FilterDropdown, filterDropdownVariants };
