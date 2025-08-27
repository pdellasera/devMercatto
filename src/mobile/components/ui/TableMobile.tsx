import React, { useState, useCallback, useMemo, useEffect } from 'react';
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
import { useAuth } from '../../../hooks/useAuth';

export interface TableMobileColumn<T> {
  key: string;
  header: string;
  accessor: (item: T, index: number, theme?: 'dark' | 'light') => React.ReactNode;
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
  theme?: 'dark' | 'light';
  pagination?: {
    page: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  onPageChange?: (page: number) => void;
  onFilterChange?: (filters: any) => void;
  onRequireAuth?: () => void;
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
  theme = 'dark',
  pagination,
  onPageChange,
  onFilterChange,
  onRequireAuth
}: TableMobileProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<any>({});
  const [screenSize, setScreenSize] = useState<'xs' | 'sm' | 'md' | 'lg'>('md');
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [selectedProspect, setSelectedProspect] = useState<any>(null);
  const { isAuthenticated } = useAuth();

  // Detección de tamaño de pantalla mejorada
  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      if (width < 390) {
        setScreenSize('xs'); // dispositivos muy pequeños (<390px)
      } else if (width < 640) {
        setScreenSize('sm'); // Dispositivos pequeños
      } else if (width < 1024) {
        setScreenSize('md'); // Tablets
      } else {
        setScreenSize('lg'); // Desktop
      }
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  // Columnas a mostrar: index, nombre (Jugador) y over/ovrGeneral. Usamos 'club' solo como detalle dentro de Jugador
  const composedColumns = useMemo(() => {
    const indexCol = columns.find(c => c.key === 'index');
    const nombreCol = columns.find(c => c.key === 'nombre');
    const overCol = columns.find(c => c.key === 'ovrGeneral' || c.key === 'over');
    const clubCol = columns.find(c => c.key === 'club');
    return { indexCol, nombreCol, overCol, clubCol };
  }, [columns]);

  // Filtrar datos por búsqueda
  const filteredData = useMemo(() => {
    if (!searchable || !searchQuery) return data;

    return data.filter((item, itemIndex) => {
        const searchLower = searchQuery.toLowerCase();
        // Buscar en nombre y club prioritariamente si existen, si no, en cualquier columna
        const { nombreCol, clubCol } = composedColumns;
        if (nombreCol || clubCol) {
          const fields: string[] = [];
          if (nombreCol) {
            const v = nombreCol.accessor(item, itemIndex, theme);
            if (typeof v === 'string') fields.push(v.toLowerCase());
          }
          if (clubCol) {
            const v = clubCol.accessor(item, itemIndex, theme);
            if (typeof v === 'string') fields.push(v.toLowerCase());
          }
          return fields.some(f => f.includes(searchLower));
        }
        return columns.some(column => {
          const value = column.accessor(item, itemIndex, theme);
          if (typeof value === 'string') {
            return value.toLowerCase().includes(searchLower);
          }
          return false;
        });
    });
  }, [data, searchQuery, searchable, columns, composedColumns, theme]);

