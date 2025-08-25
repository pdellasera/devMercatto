import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  TrendingUp,
  Video,
  Star,
  Search,
  Filter,
  UserPlus,
  Eye,
  Calendar,
  BarChart3,
  Settings,
  FileText,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  List,
  RefreshCw
} from 'lucide-react';
import { cn } from '../utils/cn';
import { 
  useMobilePerformance, 
  useMobileGestures, 
  useMobileLoading, 
  useMobileOffline, 
  useMobileHaptic,
  useMobileDebounce,
  useMobilePerformanceMetrics,
  useMobileAccessibility,
  useMobileVoiceCommands,
  useMobileKeyboardNavigation
} from '../hooks';
import MobileButton from '../components/ui/MobileButton';
import { 
  PullToRefreshIndicator, 
  SwipeableContainer,
  MobileSkeleton,
  MobileLoadingSpinner,
  MobileLoadingOverlay,
  MobileLoadingPlaceholder,
  MobileOfflineIndicator,
  MobileCacheManager,
  MobileHapticButton,
  MobileHapticSettings,
  MobileLazyImage,
  MobileVirtualList,
  MobilePerformanceMonitor,
  MobileAccessibilitySettings,
  MobileSkipLinks,
  MobileErrorAnnouncer
} from '../components/ui';
import { useProspects } from '../../hooks/useProspects';
import { useAuth } from '../../hooks/useAuth';
import { Prospect } from '../../types';
import { LoginModal } from '../../components/ui/LoginModal';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.6,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const
    }
  },
};

