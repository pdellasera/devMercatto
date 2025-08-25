import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Loader2, Search, Filter, UserPlus } from 'lucide-react';
import { cn } from '../../utils/cn';
import { FilterDropdown } from './FilterDropdown';

export interface Column<T> {
  key: string;
  header: string;
  accessor: (item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  priority?: 'high' | 'medium' | 'low';
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: string) => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  pageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  selectable?: boolean;
  selectedRows?: string[];
  onRowSelect?: (rowId: string, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void;
  rowKey?: (item: T) => string;
  searchable?: boolean;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  showHeader?: boolean;
  compact?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  // New filter props
  showFilters?: boolean;
  onClearFilters?: () => void;
  filterStatus?: string;
  onFilterChange?: (filters: any) => void;
  totalItems?: number;
  visibleItems?: number;
}

const Table = <T extends Record<string, any>>({
  data,
  columns,
  sortColumn,
  sortDirection,
  onSort,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  pageSize = 10,
  onPageSizeChange,
  loading = false,
  emptyMessage = 'No hay datos disponibles',
  className,
  selectable = false,
  selectedRows = [],
  onRowSelect,
  onSelectAll,
  rowKey = (item: T) => item.id?.toString() || '',
  searchable = false,
  onSearch,
  searchPlaceholder = 'Buscar en la tabla...',
  showHeader = true,
  compact = false,
  striped = true,
  hoverable = true,
  // New filter props
  showFilters = false,
  onClearFilters,
  filterStatus = 'Sin filtros',
  onFilterChange,
  totalItems = 0,
  visibleItems = 0,
}: TableProps<T>) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = React.useState(false);

  const handleSort = (columnKey: string) => {
    if (onSort) {
      onSort(columnKey);
    }
  };

  const handleRowSelect = (rowId: string, selected: boolean) => {
    onRowSelect?.(rowId, selected);
  };

