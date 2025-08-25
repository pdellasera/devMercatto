import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, ArrowLeftRight } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface FilterModalProps {
  isOpen: boolean;
  filterId: string;
  filterLabel: string;
  filterType: 'range' | 'select' | 'number';
  onClose: () => void;
  onApply: (filterId: string, values: any) => void;
  position: { x: number; y: number };
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  filterId,
  filterLabel,
  filterType,
  onClose,
  onApply,
  position
}) => {
  const [minValue, setMinValue] = useState('');
  const [maxValue, setMaxValue] = useState('');

  const handleApply = () => {
    onApply(filterId, {
      min: minValue,
      max: maxValue,
      type: filterType
    });
    onClose();
  };

  // Calculate dynamic top position considering scroll
  const calculateTopPosition = () => {
    const modalHeight = 200; // Approximate modal height
    const viewportHeight = window.innerHeight;
    const scrollY = window.scrollY;
    
    // Calculate initial top position relative to viewport
    let top = position.y - scrollY - 10;
    
    // If modal would go below viewport, position it above the dropdown
    if (top + modalHeight > viewportHeight - 20) {
      top = position.y - scrollY - modalHeight - 10;
    }
    
    // If modal would go above viewport, position it at the top with margin
    if (top < 20) {
      top = 20;
    }
    
    return top;
  };

  const dynamicTop = calculateTopPosition();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
                 className={cn(
           "fixed bg-white rounded-lg shadow-xl border border-white z-50",
           "before:content-[''] before:absolute before:top-4 before:-right-2 before:w-0 before:h-0",
           "before:border-l-[8px] before:border-r-[8px] before:border-b-[8px] before:border-l-transparent before:border-r-transparent before:border-b-white",
           "before:rotate-90",
           "after:content-[''] after:absolute after:top-4 after:-right-3 after:w-0 after:h-0",
           "after:border-l-[9px] after:border-r-[9px] after:border-b-[9px] after:border-l-transparent after:border-r-transparent after:border-b-white",
           "after:rotate-90"
         )}
                   style={{
            left: position.x - 920, // Posicionar a la izquierda del dropdown
            top: dynamicTop
          }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-lg font-bold italic text-gray-800 uppercase">
            {filterLabel}
          </h3>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Range Inputs */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mínimo *
              </label>
              <input
                type="number"
                value={minValue}
                onChange={(e) => setMinValue(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
            
            <div className="flex items-center justify-center pt-6">
              <ArrowLeftRight className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Máximo *
              </label>
              <input
                type="number"
                value={maxValue}
                onChange={(e) => setMaxValue(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="100"
              />
            </div>
          </div>

          {/* Apply Button */}
          <button
            onClick={handleApply}
            className="w-full bg-black text-white py-2 px-4 rounded-md font-medium hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
          >
            <Search className="w-4 h-4" />
            <span>Aplicar</span>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
