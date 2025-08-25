import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Users, 
  Star, 
  Eye, 
  ArrowRight, 
  Calendar,
  Filter,
  Search,
  RefreshCw
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useMobileGestures, useMobilePerformance } from '../hooks';
import MobileButton from '../components/ui/MobileButton';

interface DashboardMetric {
  id: string;
  title: string;
  value: string | number;
  change: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  trend: 'up' | 'down' | 'neutral';
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  color: string;
}

const mockMetrics: DashboardMetric[] = [
  {
    id: 'total-prospects',
    title: 'Total Prospectos',
    value: '1,247',
    change: 12.5,
    icon: Users,
    color: 'bg-blue-500',
    trend: 'up',
  },
  {
    id: 'top-rated',
    title: 'Top Rated',
    value: '89',
    change: 8.2,
    icon: Star,
    color: 'bg-yellow-500',
    trend: 'up',
  },
  {
    id: 'views',
    title: 'Vistas',
    value: '2.4k',
    change: -3.1,
    icon: Eye,
    color: 'bg-green-500',
    trend: 'down',
  },
  {
    id: 'new-this-week',
    title: 'Nuevos',
    value: '34',
    change: 15.7,
    icon: TrendingUp,
    color: 'bg-purple-500',
    trend: 'up',
  },
];

const quickActions: QuickAction[] = [
  {
    id: 'search-prospects',
    title: 'Buscar Prospectos',
    description: 'Encuentra atletas por filtros',
    icon: Search,
    path: '/mobile/search',
    color: 'bg-blue-600',
  },
  {
    id: 'apply-filters',
    title: 'Aplicar Filtros',
    description: 'Refina tu búsqueda',
    icon: Filter,
    path: '/mobile/filters',
    color: 'bg-green-600',
  },
  {
    id: 'view-favorites',
    title: 'Ver Favoritos',
    description: 'Tus prospectos guardados',
    icon: Star,
    path: '/mobile/favorites',
    color: 'bg-red-600',
  },
  {
    id: 'schedule-visoria',
    title: 'Agendar Visoria',
    description: 'Programa evaluaciones',
    icon: Calendar,
    path: '/mobile/schedule',
    color: 'bg-purple-600',
  },
];

