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
  RefreshCw
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useMobilePerformance, useMobileGestures, useMobileLoading, useMobileOffline, useMobileHaptic } from '../hooks';
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
  MobileHapticSettings
} from '../components/ui';

interface Prospect {
  id: string;
  name: string;
  age: number;
  position: string;
  club: string;
  ovr: number;
  ovrFisico: number;
  ovrTecnico: number;
  ovrCompetencia: number;
  talla: number;
  potencia: number;
  resistencia: number;
  velocidad: number;
  avatar?: string;
  isFavorite: boolean;
  lastSeen: string;
  location: string;
}

// Mock data para prospectos
const generateMockProspects = (count: number): Prospect[] => {
  const positions = ['Delantero', 'Centrocampista', 'Defensa', 'Portero'];
  const clubs = ['Real Madrid', 'Barcelona', 'Atlético Madrid', 'Sevilla', 'Valencia', 'Villarreal'];
  const locations = ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao', 'Málaga'];
  
  return Array.from({ length: count }, (_, index) => ({
    id: `prospect-${index + 1}`,
    name: `Prospecto ${index + 1}`,
    age: Math.floor(Math.random() * 10) + 15, // 15-24 años
    position: positions[Math.floor(Math.random() * positions.length)],
    club: clubs[Math.floor(Math.random() * clubs.length)],
    ovr: Math.floor(Math.random() * 30) + 70, // 70-99
    ovrFisico: Math.floor(Math.random() * 30) + 70,
    ovrTecnico: Math.floor(Math.random() * 30) + 70,
    ovrCompetencia: Math.floor(Math.random() * 30) + 70,
    talla: Math.floor(Math.random() * 20) + 160, // 160-179 cm
    potencia: Math.floor(Math.random() * 30) + 70,
    resistencia: Math.floor(Math.random() * 30) + 70,
    velocidad: Math.floor(Math.random() * 30) + 70,
    isFavorite: Math.random() > 0.7,
    lastSeen: `${Math.floor(Math.random() * 7) + 1} días`,
    location: locations[Math.floor(Math.random() * locations.length)],
  }));
};