  // Manejar búsqueda
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  }, [onSearch]);

  // Manejar ordenamiento (solo sobre index, nombre, over si existen)
  const handleSort = useCallback((key: string) => {
    if (!sortable || !onSort) return;
    const newDirection = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(key, newDirection);
  }, [sortable, onSort, sortKey, sortDirection]);

  // Función auxiliar para obtener páginas visibles - Mejorada para dispositivos pequeños
  const getVisiblePages = () => {
    if (!pagination) return [];

    const { page, totalPages } = pagination;
    const pages = [];

    // Detección mejorada para dispositivos pequeños
    let maxVisible = 5; // Default
    if (screenSize === 'xs') {
      maxVisible = 3; // muy pequeños
    } else if (screenSize === 'sm') {
      maxVisible = 4; // pequeños
    }

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

  // Clases responsive dinámicas
  const getResponsiveClasses = {
    // Main container
    mainContainerWidth: screenSize === 'xs' ? 'w-[95vw]' : screenSize === 'sm' ? 'w-[90vw]' : 'w-[95vw]',
    
    // Header
    headerPadding: screenSize === 'xs' ? 'p-2' : screenSize === 'sm' ? 'p-3' : 'p-3 sm:p-4',
    headerMargin: screenSize === 'xs' ? 'mb-2' : screenSize === 'sm' ? 'mb-3' : 'mb-3 sm:mb-4',
    titleSize: screenSize === 'xs' ? 'text-base' : screenSize === 'sm' ? 'text-lg' : 'text-lg',
    
    // Search
    searchPadding: screenSize === 'xs' ? 'py-2' : screenSize === 'sm' ? 'py-2' : 'py-2 sm:py-3',
    searchTextSize: screenSize === 'xs' ? 'text-sm' : screenSize === 'sm' ? 'text-sm' : 'text-sm sm:text-base',
    
    // Table content
    contentPadding: 'pb-0',
    
    // Table rows
    rowPadding: screenSize === 'xs' ? 'px-2 py-2' : screenSize === 'sm' ? 'px-3 py-2' : 'px-3 sm:px-4 py-2 sm:py-3',
    rowTextSize: screenSize === 'xs' ? 'text-xs' : screenSize === 'sm' ? 'text-sm' : 'text-sm',
    headerTextSize: 'text-xs',
    indexWidth: screenSize === 'xs' ? 'w-6' : 'w-8',
    overWidth: screenSize === 'xs' ? 'w-10' : 'w-12',

    // Paginator (restaurado)
    paginatorPadding: screenSize === 'xs' ? 'px-2 py-2' : screenSize === 'sm' ? 'px-3 py-3' : 'px-3 sm:px-4 lg:px-6 py-3',
    buttonSize: screenSize === 'xs' ? 'w-7 h-7' : screenSize === 'sm' ? 'w-8 h-8' : 'w-8 h-8 sm:w-9 sm:h-9 lg:w-8 lg:h-8',
    buttonTextSize: screenSize === 'xs' ? 'text-xs' : screenSize === 'sm' ? 'text-xs' : 'text-xs sm:text-sm',
    buttonSpacing: screenSize === 'xs' ? 'space-x-0.5' : screenSize === 'sm' ? 'space-x-1' : 'space-x-0.5 sm:space-x-1 lg:space-x-2',
    navButtonSize: screenSize === 'xs' ? 'p-1 min-w-[28px] min-h-[28px]' : screenSize === 'sm' ? 'p-1.5 min-w-[32px] min-h-[32px]' : 'p-1.5 sm:p-2 min-w-[32px] min-h-[32px] sm:min-w-[44px] sm:min-h-[44px]',
    navIconSize: screenSize === 'xs' ? 'w-3 h-3' : screenSize === 'sm' ? 'w-3 h-3' : 'w-3 h-3 sm:w-4 sm:h-4',

    // Modal (restaurado)
    modalMaxHeight: screenSize === 'xs' ? 'max-h-[70vh]' : screenSize === 'sm' ? 'max-h-[65vh]' : 'max-h-[60vh]',
    modalContentHeight: screenSize === 'xs' ? 'h-[calc(70vh-140px)]' : screenSize === 'sm' ? 'h-[calc(65vh-160px)]' : 'h-[calc(60vh-180px)]',
    modalPadding: screenSize === 'xs' ? 'p-4' : screenSize === 'sm' ? 'p-5' : 'p-6',
    modalPanelWidth: screenSize === 'xs' ? 'w-2/5' : screenSize === 'sm' ? 'w-1/3' : 'w-1/3',
    modalTitleSize: screenSize === 'xs' ? 'text-base' : screenSize === 'sm' ? 'text-lg' : 'text-lg',
    modalButtonPadding: screenSize === 'xs' ? 'px-4 py-2' : screenSize === 'sm' ? 'px-5 py-3' : 'px-6 py-3',
    modalButtonTextSize: screenSize === 'xs' ? 'text-xs' : screenSize === 'sm' ? 'text-sm' : 'text-sm',
  };

  return (
    <>
      <div className={cn(
        'flex flex-col h-full w-full',
        theme === 'light' ? '' : 'glass-card-mobile',
        className
      )}>
        {/* Header con título, filtro y búsqueda */}
        <div className="w-full px-3 sm:px-4 lg:px-6">
          <div className={cn('relative group', getResponsiveClasses.headerPadding, getResponsiveClasses.headerMargin)}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <h3 className={cn(
                  'font-semibold tracking-wide',
                  theme === 'light' ? 'text-gray-800' : 'text-white',
                  getResponsiveClasses.titleSize
                )}>{title}</h3>
              </div>
            </div>

            {/* Botón flotante de filtro - solo visible en mobile */}
            <button
              onClick={() => setShowFilterModal(true)}
              className={cn(
                'absolute top-3 right-3 p-2 rounded-lg transition-all duration-300 shadow-lg backdrop-blur-xl lg:hidden',
                theme === 'light' 
                  ? 'bg-gray-200/80 hover:bg-gray-300/80 border border-gray-300/50' 
                  : 'bg-white/10 hover:bg-white/20 border border-white/20',
                screenSize === 'xs' && 'top-2 right-2 p-1.5'
              )}
            >
              <Filter className={cn(
                'transition-colors',
                theme === 'light' ? 'text-gray-600 hover:text-gray-800' : 'text-white/80 hover:text-white',
                screenSize === 'xs' ? 'w-3.5 h-3.5' : 'w-4 h-4'
              )} />
            </button>

            {/* Subtitle */}
            {subtitle && (
              <div className={cn(
                'text-sm mb-3',
                theme === 'light' ? 'text-gray-600' : 'text-white/70'
              )}>
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
                <Search className={cn(
                  'absolute left-3 top-1/2 transform -translate-y-1/2',
                  theme === 'light' ? 'text-gray-500' : 'text-white/50',
                  screenSize === 'xs' ? 'w-3.5 h-3.5' : 'w-4 h-4'
                )} />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className={cn(
                    'w-full pl-10 pr-10 backdrop-blur-xl rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200',
                    theme === 'light' 
                      ? 'bg-gray-100/80 border border-gray-300/50 text-gray-800 placeholder-gray-500' 
                      : 'bg-white/5 border border-white/10 text-white placeholder-white/50',
                    getResponsiveClasses.searchPadding,
                    getResponsiveClasses.searchTextSize
                  )}
                />
                {searchQuery && (
                  <button
                    onClick={() => handleSearch('')}
                    className={cn(
                      'absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors',
                      theme === 'light' ? 'text-gray-500 hover:text-gray-700' : 'text-white/50 hover:text-white'
                    )}
                  >
                    <X className={cn(screenSize === 'xs' ? 'w-3.5 h-3.5' : 'w-4 h-4')} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Contenido de la tabla */}
        <div className={cn('flex-1 overflow-hidden ', getResponsiveClasses.contentPadding)}>
          <div className="w-full px-3 sm:px-4 lg:px-6"> 
            {loading ? (
              <div className="p-4">
                {/* Skeleton Loading */}
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className={cn(
                      "border-b transition-all duration-300 p-4 rounded-xl",
                      theme === 'light' ? "border-gray-200/50 hover:bg-gray-100/50" : "border-white/5 hover:bg-white/2"
                    )}>
                      <div className="space-y-3">
                        <div className={cn(
                          "h-4 rounded-md shadow-sm relative overflow-hidden",
                          theme === 'light' 
                            ? "bg-gradient-to-r from-gray-300/50 to-gray-200/50" 
                            : "bg-gradient-to-r from-white/20 to-white/10"
                        )}>
                          <div className={cn(
                            "absolute inset-0 animate-pulse",
                            theme === 'light' 
                              ? "bg-gradient-to-r from-transparent via-gray-400/30 to-transparent" 
                              : "bg-gradient-to-r from-transparent via-white/10 to-transparent"
                          )}></div>
                        </div>
                        <div className={cn(
                          "h-3 rounded w-3/4 relative overflow-hidden",
                          theme === 'light' 
                            ? "bg-gradient-to-r from-gray-300/40 to-gray-200/40" 
                            : "bg-gradient-to-r from-white/15 to-white/8"
                        )}>
                          <div className={cn(
                            "absolute inset-0 animate-pulse",
                            theme === 'light' 
                              ? "bg-gradient-to-r from-transparent via-gray-400/20 to-transparent" 
                              : "bg-gradient-to-r from-transparent via-white/10 to-transparent"
                          )}></div>
                        </div>
                        <div className={cn(
                          "h-3 rounded w-1/2 relative overflow-hidden",
                          theme === 'light' 
                            ? "bg-gradient-to-r from-gray-300/40 to-gray-200/40" 
                            : "bg-gradient-to-r from-white/15 to-white/8"
                        )}>
                          <div className={cn(
                            "absolute inset-0 animate-pulse",
                            theme === 'light' 
                              ? "bg-gradient-to-r from-transparent via-gray-400/20 to-transparent" 
                              : "bg-gradient-to-r from-transparent via-white/10 to-transparent"
                          )}></div>
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
                    <div className={cn(
                      "w-24 h-24 rounded-full flex items-center justify-center border shadow-2xl",
                      theme === 'light' 
                        ? "bg-gradient-to-br from-gray-200/80 to-gray-100/60 border-gray-300/50" 
                        : "bg-gradient-to-br from-white/10 to-white/5 border-white/10"
                    )}>
                      <div className={cn(
                        "w-12 h-12",
                        theme === 'light' ? "text-gray-500" : "text-white/40"
                      )}>⚠️</div>
                    </div>
                    <div className="space-y-3">
                      <h3 className={cn(
                        "text-xl font-semibold tracking-wide",
                        theme === 'light' ? "text-gray-800" : "text-white/80"
                      )}>Error al cargar datos</h3>
                      <p className={cn(
                        "text-sm max-w-md",
                        theme === 'light' ? "text-gray-600" : "text-white/50"
                      )}>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : filteredData.length === 0 ? (
              <div className="p-4">
                {/* Empty State */}
                <div className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center justify-center space-y-6">
                    <div className={cn(
                      "w-24 h-24 rounded-full flex items-center justify-center border shadow-2xl",
                      theme === 'light' 
                        ? "bg-gradient-to-br from-gray-200/80 to-gray-100/60 border-gray-300/50" 
                        : "bg-gradient-to-br from-white/10 to-white/5 border-white/10"
                    )}>
                      <Search className={cn(
                        "w-12 h-12",
                        theme === 'light' ? "text-gray-500" : "text-white/40"
                      )} />
                    </div>
                    <div className="space-y-3">
                      <h3 className={cn(
                        "text-xl font-semibold tracking-wide",
                        theme === 'light' ? "text-gray-800" : "text-white/80"
                      )}>{emptyMessage}</h3>
                      <p className={cn(
                        "text-sm max-w-md",
                        theme === 'light' ? "text-gray-600" : "text-white/50"
                      )}>
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
              <div className="h-full overflow-x-hidden">
              <div className="overflow-x-hidden">
                {/* Table Content */}
                <div className="w-full">
                  <div className={cn(
                    'w-full bg-transparent border rounded-xl sm:rounded-2xl overflow-hidden backdrop-blur-xl shadow-xl sm:shadow-2xl glass-card-mobile-light',
                    theme === 'light' 
                      ? 'border-gray-300/50 shadow-gray-200/50' 
                      : 'border-white/10 shadow-black/20'
                  )}>
                    {/* Header - forzado a 3 columnas: #, Jugador, Over */}
                    <div className={cn(
                      'backdrop-blur-xl border-b flex rounded-md px-2',
                      theme === 'light' 
                        ? 'bg-gradient-to-r from-gray-100/80 to-gray-200/60 border-gray-300/50' 
                        : 'bg-gradient-to-r from-white/5 to-white/10 border-white/10'
                    )}>
                      {composedColumns.indexCol && (
                        <div className={cn(
                          'py-3 font-semibold uppercase tracking-wider flex items-center justify-center',
                          getResponsiveClasses.headerTextSize,
                          theme === 'light' ? 'text-gray-700' : 'text-gray-300',
                          getResponsiveClasses.indexWidth,
                          'flex-shrink-0'
                        )}>
                          <span>#</span>
                        </div>
                      )}
                      {composedColumns.nombreCol && (
                        <div className={cn(
                          'px-2 py-3 font-semibold uppercase tracking-wider flex items-center',
                          getResponsiveClasses.headerTextSize,
                          theme === 'light' ? 'text-gray-700' : 'text-gray-300',
                          'flex-1 min-w-0'
                        )}>
                          <span className="truncate">Jugador</span>
                        </div>
                      )}
                      {composedColumns.overCol && (
                        <div className={cn(
                          'py-3 font-semibold uppercase tracking-wider flex items-center justify-center',
                          getResponsiveClasses.headerTextSize,
                          theme === 'light' ? 'text-gray-700' : 'text-gray-300',
                          getResponsiveClasses.overWidth,
                          'flex-shrink-0'
                        )}>
                          <span>Over</span>
                        </div>
                      )}
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
                            'transition-all duration-200 group',
                            'border-b',
                            theme === 'light' 
                              ? 'border-gray-200/50 hover:bg-gray-100/50' 
                              : 'border-white/5 hover:bg-white/2',
                            onRowClick && 'cursor-pointer',
                            'flex items-center',
                            getResponsiveClasses.rowPadding,
                            'w-full'
                          )}
                          onClick={() => {
                            onRowClick?.(item as any);
                            setSelectedProspect(item as any);
                            setShowPlayerModal(true);
                          }}
                        >
                          {/* Index */}
                          {composedColumns.indexCol && (
                            <div className={cn(
                              'flex items-center justify-center',
                              getResponsiveClasses.indexWidth,
                              'flex-shrink-0'
                            )}>
                              <span className={cn(
                                'font-medium text-center',
                                theme === 'light' ? 'text-gray-700' : 'text-white/80',
                                screenSize === 'xs' ? 'text-sm' : 'text-base'
                              )}>
                                {typeof composedColumns.indexCol.accessor === 'function'
                                  ? composedColumns.indexCol.accessor(item, index, theme)
                                  : index + 1}
                              </span>
                            </div>
                          )}

                          {/* Jugador (Nombre + Club) */}
                          {composedColumns.nombreCol && (
                            <div className={cn('flex-1 min-w-0 px-2')}>
                              <div className="flex flex-col min-w-0">
                                <span className={cn(
                                  'font-bold leading-tight truncate',
                                  theme === 'light' ? 'text-gray-900' : 'text-white',
                                  screenSize === 'xs' ? 'text-lg' : 'text-xl'
                                )}>
                                  {composedColumns.nombreCol.accessor(item, index, theme)}
                                </span>
                                {composedColumns.clubCol && (
                                  <span className={cn(
                                    'truncate',
                                    theme === 'light' ? 'text-gray-600' : 'text-white/70',
                                    screenSize === 'xs' ? 'text-sm' : 'text-base'
                                  )}>
                                    {composedColumns.clubCol.accessor(item, index, theme)}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Over */}
                          {composedColumns.overCol && (
                            <div className={cn(
                              'flex items-center justify-center',
                              getResponsiveClasses.overWidth,
                              'flex-shrink-0'
                            )}>
                              <span className={cn(
                                'font-bold text-center',
                                theme === 'light' ? 'text-gray-900' : 'text-white',
                                screenSize === 'xs' ? 'text-lg' : 'text-2xl'
                              )}>
                                {composedColumns.overCol.accessor(item, index, theme)}
                              </span>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            )}
          </div>
        </div>
      </div>

      {/* Paginación Fija fuera del contenedor principal */}
      {pagination && (
        <div className={cn(
          "fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl shadow-2xl pb-safe",
          theme === 'light' 
            ? "bg-gray-50/95 border-t border-gray-300/50" 
            : "bg-background-secondary border-t border-white/10"
        )}>
          <div className={cn("w-full", getResponsiveClasses.paginatorPadding)}>
                          <div className={theme === 'light' ? "glass-card-mobile-compact-light" : "glass-card-mobile-compact"}>
              {pagination.totalPages <= 1 ? (
                // Una sola página
                <div className="flex items-center justify-center">
                  <button className={cn(
                    "rounded-lg border font-medium transition-all duration-200 bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/25 touch-manipulation",
                    getResponsiveClasses.buttonSize,
                    getResponsiveClasses.buttonTextSize
                  )}>
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
                      "rounded-lg border transition-all duration-200 touch-manipulation",
                      getResponsiveClasses.navButtonSize,
                      getResponsiveClasses.navIconSize,
                      pagination.page <= 1
                        ? theme === 'light' 
                          ? "border-gray-300/50 text-gray-400 cursor-not-allowed"
                          : "border-white/10 text-white/30 cursor-not-allowed"
                        : theme === 'light'
                          ? "border-gray-400/50 text-gray-600 hover:bg-gray-200/50 hover:text-gray-800 hover:border-gray-500/50"
                          : "border-white/20 text-white/80 hover:bg-white/10 hover:text-white hover:border-white/30"
                    )}
                  >
                    <ChevronLeft className={getResponsiveClasses.navIconSize} />
                  </button>

                  <div className={cn("flex flex-1 justify-center min-w-0", getResponsiveClasses.buttonSpacing)}>
                    {getVisiblePages().map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => onPageChange?.(pageNum)}
                        className={cn(
                          "rounded-lg border font-medium transition-all duration-200 touch-manipulation",
                          getResponsiveClasses.buttonSize,
                          getResponsiveClasses.buttonTextSize,
                          pageNum === pagination.page
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/25"
                            : theme === 'light'
                              ? "border-gray-400/50 text-gray-600 hover:bg-gray-200/50 hover:text-gray-800 hover:border-gray-500/50"
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
                      "rounded-lg border transition-all duration-200 touch-manipulation",
                      getResponsiveClasses.navButtonSize,
                      getResponsiveClasses.navIconSize,
                                          pagination.page >= pagination.totalPages
                      ? theme === 'light' 
                        ? "border-gray-300/50 text-gray-400 cursor-not-allowed"
                        : "border-white/10 text-white/30 cursor-not-allowed"
                      : theme === 'light'
                        ? "border-gray-400/50 text-gray-600 hover:bg-gray-200/50 hover:text-gray-800 hover:border-gray-500/50"
                        : "border-white/20 text-white/80 hover:bg-white/10 hover:text-white hover:border-white/30"
                    )}
                  >
                    <ChevronRight className={getResponsiveClasses.navIconSize} />
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
              className={cn(
                "fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-b from-white/15 via-white/10 to-white/5 backdrop-blur-2xl border border-white/30 rounded-t-[2rem] shadow-2xl overflow-hidden",
                getResponsiveClasses.modalMaxHeight
              )}
              style={{
                boxShadow: '0 -25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(24px) saturate(180%)'
              }}
            >
              {/* Header del modal */}
              <div className={cn("flex items-center justify-between border-b border-white/20 bg-gradient-to-r from-white/10 via-white/5 to-transparent backdrop-blur-xl relative", getResponsiveClasses.modalPadding)}>
                <div className="flex items-center space-x-3">
                  <div className={cn("rounded-xl bg-gradient-to-br from-blue-400/20 to-blue-600/20 backdrop-blur-xl border border-blue-400/30 flex items-center justify-center", screenSize === 'xs' ? "w-8 h-8" : "w-10 h-10")}>
                    <Filter className={cn("text-blue-300", screenSize === 'xs' ? "w-4 h-4" : "w-5 h-5")} />
                  </div>
                  <div>
                    <h3 className={cn("font-bold text-white tracking-tight", getResponsiveClasses.modalTitleSize)}>Filtros Avanzados</h3>
                    <p className="text-xs text-white/60 font-medium">Personaliza tu búsqueda</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFilterModal(false)}
                  className={cn(
                    "rounded-xl bg-gradient-to-br from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 border border-white/20 flex items-center justify-center transition-all duration-300 shadow-lg",
                    screenSize === 'xs' ? "w-8 h-8" : "w-10 h-10"
                  )}
                >
                  <X className={cn("text-white/80", screenSize === 'xs' ? "w-4 h-4" : "w-5 h-5")} />
                </motion.button>
              </div>

              {/* Contenido del modal */}
              <div className={cn("flex", getResponsiveClasses.modalContentHeight)}>
                {/* Panel izquierdo - Categorías con scroll vertical */}
                <div className={cn("bg-gradient-to-b from-white/8 via-white/5 to-transparent backdrop-blur-xl border-r border-white/20 flex flex-col", getResponsiveClasses.modalPanelWidth)}>
                  <div className="flex-1 overflow-y-auto scrollbar-hide">
                    <div className={cn("space-y-3", getResponsiveClasses.modalPadding)}>
                      {filterCategories.map((category, index) => (
                        <motion.button
                          key={category.key}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.02, x: 2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedFilters((prev: any) => ({ ...prev, activeCategory: category.key }))}
                          className={cn(
                            "w-full text-left transition-all duration-300",
                            screenSize === 'xs' ? "p-3 rounded-xl" : "p-4 rounded-2xl",
                            selectedFilters.activeCategory === category.key
                              ? 'bg-gradient-to-r from-blue-400/20 to-blue-600/20 backdrop-blur-xl shadow-xl border-2 border-blue-400/50 font-semibold text-white transform scale-105'
                              : 'text-white/80 hover:bg-white/10 hover:shadow-lg hover:scale-102 border border-white/10 hover:border-white/20'
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span className={cn(
                              "font-medium",
                              screenSize === 'xs' ? "text-xs" : "text-xs",
                              selectedFilters.activeCategory === category.key ? 'text-white' : 'text-white/80'
                            )}>
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
                                  className={cn(
                                    "bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-full flex items-center justify-center font-bold shadow-lg",
                                    screenSize === 'xs' ? "w-6 h-6 text-xs" : "w-7 h-7 text-xs"
                                  )}
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
                  <div className={getResponsiveClasses.modalPadding}>
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
                                  <div className={cn("bg-gradient-to-r from-blue-400 to-blue-500 rounded-full shadow-lg", screenSize === 'xs' ? "w-2 h-2" : "w-2.5 h-2.5")}></div>
                                  <h4 className={cn("font-bold text-white tracking-tight", screenSize === 'xs' ? "text-base" : "text-lg")}>
                                    {activeCategory.label}
                                  </h4>
                                </div>
                                <div className="space-y-4">
                                  <motion.div 
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className={cn(
                                      "bg-gradient-to-r from-white/15 to-white/10 backdrop-blur-xl border border-white/20 shadow-xl",
                                      screenSize === 'xs' ? "p-3 rounded-lg" : "p-4 rounded-xl"
                                    )}
                                  >
                                    <label className={cn("block font-bold text-white/90 mb-3 uppercase tracking-wide", screenSize === 'xs' ? "text-xs" : "text-xs")}>
                                      Mínimo
                                    </label>
                                    <input
                                      type="number"
                                      placeholder="0"
                                      value={selectedFilters[activeCategory.key]?.min || ''}
                                      onChange={(e) => handleRangeFilterChange(activeCategory.key, 'min', e.target.value)}
                                      className={cn(
                                        "w-full bg-white/10 backdrop-blur-xl border-2 border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 font-semibold text-white placeholder-white/40",
                                        screenSize === 'xs' ? "px-3 py-2 text-sm rounded-md" : "px-4 py-3 text-base rounded-lg"
                                      )}
                                    />
                                  </motion.div>
                                  <motion.div 
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className={cn(
                                      "bg-gradient-to-r from-white/15 to-white/10 backdrop-blur-xl border border-white/20 shadow-xl",
                                      screenSize === 'xs' ? "p-3 rounded-lg" : "p-4 rounded-xl"
                                    )}
                                  >
                                    <label className={cn("block font-bold text-white/90 mb-3 uppercase tracking-wide", screenSize === 'xs' ? "text-xs" : "text-xs")}>
                                      Máximo
                                    </label>
                                    <input
                                      type="number"
                                      placeholder="100"
                                      value={selectedFilters[activeCategory.key]?.max || ''}
                                      onChange={(e) => handleRangeFilterChange(activeCategory.key, 'max', e.target.value)}
                                      className={cn(
                                        "w-full bg-white/10 backdrop-blur-xl border-2 border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 font-semibold text-white placeholder-white/40",
                                        screenSize === 'xs' ? "px-3 py-2 text-sm rounded-md" : "px-4 py-3 text-base rounded-lg"
                                      )}
                                    />
                                  </motion.div>
                                </div>
                              </div>
                            );
                          } else if (activeCategory.type === 'select') {
                            return (
                              <div className="space-y-6">
                                <div className="flex items-center space-x-3 mb-6">
                                  <div className={cn("bg-gradient-to-r from-blue-400 to-blue-500 rounded-full shadow-lg", screenSize === 'xs' ? "w-2 h-2" : "w-2.5 h-2.5")}></div>
                                  <h4 className={cn("font-bold text-white tracking-tight", screenSize === 'xs' ? "text-base" : "text-lg")}>
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
                                      className={cn(
                                        "flex items-center space-x-3 cursor-pointer transition-all duration-300 border border-transparent hover:border-white/20 shadow-lg",
                                        screenSize === 'xs' ? "p-2 rounded-lg space-x-2" : "p-3 rounded-xl space-x-3"
                                      )}
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
                                          className={cn(
                                            "border-2 flex items-center justify-center transition-all duration-300",
                                            screenSize === 'xs' ? "w-5 h-5 rounded-md" : "w-6 h-6 rounded-lg",
                                            selectedFilters[activeCategory.key]?.includes(option)
                                              ? 'bg-gradient-to-r from-blue-400 to-blue-500 border-blue-400 shadow-lg'
                                              : 'border-white/30 bg-white/10 backdrop-blur-xl hover:border-blue-400'
                                          )}
                                        >
                                          {selectedFilters[activeCategory.key]?.includes(option) && (
                                            <Check className={cn("text-white font-bold", screenSize === 'xs' ? "w-2.5 h-2.5" : "w-3 h-3")} />
                                          )}
                                        </motion.div>
                                      </div>
                                      <span className={cn("text-white font-semibold", screenSize === 'xs' ? "text-xs" : "text-sm")}>{option}</span>
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
              <div className={cn("flex items-center justify-between border-t border-white/20 bg-gradient-to-r from-white/10 via-white/5 to-transparent backdrop-blur-xl", getResponsiveClasses.modalPadding)}>
                <motion.button
                  whileHover={{ scale: 1.05, x: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClearFilters}
                  className={cn(
                    "text-white/80 hover:text-white transition-all duration-300 font-semibold rounded-xl hover:bg-white/10 hover:shadow-xl border border-white/10 hover:border-white/20",
                    getResponsiveClasses.modalButtonPadding,
                    getResponsiveClasses.modalButtonTextSize
                  )}
                >
                  Limpiar Filtros
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, x: 2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleApplyFilters}
                  className={cn(
                    "bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 border border-blue-400/30",
                    getResponsiveClasses.modalButtonPadding,
                    getResponsiveClasses.modalButtonTextSize
                  )}
                >
                  Aplicar Filtros
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modal Detalle de Jugador */}
      <AnimatePresence>
        {showPlayerModal && selectedProspect && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setShowPlayerModal(false)}
            />

            <motion.div
              initial={{ y: '100%', scale: 0.95, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: '100%', scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 400, mass: 0.8 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 100 || info.velocity.y > 800) setShowPlayerModal(false);
              }}
              className={cn(
                'fixed bottom-0 left-0 right-0 z-50 backdrop-blur-2xl border rounded-t-[2rem] shadow-2xl overflow-hidden',
                theme === 'light' 
                  ? 'bg-white/95 border-gray-200' 
                  : 'bg-gradient-to-b from-gray-900/95 via-gray-900/90 to-gray-900/85 border-white/10',
                getResponsiveClasses.modalMaxHeight
              )}
            >
              {/* Asa superior para gesto */}
              <div className="flex items-center justify-center pt-3">
                <div className={cn('w-12 h-1.5 rounded-full', theme === 'light' ? 'bg-gray-300/90' : 'bg-white/20')} />
              </div>
              {/* Header */}
              <div className={cn(
                'flex items-center justify-between border-b relative',
                theme === 'light' ? 'border-gray-200 bg-white/70' : 'border-white/10 bg-white/5',
                getResponsiveClasses.modalPadding
              )}>
                <div className="flex items-center space-x-3 min-w-0">
                  <div className={cn(
                    'rounded-xl border flex items-center justify-center overflow-hidden flex-shrink-0 ring-2',
                    theme === 'light' ? 'border-gray-200 ring-blue-100' : 'border-white/10 ring-white/10',
                    screenSize === 'xs' ? 'w-12 h-12' : 'w-14 h-14'
                  )}>
                    <img src={(selectedProspect as any).imgData} alt={(selectedProspect as any).name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center justify-between min-w-0">
                      <div className="flex items-center gap-2 min-w-0">
                        <img src="/flag_co.png" alt="Bandera" className="w-4 h-3 rounded-[2px] object-cover flex-shrink-0" />
                        <h3 className={cn('font-bold leading-tight whitespace-normal break-words', screenSize === 'xs' ? 'text-base' : 'text-lg', theme === 'light' ? 'text-gray-900' : 'text-white')} style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {(selectedProspect as any).name}
                        </h3>
                      </div>
                      <span className={cn('ml-2 flex-shrink-0', screenSize === 'xs' ? 'text-xs' : 'text-sm', theme === 'light' ? 'text-gray-600' : 'text-white/70')}>
                        {(selectedProspect as any).age} años
                      </span>
                    </div>
                    {/* Segunda línea: posición, estado (chip) y club */}
                    <div className="flex items-center justify-between min-w-0">
                      <div className={cn('flex items-center gap-2 min-w-0', screenSize === 'xs' ? 'text-xs' : 'text-sm', theme === 'light' ? 'text-gray-700' : 'text-white/80')}>
                        <span className="truncate">{(selectedProspect as any).position}</span>
                        <span>•</span>
                        <span className="truncate max-w-[44vw] sm:max-w-[52vw]">{(selectedProspect as any).club || 'Club no disponible'}</span>
                      </div>
                      <span className={cn(
                        'px-2 py-0.5 rounded-full text-[10px] font-semibold ml-2 flex-shrink-0',
                        theme === 'light' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-white/10 text-white border border-white/10'
                      )}>
                        {(selectedProspect as any).status || '—'}
                      </span>
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowPlayerModal(false)}
                  className={cn('absolute right-3 top-3 rounded-xl flex items-center justify-center', screenSize === 'xs' ? 'w-9 h-9' : 'w-10 h-10', theme === 'light' ? 'text-gray-600 hover:bg-gray-100' : 'text-white/80 hover:bg-white/10')}
                >
                  <X className={cn(screenSize === 'xs' ? 'w-4 h-4' : 'w-5 h-5')} />
                </motion.button>
              </div>

              {/* Contenido */}
              <div className={cn('space-y-4 overflow-y-auto', getResponsiveClasses.modalContentHeight, getResponsiveClasses.modalPadding)}>
                {/* Overalls */}
                <div>
                  <h4 className={cn('font-semibold mb-2', theme === 'light' ? 'text-gray-900' : 'text-white')}>Overalls</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {['ovrGeneral','ovrFisico','ovrTecnico','overCompetencia'].map((k) => {
                      const val = (selectedProspect as any)[k] ?? 0;
                      const color = val === 0 ? (theme === 'light' ? 'text-gray-500' : 'text-gray-400') : val >= 90 ? 'text-green-500' : val >= 70 ? 'text-yellow-400' : val >= 60 ? 'text-orange-400' : 'text-red-400';
                      const ring = val === 0 ? (theme === 'light' ? 'ring-gray-200' : 'ring-white/10') : val >= 90 ? 'ring-green-500/30' : val >= 70 ? 'ring-yellow-400/30' : val >= 60 ? 'ring-orange-400/30' : 'ring-red-400/30';
                      const labelMap: Record<string,string> = { ovrGeneral: 'OVR', ovrFisico: 'Físico', ovrTecnico: 'Técnico', overCompetencia: 'Compet.' };
                      return (
                        <div key={k} className={cn('rounded-xl border p-2 text-center ring-1', theme === 'light' ? 'border-gray-200' : 'border-white/10', ring)}>
                          <div className={cn('text-[11px] mb-1', theme === 'light' ? 'text-gray-600' : 'text-white/70')}>{labelMap[k]}</div>
                          <div className={cn('font-bold text-lg', color)}>{val || '-'}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Métricas físicas con barras */}
                <div>
                  <h4 className={cn('font-semibold mb-2', theme === 'light' ? 'text-gray-900' : 'text-white')}>Métricas físicas</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      ['Talla', 'talla', 220],
                      ['Resistencia', 'resistencia', 100],
                      ['Fuerza', 'fuerza', 100],
                      ['Potencia', 'potencia', 100],
                      ['Agilidad', 'agilidad', 100],
                      ['Velocidad', 'velocidad', 100],
                      ['Flexibilidad', 'flexibilidad', 100]
                    ].map(([label, key, max]) => {
                      const raw = (selectedProspect as any)[key as string];
                      const value = typeof raw === 'number' ? raw : 0;
                      const pct = Math.max(0, Math.min(100, Math.round((value / (max as number)) * 100)));
                      return (
                        <div key={key as string} className={cn('rounded-xl border p-2', theme === 'light' ? 'border-gray-200' : 'border-white/10')}>
                          <div className="flex items-center justify-between mb-1">
                            <div className={cn('text-xs', theme === 'light' ? 'text-gray-600' : 'text-white/70')}>{label}</div>
                            <div className={cn('text-xs font-semibold', theme === 'light' ? 'text-gray-900' : 'text-white')}>{value || '-'}</div>
                          </div>
                          <div className={cn('w-full h-2 rounded-full overflow-hidden', theme === 'light' ? 'bg-gray-200/80' : 'bg-white/10')}>
                            <div className={cn('h-full rounded-full transition-all', 'bg-gradient-to-r from-blue-500 to-blue-600')} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Datos personales */}
                <div>
                  <h4 className={cn('font-semibold mb-2', theme === 'light' ? 'text-gray-900' : 'text-white')}>Datos personales</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className={cn('rounded-xl border p-2', theme === 'light' ? 'border-gray-200' : 'border-white/10')}>
                      <div className={cn('text-xs', theme === 'light' ? 'text-gray-600' : 'text-white/70')}>Año de nacimiento</div>
                      <div className={cn('font-semibold', theme === 'light' ? 'text-gray-900' : 'text-white')}>{(selectedProspect as any).yearOfbirth ?? '-'}</div>
                    </div>
                    <div className={cn('rounded-xl border p-2', theme === 'light' ? 'border-gray-200' : 'border-white/10')}>
                      <div className={cn('text-xs', theme === 'light' ? 'text-gray-600' : 'text-white/70')}>Fecha de nacimiento</div>
                      <div className={cn('font-semibold', theme === 'light' ? 'text-gray-900' : 'text-white')}>{(selectedProspect as any).birthdayDate ?? '-'}</div>
                    </div>
                    <div className={cn('rounded-xl border p-2 col-span-2', theme === 'light' ? 'border-gray-200' : 'border-white/10')}>
                      <div className={cn('text-xs', theme === 'light' ? 'text-gray-600' : 'text-white/70')}>Estado</div>
                      <div className={cn('font-semibold', theme === 'light' ? 'text-gray-900' : 'text-white')}>{(selectedProspect as any).status ?? '-'}</div>
                    </div>
                  </div>
                </div>

                {/* Videos */}
                {!!(selectedProspect as any).videos && (
                  <div>
                    <h4 className={cn('font-semibold mb-2', theme === 'light' ? 'text-gray-900' : 'text-white')}>Videos</h4>
                    <div className={cn('rounded-xl border p-3', theme === 'light' ? 'border-gray-200' : 'border-white/10')}>
                      <div className={cn('text-xs mb-1', theme === 'light' ? 'text-gray-600' : 'text-white/70')}>Enlaces o datos de video</div>
                      <div className={cn('font-mono text-xs break-words', theme === 'light' ? 'text-gray-800' : 'text-white/90')}>{(selectedProspect as any).videos}</div>
                    </div>
                  </div>
                )}

                {/* Barra de acciones */}
                <div className={cn('flex items-center justify-end gap-2 pt-2 border-t', theme === 'light' ? 'border-gray-200' : 'border-white/10')}>
                  <button className={cn('px-4 py-2 rounded-lg font-medium', theme === 'light' ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' : 'bg-white/10 text-white hover:bg-white/20')}>Ver más</button>
                  <button
                    onClick={() => {
                      if (!isAuthenticated) {
                        setShowPlayerModal(false);
                        onRequireAuth && onRequireAuth();
                        return;
                      }
                      // Acción real de contactar (TODO integrar flujo real)
                      console.log('Contactar atleta', (selectedProspect as any)?.sessionID);
                    }}
                    className={cn('px-4 py-2 rounded-lg font-semibold text-white shadow', 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700')}
                  >
                    Contactar
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default TableMobile;
