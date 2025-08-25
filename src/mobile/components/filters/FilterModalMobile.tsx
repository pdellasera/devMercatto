import React, { useState, useRef, useEffect } from 'react';
import { X, Filter, Check, ChevronLeft } from 'lucide-react';
import { cn } from '../../utils/cn';
import MobileButton from '../ui/MobileButton';

interface FilterOption {
  id: string;
  label: string;
  value: string | number;
  count?: number;
  icon?: React.ComponentType<{ className?: string }>;
}

interface FilterModalMobileProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
  title: string;
  options: FilterOption[];
  type: 'single' | 'multiple' | 'search';
  selectedValues?: string[] | string;
  searchPlaceholder?: string;
  className?: string;
}

const FilterModalMobile: React.FC<FilterModalMobileProps> = ({
  isOpen,
  onClose,
  onApply,
  title,
  options,
  type,
  selectedValues = type === 'multiple' ? [] : '',
  searchPlaceholder = 'Buscar...',
  className,
}) => {
  const [selected, setSelected] = useState<string[] | string>(
    type === 'multiple' ? (selectedValues as string[]) : (selectedValues as string)
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<FilterOption[]>(options);
  
  const modalRef = useRef<HTMLDivElement>(null);

  // Filtrar opciones basado en búsqueda
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = options.filter(option =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options);
    }
  }, [searchQuery, options]);

  // Manejar overlay click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleOptionSelect = (value: string) => {
    if (type === 'single') {
      setSelected(value);
    } else if (type === 'multiple') {
      const currentSelected = selected as string[];
      if (currentSelected.includes(value)) {
        setSelected(currentSelected.filter(v => v !== value));
      } else {
        setSelected([...currentSelected, value]);
      }
    }
  };

  const handleApply = () => {
    onApply(selected);
    onClose();
  };

  const handleClear = () => {
    if (type === 'multiple') {
      setSelected([]);
    } else {
      setSelected('');
    }
  };

  const isOptionSelected = (value: string) => {
    if (type === 'single') {
      return selected === value;
    } else if (type === 'multiple') {
      return (selected as string[]).includes(value);
    }
    return false;
  };

  const getSelectedCount = () => {
    if (type === 'multiple') {
      return (selected as string[]).length;
    }
    return selected ? 1 : 0;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Modal */}
      <div
        ref={modalRef}
        className={cn(
          'relative w-full max-w-sm mx-mobile-lg bg-neutral-900 rounded-mobile-lg shadow-mobile-xl max-h-[80vh] overflow-hidden',
          'animate-mobile-fade-in',
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-mobile-lg border-b border-white/10">
          <div className="flex items-center gap-mobile-sm">
            <button
              onClick={onClose}
              className="p-mobile-xs rounded-mobile-sm hover:bg-white/10 transition-colors mobile-touch-feedback"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-mobile-lg font-semibold mobile-text-optimized">
              {title}
            </h2>
            {getSelectedCount() > 0 && (
              <span className="px-mobile-xs py-mobile-xs bg-primary-600 text-white text-mobile-xs rounded-full">
                {getSelectedCount()}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-mobile-sm rounded-mobile-lg hover:bg-white/10 transition-colors mobile-touch-feedback"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search (si es tipo search) */}
        {type === 'search' && (
          <div className="p-mobile-lg border-b border-white/10">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-4 py-mobile-sm bg-neutral-800 border border-white/20 rounded-mobile-lg text-white placeholder-neutral-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 mobile-text-optimized"
              />
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto max-h-96">
          {filteredOptions.length === 0 ? (
            <div className="p-mobile-lg text-center">
              <p className="text-neutral-400 text-mobile-sm">
                No se encontraron opciones
              </p>
            </div>
          ) : (
            <div className="p-mobile-sm">
              {filteredOptions.map((option) => {
                const isSelected = isOptionSelected(option.value as string);
                
                return (
                  <button
                    key={option.id}
                    onClick={() => handleOptionSelect(option.value as string)}
                    className={cn(
                      'w-full flex items-center justify-between p-mobile-md rounded-mobile-lg transition-colors mobile-touch-feedback',
                      isSelected
                        ? 'bg-primary-600 text-white'
                        : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                    )}
                  >
                    <div className="flex items-center gap-mobile-sm">
                      {option.icon && <option.icon className="w-4 h-4" />}
                      <span className="text-mobile-sm">{option.label}</span>
                      {option.count !== undefined && (
                        <span className="text-mobile-xs text-neutral-400">
                          ({option.count})
                        </span>
                      )}
                    </div>
                    {isSelected && <Check className="w-4 h-4" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-mobile-lg border-t border-white/10 bg-neutral-900">
          <div className="flex items-center gap-mobile-sm">
            <MobileButton
              variant="outline"
              onClick={handleClear}
              className="flex-1"
            >
              Limpiar
            </MobileButton>
            <MobileButton
              onClick={handleApply}
              className="flex-1"
            >
              Aplicar
            </MobileButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModalMobile;
