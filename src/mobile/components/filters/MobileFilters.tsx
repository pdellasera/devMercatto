import React, { useState, useRef, useEffect } from 'react';
import { X, Filter, Sliders, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { cn } from '../../utils/cn';
import MobileButton from '../ui/MobileButton';

interface FilterOption {
  id: string;
  label: string;
  value: string | number;
  icon?: React.ComponentType<{ className?: string }>;
}

interface FilterGroup {
  id: string;
  title: string;
  options: FilterOption[];
  type: 'single' | 'multiple' | 'range';
  min?: number;
  max?: number;
}

interface MobileFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
  className?: string;
}

const MobileFilters: React.FC<MobileFiltersProps> = ({
  isOpen,
  onClose,
  onApply,
  className,
}) => {
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [rangeValues, setRangeValues] = useState<Record<string, { min: number; max: number }>>({});
  
  const sheetRef = useRef<HTMLDivElement>(null);

  // Definir grupos de filtros
  const filterGroups: FilterGroup[] = [
    {
      id: 'position',
      title: 'Posición',
      type: 'single',
      options: [
        { id: 'all', label: 'Todas las posiciones', value: 'all' },
        { id: 'delantero', label: 'Delantero', value: 'Delantero' },
        { id: 'centrocampista', label: 'Centrocampista', value: 'Centrocampista' },
        { id: 'defensa', label: 'Defensa', value: 'Defensa' },
        { id: 'portero', label: 'Portero', value: 'Portero' },
      ],
    },
    {
      id: 'age',
      title: 'Edad',
      type: 'range',
      min: 15,
      max: 25,
      options: [],
    },
    {
      id: 'ovr',
      title: 'OVR General',
      type: 'range',
      min: 70,
      max: 99,
      options: [],
    },
    {
      id: 'club',
      title: 'Club',
      type: 'multiple',
      options: [
        { id: 'real-madrid', label: 'Real Madrid', value: 'Real Madrid' },
        { id: 'barcelona', label: 'Barcelona', value: 'Barcelona' },
        { id: 'atletico', label: 'Atlético Madrid', value: 'Atlético Madrid' },
        { id: 'sevilla', label: 'Sevilla', value: 'Sevilla' },
        { id: 'valencia', label: 'Valencia', value: 'Valencia' },
        { id: 'villarreal', label: 'Villarreal', value: 'Villarreal' },
      ],
    },
    {
      id: 'location',
      title: 'Ubicación',
      type: 'multiple',
      options: [
        { id: 'madrid', label: 'Madrid', value: 'Madrid' },
        { id: 'barcelona', label: 'Barcelona', value: 'Barcelona' },
        { id: 'valencia', label: 'Valencia', value: 'Valencia' },
        { id: 'sevilla', label: 'Sevilla', value: 'Sevilla' },
        { id: 'bilbao', label: 'Bilbao', value: 'Bilbao' },
        { id: 'malaga', label: 'Málaga', value: 'Málaga' },
      ],
    },
    {
      id: 'attributes',
      title: 'Atributos',
      type: 'multiple',
      options: [
        { id: 'potencia', label: 'Alta Potencia', value: 'potencia' },
        { id: 'velocidad', label: 'Alta Velocidad', value: 'velocidad' },
        { id: 'resistencia', label: 'Alta Resistencia', value: 'resistencia' },
        { id: 'tecnica', label: 'Alta Técnica', value: 'tecnica' },
      ],
    },
  ];

  // Inicializar valores de rango
  useEffect(() => {
    const initialRanges: Record<string, { min: number; max: number }> = {};
    filterGroups.forEach(group => {
      if (group.type === 'range') {
        initialRanges[group.id] = {
          min: group.min || 0,
          max: group.max || 100,
        };
      }
    });
    setRangeValues(initialRanges);
  }, []);

  // Manejar overlay click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sheetRef.current && !sheetRef.current.contains(event.target as Node)) {
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

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const handleFilterChange = (groupId: string, value: any, type: string) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      
      if (type === 'single') {
        newFilters[groupId] = value;
      } else if (type === 'multiple') {
        if (!newFilters[groupId]) {
          newFilters[groupId] = [];
        }
        const currentValues = newFilters[groupId];
        if (currentValues.includes(value)) {
          newFilters[groupId] = currentValues.filter((v: any) => v !== value);
        } else {
          newFilters[groupId] = [...currentValues, value];
        }
      } else if (type === 'range') {
        newFilters[groupId] = value;
      }
      
      return newFilters;
    });
  };

  const handleRangeChange = (groupId: string, field: 'min' | 'max', value: number) => {
    setRangeValues(prev => ({
      ...prev,
      [groupId]: {
        ...prev[groupId],
        [field]: value,
      },
    }));
    
    setActiveFilters(prev => ({
      ...prev,
      [groupId]: {
        ...prev[groupId],
        [field]: value,
      },
    }));
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    setRangeValues(prev => {
      const newRanges = { ...prev };
      Object.keys(newRanges).forEach(key => {
        const group = filterGroups.find(g => g.id === key);
        if (group) {
          newRanges[key] = {
            min: group.min || 0,
            max: group.max || 100,
          };
        }
      });
      return newRanges;
    });
  };

  const applyFilters = () => {
    onApply(activeFilters);
    onClose();
  };

  const getActiveFilterCount = () => {
    let count = 0;
    Object.values(activeFilters).forEach(value => {
      if (Array.isArray(value)) {
        count += value.length;
      } else if (value && typeof value === 'object') {
        count += 1;
      } else if (value && value !== 'all') {
        count += 1;
      }
    });
    return count;
  };

  const renderFilterOption = (option: FilterOption, group: FilterGroup) => {
    const isSelected = group.type === 'single' 
      ? activeFilters[group.id] === option.value
      : activeFilters[group.id]?.includes(option.value);

    return (
      <button
        key={option.id}
        onClick={() => handleFilterChange(group.id, option.value, group.type)}
        className={cn(
          'flex items-center justify-between w-full px-mobile-md py-mobile-sm rounded-mobile-lg transition-colors mobile-touch-feedback',
          isSelected
            ? 'bg-primary-600 text-white'
            : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
        )}
      >
        <div className="flex items-center gap-mobile-sm">
          {option.icon && <option.icon className="w-4 h-4" />}
          <span className="text-mobile-sm">{option.label}</span>
        </div>
        {isSelected && <Check className="w-4 h-4" />}
      </button>
    );
  };

  const renderRangeFilter = (group: FilterGroup) => {
    const range = rangeValues[group.id] || { min: group.min || 0, max: group.max || 100 };
    
    return (
      <div className="space-y-mobile-md">
        <div className="flex items-center justify-between text-mobile-sm text-neutral-400">
          <span>{range.min}</span>
          <span>{range.max}</span>
        </div>
        <div className="relative">
          <input
            type="range"
            min={group.min}
            max={group.max}
            value={range.min}
            onChange={(e) => handleRangeChange(group.id, 'min', parseInt(e.target.value))}
            className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <input
            type="range"
            min={group.min}
            max={group.max}
            value={range.max}
            onChange={(e) => handleRangeChange(group.id, 'max', parseInt(e.target.value))}
            className="absolute top-0 w-full h-2 bg-transparent rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
        <div className="flex items-center gap-mobile-sm">
          <input
            type="number"
            value={range.min}
            onChange={(e) => handleRangeChange(group.id, 'min', parseInt(e.target.value) || 0)}
            className="flex-1 px-mobile-sm py-mobile-xs bg-neutral-800 border border-neutral-600 rounded-mobile-sm text-white text-mobile-sm"
            min={group.min}
            max={group.max}
          />
          <span className="text-neutral-400">-</span>
          <input
            type="number"
            value={range.max}
            onChange={(e) => handleRangeChange(group.id, 'max', parseInt(e.target.value) || 0)}
            className="flex-1 px-mobile-sm py-mobile-xs bg-neutral-800 border border-neutral-600 rounded-mobile-sm text-white text-mobile-sm"
            min={group.min}
            max={group.max}
          />
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        className={cn(
          'relative w-full bg-neutral-900 rounded-t-mobile-xl shadow-mobile-xl max-h-[85vh] overflow-hidden',
          'animate-mobile-slide-up',
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-mobile-lg border-b border-white/10">
          <div className="flex items-center gap-mobile-sm">
            <Filter className="w-5 h-5 text-primary-500" />
            <h2 className="text-mobile-lg font-semibold mobile-text-optimized">
              Filtros
            </h2>
            {getActiveFilterCount() > 0 && (
              <span className="px-mobile-xs py-mobile-xs bg-primary-600 text-white text-mobile-xs rounded-full">
                {getActiveFilterCount()}
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-mobile-lg space-y-mobile-lg">
          {filterGroups.map((group) => {
            const isExpanded = expandedGroups.has(group.id);
            const hasActiveFilters = activeFilters[group.id] && 
              (Array.isArray(activeFilters[group.id]) ? activeFilters[group.id].length > 0 : activeFilters[group.id] !== 'all');

            return (
              <div key={group.id} className="border border-white/10 rounded-mobile-lg overflow-hidden">
                <button
                  onClick={() => toggleGroup(group.id)}
                  className="w-full flex items-center justify-between p-mobile-md bg-neutral-800 hover:bg-neutral-700 transition-colors mobile-touch-feedback"
                >
                  <div className="flex items-center gap-mobile-sm">
                    <Sliders className="w-4 h-4 text-neutral-400" />
                    <span className="text-mobile-base font-medium mobile-text-optimized">
                      {group.title}
                    </span>
                    {hasActiveFilters && (
                      <span className="w-2 h-2 bg-primary-500 rounded-full" />
                    )}
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-neutral-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-400" />
                  )}
                </button>

                {isExpanded && (
                  <div className="p-mobile-md bg-neutral-900 space-y-mobile-sm">
                    {group.type === 'range' ? (
                      renderRangeFilter(group)
                    ) : (
                      group.options.map((option) => renderFilterOption(option, group))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-mobile-lg border-t border-white/10 bg-neutral-900">
          <div className="flex items-center gap-mobile-sm">
            <MobileButton
              variant="outline"
              onClick={clearAllFilters}
              className="flex-1"
            >
              Limpiar
            </MobileButton>
            <MobileButton
              onClick={applyFilters}
              className="flex-1"
            >
              Aplicar Filtros
            </MobileButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileFilters;
