import React, { useState } from 'react';
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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={cn(
          "absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50",
          className
        )}
      >
        {/* Dropdown Content */}
        <div className="p-0">
          {/* Filter Options List */}
          <div className="max-h-96 overflow-y-auto">
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
                onClick={() => onAddFilter(option.id)}
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
                    onAddFilter(option.id);
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
    </AnimatePresence>
  );
};