export const DashboardMobile: React.FC = () => {
  const {
    prospects,
    metrics,
    pagination,
    loading,
    error,
    setFilters,
    setPage,
  } = useProspects();

  const { isAuthenticated, user } = useAuth();

  // Debug logs
  console.log('DashboardMobile render:', { prospects, loading, error, metrics });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPosition, setSelectedPosition] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAccessibilitySettings, setShowAccessibilitySettings] = useState(false);

  const positionOptions = [
    { value: '', label: 'Todas las posiciones' },
    { value: 'Portero', label: 'Portero' },
    { value: 'Portera', label: 'Portera' },
    { value: 'Defensa', label: 'Defensa' },
    { value: 'Centrocampista', label: 'Centrocampista' },
    { value: 'Delantero', label: 'Delantero' },
  ];

  const statusOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'Libre', label: 'Libre' },
    { value: 'Contratado', label: 'Contratado' },
    { value: 'Observado', label: 'Observado' },
    { value: 'Pendiente', label: 'Pendiente' },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters({ search: query, page: 1 });
  };

  const handleLogin = (email: string, password: string) => {
    console.log('Login attempt:', { email, password });
    setShowLoginModal(false);
  };

  const handleRegister = (email: string, password: string, name: string) => {
    console.log('Register attempt:', { email, password, name });
    setShowLoginModal(false);
  };

  const handlePositionFilter = (position: string | string[]) => {
    const pos = Array.isArray(position) ? position[0] : position;
    setSelectedPosition(pos);
    setFilters({ position: pos || undefined, page: 1 });
  };

  const handleStatusFilter = (status: string | string[]) => {
    const stat = Array.isArray(status) ? status[0] : status;
    setSelectedStatus(stat);
    setFilters({ status: stat || undefined, page: 1 });
  };

  const handleAddProspect = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    console.log('Agregar prospecto');
  };

  const handleContactAthlete = (prospectId: number) => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    console.log('Contactar atleta:', prospectId);
  };

  const handleViewDetails = (prospectId: number) => {
    console.log('Ver detalles del prospecto:', prospectId);
  };

  const getAge = (birthYear: number) => {
    return new Date().getFullYear() - birthYear;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    haptic.triggerClick();
    
    // Recargar datos usando el hook
    setFilters({ page: 1 });
    
    haptic.triggerSuccess();
    setIsRefreshing(false);
  };

  // Hooks móviles
  const haptic = useMobileHaptic({
    enabled: true,
    soundEnabled: true,
    hapticEnabled: true,
    defaultVolume: 0.5,
    defaultIntensity: 0.5,
  });

  const offlineState = useMobileOffline({
    cacheExpiry: 2 * 60 * 60 * 1000, // 2 horas
    maxCacheSize: 50,
    syncRetryAttempts: 3,
    syncRetryDelay: 5000,
    enableAutoSync: true,
  });

  const {
    settings: accessibilitySettings,
    isScreenReaderActive,
    announceToScreenReader,
    setFocus,
    updateSettings: updateAccessibilitySettings,
  } = useMobileAccessibility({
    onSettingsChange: (newSettings) => {
      announceToScreenReader('Configuración de accesibilidad actualizada');
    },
  });

  // Table columns configuration para móvil
  const columns = [
    {
      key: 'nombre',
      header: 'Jugador',
      accessor: (prospect: Prospect) => (
        <div className="flex items-center space-x-3 py-2">
          {/* Avatar con indicador de estado */}
          <div className="relative flex-shrink-0">
            {prospect.imgData ? (
              <MobileLazyImage
                src={prospect.imgData}
                alt={prospect.name}
                className="w-10 h-10 rounded-mobile-lg ring-2 ring-white/10"
                aspectRatio="square"
                objectFit="cover"
                showLoadingIndicator={false}
                showErrorIndicator={false}
                fallbackSrc="/images/placeholder-avatar.png"
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-mobile-lg flex items-center justify-center ring-2 ring-white/10">
                <span className="text-white font-bold text-mobile-xs">
                  {prospect.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            {/* Indicador de estado premium */}
            {prospect.fullaccess && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-[4px] font-bold text-black">★</span>
              </div>
            )}
          </div>

          {/* Información del jugador - Layout compacto */}
          <div className="flex-1 min-w-0">
            {/* Primera línea: Nombre, edad y posición */}
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-bold text-white text-mobile-sm leading-tight truncate">
                {prospect.name}
              </h3>
              <span className="text-mobile-xs text-gray-400 bg-gray-700/50 px-1 py-0.5 rounded-full">
                {prospect.age} años
              </span>
              <div className="flex items-center space-x-1">
                <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                <span className="text-mobile-xs text-gray-300 font-medium">
                  {prospect.position}
                </span>
              </div>
            </div>

            {/* Segunda línea: Club y contrato en línea */}
            <div className="flex items-center space-x-2 text-mobile-xs">
              <div className="flex items-center space-x-1">
                <span className="text-gray-400">Club:</span>
                <span className="text-white font-semibold bg-gray-700/50 px-1 py-0.5 rounded-full">
                  {prospect.status || 'Sin club'}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-gray-400">Contrato:</span>
                <span className="text-white font-semibold">
                  {prospect.birthdayDate ? formatDate(prospect.birthdayDate) : 'Sin fecha'}
                </span>
              </div>
            </div>

            {/* Tercera línea: Badges de estado */}
            <div className="flex items-center space-x-2 mt-1">
              {prospect.fullaccess && (
                <span className="text-[8px] bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-1 py-0.5 rounded-full font-bold shadow-sm">
                  PREMIUM
                </span>
              )}
              <span className={`text-[8px] px-1 py-0.5 rounded-full font-semibold ${prospect.status === 'Contratado'
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                }`}>
                {prospect.status === 'Contratado' ? 'ACTIVO' : 'PENDIENTE'}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'yearOfbirth',
      header: 'Año',
      accessor: (prospect: Prospect) => (
        <div className="text-center">
          <div className="font-semibold text-mobile-sm text-white">{prospect.yearOfbirth}</div>
          <div className="text-mobile-xs text-gray-300 mt-1">
            {prospect.age} años
          </div>
        </div>
      ),
    },
    {
      key: 'talla',
      header: 'Talla',
      accessor: (prospect: Prospect) => (
        <div className="text-center">
          <div className="font-semibold text-mobile-sm text-white">{prospect.talla}m</div>
          <div className="text-mobile-xs text-gray-300 mt-1">
            {(prospect.talla * 100).toFixed(0)} cm
          </div>
        </div>
      ),
    },
    {
      key: 'overallRating',
      header: 'Over G',
      accessor: (prospect: Prospect) => {
        const overall = prospect.ovrGeneral || 0;
        return (
          <div className="text-center flex items-center justify-center">
            <div className={`font-semibold text-mobile-sm px-1 py-0.5 rounded-sm max-w-12 w-12 text-center ${overall === 0 ? 'text-gray-400 bg-gray-400/2' :
              overall >= 90 ? 'text-green-400 bg-green-400/2' :
                overall >= 70 ? 'text-yellow-400 bg-yellow-400/2' :
                  overall >= 60 ? 'text-orange-400 bg-orange-400/2' :
                    'text-red-400 bg-red-400/2'
              }`}>
              {overall === 0 ? '-' : `${overall}%`}
            </div>
          </div>
        );
      },
    },
    {
      key: 'ovrFisico',
      header: 'Físico',
      accessor: (prospect: Prospect) => (
        <div className="text-center flex items-center justify-center">
          <div className={`font-semibold text-mobile-sm px-1 py-0.5 rounded-sm max-w-12 w-12 text-center ${prospect.ovrFisico === 0 ? 'text-gray-400 bg-gray-400/2' :
            prospect.ovrFisico >= 90 ? 'text-green-400 bg-green-400/2' :
              prospect.ovrFisico >= 70 ? 'text-yellow-400 bg-yellow-400/2' :
                prospect.ovrFisico >= 60 ? 'text-orange-400 bg-orange-400/2' :
                  'text-red-400 bg-red-400/2'
            }`}>
            {prospect.ovrFisico === 0 ? '-' : prospect.ovrFisico}%
          </div>
        </div>
      ),
    },
    {
      key: 'potencia',
      header: 'Pot',
      accessor: (prospect: Prospect) => (
        <div className="text-center flex items-center justify-center">
          <div className={`font-semibold text-mobile-sm px-1 py-0.5 rounded-sm max-w-12 w-12 text-center ${prospect.potencia === 0 ? 'text-gray-400 bg-gray-400/2' :
            prospect.potencia >= 90 ? 'text-green-400 bg-green-400/2' :
              prospect.potencia >= 70 ? 'text-yellow-400 bg-yellow-400/2' :
                prospect.potencia >= 60 ? 'text-orange-400 bg-orange-400/2' :
                  'text-red-400 bg-red-400/2'
            }`}>
            {prospect.potencia === 0 ? '-' : prospect.potencia}
          </div>
        </div>
      ),
    },
    {
      key: 'resistencia',
      header: 'Res',
      accessor: (prospect: Prospect) => (
        <div className="text-center">
          <div className={`font-semibold text-mobile-sm px-1 py-0.5 rounded-sm max-w-12 w-12 text-center ${prospect.resistencia === 0 ? 'text-gray-400 bg-gray-400/2' :
            prospect.resistencia >= 90 ? 'text-green-400 bg-green-400/2' :
              prospect.resistencia >= 70 ? 'text-yellow-400 bg-yellow-400/2' :
                prospect.resistencia >= 60 ? 'text-orange-400 bg-orange-400/2' :
                  'text-red-400 bg-red-400/2'
            }`}>
            {prospect.resistencia === 0 ? '-' : `${prospect.resistencia}%`}
          </div>
        </div>
      ),
    },
    {
      key: 'ovrTecnico',
      header: 'Técnico',
      accessor: (prospect: Prospect) => (
        <div className="text-center">
          <div className={`font-semibold text-mobile-sm px-1 py-0.5 rounded-sm max-w-12 w-12 text-center ${prospect.ovrTecnico === 0 ? 'text-gray-400 bg-gray-400/2' :
            prospect.ovrTecnico >= 90 ? 'text-green-400 bg-green-400/2' :
              prospect.ovrTecnico >= 70 ? 'text-yellow-400 bg-yellow-400/2' :
                prospect.ovrTecnico >= 60 ? 'text-orange-400 bg-orange-400/2' :
                  'text-red-400 bg-red-400/2'
            }`}>
            {prospect.ovrTecnico === 0 ? '-' : prospect.ovrTecnico}
          </div>
        </div>
      ),
    },
    {
      key: 'overCompetencia',
      header: 'Partido',
      accessor: (prospect: Prospect) => (
        <div className="text-center">
          <div className={`font-semibold text-mobile-sm px-1 py-0.5 rounded-sm max-w-12 w-12 text-center ${prospect.overCompetencia === 0 ? 'text-gray-400 bg-gray-400/2' :
            prospect.overCompetencia >= 90 ? 'text-green-400 bg-green-400/2' :
              prospect.overCompetencia >= 70 ? 'text-yellow-400 bg-yellow-400/2' :
                prospect.overCompetencia >= 60 ? 'text-orange-400 bg-orange-400/2' :
                  'text-red-400 bg-red-400/2'
            }`}>
            {prospect.overCompetencia === 0 ? '-' : prospect.overCompetencia}
          </div>
        </div>
      ),
    },
    {
      key: 'video',
      header: 'Video',
      accessor: (prospect: Prospect) => (
        <div className="flex items-center justify-center">
          {prospect.videos ? (
            <MobileHapticButton
              onClick={() => console.log('Ver video:', prospect.videos)}
              hapticType="click"
              soundType="click"
              className="w-8 h-8 bg-blue-500/20 hover:bg-blue-500/30 rounded-mobile-lg flex items-center justify-center"
            >
              <Video className="w-4 h-4 text-blue-400" />
            </MobileHapticButton>
          ) : (
            <div className="text-center">
              <div className="w-8 h-8 bg-gray-700/30 rounded-mobile-lg flex items-center justify-center mx-auto border border-gray-600/20">
                <span className="text-gray-500 text-mobile-xs">—</span>
              </div>
              <div className="text-mobile-xs text-gray-400 mt-1 font-medium">
                Sin video
              </div>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8 py-2"
      >
        {/* Authentication Notice */}
        {!isAuthenticated && (
          <motion.div variants={itemVariants} className="mb-8">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <UserPlus className="w-5 h-5 text-blue-400" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-blue-300">¿Quieres contactar atletas?</h3>
                  <p className="text-xs text-blue-200 mt-1">
                    Inicia sesión para contactar prospectos y acceder a funciones avanzadas.
                  </p>
                </div>
                <MobileButton
                  size="sm"
                  variant="primary"
                  onClick={() => setShowLoginModal(true)}
                >
                  Comenzar
                </MobileButton>
              </div>
            </div>
          </motion.div>
        )}

        {/* Table Section */}
        <motion.div variants={itemVariants}>
          <div className="glass-card p-8">
            {/* Header simplificado */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">Lista de Prospectos</h3>
                <div className="text-gray-300 text-sm">
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <span>Preparando datos...</span>
                    </div>
                  ) : (
                    `${prospects?.length || 0} prospectos encontrados`
                  )}
                </div>
              </div>
            </div>

            {/* Tabla móvil */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    {columns.map((column) => (
                      <th
                        key={column.key}
                        className="text-left py-3 px-3 text-xs font-medium text-gray-300"
                      >
                        {column.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    // Skeleton loading
                    Array.from({ length: 5 }).map((_, index) => (
                      <tr key={index} className="border-b border-white/5">
                        {columns.map((column) => (
                          <td key={column.key} className="py-3 px-3">
                            <MobileSkeleton
                              variant="text"
                              className="h-4 w-full"
                            />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : error ? (
                    <tr>
                      <td colSpan={columns.length} className="py-8 text-center">
                        <MobileLoadingPlaceholder
                          type="error"
                          title="Error al cargar prospectos"
                          description={error || 'Hubo un problema al cargar los datos'}
                          actionText="Reintentar"
                          onAction={() => setFilters({ page: 1 })}
                        />
                      </td>
                    </tr>
                  ) : (prospects?.length || 0) === 0 ? (
                    <tr>
                      <td colSpan={columns.length} className="py-8 text-center">
                        <MobileLoadingPlaceholder
                          type="no-results"
                          title="No se encontraron prospectos"
                          description="Intenta ajustar los filtros o la búsqueda para encontrar más prospectos"
                          actionText="Limpiar filtros"
                          onAction={() => {
                            setSearchQuery('');
                            setSelectedPosition('');
                            setSelectedStatus('');
                            setFilters({ page: 1 });
                          }}
                        />
                      </td>
                    </tr>
                  ) : (
                    prospects?.map((prospect: Prospect, index: number) => (
                      <tr
                        key={prospect.sessionID}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        {columns.map((column) => (
                          <td key={column.key} className="py-3 px-3">
                            {column.accessor(prospect)}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Pagination */}
        {prospects && prospects.length > 0 && pagination.totalPages && pagination.totalPages > 1 && (
          <motion.div variants={itemVariants} className="mt-8">
            <div className="glass-card p-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-300">
                  Mostrando <span className="font-semibold text-white">{(pagination.page - 1) * pagination.limit + 1}</span> a{' '}
                  <span className="font-semibold text-white">
                    {Math.min(pagination.page * pagination.limit, pagination.total)}
                  </span>{' '}
                  de <span className="font-semibold text-white">{pagination.total}</span> prospectos
                </div>

                <div className="flex items-center space-x-4">
                  <MobileButton
                    variant="outline"
                    size="sm"
                    className="glass-button"
                    disabled={pagination.page <= 1}
                    onClick={() => setPage(pagination.page - 1)}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Anterior
                  </MobileButton>

                  <div className="flex items-center space-x-2">
                    {Array.from({ length: Math.min(5, pagination.totalPages || 1) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <MobileButton
                          key={pageNum}
                          variant={pageNum === pagination.page ? 'primary' : 'outline'}
                          size="sm"
                          className="glass-button w-10 h-10 p-0"
                          onClick={() => setPage(pageNum)}
                        >
                          {pageNum}
                        </MobileButton>
                      );
                    })}
                  </div>

                  <MobileButton
                    variant="outline"
                    size="sm"
                    className="glass-button"
                    disabled={pagination.page >= (pagination.totalPages || 1)}
                    onClick={() => setPage(pagination.page + 1)}
                  >
                    Siguiente
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </MobileButton>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Login Modal */}
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      </motion.div>
    </div>
  );
};

export default DashboardMobile;
