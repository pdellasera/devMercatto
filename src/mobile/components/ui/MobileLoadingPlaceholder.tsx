import React from 'react';
import { cn } from '../../utils/cn';
import { Users, Search, Filter, Heart, Star, MapPin, Calendar } from 'lucide-react';

interface MobileLoadingPlaceholderProps {
  type: 'empty-list' | 'no-results' | 'error' | 'offline' | 'search' | 'filters';
  title?: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

const MobileLoadingPlaceholder: React.FC<MobileLoadingPlaceholderProps> = ({
  type,
  title,
  description,
  icon,
  actionText,
  onAction,
  className,
}) => {
  const getDefaultContent = () => {
    switch (type) {
      case 'empty-list':
        return {
          icon: Users,
          title: 'No hay prospectos disponibles',
          description: 'Aún no se han cargado prospectos. Intenta actualizar la página.',
          actionText: 'Actualizar',
        };

      case 'no-results':
        return {
          icon: Search,
          title: 'No se encontraron resultados',
          description: 'Intenta ajustar los filtros o la búsqueda para encontrar más prospectos.',
          actionText: 'Limpiar filtros',
        };

      case 'error':
        return {
          icon: Users,
          title: 'Error al cargar datos',
          description: 'Hubo un problema al cargar los prospectos. Intenta de nuevo.',
          actionText: 'Reintentar',
        };

      case 'offline':
        return {
          icon: Users,
          title: 'Sin conexión',
          description: 'No tienes conexión a internet. Los datos mostrados pueden estar desactualizados.',
          actionText: 'Reconectar',
        };

      case 'search':
        return {
          icon: Search,
          title: 'Buscar prospectos',
          description: 'Escribe el nombre, club o posición del prospecto que buscas.',
          actionText: 'Buscar',
        };

      case 'filters':
        return {
          icon: Filter,
          title: 'Aplicar filtros',
          description: 'Usa los filtros para encontrar prospectos específicos.',
          actionText: 'Filtrar',
        };

      default:
        return {
          icon: Users,
          title: 'Sin contenido',
          description: 'No hay contenido para mostrar.',
          actionText: 'Actualizar',
        };
    }
  };

  const defaultContent = getDefaultContent();
  const IconComponent = icon || defaultContent.icon;

  return (
    <div className={cn(
      'flex flex-col items-center justify-center py-mobile-xl px-mobile-lg text-center',
      className
    )}>
      {/* Icono */}
      <div className="mb-mobile-md">
        <IconComponent className="w-16 h-16 text-neutral-600" />
      </div>

      {/* Título */}
      <h3 className="text-mobile-lg font-semibold text-neutral-300 mb-mobile-sm">
        {title || defaultContent.title}
      </h3>

      {/* Descripción */}
      <p className="text-neutral-500 text-mobile-sm mb-mobile-lg max-w-sm">
        {description || defaultContent.description}
      </p>

      {/* Botón de acción */}
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-mobile-lg py-mobile-sm bg-primary-600 hover:bg-primary-700 text-white rounded-mobile-lg font-medium transition-colors mobile-touch-feedback"
        >
          {actionText || defaultContent.actionText}
        </button>
      )}
    </div>
  );
};

export default MobileLoadingPlaceholder;