const ProspectsMobile: React.FC = () => {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [filteredProspects, setFilteredProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPosition, setSelectedPosition] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'ovr' | 'age' | 'name'>('ovr');
  const [showFavorites, setShowFavorites] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [currentView, setCurrentView] = useState<'list' | 'grid' | 'map'>('list');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { useLazyLoad, throttle } = useMobilePerformance();

  // Función para cargar prospectos
  const loadProspects = async () => {
    // Verificar cache primero
    const cachedProspects = offlineState.getCache<Prospect[]>('prospects');
    if (cachedProspects && !offlineState.isOffline) {
      setProspects(cachedProspects);
      setFilteredProspects(cachedProspects);
      return;
    }

    // Simular carga de API
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockData = generateMockProspects(50);
    
    // Guardar en cache
    offlineState.setCache('prospects', mockData, {
      expiresAt: Date.now() + (2 * 60 * 60 * 1000), // 2 horas
    });
    
    setProspects(mockData);
    setFilteredProspects(mockData);
  };

  // Generar datos mock al cargar
  useEffect(() => {
    loadingState.withLoading(loadProspects());
  }, []);

  // Filtrar prospectos
  useEffect(() => {
    let filtered = prospects;

    // Filtro por búsqueda
    if (searchQuery) {
      filtered = filtered.filter(prospect =>
        prospect.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prospect.club.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prospect.position.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtro por posición
    if (selectedPosition !== 'all') {
      filtered = filtered.filter(prospect => prospect.position === selectedPosition);
    }

    // Filtro por favoritos
    if (showFavorites) {
      filtered = filtered.filter(prospect => prospect.isFavorite);
    }

    // Filtros avanzados
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        switch (key) {
          case 'position':
            if (value !== 'all') {
              filtered = filtered.filter(prospect => prospect.position === value);
            }
            break;
          case 'age':
            if (value.min !== undefined && value.max !== undefined) {
              filtered = filtered.filter(prospect => 
                prospect.age >= value.min && prospect.age <= value.max
              );
            }
            break;
          case 'ovr':
            if (value.min !== undefined && value.max !== undefined) {
              filtered = filtered.filter(prospect => 
                prospect.ovr >= value.min && prospect.ovr <= value.max
              );
            }
            break;
          case 'club':
            if (Array.isArray(value) && value.length > 0) {
              filtered = filtered.filter(prospect => value.includes(prospect.club));
            }
            break;
          case 'location':
            if (Array.isArray(value) && value.length > 0) {
              filtered = filtered.filter(prospect => value.includes(prospect.location));
            }
            break;
          case 'attributes':
            if (Array.isArray(value) && value.length > 0) {
              filtered = filtered.filter(prospect => {
                return value.some((attr: string) => {
                  switch (attr) {
                    case 'potencia':
                      return prospect.potencia >= 80;
                    case 'velocidad':
                      return prospect.velocidad >= 80;
                    case 'resistencia':
                      return prospect.resistencia >= 80;
                    case 'tecnica':
                      return prospect.ovrTecnico >= 80;
                    default:
                      return false;
                  }
                });
              });
            }
            break;
        }
      }
    });

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'ovr':
          return b.ovr - a.ovr;
        case 'age':
          return a.age - b.age;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredProspects(filtered);
  }, [prospects, searchQuery, selectedPosition, showFavorites, sortBy, activeFilters]);

  // Lazy load para prospectos
  const { visibleItems, hasMore, loadingRef, loadMore } = useLazyLoad(
    filteredProspects,
    10,
    0.8
  );

  // Toggle favorito
  const toggleFavorite = (prospectId: string) => {
    const prospect = prospects.find(p => p.id === prospectId);
    const newFavoriteState = !prospect?.isFavorite;

    setProspects(prev => 
      prev.map(prospect => 
        prospect.id === prospectId 
          ? { ...prospect, isFavorite: newFavoriteState }
          : prospect
      )
    );

    // Feedback háptico
    if (newFavoriteState) {
      haptic.triggerSuccess();
    } else {
      haptic.triggerClick();
    }

    // Agregar a cola de sincronización si está offline
    if (offlineState.isOffline) {
      offlineState.addToSyncQueue({
        action: 'update',
        endpoint: `/prospects/${prospectId}/favorite`,
        data: { isFavorite: newFavoriteState },
      });
    }
  };

  // Refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    haptic.triggerClick();
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    const newData = generateMockProspects(50);
    setProspects(newData);
    
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
    onRetry: async () => {
      await loadProspects();
    },
  });

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
      {/* Indicador de Pull-to-Refresh */}
      <PullToRefreshIndicator
        progress={pullProgress}
        isRefreshing={isGestureRefreshing}
        className="absolute top-0 left-0 right-0 z-40"
      />
      {/* Header */}
      <div className="sticky top-14 z-30 bg-neutral-950/95 backdrop-blur-md border-b border-white/10 px-mobile-lg py-mobile-md">
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
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar prospectos..."
            className="w-full pl-10 pr-4 py-mobile-sm bg-neutral-900 border border-white/20 rounded-mobile-lg text-white placeholder-neutral-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 mobile-text-optimized"
          />
        </div>

        {/* Filtros */}
        <div className="flex items-center gap-mobile-sm overflow-x-auto pb-mobile-xs">
          <MobileButton
            size="sm"
            variant={showFavorites ? 'primary' : 'outline'}
            onClick={() => setShowFavorites(!showFavorites)}
            className="flex-shrink-0"
          >
            <Heart className="w-3 h-3 mr-mobile-xs" />
            Favoritos
          </MobileButton>

          <select
            value={selectedPosition}
            onChange={(e) => setSelectedPosition(e.target.value)}
            className="px-mobile-md py-mobile-sm bg-neutral-900 border border-white/20 rounded-mobile-lg text-white mobile-text-optimized focus:outline-none focus:border-primary-500"
          >
            {positions.map(position => (
              <option key={position} value={position}>
                {position === 'all' ? 'Todas las posiciones' : position}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'ovr' | 'age' | 'name')}
            className="px-mobile-md py-mobile-sm bg-neutral-900 border border-white/20 rounded-mobile-lg text-white mobile-text-optimized focus:outline-none focus:border-primary-500"
          >
            <option value="ovr">Ordenar por OVR</option>
            <option value="age">Ordenar por Edad</option>
            <option value="name">Ordenar por Nombre</option>
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
            onClick={handlePullToRefresh}
            disabled={isGestureRefreshing}
            className="flex-shrink-0"
          >
            <RefreshCw className={cn('w-3 h-3 mr-mobile-xs', isGestureRefreshing && 'animate-spin')} />
            Actualizar
          </MobileButton>
        </div>
      </div>

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
            ref={containerRef}
            className="space-y-mobile-md"
          >
        {loadingState.isLoading ? (
          // Skeleton loading mejorado
          Array.from({ length: 10 }).map((_, index) => (
            <MobileSkeleton
              key={index}
              variant="prospect-card"
              className="animate-mobile-slide-up"
            />
          ))
        ) : loadingState.isError ? (
          // Estado de error
          <MobileLoadingPlaceholder
            type="error"
            title="Error al cargar prospectos"
            description={loadingState.error || 'Hubo un problema al cargar los datos'}
            actionText="Reintentar"
            onAction={loadingState.retry}
          />
        ) : visibleItems.length === 0 ? (
          // Estado vacío
          <MobileLoadingPlaceholder
            type={offlineState.isOffline ? "offline" : "no-results"}
            title={offlineState.isOffline ? "Sin conexión" : "No se encontraron prospectos"}
            description={offlineState.isOffline 
              ? "No tienes conexión a internet. Los datos mostrados pueden estar desactualizados."
              : "Intenta ajustar los filtros o la búsqueda para encontrar más prospectos"
            }
            actionText={offlineState.isOffline ? "Reconectar" : "Limpiar filtros"}
            onAction={offlineState.isOffline 
              ? () => window.location.reload()
              : () => {
                  setSearchQuery('');
                  setSelectedPosition('all');
                  setShowFavorites(false);
                  setActiveFilters({});
                }
            }
          />
        ) : (
          // Lista de prospectos
          visibleItems.map((prospect, index) => (
            <div
              key={prospect.id}
              className="bg-neutral-900/50 backdrop-blur-sm border border-white/10 rounded-mobile-lg p-mobile-lg animate-mobile-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-mobile-md">
                {/* Avatar */}
                {prospect.avatar ? (
                  <img
                    src={prospect.avatar}
                    alt={prospect.name}
                    className="w-12 h-12 rounded-mobile-lg object-cover"
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
                    <MobileHapticButton
                      onClick={() => toggleFavorite(prospect.id)}
                      hapticType={prospect.isFavorite ? "click" : "success"}
                      soundType={prospect.isFavorite ? "click" : "success"}
                      className="flex-shrink-0 p-mobile-xs bg-transparent border-none shadow-none"
                    >
                      <Heart 
                        className={cn(
                          'w-4 h-4 transition-colors',
                          prospect.isFavorite 
                            ? 'text-red-500 fill-current' 
                            : 'text-neutral-400 hover:text-red-400'
                        )} 
                      />
                    </MobileHapticButton>
                  </div>
                  
                  <div className="flex items-center gap-mobile-sm text-neutral-400 text-mobile-sm mb-mobile-xs">
                    <span>{prospect.position}</span>
                    <span>•</span>
                    <span>{prospect.age} años</span>
                    <span>•</span>
                    <span>{prospect.club}</span>
                  </div>

                  <div className="flex items-center gap-mobile-sm text-neutral-500 text-mobile-xs">
                    <div className="flex items-center gap-mobile-xs">
                      <MapPin className="w-3 h-3" />
                      <span>{prospect.location}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-mobile-xs">
                      <Calendar className="w-3 h-3" />
                      <span>Visto hace {prospect.lastSeen}</span>
                    </div>
                  </div>
                </div>

                {/* OVR y estadísticas */}
                <div className="text-right">
                  <div className={cn(
                    'inline-flex items-center justify-center w-12 h-12 rounded-mobile-lg font-bold text-mobile-sm',
                    getOvrBgColor(prospect.ovr),
                    getOvrColor(prospect.ovr)
                  )}>
                    {prospect.ovr}
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
                    <div className={cn('text-mobile-sm font-medium', getOvrColor(prospect.ovrFisico))}>
                      {prospect.ovrFisico}
                    </div>
                  </div>
                  <div>
                    <div className="text-mobile-xs text-neutral-400">Técnico</div>
                    <div className={cn('text-mobile-sm font-medium', getOvrColor(prospect.ovrTecnico))}>
                      {prospect.ovrTecnico}
                    </div>
                  </div>
                  <div>
                    <div className="text-mobile-xs text-neutral-400">Comp.</div>
                    <div className={cn('text-mobile-sm font-medium', getOvrColor(prospect.ovrCompetencia))}>
                      {prospect.ovrCompetencia}
                    </div>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="mt-mobile-md flex items-center gap-mobile-sm">
                <Link 
                  to={`/mobile/prospects/${prospect.id}`}
                  className="flex-1 inline-flex items-center justify-center px-mobile-md py-mobile-sm text-mobile-sm font-medium border border-neutral-300 bg-transparent text-neutral-700 hover:bg-neutral-50 focus:ring-2 focus:ring-neutral-500 active:bg-neutral-100 rounded-mobile-lg shadow-mobile-sm hover:shadow-mobile-md transition-all duration-200 mobile-touch-feedback mobile-optimized"
                >
                  <Eye className="w-3 h-3 mr-mobile-xs" />
                  Ver Detalles
                </Link>
                <MobileButton
                  size="sm"
                  variant="outline"
                  className="flex-1"
                >
                  <Star className="w-3 h-3 mr-mobile-xs" />
                  Evaluar
                </MobileButton>
              </div>
            </div>
          ))
        )}

        {/* Loading indicator para infinite scroll */}
        {hasMore && (
          <div ref={loadingRef} className="text-center py-mobile-lg">
            <MobileLoadingSpinner
              size="sm"
              variant="secondary"
              text="Cargando más prospectos..."
              showText
            />
          </div>
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

      <FilterModalMobile
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleFilterModalApply}
        title="Filtro Específico"
        options={[
          { id: '1', label: 'Opción 1', value: 'option1' },
          { id: '2', label: 'Opción 2', value: 'option2' },
          { id: '3', label: 'Opción 3', value: 'option3' },
        ]}
        type="single"
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
    </div>
  );
};

export default ProspectsMobile;