const DashboardMobile: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const { useLazyLoad } = useMobilePerformance();

  // Simular refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLastUpdated(new Date());
    setIsRefreshing(false);
  };

  // Lazy load para métricas
  const { visibleItems: visibleMetrics } = useLazyLoad(mockMetrics, 4);

  const formatChange = (change: number) => {
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  };

  const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return 'text-green-400';
      case 'down':
        return 'text-red-400';
      default:
        return 'text-neutral-400';
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return '↗';
      case 'down':
        return '↘';
      default:
        return '→';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Header del Dashboard */}
      <div className="px-mobile-lg py-mobile-lg">
        <div className="flex items-center justify-between mb-mobile-lg">
          <div>
            <h1 className="text-mobile-xl font-bold mobile-text-optimized">
              Dashboard
            </h1>
            <p className="text-neutral-400 text-mobile-sm mt-mobile-xs">
              Última actualización: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-mobile-sm rounded-mobile-lg bg-neutral-800 hover:bg-neutral-700 transition-colors mobile-touch-feedback disabled:opacity-50"
          >
            <RefreshCw 
              className={cn(
                'w-5 h-5 text-neutral-300',
                isRefreshing && 'animate-spin'
              )} 
            />
          </button>
        </div>

        {/* KPIs Grid */}
        <div className="grid grid-cols-2 gap-mobile-md mb-mobile-xl">
          {visibleMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.id}
                className="bg-neutral-900/50 backdrop-blur-sm border border-white/10 rounded-mobile-lg p-mobile-lg animate-mobile-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-mobile-sm">
                  <div className={cn('w-8 h-8 rounded-mobile-md flex items-center justify-center', metric.color)}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-right">
                    <span className={cn('text-mobile-xs font-medium', getTrendColor(metric.trend))}>
                      {getTrendIcon(metric.trend)} {formatChange(metric.change)}
                    </span>
                  </div>
                </div>
                <div className="mb-mobile-xs">
                  <div className="text-mobile-lg font-bold mobile-text-optimized">
                    {metric.value}
                  </div>
                  <div className="text-neutral-400 text-mobile-xs">
                    {metric.title}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Acciones Rápidas */}
        <div className="mb-mobile-xl">
          <div className="flex items-center justify-between mb-mobile-lg">
            <h2 className="text-mobile-lg font-semibold mobile-text-optimized">
              Acciones Rápidas
            </h2>
            <Link 
              to="/mobile/actions"
              className="text-primary-500 text-mobile-sm font-medium hover:text-primary-400 transition-colors"
            >
              Ver todas
            </Link>
          </div>
          
          <div className="space-y-mobile-sm">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.id}
                  to={action.path}
                  className="block bg-neutral-900/50 backdrop-blur-sm border border-white/10 rounded-mobile-lg p-mobile-lg hover:bg-neutral-800/50 transition-all duration-200 mobile-touch-feedback animate-mobile-slide-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex items-center gap-mobile-md">
                    <div className={cn('w-10 h-10 rounded-mobile-lg flex items-center justify-center', action.color)}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-mobile-base font-medium mobile-text-optimized">
                        {action.title}
                      </h3>
                      <p className="text-neutral-400 text-mobile-sm">
                        {action.description}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-neutral-400" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Sección de Prospectos Recientes */}
        <div className="mb-mobile-xl">
          <div className="flex items-center justify-between mb-mobile-lg">
            <h2 className="text-mobile-lg font-semibold mobile-text-optimized">
              Prospectos Recientes
            </h2>
            <Link 
              to="/mobile/prospects"
              className="text-primary-500 text-mobile-sm font-medium hover:text-primary-400 transition-colors"
            >
              Ver todos
            </Link>
          </div>
          
          <div className="space-y-mobile-sm">
            {[1, 2, 3].map((_, index) => (
              <div
                key={index}
                className="bg-neutral-900/50 backdrop-blur-sm border border-white/10 rounded-mobile-lg p-mobile-lg animate-mobile-slide-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="flex items-center gap-mobile-md">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-mobile-lg flex items-center justify-center">
                    <span className="text-white font-bold text-mobile-sm">
                      {String.fromCharCode(65 + index)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-mobile-base font-medium mobile-text-optimized">
                      Prospecto {index + 1}
                    </h3>
                    <p className="text-neutral-400 text-mobile-sm">
                      OVR: 85 • Edad: 18 • Posición: Delantero
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-mobile-sm font-bold text-green-400">
                      85
                    </div>
                    <div className="text-neutral-500 text-mobile-xs">
                      OVR
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-mobile-lg p-mobile-lg text-center animate-mobile-fade-in">
          <h3 className="text-mobile-lg font-bold mb-mobile-sm mobile-text-optimized">
            ¿Listo para encontrar el próximo crack?
          </h3>
          <p className="text-primary-100 text-mobile-sm mb-mobile-lg">
            Explora nuestra base de datos de prospectos y descubre talentos excepcionales
          </p>
          <Link 
            to="/mobile/prospects"
            className="inline-flex items-center justify-center w-full px-mobile-xl py-mobile-lg text-mobile-lg font-medium bg-neutral-200 text-neutral-900 hover:bg-neutral-300 focus:ring-2 focus:ring-neutral-500 active:bg-neutral-400 rounded-mobile-lg shadow-mobile-sm hover:shadow-mobile-md transition-all duration-200 mobile-touch-feedback mobile-optimized"
          >
            Explorar Prospectos
            <ArrowRight className="w-4 h-4 ml-mobile-xs" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardMobile;


