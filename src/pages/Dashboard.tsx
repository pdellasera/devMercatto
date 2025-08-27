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
  List
} from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { useTheme } from '../design-system/theme/ThemeProvider';
import { cn } from '../utils/cn';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../design-system/components/Card/Card';
import { Button } from '../design-system';
import { SearchBar } from '../components/ui/SearchBar';
import { FilterDropdown } from '../components/ui/FilterDropdown';
import { Table } from '../components/ui/Table';
import { MetricBadge } from '../components/ui/MetricBadge';
import { Avatar } from '../components/ui/Avatar';
import { VideoIcon } from '../components/ui/VideoIcon';
import { StatusTag } from '../components/ui/StatusTag';
import { useProspects } from '../hooks/useProspects';
import { useAuth } from '../hooks/useAuth';
import { DismissibleNotice } from '../components/ui/DismissibleNotice';
import { LoginModal } from '../components/ui/LoginModal';
import { Prospect } from '../types';
import { prospectsService } from '../services/prospects.service';
import { ApiDebugger } from '../components/debug/ApiDebugger';

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

export const Dashboard: React.FC = () => {
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
  console.log('Dashboard render:', { prospects, loading, error, metrics });

  // Add debug information display
  const debugInfo = {
    prospectsCount: prospects?.length || 0,
    loading,
    error,
    hasData: prospects && prospects.length > 0,
    firstProspect: prospects?.[0],
  };

  console.log('Debug info:', debugInfo);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPosition, setSelectedPosition] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [showLoginModal, setShowLoginModal] = useState(false);

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
    // Aquí se implementaría la lógica de login
    setShowLoginModal(false);
  };

  const handleRegister = (email: string, password: string, name: string) => {
    console.log('Register attempt:', { email, password, name });
    // Aquí se implementaría la lógica de registro
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
      window.location.href = '/login';
      return;
    }
    console.log('Agregar prospecto');
  };

  const handleContactAthlete = (prospectId: number) => {
    if (!isAuthenticated) {
      window.location.href = '/login';
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

  // Table columns configuration
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
              fallback={prospect.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              size="md"
              className="ring-2 ring-white/10 shadow-lg"
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
              <h3 className={cn(
                "font-bold text-sm leading-tight truncate",
                resolvedTheme === 'light' ? "text-gray-900" : "text-white"
              )}>
                {prospect.name}
              </h3>
              <span className={cn(
                "text-xs px-1.5 py-0.5 rounded-full",
                resolvedTheme === 'light' 
                  ? "text-gray-600 bg-gray-200" 
                  : "text-gray-400 bg-gray-700/50"
              )}>
                {prospect.age} años
              </span>
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                <span className={cn(
                  "text-xs font-medium",
                  resolvedTheme === 'light' ? "text-gray-700" : "text-gray-300"
                )}>
                  {prospect.position}
                </span>
              </div>
            </div>

            {/* Segunda línea: Club y contrato en línea */}
            <div className="flex items-center space-x-3 text-xs">
              <div className="flex items-center space-x-1">
                <span className={cn(
                  resolvedTheme === 'light' ? "text-gray-600" : "text-gray-400"
                )}>Club:</span>
                <span className={cn(
                  "font-semibold px-1.5 py-0.5 rounded-full",
                  resolvedTheme === 'light' 
                    ? "text-gray-800 bg-gray-200" 
                    : "text-white bg-gray-700/50"
                )}>
                  {prospect.status || 'Sin club'}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <span className={cn(
                  resolvedTheme === 'light' ? "text-gray-600" : "text-gray-400"
                )}>Contrato:</span>
                <span className={cn(
                  "font-semibold",
                  resolvedTheme === 'light' ? "text-gray-800" : "text-white"
                )}>
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
      key: 'yearOfbirth',
      header: 'Año de Nacimiento',
      accessor: (prospect: Prospect) => (
        <div className="text-center">
          <div className={cn(
            "font-semibold text-sm",
            resolvedTheme === 'light' ? "text-gray-900" : "text-white"
          )}>{prospect.yearOfbirth}</div>
          <div className={cn(
            "text-xs mt-1",
            resolvedTheme === 'light' ? "text-gray-600" : "text-gray-300"
          )}>
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
          <div className={cn(
            "font-semibold text-sm",
            resolvedTheme === 'light' ? "text-gray-900" : "text-white"
          )}>{prospect.talla}m</div>
          <div className={cn(
            "text-xs mt-1",
            resolvedTheme === 'light' ? "text-gray-600" : "text-gray-300"
          )}>
            {(prospect.talla * 100).toFixed(0)} cm
          </div>
        </div>
      ),
    },
    {
      key: 'overallRating',
      header: 'Over General',
      accessor: (prospect: Prospect) => {
        const overall = prospect.ovrGeneral || 0; //Math.round((prospect.ovrFisico + prospect.ovrTecnico + prospect.overCompetencia) / 3);
        return (
          <div className="text-center flex items-center justify-center">
            <div className={`font-semibold text-sm px-2 py-1 rounded-sm max-w-20 w-20 text-center ${overall === 0 ? 'text-gray-400 bg-gray-400/2' :
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
      header: 'Over Físico',
      accessor: (prospect: Prospect) => (
        <div className="text-center flex items-center justify-center">
          <div className={`font-semibold text-sm px-2 py-1 rounded-sm max-w-20 w-20 text-center ${prospect.ovrFisico === 0 ? 'text-gray-400 bg-gray-400/2' :
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
      header: 'Potencia',
      accessor: (prospect: Prospect) => (
        <div className="text-center flex items-center justify-center">
          <div className="relative inline-block">
            <div className={`font-semibold text-sm px-2 py-1 rounded-sm max-w-20 w-20 text-center ${prospect.potencia === 0 ? 'text-gray-400 bg-gray-400/2' :
              prospect.potencia >= 90 ? 'text-green-400 bg-green-400/2' :
                prospect.potencia >= 70 ? 'text-yellow-400 bg-yellow-400/2' :
                  prospect.potencia >= 60 ? 'text-orange-400 bg-orange-400/2' :
                    'text-red-400 bg-red-400/2'
              }`}>
              {prospect.potencia === 0 ? '-' : prospect.potencia}
            </div>
          </div>

        </div>
      ),
    },
    {
      key: 'resistencia',
      header: 'Resistencia',
      accessor: (prospect: Prospect) => (
        <div className="text-center">
          <div className={`font-semibold text-sm px-2 py-1 rounded-sm max-w-20 w-20 text-center ${prospect.resistencia === 0 ? 'text-gray-400 bg-gray-400/2' :
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
      header: 'Over Técnico',
      accessor: (prospect: Prospect) => (
        <div className="text-center">
          <div className={`font-semibold text-sm px-2 py-1 rounded-sm max-w-20 w-20 text-center ${prospect.ovrTecnico === 0 ? 'text-gray-400 bg-gray-400/2' :
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
      header: 'Over de Partido',
      accessor: (prospect: Prospect) => (
        <div className="text-center">
          <div className={`font-semibold text-sm px-2 py-1 rounded-sm max-w-20 w-20 text-center ${prospect.overCompetencia === 0 ? 'text-gray-400 bg-gray-400/2' :
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
            <VideoIcon
              size="md"
              src={prospect.imgData}
              onClick={() => console.log('Ver video:', prospect.videos)}
            />
          ) : (
            <div className="text-center">
              <div className="w-10 h-10 bg-gray-700/30 rounded-lg flex items-center justify-center mx-auto border border-gray-600/20">
                <span className="text-gray-500 text-sm">—</span>
              </div>
              <div className="text-xs text-gray-400 mt-1 font-medium">
                Sin video
              </div>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <MainLayout
      onSearch={handleSearch}
      onAddProspect={handleAddProspect}
    >
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
              <DismissibleNotice
                title="¿Quieres contactar atletas?"
                message="Inicia sesión o crea una cuenta para contactar prospectos, agregarlos a tu lista de scouting y acceder a funciones avanzadas."
                actionText="Comenzar"
                onAction={() => setShowLoginModal(true)}
                icon={<UserPlus className="w-6 h-6" />}
              />
            </motion.div>
          )}

          

                     {/* Table Section */}
           <motion.div variants={itemVariants}>
             <div className="glass-card p-8">
                               {/* Header simplificado */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className={cn(
                      "text-2xl font-bold mb-1",
                      resolvedTheme === 'light' ? "text-gray-900" : "text-white"
                    )}>Lista de Prospectos</h3>
                    <div className={cn(
                      "text-sm",
                      resolvedTheme === 'light' ? "text-gray-600" : "text-gray-300"
                    )}>
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

                {/* Tabla con filtros integrados mejorados */}
                <Table
                  data={prospects || []}
                  columns={columns}
                  loading={loading}
                  emptyMessage="No se encontraron prospectos"
                  className="w-full"
                  searchable={true}
                  searchPlaceholder="Buscar por nombre, posición o club..."
                  striped={true}
                  hoverable={true}
                  compact={false}
                  showFilters={true}
                  onClearFilters={() => {
                    setSearchQuery('');
                    setSelectedPosition('');
                    setSelectedStatus('');
                    setFilters({ page: 1 });
                  }}
                  filterStatus={searchQuery || selectedPosition || selectedStatus ? 'Filtros activos' : 'Sin filtros'}
                  totalItems={pagination.total || 0}
                  visibleItems={prospects?.length || 0}
                  onSearch={handleSearch}
                  onFilterChange={(filters) => {
                    if (filters.position !== undefined) handlePositionFilter(filters.position);
                    if (filters.status !== undefined) handleStatusFilter(filters.status);
                  }}
                />
            </div>
          </motion.div>

          {/* Enhanced Pagination */}
          {prospects.length > 0 && pagination.totalPages && pagination.totalPages > 1 && (
            <motion.div variants={itemVariants} className="mt-8">
              <div className="glass-card p-6">
                <div className="flex items-center justify-between">
                  <div className={cn(
                    "text-sm",
                    resolvedTheme === 'light' ? "text-gray-600" : "text-gray-300"
                  )}>
                    Mostrando <span className={cn(
                      "font-semibold",
                      resolvedTheme === 'light' ? "text-gray-900" : "text-white"
                    )}>{(pagination.page - 1) * pagination.limit + 1}</span> a{' '}
                    <span className={cn(
                      "font-semibold",
                      resolvedTheme === 'light' ? "text-gray-900" : "text-white"
                    )}>
                      {Math.min(pagination.page * pagination.limit, pagination.total)}
                    </span>{' '}
                    de <span className={cn(
                      "font-semibold",
                      resolvedTheme === 'light' ? "text-gray-900" : "text-white"
                    )}>{pagination.total}</span> prospectos
                  </div>

                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="glass-button"
                      disabled={pagination.page <= 1}
                      onClick={() => setPage(pagination.page - 1)}
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Anterior
                    </Button>

                    <div className="flex items-center space-x-2">
                      {Array.from({ length: Math.min(5, pagination.totalPages || 1) }, (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <Button
                            key={pageNum}
                            variant={pageNum === pagination.page ? 'primary' : 'outline'}
                            size="sm"
                            className="glass-button w-10 h-10 p-0"
                            onClick={() => setPage(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="glass-button"
                      disabled={pagination.page >= (pagination.totalPages || 1)}
                      onClick={() => setPage(pagination.page + 1)}
                    >
                      Siguiente
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
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

          {/* API Debugger - Temporal */}
          <ApiDebugger />
        </motion.div>
      </div>
    </MainLayout>
  );
};
