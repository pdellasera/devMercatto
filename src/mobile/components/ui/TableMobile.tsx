import React, { useState, useCallback, useMemo } from 'react';
import {
  Search,
  X,
  ChevronRight,
  ChevronLeft,
  SortAsc,
  SortDesc,
  Filter,
  Check
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

export interface TableMobileColumn<T> {
  key: string;
  header: string;
  accessor: (item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface TableMobileProps<T> {
  data: T[];
  columns: TableMobileColumn<T>[];
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  sortable?: boolean;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  getItemKey: (item: T) => string | number;
  className?: string;
  onRowClick?: (item: T) => void;
  title?: string;
  subtitle?: string;
  pagination?: {
    page: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  onPageChange?: (page: number) => void;
  onFilterChange?: (filters: any) => void;
}

export function TableMobile<T>({
  data,
  columns,
  loading = false,
  error = null,
  emptyMessage = "No se encontraron datos",
  searchable = false,
  searchPlaceholder = "Buscar...",
  onSearch,
  sortable = false,
  onSort,
  sortKey,
  sortDirection,
  getItemKey,
  className,
  onRowClick,
  title,
  subtitle,
  pagination,
  onPageChange,
  onFilterChange
}: TableMobileProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<any>({});

  // Filtrar datos por búsqueda
  const filteredData = useMemo(() => {
    if (!searchable || !searchQuery) return data;

    return data.filter(item => {
      const searchLower = searchQuery.toLowerCase();
      return columns.some(column => {
        const value = column.accessor(item);
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchLower);
        }
        return false;
      });
    });
  }, [data, searchQuery, searchable, columns]);

  // Manejar búsqueda
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  }, [onSearch]);

  // Manejar ordenamiento
  const handleSort = useCallback((key: string) => {
    if (!sortable || !onSort) return;
    const newDirection = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(key, newDirection);
  }, [sortable, onSort, sortKey, sortDirection]);

  // Función auxiliar para obtener páginas visibles
  const getVisiblePages = () => {
    if (!pagination) return [];

    const { page, totalPages } = pagination;
    const pages = [];

    // Detectar si estamos en una pantalla muy pequeña (375px)
    const isSmallScreen = window.innerWidth <= 375;
    const maxVisible = isSmallScreen ? 3 : 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, page - Math.floor(maxVisible / 2));
      let end = Math.min(totalPages, start + maxVisible - 1);

      if (end === totalPages) {
        start = Math.max(1, end - maxVisible + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  // Manejar filtros de rango
  const handleRangeFilterChange = (category: string, type: 'min' | 'max', value: string) => {
    setSelectedFilters((prev: any) => {
      const newFilters = { ...prev };
      if (!newFilters[category]) {
        newFilters[category] = { min: '', max: '' };
      }

      newFilters[category][type] = value;

      // Si ambos valores están vacíos, eliminar la categoría
      if (!newFilters[category].min && !newFilters[category].max) {
        delete newFilters[category];
      }

      return newFilters;
    });
  };

  // Manejar filtros de selección
  const handleSelectFilterToggle = (category: string, value: string) => {
    setSelectedFilters((prev: any) => {
      const newFilters = { ...prev };
      if (!newFilters[category]) {
        newFilters[category] = [];
      }

      const index = newFilters[category].indexOf(value);
      if (index > -1) {
        newFilters[category].splice(index, 1);
      } else {
        newFilters[category].push(value);
      }

      if (newFilters[category].length === 0) {
        delete newFilters[category];
      }

      return newFilters;
    });
  };

  const handleClearFilters = () => {
    setSelectedFilters({});
  };

  const handleApplyFilters = () => {
    onFilterChange?.(selectedFilters);
    setShowFilterModal(false);
  };

  // Categorías de filtros para prospectos deportivos
  const filterCategories = [
    {
      key: 'ovrFisico',
      label: 'OVR FISICO',
      type: 'range'
    },
    {
      key: 'ovrTecnico',
      label: 'OVR TECNICO',
      type: 'range'
    },
    {
      key: 'ovrCompetencia',
      label: 'OVR COMPETENCIA',
      type: 'range'
    },
    {
      key: 'posicion',
      label: 'POSICION',
      type: 'select',
      options: ['Delantero', 'Centrocampista', 'Defensa', 'Portero']
    },
    {
      key: 'anoNacimiento',
      label: 'AÑO DE NACIMIENTO',
      type: 'range'
    },
    {
      key: 'talla',
      label: 'TALLA',
      type: 'range'
    },
    {
      key: 'resistencia',
      label: 'RESISTENCIA',
      type: 'range'
    },
    {
      key: 'potencia',
      label: 'POTENCIA',
      type: 'range'
    }
  ];

  // Inicializar con OVR FISICO seleccionado por defecto
  React.useEffect(() => {
    if (!selectedFilters.activeCategory) {
      setSelectedFilters((prev: any) => ({ ...prev, activeCategory: 'ovrFisico' }));
    }
  }, []);

  return (
    <>
      <div className={cn("flex flex-col h-full w-full", className)}>
        {/* Header con título, filtro y búsqueda */}
        <div className="glass-card-mobile p-3 sm:p-4 mb-3 sm:mb-4 relative group">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <h3 className="text-lg font-semibold text-white tracking-wide">{title}</h3>
            </div>
          </div>

          {/* Botón flotante de filtro - solo visible en mobile */}
          <button
            onClick={() => setShowFilterModal(true)}
            className="absolute top-3 right-3 p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300 shadow-lg backdrop-blur-xl lg:hidden"
          >
            <Filter className="w-4 h-4 text-white/80 hover:text-white transition-colors" />
          </button>

          {/* Subtitle */}
          {subtitle && (
            <div className="text-white/70 text-sm mb-3">
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span>Preparando datos...</span>
                </div>
              ) : (
                subtitle
              )}
            </div>
          )}

          {/* Búsqueda */}
          {searchable && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-2 sm:py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg sm:rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearch('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Contenido de la tabla */}
        <div className="flex-1 overflow-hidden  sm:pb-20">
          {loading ? (
            <div className="p-4">
              {/* Skeleton Loading */}
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="border-b border-white/5 hover:bg-white/2 transition-all duration-300 p-4 rounded-xl">
                    <div className="space-y-3">
                      <div className="h-4 bg-gradient-to-r from-white/20 to-white/10 rounded-md shadow-sm relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
                      </div>
                      <div className="h-3 bg-gradient-to-r from-white/15 to-white/8 rounded w-3/4 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
                      </div>
                      <div className="h-3 bg-gradient-to-r from-white/15 to-white/8 rounded w-1/2 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="p-4">
              {/* Error State */}
              <div className="px-6 py-20 text-center">
                <div className="flex flex-col items-center justify-center space-y-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-white/10 to-white/5 rounded-full flex items-center justify-center border border-white/10 shadow-2xl">
                    <div className="w-12 h-12 text-white/40">⚠️</div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-white/80 tracking-wide">Error al cargar datos</h3>
                    <p className="text-white/50 text-sm max-w-md">{error}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="p-4">
              {/* Empty State */}
              <div className="px-6 py-20 text-center">
                <div className="flex flex-col items-center justify-center space-y-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-white/10 to-white/5 rounded-full flex items-center justify-center border border-white/10 shadow-2xl">
                    <Search className="w-12 h-12 text-white/40" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-white/80 tracking-wide">{emptyMessage}</h3>
                    <p className="text-white/50 text-sm max-w-md">
                      {searchQuery
                        ? "No se encontraron resultados para tu búsqueda. Intenta con otros términos."
                        : "No hay prospectos disponibles en este momento. Vuelve más tarde."
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full overflow-y-auto">
              {/* Table Content */}
              <div className="overflow-x-auto">
                <div className="w-full bg-transparent border border-white/10 rounded-xl sm:rounded-2xl overflow-hidden backdrop-blur-xl shadow-xl sm:shadow-2xl shadow-black/20">
                  {/* Header - Solo visible en desktop, oculto en móvil */}
                  <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl border-b border-white/10 hidden lg:flex">
                    {columns.map((column) => (
                      <div
                        key={column.key}
                        className="px-4 py-3 text-xs font-semibold text-gray-300 uppercase tracking-wider flex-1"
                      >
                        <button
                          onClick={() => column.sortable && handleSort(column.key)}
                          className={cn(
                            "w-full text-left flex items-center justify-between",
                            column.sortable && "cursor-pointer hover:bg-white/10 transition-all duration-200",
                            sortKey === column.key && "text-blue-400"
                          )}
                        >
                          <span className="truncate">{column.header}</span>
                          {column.sortable && (
                            <div className="flex-shrink-0 ml-1">
                              {sortKey === column.key ? (
                                sortDirection === 'asc' ? (
                                  <SortAsc className="w-3 h-3" />
                                ) : (
                                  <SortDesc className="w-3 h-3" />
                                )
                              ) : (
                                <div className="w-3 h-3 text-white/30">↕</div>
                              )}
                            </div>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Body */}
                  <div className="bg-transparent">
                    {filteredData.map((item, index) => (
                      <motion.div
                        key={String(getItemKey(item))}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={cn(
                          "transition-all duration-200 group",
                          "border-b border-white/5 hover:bg-white/2",
                          onRowClick && "cursor-pointer",
                          "flex flex-col lg:flex-row",
                          "glass-card-mobile m-2"
                        )}
                        onClick={() => onRowClick?.(item)}
                      >
                        {columns.map((column) => (
                          <div
                            key={column.key}
                            className="flex justify-between items-center lg:flex-1 lg:justify-start lg:items-start px-3 sm:px-4 py-2 sm:py-3 border-b border-white/5 last:border-b-0 lg:border-b-0 text-sm transition-all duration-200"
                          >
                            {
                              column.key === 'nombre' ? null : (
                                <div className="text-xs font-medium text-gray-300 lg:hidden min-w-[70px] sm:min-w-[80px]">
                                  {column.header}
                                </div>
                              )
                            }

                            <div className="text-sm text-white lg:hidden flex-1 text-right font-semibold">
                              {column.accessor(item)}
                            </div>
                            <div className="hidden lg:block text-sm text-white font-semibold w-full">
                              {column.accessor(item)}
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Paginación Fija fuera del contenedor principal */}
      {pagination && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background-secondary border-t border-white/10 backdrop-blur-xl shadow-2xl pb-safe">
          <div className="w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-[80vw] xl:max-w-[75vw] mx-auto px-3 sm:px-4 lg:px-6 py-3">
            <div className="glass-card-mobile-compact">
              {pagination.totalPages <= 1 ? (
                // Una sola página
                <div className="flex items-center justify-center">
                  <button className="w-8 h-8 sm:w-9 sm:h-9 lg:w-8 lg:h-8 rounded-lg border text-xs sm:text-sm font-medium transition-all duration-200 bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/25 touch-manipulation">
                    1
                  </button>
                </div>
              ) : (
                // Múltiples páginas
                <div className="flex items-center justify-between min-w-0">
                  <button
                    onClick={() => onPageChange?.(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className={cn(
                      "p-1.5 sm:p-2 rounded-lg border transition-all duration-200 touch-manipulation min-w-[32px] min-h-[32px] sm:min-w-[44px] sm:min-h-[44px]",
                      pagination.page <= 1
                        ? "border-white/10 text-white/30 cursor-not-allowed"
                        : "border-white/20 text-white/80 hover:bg-white/10 hover:text-white hover:border-white/30"
                    )}
                  >
                    <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>

                  <div className="flex space-x-0.5 sm:space-x-1 lg:space-x-2 flex-1 justify-center min-w-0">
                    {getVisiblePages().map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => onPageChange?.(pageNum)}
                        className={cn(
                          "w-8 h-8 sm:w-9 sm:h-9 lg:w-8 lg:h-8 rounded-lg border text-xs sm:text-sm font-medium transition-all duration-200 touch-manipulation",
                          pageNum === pagination.page
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/25"
                            : "border-white/20 text-white/80 hover:bg-white/10 hover:text-white hover:border-white/30"
                        )}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => onPageChange?.(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                    className={cn(
                      "p-1.5 sm:p-2 rounded-lg border transition-all duration-200 touch-manipulation min-w-[32px] min-h-[32px] sm:min-w-[44px] sm:min-h-[44px]",
                      pagination.page >= pagination.totalPages
                        ? "border-white/10 text-white/30 cursor-not-allowed"
                        : "border-white/20 text-white/80 hover:bg-white/10 hover:text-white hover:border-white/30"
                    )}
                  >
                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Filtros */}
      <AnimatePresence>
        {showFilterModal && (
          <>
            {/* Overlay de fondo */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilterModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ y: '100%', scale: 0.95, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: '100%', scale: 0.95, opacity: 0 }}
              transition={{
                type: 'spring',
                damping: 30,
                stiffness: 400,
                mass: 0.8
              }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-b from-white/15 via-white/10 to-white/5 backdrop-blur-2xl border border-white/30 rounded-t-[2rem] shadow-2xl max-h-[60vh] overflow-hidden"
              style={{
                boxShadow: '0 -25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(24px) saturate(180%)'
              }}
            >
              {/* Header del modal */}
              <div className="flex items-center justify-between p-6 border-b border-white/20 bg-gradient-to-r from-white/10 via-white/5 to-transparent backdrop-blur-xl relative">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400/20 to-blue-600/20 backdrop-blur-xl border border-blue-400/30 flex items-center justify-center">
                    <Filter className="w-5 h-5 text-blue-300" />
                  </div>
                  <div>
                                         <h3 className="text-lg font-bold text-white tracking-tight">Filtros Avanzados</h3>
                     <p className="text-xs text-white/60 font-medium">Personaliza tu búsqueda</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFilterModal(false)}
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 border border-white/20 flex items-center justify-center transition-all duration-300 shadow-lg"
                >
                  <X className="w-5 h-5 text-white/80" />
                </motion.button>
              </div>

              {/* Contenido del modal */}
              <div className="flex h-[calc(60vh-180px)]">
                {/* Panel izquierdo - Categorías con scroll vertical */}
                <div className="w-1/3 bg-gradient-to-b from-white/8 via-white/5 to-transparent backdrop-blur-xl border-r border-white/20 flex flex-col">
                  <div className="flex-1 overflow-y-auto scrollbar-hide">
                    <div className="p-5 space-y-3">
                      {filterCategories.map((category, index) => (
                        <motion.button
                          key={category.key}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.02, x: 2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedFilters((prev: any) => ({ ...prev, activeCategory: category.key }))}
                          className={`w-full text-left p-4 rounded-2xl transition-all duration-300 ${selectedFilters.activeCategory === category.key
                              ? 'bg-gradient-to-r from-blue-400/20 to-blue-600/20 backdrop-blur-xl shadow-xl border-2 border-blue-400/50 font-semibold text-white transform scale-105'
                              : 'text-white/80 hover:bg-white/10 hover:shadow-lg hover:scale-102 border border-white/10 hover:border-white/20'
                            }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`font-medium text-xs ${selectedFilters.activeCategory === category.key ? 'text-white' : 'text-white/80'
                              }`}>
                              {category.label}
                            </span>
                            {(() => {
                              const filterValue = selectedFilters[category.key];
                              if (!filterValue) return null;

                              let count = 0;
                              if (category.type === 'range') {
                                // Para filtros de rango, contar si hay min o max
                                if (filterValue.min || filterValue.max) count = 1;
                              } else if (category.type === 'select') {
                                // Para filtros de selección, contar elementos seleccionados
                                count = filterValue.length || 0;
                              }

                              return count > 0 ? (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-7 h-7 bg-gradient-to-r from-blue-400 to-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg"
                                >
                                  {count}
                                </motion.span>
                              ) : null;
                            })()}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Panel derecho - Opciones */}
                <div className="flex-1 bg-gradient-to-b from-white/8 via-white/5 to-transparent backdrop-blur-xl">
                  <div className="p-6">
                    {selectedFilters.activeCategory && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        {(() => {
                          const activeCategory = filterCategories.find(cat => cat.key === selectedFilters.activeCategory);
                          if (!activeCategory) return null;

                          if (activeCategory.type === 'range') {
                            return (
                              <div className="space-y-6">
                                                                 <div className="flex items-center space-x-3 mb-6">
                                   <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full shadow-lg"></div>
                                   <h4 className="text-lg font-bold text-white tracking-tight">
                                     {activeCategory.label}
                                   </h4>
                                 </div>
                                 <div className="space-y-4">
                                   <motion.div 
                                     initial={{ opacity: 0, x: 20 }}
                                     animate={{ opacity: 1, x: 0 }}
                                     transition={{ delay: 0.1 }}
                                     className="bg-gradient-to-r from-white/15 to-white/10 backdrop-blur-xl p-4 rounded-xl border border-white/20 shadow-xl"
                                   >
                                     <label className="block text-xs font-bold text-white/90 mb-3 uppercase tracking-wide">
                                       Mínimo
                                     </label>
                                     <input
                                       type="number"
                                       placeholder="0"
                                       value={selectedFilters[activeCategory.key]?.min || ''}
                                       onChange={(e) => handleRangeFilterChange(activeCategory.key, 'min', e.target.value)}
                                       className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 text-base font-semibold text-white placeholder-white/40"
                                     />
                                   </motion.div>
                                   <motion.div 
                                     initial={{ opacity: 0, x: 20 }}
                                     animate={{ opacity: 1, x: 0 }}
                                     transition={{ delay: 0.2 }}
                                     className="bg-gradient-to-r from-white/15 to-white/10 backdrop-blur-xl p-4 rounded-xl border border-white/20 shadow-xl"
                                   >
                                     <label className="block text-xs font-bold text-white/90 mb-3 uppercase tracking-wide">
                                       Máximo
                                     </label>
                                     <input
                                       type="number"
                                       placeholder="100"
                                       value={selectedFilters[activeCategory.key]?.max || ''}
                                       onChange={(e) => handleRangeFilterChange(activeCategory.key, 'max', e.target.value)}
                                       className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 text-base font-semibold text-white placeholder-white/40"
                                     />
                                   </motion.div>
                                 </div>
                              </div>
                            );
                          } else if (activeCategory.type === 'select') {
                            return (
                              <div className="space-y-6">
                                                                 <div className="flex items-center space-x-3 mb-6">
                                   <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full shadow-lg"></div>
                                   <h4 className="text-lg font-bold text-white tracking-tight">
                                     {activeCategory.label}
                                   </h4>
                                 </div>
                                 <div className="space-y-2">
                                   {activeCategory.options?.map((option, index) => (
                                     <motion.label
                                       key={option}
                                       initial={{ opacity: 0, x: 20 }}
                                       animate={{ opacity: 1, x: 0 }}
                                       transition={{ delay: index * 0.1 }}
                                       whileHover={{ scale: 1.02, x: 5 }}
                                       className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/10 cursor-pointer transition-all duration-300 border border-transparent hover:border-white/20 shadow-lg"
                                     >
                                       <div className="relative">
                                         <input
                                           type="checkbox"
                                           checked={selectedFilters[activeCategory.key]?.includes(option) || false}
                                           onChange={() => handleSelectFilterToggle(activeCategory.key, option)}
                                           className="sr-only"
                                         />
                                         <motion.div 
                                           whileHover={{ scale: 1.1 }}
                                           whileTap={{ scale: 0.9 }}
                                           className={`w-6 h-6 border-2 rounded-lg flex items-center justify-center transition-all duration-300 ${
                                             selectedFilters[activeCategory.key]?.includes(option)
                                               ? 'bg-gradient-to-r from-blue-400 to-blue-500 border-blue-400 shadow-lg'
                                               : 'border-white/30 bg-white/10 backdrop-blur-xl hover:border-blue-400'
                                           }`}
                                         >
                                           {selectedFilters[activeCategory.key]?.includes(option) && (
                                             <Check className="w-3 h-3 text-white font-bold" />
                                           )}
                                         </motion.div>
                                       </div>
                                       <span className="text-white font-semibold text-sm">{option}</span>
                                     </motion.label>
                                   ))}
                                 </div>
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>

                                                                                  {/* Botones de acción */}
                   <div className="flex items-center justify-between p-6 border-t border-white/20 bg-gradient-to-r from-white/10 via-white/5 to-transparent backdrop-blur-xl">
                                            <motion.button
                         whileHover={{ scale: 1.05, x: -2 }}
                         whileTap={{ scale: 0.95 }}
                         onClick={handleClearFilters}
                         className="px-6 py-3 text-white/80 hover:text-white transition-all duration-300 font-semibold rounded-xl hover:bg-white/10 hover:shadow-xl border border-white/10 hover:border-white/20 text-sm"
                       >
                         Limpiar Filtros
                       </motion.button>
                       <motion.button
                         whileHover={{ scale: 1.05, x: 2 }}
                         whileTap={{ scale: 0.95 }}
                         onClick={handleApplyFilters}
                         className="px-8 py-3 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 border border-blue-400/30 text-sm"
                       >
                         Aplicar Filtros
                       </motion.button>
                   </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default TableMobile;
