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
import { useTheme } from '../../design-system/theme/ThemeProvider';
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
  const { resolvedTheme } = useTheme();

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

  // Helper: convertir código de país (ISO-3166 alpha-2) a emoji de bandera
  const countryCodeToFlag = (code?: string): string => {
    if (!code || typeof code !== 'string') return '🏳️';
    const cc = code.trim().toUpperCase();
    if (cc.length !== 2) return '🏳️';
    const A = 0x1F1E6;
    const base = 'A'.charCodeAt(0);
    const first = A + (cc.charCodeAt(0) - base);
    const second = A + (cc.charCodeAt(1) - base);
    return String.fromCodePoint(first) + String.fromCodePoint(second);
  };

  // Helper: obtener posible código de país desde Prospect (flexible con claves comunes)
  const getProspectCountryCode = (p: Prospect): string | undefined => {
    // Intentar varias propiedades conocidas
    const anyP: any = p as any;
    return (
      anyP.countryCode || anyP.nationalityCode || anyP.iso2 || anyP.country || anyP.nationality || anyP.pais || undefined
    );
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

  // Table columns configuration - Solo dos columnas: Jugador (con posición del array) y OVR
  const columns = [
    {
      key: 'jugador',
      header: 'Jugador',
      accessor: (prospect: Prospect, index: number, theme?: 'dark' | 'light') => (
        <div className="flex items-center gap-2 min-w-0">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <Avatar
              src={prospect.imgData}
              alt={`${prospect.name} - ${prospect.position}`}
              fallback={prospect.name}
              size="xl"
              shape="square"
              className="shadow-lg"
            />
            {/* Indicador de estado premium */}
            {prospect.fullaccess && (
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-[4px] font-bold text-black">★</span>
              </div>
            )}
          </div>

          {/* Información del jugador */}
          <div className="min-w-0 flex flex-col items-start justify-start">
            {/* Primera línea: Posición del array + Bandera + Nombre (izquierda) y Edad (derecha) */}
            <div className="flex items-center justify-between w-full min-w-0">
              <div className="flex items-center gap-1 min-w-0">
                {/* Posición del array */}
                <span className={cn(
                  "text-xs font-bold px-1.5 py-0.5 rounded bg-gray-200 text-gray-700 flex-shrink-0",
                  resolvedTheme === 'light' ? "bg-gray-200 text-gray-700" : "bg-gray-700 text-gray-300"
                )}>
                  #{index + 1}
                </span>
                {/* Bandera */}
                <img
                  src="/flag_co.png"
                  alt="Bandera"
                  className="w-4 h-3 rounded-[2px] object-cover flex-shrink-0"
                />
                {/* Nombre */}
                <h3 className={cn(
                  "font-bold leading-tight whitespace-normal break-words text-[14px] sm:text-[14px]",
                  resolvedTheme === 'light' ? "text-blue-700" : "text-blue-300"
                )} style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{prospect.name}</h3>
              </div>
              <span className={cn(
                "ml-2 flex-shrink-0 text-[10px] sm:text-[13px]",
                resolvedTheme === 'light' ? "text-gray-600" : "text-gray-300"
              )}>{prospect.age} años</span>
            </div>

                         {/* Segunda línea: posición y club */}
             <div className="flex items-center gap-1">
               <span className={cn(
                 "text-[11px] sm:text-xs",
                 resolvedTheme === 'light' ? "text-gray-600" : "text-gray-300"
               )}>{prospect.position}</span>
               <span className={cn(
                 "text-[10px]",
                 resolvedTheme === 'light' ? "text-gray-400" : "text-gray-500"
               )}>•</span>
               {(prospect as any).club ? (
                 <div className={cn(
                   "flex items-center gap-1 px-1.5 py-0.5 rounded-full border",
                   resolvedTheme === 'light'
                     ? "bg-green-100 text-green-700 border-green-200"
                     : "bg-green-900/20 text-green-300 border-green-700"
                 )}>
                   <img
                     src="/flag_co.png"
                     alt="Bandera del club"
                     className="w-3 h-2 rounded-[1px] object-cover flex-shrink-0"
                   />
                   <span className="text-[10px] font-semibold">
                     {(prospect as any).club}
                   </span>
                 </div>
               ) : (
                 <span className={cn(
                   "text-[10px] font-semibold px-1.5 py-0.5 rounded-full border",
                   resolvedTheme === 'light'
                     ? "bg-orange-100 text-orange-700 border-orange-200"
                     : "bg-orange-900/20 text-orange-300 border-orange-700"
                 )}>
                   Agente Libre
                 </span>
               )}
             </div>
          </div>
        </div>
      ),
    },
    {
      key: 'ovrGeneral',
      header: 'OVR',
      accessor: (prospect: Prospect, index: number, theme?: 'dark' | 'light') => {
        const overall = prospect.ovrGeneral || 0;
        return (
          <div className="text-right">
            <div className={cn(
              "font-bold text-base sm:text-lg",
              overall === 0 
                ? (resolvedTheme === 'light' ? 'text-gray-500' : 'text-gray-400')
                : overall >= 90 
                  ? 'text-green-500' 
                  : overall >= 70 
                    ? 'text-yellow-400' 
                    : overall >= 60 
                      ? 'text-orange-400' 
                      : 'text-red-400'
            )}>
              {overall === 0 ? '-' : overall}
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full h-full flex flex-col">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full h-full flex flex-col"
      >
        {/* Authentication Toast */}
        {!isAuthenticated && showAuthToast && (
          <motion.div
            variants={itemVariants}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="mb-4 flex-shrink-0 px-4 mt-2 py-2"
          >
            <div className={cn(
              "relative p-2",
              resolvedTheme === 'light' ? "glass-card-mobile-light" : "glass-card-mobile"
            )}>
              <div className="flex items-center gap-3">
                <UserPlus className={cn(
                  "w-4 h-4 flex-shrink-0",
                  resolvedTheme === 'light' ? "text-blue-600" : "text-blue-400"
                )} />
                <div className="flex-1">
                  <h3 className={cn(
                    "text-sm font-medium",
                    resolvedTheme === 'light' ? "text-blue-700" : "text-blue-300"
                  )}>¿Quieres contactar atletas?</h3>
                  <p className={cn(
                    "text-xs mt-1",
                    resolvedTheme === 'light' ? "text-blue-600" : "text-blue-200"
                  )}>
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
                    className={cn(
                      "p-1 transition-colors rounded-full",
                      resolvedTheme === 'light' 
                        ? "text-blue-600 hover:text-blue-800 hover:bg-blue-100" 
                        : "text-blue-300 hover:text-blue-100 hover:bg-blue-500/10"
                    )}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Table Section - Ocupa todo el espacio disponible */}
        <div className="flex-1 w-full h-full overflow-hidden">
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
            theme={resolvedTheme}
            pagination={{
              page: pagination.page,
              totalPages: pagination.totalPages,
              totalItems: pagination.total,
              itemsPerPage: pagination.limit
            }}
            onPageChange={setPage}
            onRequireAuth={() => setShowLoginModal(true)}
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
