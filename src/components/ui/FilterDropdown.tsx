import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronUp,
  ChevronDown,
  Percent,
  User,
  Ruler,
  Flame,
  Trash2,
  Plus
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { FilterModal } from './FilterModal';

export interface FilterOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  type: 'range' | 'select' | 'number';
}

interface FilterDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFilter: (filterId: string) => void;
  onClearAll: () => void;
  className?: string;
}

const filterOptions: FilterOption[] = [
  {
    id: 'ovrFisico',
    label: 'OVR FISICO',
    icon: <ChevronUp className="w-4 h-4" />,
    type: 'range'
  },
  {
    id: 'ovrTecnico',
    label: 'OVR TECNICO',
    icon: <Percent className="w-4 h-4" />,
    type: 'range'
  },
  {
    id: 'ovrCompetencia',
    label: 'OVR DE COMPETENCIA',
    icon: <Percent className="w-4 h-4" />,
    type: 'range'
  },
  {
    id: 'posicion',
    label: 'POSICION',
    icon: <ChevronUp className="w-4 h-4" />,
    type: 'select'
  },
  {
    id: 'yearOfBirth',
    label: 'AÑO DE NACIMIENTO',
    icon: <User className="w-4 h-4" />,
    type: 'number'
  },
  {
    id: 'talla',
    label: 'TALLA',
    icon: <Ruler className="w-4 h-4" />,
    type: 'range'
  },
  {
    id: 'resistencia',
    label: 'RESISTENCIA',
    icon: <Percent className="w-4 h-4" />,
    type: 'range'
  },
  {
    id: 'potencia',
    label: 'POTENCIA',
    icon: <Flame className="w-4 h-4" />,
    type: 'range'
  }
];

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  isOpen,
  onClose,
  onAddFilter,
  onClearAll,
  className
}) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [filterPosition, setFilterPosition] = useState({ x: 0, y: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleFilterClick = (filterId: string, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const scrollY = window.scrollY;
    
    // Usar coordenadas absolutas para evitar problemas con scroll
    setFilterPosition({
      x: rect.right,
      y: rect.top + scrollY
    });
    setActiveFilter(filterId);
  };

  const handleFilterClose = () => {
    setActiveFilter(null);
  };

  const handleFilterApply = (filterId: string, values: any) => {
    console.log('Applying filter:', filterId, values);
    onAddFilter(filterId);
    setActiveFilter(null);
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
        setActiveFilter(null);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={dropdownRef}
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={cn(
          "absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50",
          "before:content-[''] before:absolute before:top-0 before:right-4 before:w-0 before:h-0",
          "before:border-l-[8px] before:border-r-[8px] before:border-b-[8px] before:border-l-transparent before:border-r-transparent before:border-b-white",
          "before:-translate-y-full before:translate-x-0",
          "after:content-[''] after:absolute after:top-0 after:right-4 after:w-0 after:h-0",
          "after:border-l-[9px] after:border-r-[9px] after:border-b-[9px] after:border-l-transparent after:border-r-transparent after:border-b-gray-200",
          "after:-translate-y-full after:translate-x-0 after:-translate-x-[1px]",
          className
        )}
      >
        {/* Dropdown Content */}
        <div className="p-0">
          {/* Filter Options List */}
          <div className="overflow-y-auto">
            {filterOptions.map((option, index) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onMouseEnter={() => setHoveredItem(option.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className={cn(
                  "flex items-center justify-between px-4 py-3 cursor-pointer transition-colors duration-200",
                  hoveredItem === option.id ? "bg-gray-50" : "hover:bg-gray-50",
                  index < filterOptions.length - 1 && "border-b border-gray-100"
                )}
                onClick={(e) => handleFilterClick(option.id, e)}
              >
                {/* Left side - Icon and Label */}
                <div className="flex items-center space-x-3">
                  <div className="text-gray-600">
                    {option.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {option.label}
                  </span>
                </div>

                {/* Right side - Add button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFilterClick(option.id, e);
                  }}
                >
                  <Plus className="w-3 h-3 text-gray-600" />
                </motion.button>
              </motion.div>
            ))}
          </div>

          {/* Clear All Button */}
          <div className="border-t border-gray-100 p-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClearAll}
              className="flex items-center space-x-2 text-red-500 hover:text-red-600 text-sm font-medium transition-colors duration-200"
            >
              <Trash2 className="w-4 h-4" />
              <span>Limpiar Todo Los Campos</span>
            </motion.button>
                     </div>
         </div>
       </motion.div>

       {/* Filter Modal */}
       {activeFilter && (
         <FilterModal
           isOpen={!!activeFilter}
           filterId={activeFilter}
           filterLabel={filterOptions.find(opt => opt.id === activeFilter)?.label || ''}
           filterType={filterOptions.find(opt => opt.id === activeFilter)?.type || 'range'}
           onClose={handleFilterClose}
           onApply={handleFilterApply}
           position={filterPosition}
         />
       )}
     </AnimatePresence>
   );
 };
