import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  Star, 
  MapPin, 
  Calendar,
  Users,
  Trophy,
  Target,
  Zap,
  Shield,
  Eye,
  Play,
  Download,
  MessageCircle
} from 'lucide-react';
import { cn } from '../utils/cn';
import MobileButton from '../components/ui/MobileButton';

interface ProspectDetail {
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
  fuerza: number;
  agilidad: number;
  velocidad: number;
  flexibilidad: number;
  avatar?: string;
  isFavorite: boolean;
  lastSeen: string;
  location: string;
  description: string;
  achievements: string[];
  videos: string[];
  stats: {
    goals: number;
    assists: number;
    matches: number;
    minutes: number;
  };
}

const ProspectDetailMobile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [prospect, setProspect] = useState<ProspectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'videos'>('overview');

  // Mock data para el prospecto
  useEffect(() => {
    const loadProspect = async () => {
      setLoading(true);
      // Simular carga de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockProspect: ProspectDetail = {
        id: id || '1',
        name: 'Carlos Rodríguez',
        age: 18,
        position: 'Delantero',
        club: 'Real Madrid',
        ovr: 87,
        ovrFisico: 85,
        ovrTecnico: 88,
        ovrCompetencia: 86,
        talla: 175,
        potencia: 82,
        resistencia: 84,
        fuerza: 80,
        agilidad: 86,
        velocidad: 88,
        flexibilidad: 83,
        isFavorite: false,
        lastSeen: '2 días',
        location: 'Madrid, España',
        description: 'Jugador promesa con gran potencial ofensivo. Destaca por su velocidad y capacidad goleadora. Ha demostrado consistencia en las categorías inferiores.',
        achievements: [
          'Máximo goleador Sub-18 (2023)',
          'Mejor jugador del torneo regional',
          'Convocado para selección nacional Sub-19'
        ],
        videos: [
          'https://example.com/video1.mp4',
          'https://example.com/video2.mp4',
          'https://example.com/video3.mp4'
        ],
        stats: {
          goals: 24,
          assists: 8,
          matches: 32,
          minutes: 2880
        }
      };
      
      setProspect(mockProspect);
      setLoading(false);
    };

    loadProspect();
  }, [id]);

  const toggleFavorite = () => {
    if (prospect) {
      setProspect(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white">
        <div className="px-mobile-lg py-mobile-lg">
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-800 rounded w-1/3 mb-mobile-lg" />
            <div className="flex items-center gap-mobile-lg mb-mobile-xl">
              <div className="w-20 h-20 bg-neutral-800 rounded-full" />
              <div className="flex-1 space-y-mobile-sm">
                <div className="h-6 bg-neutral-800 rounded w-3/4" />
                <div className="h-4 bg-neutral-800 rounded w-1/2" />
              </div>
            </div>
            <div className="space-y-mobile-md">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-16 bg-neutral-800 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!prospect) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-mobile-lg font-semibold mb-mobile-sm">Prospecto no encontrado</h2>
          <MobileButton onClick={() => navigate('/mobile/prospects')}>
            Volver a Prospectos
          </MobileButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Header */}
      <div className="sticky top-14 z-30 bg-neutral-950/95 backdrop-blur-md border-b border-white/10 px-mobile-lg py-mobile-md">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-mobile-sm rounded-mobile-lg hover:bg-white/10 transition-colors mobile-touch-feedback"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <h1 className="text-mobile-lg font-bold mobile-text-optimized">
            {prospect.name}
          </h1>
          
          <div className="flex items-center gap-mobile-sm">
            <button
              onClick={toggleFavorite}
              className="p-mobile-sm rounded-mobile-lg hover:bg-white/10 transition-colors mobile-touch-feedback"
            >
              <Heart 
                className={cn(
                  'w-5 h-5 transition-colors',
                  prospect.isFavorite 
                    ? 'text-red-500 fill-current' 
                    : 'text-neutral-400 hover:text-red-400'
                )} 
              />
            </button>
            <button className="p-mobile-sm rounded-mobile-lg hover:bg-white/10 transition-colors mobile-touch-feedback">
              <Share2 className="w-5 h-5 text-neutral-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="px-mobile-lg py-mobile-lg">
        {/* Información principal */}
        <div className="flex items-center gap-mobile-lg mb-mobile-xl">
          {prospect.avatar ? (
            <img
              src={prospect.avatar}
              alt={prospect.name}
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-mobile-lg">
                {prospect.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          
          <div className="flex-1">
            <h2 className="text-mobile-xl font-bold mobile-text-optimized mb-mobile-xs">
              {prospect.name}
            </h2>
            <div className="flex items-center gap-mobile-sm text-neutral-400 text-mobile-sm mb-mobile-xs">
              <span>{prospect.position}</span>
              <span>•</span>
              <span>{prospect.age} años</span>
              <span>•</span>
              <span>{prospect.club}</span>
            </div>
            <div className="flex items-center gap-mobile-sm text-neutral-500 text-mobile-xs">
              <MapPin className="w-3 h-3" />
              <span>{prospect.location}</span>
            </div>
          </div>

          {/* OVR principal */}
          <div className="text-center">
            <div className={cn(
              'inline-flex items-center justify-center w-16 h-16 rounded-full font-bold text-mobile-lg',
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

        {/* Tabs */}
        <div className="flex items-center gap-mobile-sm mb-mobile-lg border-b border-white/10">
          {[
            { id: 'overview', label: 'Resumen', icon: Eye },
            { id: 'stats', label: 'Estadísticas', icon: Target },
            { id: 'videos', label: 'Videos', icon: Play }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'flex items-center gap-mobile-xs px-mobile-md py-mobile-sm text-mobile-sm font-medium transition-colors mobile-touch-feedback border-b-2',
                  isActive
                    ? 'text-primary-500 border-primary-500'
                    : 'text-neutral-400 border-transparent hover:text-white'
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Contenido de tabs */}
        {activeTab === 'overview' && (
          <div className="space-y-mobile-lg">
            {/* Descripción */}
            <div>
              <h3 className="text-mobile-base font-semibold mb-mobile-sm">Descripción</h3>
              <p className="text-neutral-300 text-mobile-sm leading-relaxed">
                {prospect.description}
              </p>
            </div>

            {/* Logros */}
            <div>
              <h3 className="text-mobile-base font-semibold mb-mobile-sm">Logros</h3>
              <div className="space-y-mobile-sm">
                {prospect.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-mobile-sm">
                    <Trophy className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                    <span className="text-neutral-300 text-mobile-sm">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Estadísticas principales */}
            <div>
              <h3 className="text-mobile-base font-semibold mb-mobile-sm">Estadísticas</h3>
              <div className="grid grid-cols-2 gap-mobile-md">
                <div className="bg-neutral-900/50 rounded-mobile-lg p-mobile-md text-center">
                  <div className="text-mobile-lg font-bold text-green-400">{prospect.stats.goals}</div>
                  <div className="text-neutral-400 text-mobile-xs">Goles</div>
                </div>
                <div className="bg-neutral-900/50 rounded-mobile-lg p-mobile-md text-center">
                  <div className="text-mobile-lg font-bold text-blue-400">{prospect.stats.assists}</div>
                  <div className="text-neutral-400 text-mobile-xs">Asistencias</div>
                </div>
                <div className="bg-neutral-900/50 rounded-mobile-lg p-mobile-md text-center">
                  <div className="text-mobile-lg font-bold text-purple-400">{prospect.stats.matches}</div>
                  <div className="text-neutral-400 text-mobile-xs">Partidos</div>
                </div>
                <div className="bg-neutral-900/50 rounded-mobile-lg p-mobile-md text-center">
                  <div className="text-mobile-lg font-bold text-orange-400">{prospect.stats.minutes}</div>
                  <div className="text-neutral-400 text-mobile-xs">Minutos</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-mobile-lg">
            {/* OVRs */}
            <div>
              <h3 className="text-mobile-base font-semibold mb-mobile-sm">Evaluación General</h3>
              <div className="space-y-mobile-sm">
                {[
                  { label: 'OVR General', value: prospect.ovr },
                  { label: 'OVR Físico', value: prospect.ovrFisico },
                  { label: 'OVR Técnico', value: prospect.ovrTecnico },
                  { label: 'OVR Competencia', value: prospect.ovrCompetencia }
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between">
                    <span className="text-neutral-300 text-mobile-sm">{stat.label}</span>
                    <div className="flex items-center gap-mobile-sm">
                      <div className="w-20 h-2 bg-neutral-700 rounded-full overflow-hidden">
                        <div 
                          className={cn('h-full rounded-full', getOvrBgColor(stat.value))}
                          style={{ width: `${stat.value}%` }}
                        />
                      </div>
                      <span className={cn('text-mobile-sm font-medium', getOvrColor(stat.value))}>
                        {stat.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Atributos físicos */}
            <div>
              <h3 className="text-mobile-base font-semibold mb-mobile-sm">Atributos Físicos</h3>
              <div className="space-y-mobile-sm">
                {[
                  { label: 'Potencia', value: prospect.potencia, icon: Zap },
                  { label: 'Resistencia', value: prospect.resistencia, icon: Shield },
                  { label: 'Fuerza', value: prospect.fuerza, icon: Target },
                  { label: 'Agilidad', value: prospect.agilidad, icon: Zap },
                  { label: 'Velocidad', value: prospect.velocidad, icon: Zap },
                  { label: 'Flexibilidad', value: prospect.flexibilidad, icon: Shield }
                ].map((attr) => {
                  const Icon = attr.icon;
                  return (
                    <div key={attr.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-mobile-sm">
                        <Icon className="w-4 h-4 text-neutral-400" />
                        <span className="text-neutral-300 text-mobile-sm">{attr.label}</span>
                      </div>
                      <div className="flex items-center gap-mobile-sm">
                        <div className="w-20 h-2 bg-neutral-700 rounded-full overflow-hidden">
                          <div 
                            className={cn('h-full rounded-full', getOvrBgColor(attr.value))}
                            style={{ width: `${attr.value}%` }}
                          />
                        </div>
                        <span className={cn('text-mobile-sm font-medium', getOvrColor(attr.value))}>
                          {attr.value}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="space-y-mobile-lg">
            <h3 className="text-mobile-base font-semibold mb-mobile-sm">Videos de Evaluación</h3>
            <div className="space-y-mobile-md">
              {prospect.videos.map((video, index) => (
                <div key={index} className="bg-neutral-900/50 rounded-mobile-lg p-mobile-md">
                  <div className="aspect-video bg-neutral-800 rounded-mobile-lg mb-mobile-sm flex items-center justify-center">
                    <Play className="w-12 h-12 text-neutral-400" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-300 text-mobile-sm">
                      Video de evaluación {index + 1}
                    </span>
                    <div className="flex items-center gap-mobile-sm">
                      <button className="p-mobile-xs rounded-mobile-sm hover:bg-white/10 transition-colors">
                        <Download className="w-4 h-4 text-neutral-400" />
                      </button>
                      <button className="p-mobile-xs rounded-mobile-sm hover:bg-white/10 transition-colors">
                        <Share2 className="w-4 h-4 text-neutral-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="mt-mobile-xl space-y-mobile-sm">
          <MobileButton className="w-full" size="lg">
            <MessageCircle className="w-4 h-4 mr-mobile-sm" />
            Contactar Prospecto
          </MobileButton>
          <MobileButton variant="outline" className="w-full" size="lg">
            <Star className="w-4 h-4 mr-mobile-sm" />
            Evaluar Prospecto
          </MobileButton>
        </div>
      </div>
    </div>
  );
};

export default ProspectDetailMobile;
