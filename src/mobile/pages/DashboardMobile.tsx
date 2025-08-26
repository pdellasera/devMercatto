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
  RefreshCw,
  X
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
import {
  MobileButton,
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
  MobileErrorAnnouncer,
  TableMobile
} from '../components/ui';
import { Avatar } from '../../components/ui/Avatar';
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
  const [showAuthToast, setShowAuthToast] = useState(true);

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

  // Table columns configuration - Adaptada para mobile
  const columns = [
    {
      key: 'nombre',
      header: 'Jugador',
      accessor: (prospect: Prospect) => (
        <div className="flex items-center space-x-3 py-2 hover:bg-white/5 transition-all duration-200 rounded-lg px-1">
                     {/* Avatar con indicador de estado */}
           <div className="relative flex-shrink-0">
             <Avatar
               src={prospect.imgData}
               alt={`${prospect.name} - ${prospect.position}`}
               fallback={prospect.name}
               size="lg"
               shape="square"
               className="shadow-lg"
             />
             {/* Indicador de estado premium */}
             {prospect.fullaccess && (
               <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                 <span className="text-[6px] font-bold text-black">★</span>
               </div>
             )}
           </div>

          {/* Información del jugador - Layout compacto */}
          <div className="flex-1 min-w-0">
            {/* Primera línea: Nombre, edad y posición */}
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-bold text-white text-sm leading-tight truncate">
                {prospect.name}
              </h3>
              <span className="text-xs text-gray-400 bg-gray-700/50 px-1.5 py-0.5 rounded-full">
                {prospect.age} años
              </span>
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                <span className="text-xs text-gray-300 font-medium">
                  {prospect.position}
                </span>
              </div>
            </div>

            {/* Segunda línea: Club y contrato en línea */}
            <div className="flex items-center space-x-3 text-xs">
              <div className="flex items-center space-x-1">
                <span className="text-gray-400">Club:</span>
                <span className="text-white font-semibold bg-gray-700/50 px-1.5 py-0.5 rounded-full">
                  {prospect.status || 'Sin club'}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-gray-400">Contrato:</span>
                <span className="text-white font-semibold">
                  {prospect.birthdayDate ? new Date(prospect.birthdayDate).toLocaleDateString('es-ES') : 'Sin fecha'}
                </span>
              </div>
            </div>

            {/* Tercera línea: Badges de estado */}
            <div className="flex items-center space-x-2 mt-1">
              {prospect.fullaccess && (
                <span className="text-[9px] bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-1.5 py-0.5 rounded-full font-bold shadow-sm">
                  PREMIUM
                </span>
              )}
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${prospect.status === 'Contratado'
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
      key: 'talla',
      header: 'Talla',
      accessor: (prospect: Prospect) => (
        <div className="text-center">
          <div className="font-semibold text-sm text-white">{prospect.talla}m</div>
        </div>
      ),
    },
    {
      key: 'overallRating',
      header: 'OVR',
      accessor: (prospect: Prospect) => {
        const overall = prospect.ovrGeneral || 0;
        return (
          <div className="text-center">
            <div className={`font-semibold text-sm px-2 py-1 rounded-sm ${overall === 0 ? 'text-gray-400' :
              overall >= 90 ? 'text-green-400' :
                overall >= 70 ? 'text-yellow-400' :
                  overall >= 60 ? 'text-orange-400' :
                    'text-red-400'
              }`}>
              {overall === 0 ? '-' : overall}
            </div>
          </div>
        );
      },
    },
    {
      key: 'ovrFisico',
      header: 'Físico',
      accessor: (prospect: Prospect) => (
        <div className="text-center">
          <div className={`font-semibold text-sm ${prospect.ovrFisico === 0 ? 'text-gray-400' :
            prospect.ovrFisico >= 90 ? 'text-green-400' :
              prospect.ovrFisico >= 70 ? 'text-yellow-400' :
                prospect.ovrFisico >= 60 ? 'text-orange-400' :
                  'text-red-400'
            }`}>
            {prospect.ovrFisico === 0 ? '-' : prospect.ovrFisico}
          </div>
        </div>
      ),
    },
    {
      key: 'potencia',
      header: 'Potencia',
      accessor: (prospect: Prospect) => (
        <div className="text-center">
          <div className={`font-semibold text-sm ${prospect.potencia === 0 ? 'text-gray-400' :
            prospect.potencia >= 90 ? 'text-green-400' :
              prospect.potencia >= 70 ? 'text-yellow-400' :
                prospect.potencia >= 60 ? 'text-orange-400' :
                  'text-red-400'
            }`}>
            {prospect.potencia === 0 ? '-' : prospect.potencia}
          </div>
        </div>
      ),
    },
    {
      key: 'resistencia',
      header: 'Resistencia',
      accessor: (prospect: Prospect) => (
        <div className="text-center">
          <div className={`font-semibold text-sm ${prospect.resistencia === 0 ? 'text-gray-400' :
            prospect.resistencia >= 90 ? 'text-green-400' :
              prospect.resistencia >= 70 ? 'text-yellow-400' :
                prospect.resistencia >= 60 ? 'text-orange-400' :
                  'text-red-400'
            }`}>
            {prospect.resistencia === 0 ? '-' : prospect.resistencia}
          </div>
        </div>
      ),
    },
    {
      key: 'ovrTecnico',
      header: 'Técnico',
      accessor: (prospect: Prospect) => (
        <div className="text-center">
          <div className={`font-semibold text-sm ${prospect.ovrTecnico === 0 ? 'text-gray-400' :
            prospect.ovrTecnico >= 90 ? 'text-green-400' :
              prospect.ovrTecnico >= 70 ? 'text-yellow-400' :
                prospect.ovrTecnico >= 60 ? 'text-orange-400' :
                  'text-red-400'
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
          <div className={`font-semibold text-sm ${prospect.overCompetencia === 0 ? 'text-gray-400' :
            prospect.overCompetencia >= 90 ? 'text-green-400' :
              prospect.overCompetencia >= 70 ? 'text-yellow-400' :
                prospect.overCompetencia >= 60 ? 'text-orange-400' :
                  'text-red-400'
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
            <div className="w-6 h-6 bg-gradient-to-br from-white/20 to-white/10 rounded flex items-center justify-center">
              <span className="text-red-400 text-xs">▶</span>
            </div>
          ) : (
            <div className="w-6 h-6 bg-gray-700/30 rounded flex items-center justify-center">
              <span className="text-gray-500 text-xs">—</span>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-full mx-auto px-2 sm:px-3 lg:px-4 py-1 pb-20 flex flex-col flex-1"
      >
        {/* Authentication Toast */}
        {!isAuthenticated && showAuthToast && (
          <motion.div 
            variants={itemVariants}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="mb-4 flex-shrink-0"
          >
            <div className="glass-card-mobile relative">
              <div className="flex items-center gap-3">
                <UserPlus className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-blue-300">¿Quieres contactar atletas?</h3>
                  <p className="text-xs text-blue-200 mt-1">
                    Inicia sesión para contactar prospectos y acceder a funciones avanzadas.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <MobileButton
                    size="sm"
                    variant="primary"
                    onClick={() => setShowLoginModal(true)}
                  >
                    Comenzar
                  </MobileButton>
                  <button
                    onClick={() => setShowAuthToast(false)}
                    className="p-1 text-blue-300 hover:text-blue-100 transition-colors rounded-full hover:bg-blue-500/10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Table Section - Con flex-1 para ocupar el espacio disponible */}
        <div className="flex-1 overflow-hidden">
          <TableMobile
            data={prospects || []}
            columns={columns}
            loading={loading}
            error={error}
            emptyMessage="No se encontraron prospectos"
            searchable={true}
            searchPlaceholder="Buscar prospectos..."
            onSearch={handleSearch}
            sortable={true}
            onSort={(key: string, direction: 'asc' | 'desc') => {
              console.log('Sort:', key, direction);
              // Implementar lógica de ordenamiento
            }}
            getItemKey={(prospect: Prospect) => prospect.sessionID}
            onRowClick={(prospect: Prospect) => handleViewDetails(Number(prospect.sessionID))}
            title="Lista de Prospectos"
            subtitle={loading ? undefined : `${prospects?.length || 0} prospectos encontrados`}
            pagination={pagination}
            onPageChange={setPage}
          />
        </div>
            </motion.div>
   
      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    </div>
  );
};

export default DashboardMobile;