  const handleSelectAll = (selected: boolean) => {
    onSelectAll?.(selected);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  const handleFilterToggle = () => {
    setIsFilterDropdownOpen(!isFilterDropdownOpen);
  };

  const handleAddFilter = (filterId: string) => {
    console.log('Adding filter:', filterId);
    // Aquí puedes implementar la lógica para agregar filtros
    onFilterChange?.({ [filterId]: true });
  };

  const handleClearAllFilters = () => {
    console.log('Clearing all filters');
    // Aquí puedes implementar la lógica para limpiar todos los filtros
    onClearFilters?.();
  };

  const isAllSelected = data.length > 0 && selectedRows.length === data.length;
  const isIndeterminate = selectedRows.length > 0 && selectedRows.length < data.length;

  const tableClasses = cn(
    'w-full bg-transparent border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl',
    'shadow-2xl shadow-black/20',
    className
  );

  const headerClasses = cn(
    'bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl',
    'border-b border-white/10'
  );

  const cellClasses = cn(
    'px-4 py-3 text-sm border-b border-white/5 text-white/90 transition-all duration-200',
    compact && 'px-3 py-2 text-xs',
    'relative'
  );

  const headerCellClasses = cn(
    'px-4 py-3 text-xs font-semibold text-white/85 uppercase tracking-wider',
    'bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl',
    compact && 'px-3 py-2 text-xs',
    'relative'
  );

  const rowClasses = cn(
    'transition-all duration-200 group',
    striped && 'even:bg-white/2',
    hoverable && 'hover:bg-white/5 hover:shadow-lg',
    'border-b border-white/5 last:border-b-0'
  );

  const selectedRowClasses = cn(
    'bg-gradient-to-r from-blue-500/10 to-purple-500/10',
    'border-l-4 border-l-blue-400'
  );

  return (
    <div className="w-full space-y-4">
      {/* Integrated Filters and Search Section */}
      {(searchable || showFilters) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-4">
            {/* Header with title and stats */}
            <div className="flex items-center space-x-3">
              <div className="w-2 h-8 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full"></div>
              <div>
                <h3 className="text-lg font-semibold text-white tracking-wide">
                  Filtros de Búsqueda
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  Encuentra el prospecto ideal para tu equipo
                </p>
              </div>
            </div>

            {/* Clear Filters and Status */}
            {showFilters && (
              <div className="flex items-center space-x-3">
                <button
                  onClick={onClearFilters}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white rounded-lg text-xs transition-all duration-200"
                >
                  Limpiar Filtros
                </button>
                <span className="text-xs text-gray-500">
                  {filterStatus}
                </span>
              </div>
            )}
          </div>

          {/* Search and Actions Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Search Bar */}
            {searchable && (
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                  <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            )}

                         {/* Action Buttons */}
             <div className="flex items-center justify-end gap-3">
               <div className="relative">
                 <button 
                   onClick={handleFilterToggle}
                   className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-md text-sm transition-all duration-200 flex items-center space-x-2"
                 >
                   <Filter className="w-4 h-4" />
                   <span>Filtros</span>
                 </button>
                 
                 {/* Filter Dropdown */}
                 <FilterDropdown
                   isOpen={isFilterDropdownOpen}
                   onClose={() => setIsFilterDropdownOpen(false)}
                   onAddFilter={handleAddFilter}
                   onClearAll={handleClearAllFilters}
                 />
               </div>
               
               <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg shadow-blue-500/25">
                 <UserPlus className="w-4 h-4" />
                 <span>Invitar a Visoria</span>
               </button>
             </div>
          </div>
        </motion.div>
      )}

      {/* Table Container */}
      <div className={tableClasses}>
        <div className="overflow-x-auto max-w-full">
          <table className="w-full min-w-full">
            {showHeader && (
              <thead className={headerClasses}>
                <tr>
                  {selectable && (
                    <th className="w-12 px-4 py-3">
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={isAllSelected}
                          ref={(input) => {
                            if (input) input.indeterminate = isIndeterminate;
                          }}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="w-4 h-4 text-blue-500 bg-white/10 border-white/20 rounded focus:ring-blue-500/50 focus:ring-2 transition-all duration-200"
                        />
                      </div>
                    </th>
                  )}
                  {columns.map((column, index) => (
                    <motion.th
                      key={column.key}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={cn(
                        headerCellClasses,
                        column.sortable && 'cursor-pointer hover:bg-white/10 transition-all duration-200',
                        column.width && `w-${column.width}`,
                        column.align && `text-${column.align}`
                      )}
                      onClick={() => column.sortable && handleSort(column.key)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white/90">{column.header}</span>
                        {column.sortable && (
                          <div className="ml-2 flex flex-col">
                            {sortColumn === column.key ? (
                              sortDirection === 'asc' ? (
                                <ChevronUp className="w-3 h-3 text-blue-400" />
                              ) : (
                                <ChevronDown className="w-3 h-3 text-blue-400" />
                              )
                            ) : (
                              <div className="w-3 h-3 text-white/30">
                                <ChevronUp className="w-2 h-2" />
                                <ChevronDown className="w-2 h-2" />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody className="bg-transparent">
              <AnimatePresence>
                {loading ? (
                  <>
                    {/* Enhanced Loading Skeleton Rows */}
                    {Array.from({ length: 10 }, (_, index) => (
                      <motion.tr
                        key={`skeleton-${index}`}
                        initial={{ opacity: 0, y: 20, scale: 0.70 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.70 }}
                        transition={{
                          delay: index * 0.05,
                          duration: 0.3,
                          ease: "easeOut"
                        }}
                        className="border-b border-white/5 hover:bg-white/2 transition-all duration-300"
                      >
                        {selectable && (
                          <td className="w-12 px-4 py-3">
                            <div className="w-4 h-4 bg-gradient-to-r from-white/20 to-white/10 rounded-md animate-pulse shadow-lg"></div>
                          </td>
                        )}
                        {columns.map((column, colIndex) => (
                          <td
                            key={`skeleton-${index}-${colIndex}`}
                            className={cn(
                              "px-4 py-3",
                              column.align && `text-${column.align}`
                            )}
                          >
                            {/* Avatar skeleton for first column */}
                            {colIndex === 0 && (
                              <div className="flex items-center space-x-3">
                                <div className="relative flex-shrink-0">
                                  <motion.div
                                    className="w-10 h-10 bg-gradient-to-br from-white/20 to-white/10 rounded-full shadow-lg relative overflow-hidden"
                                    animate={{
                                      background: [
                                        "linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 100%)",
                                        "linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.2) 100%)",
                                        "linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 100%)"
                                      ]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                  >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
                                  </motion.div>
                                  <motion.div
                                    className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400/30 to-orange-500/30 rounded-full"
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                  ></motion.div>
                                </div>

                                <div className="flex-1 space-y-2 min-w-0">
                                  {/* Name skeleton */}
                                  <motion.div
                                    className="h-4 bg-gradient-to-r from-white/20 to-white/10 rounded-md shadow-sm w-24 relative overflow-hidden"
                                    animate={{
                                      background: [
                                        "linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 100%)",
                                        "linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.2) 100%)"
                                      ]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                  >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                                  </motion.div>

                                  {/* Age and position skeleton */}
                                  <div className="flex items-center space-x-2">
                                    <motion.div
                                      className="w-12 h-3 bg-gradient-to-r from-gray-600/30 to-gray-500/20 rounded-full"
                                      animate={{ opacity: [0.5, 1, 0.5] }}
                                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                    ></motion.div>
                                    <motion.div
                                      className="w-2 h-2 bg-blue-400/30 rounded-full"
                                      animate={{ scale: [1, 1.2, 1] }}
                                      transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                                    ></motion.div>
                                    <motion.div
                                      className="w-16 h-3 bg-gradient-to-r from-white/15 to-white/8 rounded-md"
                                      animate={{ opacity: [0.5, 1, 0.5] }}
                                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                                    ></motion.div>
                                  </div>

                                  {/* Club and contract skeleton */}
                                  <div className="flex items-center space-x-3">
                                    <div className="flex items-center space-x-1">
                                      <motion.div
                                        className="w-3 h-3 bg-white/10 rounded"
                                        animate={{ opacity: [0.3, 0.7, 0.3] }}
                                        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                                      ></motion.div>
                                      <motion.div
                                        className="w-16 h-2 bg-gradient-to-r from-white/15 to-white/8 rounded"
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                                      ></motion.div>
                                    </div>
                                    <div className="w-px h-3 bg-white/10"></div>
                                    <div className="flex items-center space-x-1">
                                      <motion.div
                                        className="w-3 h-3 bg-white/10 rounded"
                                        animate={{ opacity: [0.3, 0.7, 0.3] }}
                                        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                      ></motion.div>
                                      <motion.div
                                        className="w-12 h-2 bg-gradient-to-r from-white/15 to-white/8 rounded"
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                                      ></motion.div>
                                    </div>
                                  </div>

                                  {/* Badges skeleton */}
                                  <div className="flex items-center space-x-2">
                                    <motion.div
                                      className="w-10 h-4 bg-gradient-to-r from-green-500/20 to-green-400/10 rounded-full"
                                      animate={{ scale: [1, 1.05, 1] }}
                                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    ></motion.div>
                                    <motion.div
                                      className="w-12 h-4 bg-gradient-to-r from-yellow-500/20 to-orange-400/10 rounded-full"
                                      animate={{ scale: [1, 1.05, 1] }}
                                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                    ></motion.div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Year of birth skeleton */}
                            {colIndex === 1 && (
                              <div className="text-center">
                                <motion.div
                                  className="h-4 bg-gradient-to-r from-white/20 to-white/10 rounded-md shadow-sm w-12 mx-auto relative overflow-hidden"
                                  animate={{
                                    background: [
                                      "linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 100%)",
                                      "linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.2) 100%)"
                                    ]
                                  }}
                                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                >
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                                </motion.div>
                                <motion.div
                                  className="h-3 bg-gradient-to-r from-white/15 to-white/8 rounded w-8 mx-auto mt-1"
                                  animate={{ opacity: [0.5, 1, 0.5] }}
                                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                ></motion.div>
                              </div>
                            )}

                            {/* Height skeleton */}
                            {colIndex === 2 && (
                              <div className="text-center">
                                <motion.div
                                  className="h-4 bg-gradient-to-r from-white/20 to-white/10 rounded-md shadow-sm w-10 mx-auto relative overflow-hidden"
                                  animate={{
                                    background: [
                                      "linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 100%)",
                                      "linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.2) 100%)"
                                    ]
                                  }}
                                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                >
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                                </motion.div>
                                <motion.div
                                  className="h-3 bg-gradient-to-r from-white/15 to-white/8 rounded w-12 mx-auto mt-1"
                                  animate={{ opacity: [0.5, 1, 0.5] }}
                                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                ></motion.div>
                              </div>
                            )}

                            {/* Performance metrics skeleton */}
                            {(colIndex === 3 || colIndex === 4 || colIndex === 5 || colIndex === 6 || colIndex === 7 || colIndex === 8) && (
                              <div className="text-center">
                                <motion.div
                                  className="h-5 bg-gradient-to-r from-white/20 to-white/10 rounded-md shadow-sm w-12 mx-auto relative overflow-hidden"
                                  animate={{
                                    background: [
                                      "linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 100%)",
                                      "linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.2) 100%)"
                                    ]
                                  }}
                                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                >
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                                </motion.div>
                                <motion.div
                                  className="h-3 bg-gradient-to-r from-white/10 to-white/5 rounded w-8 mx-auto mt-1"
                                  animate={{ opacity: [0.5, 1, 0.5] }}
                                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                ></motion.div>
                              </div>
                            )}

                            {/* Video icon skeleton for last column */}
                            {colIndex === columns.length - 1 && (
                              <div className="flex items-center justify-center">
                                <div className="relative">
                                  <motion.div
                                    className="w-10 h-10 bg-gradient-to-br from-white/20 to-white/10 rounded-lg shadow-lg relative overflow-hidden"
                                    animate={{
                                      background: [
                                        "linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 100%)",
                                        "linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.2) 100%)"
                                      ]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                  >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                                  </motion.div>
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <motion.div
                                      className="w-3 h-3 bg-white/30 rounded-full"
                                      animate={{ scale: [1, 1.2, 1] }}
                                      transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                                    ></motion.div>
                                  </div>
                                  <motion.div
                                    className="absolute top-1 right-1 w-2 h-2 bg-red-500/30 rounded-full"
                                    animate={{ scale: [1, 1.3, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                  ></motion.div>
                                </div>
                              </div>
                            )}
                          </td>
                        ))}
                      </motion.tr>
                    ))}
                  </>
                ) : data.length === 0 ? (
                  <motion.tr
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <td
                      colSpan={selectable ? columns.length + 1 : columns.length}
                      className="px-6 py-20 text-center"
                    >
                      <div className="flex flex-col items-center justify-center space-y-6">
                        {/* Enhanced Empty State Icon */}
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.2, duration: 0.5 }}
                          className="relative"
                        >
                          <div className="w-24 h-24 bg-gradient-to-br from-white/10 to-white/5 rounded-full flex items-center justify-center border border-white/10 shadow-2xl">
                            <Search className="w-12 h-12 text-white/40" />
                          </div>
                          <motion.div
                            animate={{
                              scale: [1, 1.1, 1],
                              opacity: [0.3, 0.6, 0.3]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                            className="absolute inset-0 w-24 h-24 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-xl"
                          />
                        </motion.div>

                        {/* Empty State Text */}
                        <div className="space-y-3">
                          <motion.h3
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="text-xl font-semibold text-white/80 tracking-wide"
                          >
                            {emptyMessage}
                          </motion.h3>
                          <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="text-white/50 text-sm max-w-md"
                          >
                            {searchQuery
                              ? "No se encontraron resultados para tu búsqueda. Intenta con otros términos."
                              : "No hay prospectos disponibles en este momento. Vuelve más tarde."
                            }
                          </motion.p>
                        </div>

                        {/* Action Buttons */}
                        {searchQuery && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="flex items-center space-x-4"
                          >
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleSearch('')}
                              className="px-6 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-200 shadow-lg"
                            >
                              Limpiar búsqueda
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-6 py-2 bg-gradient-to-r from-white/10 to-white/5 border border-white/20 text-white/70 rounded-lg hover:from-white/20 hover:to-white/10 transition-all duration-200"
                            >
                              Ver todos
                            </motion.button>
                          </motion.div>
                        )}

                        {/* Decorative Elements */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6, duration: 0.5 }}
                          className="flex items-center space-x-2 text-xs text-white/30"
                        >
                          <div className="w-1 h-1 bg-white/30 rounded-full"></div>
                          <span>Sin resultados</span>
                          <div className="w-1 h-1 bg-white/30 rounded-full"></div>
                        </motion.div>
                      </div>
                    </td>
                  </motion.tr>
                ) : (
                  data.map((item, index) => {
                    const rowId = typeof rowKey === 'function' ? rowKey(item) : item[rowKey];
                    const isSelected = selectedRows.includes(rowId);

                    return (
                      <motion.tr
                        key={rowId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{
                          delay: index * 0.05,
                          duration: 0.3,
                          ease: "easeOut"
                        }}
                        className={cn(
                          rowClasses,
                          isSelected && selectedRowClasses
                        )}
                      >
                        {selectable && (
                          <td className="w-12 px-4 py-3">
                            <div className="flex items-center justify-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => handleRowSelect(rowId, e.target.checked)}
                                className="w-4 h-4 text-blue-500 bg-white/10 border-white/20 rounded focus:ring-blue-500/50 focus:ring-2 transition-all duration-200"
                              />
                            </div>
                          </td>
                        )}
                        {columns.map((column, colIndex) => (
                          <motion.td
                            key={column.key}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 + colIndex * 0.02 }}
                            className={cn(
                              cellClasses,
                              column.align && `text-${column.align}`,
                              column.priority === 'high' && 'font-semibold text-white',
                              column.priority === 'medium' && 'text-white/90',
                              column.priority === 'low' && 'text-white/70'
                            )}
                          >
                            <div className="relative">
                              {typeof column.accessor === 'function' ? column.accessor(item) : item[column.key]}
                              {/* Hover effect */}
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                            </div>
                          </motion.td>
                        ))}
                      </motion.tr>
                    );
                  })
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between px-6 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl"
        >
          <div className="flex items-center space-x-4">
            <span className="text-sm text-white/70">
              Página <span className="font-semibold text-white">{currentPage}</span> de{' '}
              <span className="font-semibold text-white">{totalPages}</span>
            </span>
            <span className="text-xs text-white/50">
              {data.length} elementos por página
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <motion.button
                  key={page}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onPageChange?.(page)}
                  className={cn(
                    'px-3 py-2 text-sm rounded-lg transition-all duration-200 font-medium',
                    currentPage === page
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  )}
                >
                  {page}
                </motion.button>
              );
            })}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export { Table };
