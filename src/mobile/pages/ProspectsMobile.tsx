import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Heart, 
  Eye, 
  Star, 
  MapPin,
  Calendar,
  Users,
  ArrowUp,
  RefreshCw,
  UserPlus,
  ChevronLeft,
  ChevronRight
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
import { MobileFilters, FilterModalMobile } from '../components/filters';
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

const ProspectsMobile: React.FC = () => {
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

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPosition, setSelectedPosition] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [currentView, setCurrentView] = useState<'list' | 'grid' | 'map'>('list');
  const [showAccessibilitySettings, setShowAccessibilitySettings] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { useLazyLoad, throttle } = useMobilePerformance();

  // Hook de debounce para búsquedas optimizadas
  const debouncedSearchQuery = useMobileDebounce(searchQuery, { delay: 300 });

  // Debug logs
  console.log('ProspectsMobile render:', { prospects, loading, error, metrics });

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

  // Configurar pull-to-refresh manual
  const [isPulling, setIsPulling] = useState(false);
  const [pullProgress, setPullProgress] = useState(0);
  const [isGestureRefreshing, setIsGestureRefreshing] = useState(false);

  // Hook de loading para gestionar estados de carga
  const loadingState = useMobileLoading({
    initialLoading: true,
    maxRetries: 3,
    retryDelay: 2000,
  });

  // Hooks de accesibilidad
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

  const {
    isListening: isVoiceListening,
    isSupported: isVoiceSupported,
    transcript,
    confidence,
    startListening,
    stopListening,
    commands,
  } = useMobileVoiceCommands({
    enabled: accessibilitySettings.voiceCommands,
    onCommandRecognized: (command, conf) => {
      announceToScreenReader(`Comando reconocido: ${command} con ${Math.round(conf * 100)}% de confianza`);
    },
  });

  const {
    isEnabled: isKeyboardEnabled,
    shortcuts,
    addShortcut,
  } = useMobileKeyboardNavigation({
    enabled: accessibilitySettings.keyboardNavigation,
  });

  // Hook de offline para gestionar cache y sincronización

  // Hook de offline para gestionar cache y sincronización
  const offlineState = useMobileOffline({
    cacheExpiry: 2 * 60 * 60 * 1000, // 2 horas
    maxCacheSize: 50,
    syncRetryAttempts: 3,
    syncRetryDelay: 5000,
    enableAutoSync: true,
  });

  // Hook de haptic para feedback táctil y sonoro
  const haptic = useMobileHaptic({
    enabled: true,
    soundEnabled: true,
    hapticEnabled: true,
    defaultVolume: 0.5,
    defaultIntensity: 0.5,
  });

  // Hook de métricas de performance
  const performanceMetrics = useMobilePerformanceMetrics({
    enableMemoryMonitoring: true,
    enableNetworkMonitoring: true,
    enableWebVitals: true,
    onMetricsUpdate: (metrics) => {
      console.log('Performance metrics updated:', metrics);
    },
  });

  const handleFiltersApply = (filters: Record<string, any>) => {
    setActiveFilters(filters);
  };

  const handleFilterModalApply = (value: any) => {
    // Aquí puedes manejar filtros específicos si es necesario
    console.log('Filter modal applied:', value);
  };

  // Manejar pull-to-refresh
  const handlePullToRefresh = async () => {
    setIsGestureRefreshing(true);
    await handleRefresh();
    setIsGestureRefreshing(false);
  };

  // Manejar cambio de vista
  const handleViewChange = (view: 'list' | 'grid' | 'map') => {
    setCurrentView(view);
  };

  // Scroll to top
  const scrollToTop = () => {
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getOvrColor = (ovr: number) => {
    if (ovr >= 90) return 'text-green-400';
    if (ovr >= 80) return 'text-blue-400';
    if (ovr >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getOvrBgColor = (ovr: number) => {
    if (ovr >= 90) return 'bg-green-500/20';
    if (ovr >= 80) return 'bg-blue-500/20';
    if (ovr >= 70) return 'bg-yellow-500/20';
    return 'bg-red-500/20';
  };

  const positions = ['all', 'Delantero', 'Centrocampista', 'Defensa', 'Portero'];
  const viewSections = ['Lista', 'Cuadrícula', 'Mapa'];

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Skip links para navegación rápida */}
      <a href="#main-content" className="skip-link sr-only">
        Saltar al contenido principal
      </a>
      <a href="#prospects-list" className="skip-link sr-only">
        Saltar a la lista de prospectos
      </a>
      <a href="#search" className="skip-link sr-only">
        Saltar a la búsqueda
      </a>
      <a href="#accessibility-settings" className="skip-link sr-only">
        Saltar a configuración de accesibilidad
      </a>
      {/* Indicador de Pull-to-Refresh */}
      <PullToRefreshIndicator
        progress={pullProgress}
        isRefreshing={isGestureRefreshing}
        className="absolute top-0 left-0 right-0 z-40"
      />
      {/* Header */}
      <div id="main-content" className="sticky top-14 z-30 bg-neutral-950/95 backdrop-blur-md border-b border-white/10 px-mobile-lg py-mobile-md">
        <div className="flex items-center justify-between mb-mobile-md">
          <h1 className="text-mobile-lg font-bold mobile-text-optimized">
            Prospectos
          </h1>
          <MobileHapticButton
            onClick={handleRefresh}
            disabled={isRefreshing}
            hapticType="click"
            soundType="click"
            className="p-mobile-sm rounded-mobile-lg bg-neutral-800 hover:bg-neutral-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw 
              className={cn(
                'w-4 h-4 text-neutral-300',
                isRefreshing && 'animate-spin'
              )} 
            />
          </MobileHapticButton>
        </div>

        {/* Búsqueda */}
        <div className="relative mb-mobile-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            id="search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar prospectos..."
            className="w-full pl-10 pr-4 py-mobile-sm bg-neutral-900 border border-white/20 rounded-mobile-lg text-white placeholder-neutral-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 mobile-text-optimized"
            aria-label="Buscar prospectos por nombre, club o posición"
          />
        </div>

        {/* Filtros */}
        <div className="flex items-center gap-mobile-sm overflow-x-auto pb-mobile-xs">
          <select
            value={selectedPosition}
            onChange={(e) => handlePositionFilter(e.target.value)}
            className="px-mobile-md py-mobile-sm bg-neutral-900 border border-white/20 rounded-mobile-lg text-white mobile-text-optimized focus:outline-none focus:border-primary-500"
          >
            {positionOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="px-mobile-md py-mobile-sm bg-neutral-900 border border-white/20 rounded-mobile-lg text-white mobile-text-optimized focus:outline-none focus:border-primary-500"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <MobileButton
            size="sm"
            variant="outline"
            onClick={() => setIsFiltersOpen(true)}
            className="flex-shrink-0"
          >
            <Filter className="w-3 h-3 mr-mobile-xs" />
            Filtros
            {Object.keys(activeFilters).length > 0 && (
              <span className="ml-mobile-xs px-mobile-xs py-mobile-xs bg-primary-600 text-white text-mobile-xs rounded-full">
                {Object.keys(activeFilters).length}
              </span>
            )}
          </MobileButton>

          <MobileButton
            size="sm"
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex-shrink-0"
          >
            <RefreshCw className={cn('w-3 h-3 mr-mobile-xs', isRefreshing && 'animate-spin')} />
            Actualizar
          </MobileButton>
        </div>
      </div>

      {/* Authentication Notice */}
      {!isAuthenticated && (
        <div className="px-mobile-lg py-mobile-md">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-mobile-lg p-mobile-md">
            <div className="flex items-center gap-mobile-sm">
              <UserPlus className="w-4 h-4 text-blue-400" />
              <div className="flex-1">
                <h3 className="text-mobile-sm font-medium text-blue-300">¿Quieres contactar atletas?</h3>
                <p className="text-mobile-xs text-blue-200 mt-mobile-xs">
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
        </div>
      )}

      {/* Contenedor Swipeable para diferentes vistas */}
        <SwipeableContainer
          sections={viewSections}
          currentSection={currentView === 'list' ? 0 : currentView === 'grid' ? 1 : 2}
          onSectionChange={(index) => {
            const views: ('list' | 'grid' | 'map')[] = ['list', 'grid', 'map'];
            handleViewChange(views[index]);
          }}
          className="px-mobile-lg py-mobile-md"
        >
          {/* Lista de Prospectos */}
          <div 
            id="prospects-list"
            ref={containerRef}
            className="space-y-mobile-md"
            role="region"
            aria-label="Lista de prospectos deportivos"
          >
        {loading ? (
          // Skeleton loading mejorado
          Array.from({ length: 10 }).map((_, index) => (
            <MobileSkeleton
              key={index}
              variant="prospect-card"
              className="animate-mobile-slide-up"
            />
          ))
        ) : error ? (
          // Estado de error
          <MobileLoadingPlaceholder
            type="error"
            title="Error al cargar prospectos"
            description={error || 'Hubo un problema al cargar los datos'}
            actionText="Reintentar"
            onAction={() => setFilters({ page: 1 })}
          />
        ) : (prospects?.length || 0) === 0 ? (
          // Estado vacío
          <MobileLoadingPlaceholder
            type="no-results"
            title="No se encontraron prospectos"
            description="Intenta ajustar los filtros o la búsqueda para encontrar más prospectos"
            actionText="Limpiar filtros"
            onAction={() => {
              setSearchQuery('');
              setSelectedPosition('');
              setSelectedStatus('');
              setActiveFilters({});
              setFilters({ page: 1 });
            }}
          />
        ) : (
          // Lista de prospectos
          prospects?.map((prospect: Prospect, index: number) => (
            <div
              key={prospect.sessionID}
              className="bg-neutral-900/50 backdrop-blur-sm border border-white/10 rounded-mobile-lg p-mobile-lg animate-mobile-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-mobile-md">
                {/* Avatar con lazy loading */}
                {prospect.imgData ? (
                  <MobileLazyImage
                    src={prospect.imgData}
                    alt={prospect.name}
                    className="w-12 h-12 rounded-mobile-lg"
                    aspectRatio="square"
                    objectFit="cover"
                    showLoadingIndicator={false}
                    showErrorIndicator={false}
                    fallbackSrc="/images/placeholder-avatar.png"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-mobile-lg flex items-center justify-center">
                    <span className="text-white font-bold text-mobile-sm">
                      {prospect.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}

                {/* Información principal */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-mobile-sm mb-mobile-xs">
                    <h3 className="text-mobile-base font-medium mobile-text-optimized truncate">
                      {prospect.name}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-mobile-sm text-neutral-400 text-mobile-sm mb-mobile-xs">
                    <span>{prospect.position}</span>
                    <span>•</span>
                    <span>{prospect.age} años</span>
                    <span>•</span>
                    <span>{prospect.status || 'Sin club'}</span>
                  </div>

                  <div className="flex items-center gap-mobile-sm text-neutral-500 text-mobile-xs">
                    <div className="flex items-center gap-mobile-xs">
                      <Calendar className="w-3 h-3" />
                      <span>{prospect.birthdayDate ? formatDate(prospect.birthdayDate) : 'Sin fecha'}</span>
                    </div>
                  </div>
                </div>

                {/* OVR General */}
                <div className="text-right">
                  <div className={cn(
                    'inline-flex items-center justify-center w-12 h-12 rounded-mobile-lg font-bold text-mobile-sm',
                    getOvrBgColor(prospect.ovrGeneral || 0),
                    getOvrColor(prospect.ovrGeneral || 0)
                  )}>
                    {prospect.ovrGeneral || 0}
                  </div>
                  <div className="text-neutral-500 text-mobile-xs mt-mobile-xs">
                    OVR
                  </div>
                </div>
              </div>

              {/* Estadísticas detalladas */}
              <div className="mt-mobile-md pt-mobile-md border-t border-white/10">
                <div className="grid grid-cols-3 gap-mobile-sm text-center">
                  <div>
                    <div className="text-mobile-xs text-neutral-400">Físico</div>
                    <div className={cn('text-mobile-sm font-medium', getOvrColor(prospect.ovrFisico || 0))}>
                      {prospect.ovrFisico || 0}
                    </div>
                  </div>
                  <div>
                    <div className="text-mobile-xs text-neutral-400">Técnico</div>
                    <div className={cn('text-mobile-sm font-medium', getOvrColor(prospect.ovrTecnico || 0))}>
                      {prospect.ovrTecnico || 0}
                    </div>
                  </div>
                  <div>
                    <div className="text-mobile-xs text-neutral-400">Comp.</div>
                    <div className={cn('text-mobile-sm font-medium', getOvrColor(prospect.overCompetencia || 0))}>
                      {prospect.overCompetencia || 0}
                    </div>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="mt-mobile-md flex items-center gap-mobile-sm">
                <MobileButton
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleViewDetails(Number(prospect.sessionID))}
                >
                  <Eye className="w-3 h-3 mr-mobile-xs" />
                  Ver Detalles
                </MobileButton>
                <MobileButton
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleContactAthlete(Number(prospect.sessionID))}
                >
                  <Star className="w-3 h-3 mr-mobile-xs" />
                  Contactar
                </MobileButton>
              </div>
            </div>
          ))
        )}
          </div>
        </SwipeableContainer>

      {/* Botón flotante para scroll to top */}
      <MobileHapticButton
        onClick={scrollToTop}
        hapticType="click"
        soundType="click"
        className="fixed bottom-24 right-mobile-lg z-40 p-mobile-md bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-mobile-lg transition-all duration-200"
      >
        <ArrowUp className="w-5 h-5" />
      </MobileHapticButton>

      {/* Componentes de Filtros */}
      <MobileFilters
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        onApply={handleFiltersApply}
      />



      {/* Overlay de loading para refresh */}
      <MobileLoadingOverlay
        isVisible={isGestureRefreshing}
        text="Actualizando prospectos..."
        variant="overlay"
        spinnerSize="lg"
        spinnerVariant="primary"
      />

      {/* Indicador de estado offline */}
      <MobileOfflineIndicator
        isOnline={offlineState.isOnline}
        isOffline={offlineState.isOffline}
        isSyncing={offlineState.isSyncing}
        syncQueue={offlineState.syncQueue}
        lastSync={offlineState.lastSync}
        syncError={offlineState.syncError}
        connectionType={offlineState.connectionType}
        connectionQuality={offlineState.connectionQuality}
        onManualSync={offlineState.performSync}
        className="fixed bottom-20 left-mobile-lg right-mobile-lg z-40"
        showDetails={true}
      />

      {/* Gestor de cache */}
      <MobileCacheManager
        cacheSize={offlineState.cacheSize * 1024} // Simular tamaño en bytes
        syncQueue={offlineState.syncQueue}
        isSyncing={offlineState.isSyncing}
        lastSync={offlineState.lastSync}
        syncError={offlineState.syncError}
        onClearCache={offlineState.clearCache}
        onPerformSync={offlineState.performSync}
        className="fixed bottom-32 left-mobile-lg right-mobile-lg z-40"
        showAdvanced={true}
      />

      {/* Configuración de feedback háptico */}
      <MobileHapticSettings
        className="fixed bottom-44 left-mobile-lg right-mobile-lg z-40"
        onSettingsChange={(settings) => {
          console.log('Haptic settings changed:', settings);
        }}
      />

      {/* Monitor de performance */}
      <MobilePerformanceMonitor
        className="fixed bottom-56 left-mobile-lg right-mobile-lg z-40"
        showDetails={true}
        autoStart={true}
        onScoreChange={(score) => {
          console.log('Lighthouse score:', score);
        }}
      />

      {/* Componentes de Accesibilidad */}
      <MobileSkipLinks
        onSkip={(linkId) => {
          console.log('Skip to:', linkId);
          announceToScreenReader(`Saltado a ${linkId}`);
        }}
      />

      <MobileErrorAnnouncer
        onErrorAnnounced={(error) => {
          console.log('Error announced:', error);
        }}
        onErrorDismissed={(errorId) => {
          console.log('Error dismissed:', errorId);
        }}
      />

      {showAccessibilitySettings && (
        <MobileAccessibilitySettings
          className="fixed inset-0 z-50 flex items-center justify-center p-mobile-lg"
          onClose={() => setShowAccessibilitySettings(false)}
        />
      )}

      {/* Botón de accesibilidad flotante */}
      <MobileHapticButton
        onClick={() => setShowAccessibilitySettings(true)}
        hapticType="click"
        soundType="click"
        className="fixed bottom-68 left-mobile-lg z-40 p-mobile-md bg-neutral-800 hover:bg-neutral-700 text-white rounded-full shadow-mobile-lg transition-all duration-200"
        aria-label="Abrir configuración de accesibilidad"
      >
        <span className="sr-only">Accesibilidad</span>
        <span className="text-mobile-lg">♿</span>
      </MobileHapticButton>

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

export default ProspectsMobile;
