import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  Volume2, 
  VolumeX, 
  Keyboard, 
  Smartphone, 
  Settings,
  RotateCcw,
  Check,
  X
} from 'lucide-react';
import { cn } from '../../utils/cn';
import useMobileAccessibility from '../../hooks/useMobileAccessibility';
import useMobileVoiceCommands from '../../hooks/useMobileVoiceCommands';
import useMobileKeyboardNavigation from '../../hooks/useMobileKeyboardNavigation';

interface MobileAccessibilitySettingsProps {
  className?: string;
  onClose?: () => void;
}

const MobileAccessibilitySettings: React.FC<MobileAccessibilitySettingsProps> = ({
  className,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'voice' | 'keyboard'>('general');
  
  const {
    settings,
    isScreenReaderActive,
    updateSettings,
    resetSettings,
    announceToScreenReader,
  } = useMobileAccessibility({
    onSettingsChange: (newSettings) => {
      announceToScreenReader('Configuración de accesibilidad actualizada');
    },
  });

  const {
    isListening,
    isSupported: isVoiceSupported,
    transcript,
    confidence,
    startListening,
    stopListening,
    commands,
  } = useMobileVoiceCommands({
    enabled: settings.voiceCommands,
    onCommandRecognized: (command, conf) => {
      announceToScreenReader(`Comando reconocido: ${command} con ${Math.round(conf * 100)}% de confianza`);
    },
  });

  const {
    isEnabled: isKeyboardEnabled,
    shortcuts,
    enableNavigation,
    disableNavigation,
    getShortcutsByCategory,
  } = useMobileKeyboardNavigation({
    enabled: settings.keyboardNavigation,
  });

  const handleSettingToggle = (setting: keyof typeof settings) => {
    updateSettings({ [setting]: !settings[setting] });
  };

  const handleReset = () => {
    resetSettings();
    announceToScreenReader('Configuraciones restablecidas');
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'voice', label: 'Voz', icon: Volume2 },
    { id: 'keyboard', label: 'Teclado', icon: Keyboard },
  ] as const;

  return (
    <div className={cn(
      'bg-neutral-900/95 backdrop-blur-sm border border-white/10 rounded-mobile-lg p-mobile-md',
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between mb-mobile-md">
        <h2 className="text-mobile-lg font-bold text-white">Accesibilidad</h2>
        <button
          onClick={onClose}
          className="p-mobile-xs rounded-mobile-sm bg-neutral-800 hover:bg-neutral-700 transition-colors"
          aria-label="Cerrar configuración de accesibilidad"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-mobile-xs mb-mobile-md">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-mobile-xs px-mobile-sm py-mobile-xs rounded-mobile-sm text-mobile-sm transition-colors',
                activeTab === tab.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              )}
              aria-label={`Cambiar a pestaña ${tab.label}`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="space-y-mobile-md">
        {activeTab === 'general' && (
          <div className="space-y-mobile-sm">
            <h3 className="text-mobile-base font-semibold text-white mb-mobile-sm">
              Configuración General
            </h3>
            
            {/* Screen Reader */}
            <div className="flex items-center justify-between p-mobile-sm bg-neutral-800/50 rounded-mobile-sm">
              <div className="flex items-center gap-mobile-sm">
                <Smartphone className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="text-mobile-sm font-medium">Lector de pantalla</div>
                  <div className="text-mobile-xs text-neutral-400">
                    {isScreenReaderActive ? 'Activo' : 'No detectado'}
                  </div>
                </div>
              </div>
              <div className={cn(
                'w-3 h-3 rounded-full',
                isScreenReaderActive ? 'bg-green-400' : 'bg-neutral-500'
              )} />
            </div>

            {/* High Contrast */}
            <div className="flex items-center justify-between p-mobile-sm bg-neutral-800/50 rounded-mobile-sm">
              <div className="flex items-center gap-mobile-sm">
                <Eye className="w-5 h-5 text-yellow-400" />
                <div>
                  <div className="text-mobile-sm font-medium">Alto contraste</div>
                  <div className="text-mobile-xs text-neutral-400">
                    Mejorar contraste visual
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleSettingToggle('highContrast')}
                className={cn(
                  'w-10 h-6 rounded-full transition-colors relative',
                  settings.highContrast ? 'bg-primary-600' : 'bg-neutral-600'
                )}
                aria-label={`${settings.highContrast ? 'Desactivar' : 'Activar'} alto contraste`}
              >
                <div className={cn(
                  'w-4 h-4 bg-white rounded-full transition-transform absolute top-1',
                  settings.highContrast ? 'translate-x-5' : 'translate-x-1'
                )} />
              </button>
            </div>

            {/* Large Text */}
            <div className="flex items-center justify-between p-mobile-sm bg-neutral-800/50 rounded-mobile-sm">
              <div className="flex items-center gap-mobile-sm">
                <span className="text-mobile-lg font-bold text-green-400">A</span>
                <div>
                  <div className="text-mobile-sm font-medium">Texto grande</div>
                  <div className="text-mobile-xs text-neutral-400">
                    Aumentar tamaño de texto
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleSettingToggle('largeText')}
                className={cn(
                  'w-10 h-6 rounded-full transition-colors relative',
                  settings.largeText ? 'bg-primary-600' : 'bg-neutral-600'
                )}
                aria-label={`${settings.largeText ? 'Desactivar' : 'Activar'} texto grande`}
              >
                <div className={cn(
                  'w-4 h-4 bg-white rounded-full transition-transform absolute top-1',
                  settings.largeText ? 'translate-x-5' : 'translate-x-1'
                )} />
              </button>
            </div>

            {/* Reduced Motion */}
            <div className="flex items-center justify-between p-mobile-sm bg-neutral-800/50 rounded-mobile-sm">
              <div className="flex items-center gap-mobile-sm">
                <RotateCcw className="w-5 h-5 text-purple-400" />
                <div>
                  <div className="text-mobile-sm font-medium">Reducir movimiento</div>
                  <div className="text-mobile-xs text-neutral-400">
                    Minimizar animaciones
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleSettingToggle('reducedMotion')}
                className={cn(
                  'w-10 h-6 rounded-full transition-colors relative',
                  settings.reducedMotion ? 'bg-primary-600' : 'bg-neutral-600'
                )}
                aria-label={`${settings.reducedMotion ? 'Desactivar' : 'Activar'} reducción de movimiento`}
              >
                <div className={cn(
                  'w-4 h-4 bg-white rounded-full transition-transform absolute top-1',
                  settings.reducedMotion ? 'translate-x-5' : 'translate-x-1'
                )} />
              </button>
            </div>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="w-full mt-mobile-md px-mobile-sm py-mobile-sm bg-neutral-800 hover:bg-neutral-700 rounded-mobile-sm transition-colors text-mobile-sm"
            >
              <RotateCcw className="w-4 h-4 mr-mobile-xs inline" />
              Restablecer configuración
            </button>
          </div>
        )}

        {activeTab === 'voice' && (
          <div className="space-y-mobile-sm">
            <h3 className="text-mobile-base font-semibold text-white mb-mobile-sm">
              Comandos de Voz
            </h3>
            
            {/* Voice Support Status */}
            <div className="flex items-center justify-between p-mobile-sm bg-neutral-800/50 rounded-mobile-sm">
              <div className="flex items-center gap-mobile-sm">
                <Volume2 className="w-5 h-5 text-green-400" />
                <div>
                  <div className="text-mobile-sm font-medium">Reconocimiento de voz</div>
                  <div className="text-mobile-xs text-neutral-400">
                    {isVoiceSupported ? 'Soportado' : 'No soportado'}
                  </div>
                </div>
              </div>
              <div className={cn(
                'w-3 h-3 rounded-full',
                isVoiceSupported ? 'bg-green-400' : 'bg-red-400'
              )} />
            </div>

            {/* Voice Commands Toggle */}
            <div className="flex items-center justify-between p-mobile-sm bg-neutral-800/50 rounded-mobile-sm">
              <div className="flex items-center gap-mobile-sm">
                <Volume2 className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="text-mobile-sm font-medium">Comandos de voz</div>
                  <div className="text-mobile-xs text-neutral-400">
                    Activar reconocimiento de voz
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleSettingToggle('voiceCommands')}
                disabled={!isVoiceSupported}
                className={cn(
                  'w-10 h-6 rounded-full transition-colors relative',
                  settings.voiceCommands ? 'bg-primary-600' : 'bg-neutral-600',
                  !isVoiceSupported && 'opacity-50 cursor-not-allowed'
                )}
                aria-label={`${settings.voiceCommands ? 'Desactivar' : 'Activar'} comandos de voz`}
              >
                <div className={cn(
                  'w-4 h-4 bg-white rounded-full transition-transform absolute top-1',
                  settings.voiceCommands ? 'translate-x-5' : 'translate-x-1'
                )} />
              </button>
            </div>

            {/* Voice Controls */}
            {isVoiceSupported && (
              <div className="space-y-mobile-sm">
                <div className="flex gap-mobile-sm">
                  <button
                    onClick={startListening}
                    disabled={isListening || !settings.voiceCommands}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-mobile-xs px-mobile-sm py-mobile-sm rounded-mobile-sm text-mobile-sm transition-colors',
                      isListening
                        ? 'bg-red-600 text-white'
                        : 'bg-primary-600 hover:bg-primary-700 text-white',
                      !settings.voiceCommands && 'opacity-50 cursor-not-allowed'
                    )}
                    aria-label={isListening ? 'Detener escucha' : 'Iniciar escucha'}
                  >
                    {isListening ? (
                      <>
                        <VolumeX className="w-4 h-4" />
                        Detener
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4" />
                        Escuchar
                      </>
                    )}
                  </button>
                </div>

                {/* Transcript */}
                {transcript && (
                  <div className="p-mobile-sm bg-neutral-800/30 rounded-mobile-sm">
                    <div className="text-mobile-xs text-neutral-400 mb-mobile-xs">
                      Reconocido:
                    </div>
                    <div className="text-mobile-sm text-white">{transcript}</div>
                    <div className="text-mobile-xs text-neutral-400 mt-mobile-xs">
                      Confianza: {Math.round(confidence * 100)}%
                    </div>
                  </div>
                )}

                {/* Available Commands */}
                <div className="p-mobile-sm bg-neutral-800/30 rounded-mobile-sm">
                  <div className="text-mobile-xs text-neutral-400 mb-mobile-xs">
                    Comandos disponibles:
                  </div>
                  <div className="space-y-mobile-xs">
                    {commands.map((cmd) => (
                      <div key={cmd.command} className="text-mobile-sm">
                        <span className="text-primary-400 font-medium">"{cmd.command}"</span>
                        <span className="text-neutral-400"> - {cmd.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'keyboard' && (
          <div className="space-y-mobile-sm">
            <h3 className="text-mobile-base font-semibold text-white mb-mobile-sm">
              Navegación por Teclado
            </h3>
            
            {/* Keyboard Navigation Toggle */}
            <div className="flex items-center justify-between p-mobile-sm bg-neutral-800/50 rounded-mobile-sm">
              <div className="flex items-center gap-mobile-sm">
                <Keyboard className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="text-mobile-sm font-medium">Navegación por teclado</div>
                  <div className="text-mobile-xs text-neutral-400">
                    Activar atajos de teclado
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleSettingToggle('keyboardNavigation')}
                className={cn(
                  'w-10 h-6 rounded-full transition-colors relative',
                  settings.keyboardNavigation ? 'bg-primary-600' : 'bg-neutral-600'
                )}
                aria-label={`${settings.keyboardNavigation ? 'Desactivar' : 'Activar'} navegación por teclado`}
              >
                <div className={cn(
                  'w-4 h-4 bg-white rounded-full transition-transform absolute top-1',
                  settings.keyboardNavigation ? 'translate-x-5' : 'translate-x-1'
                )} />
              </button>
            </div>

            {/* Available Shortcuts */}
            <div className="p-mobile-sm bg-neutral-800/30 rounded-mobile-sm">
              <div className="text-mobile-xs text-neutral-400 mb-mobile-xs">
                Atajos disponibles:
              </div>
              <div className="space-y-mobile-xs">
                {shortcuts.map((shortcut) => (
                  <div key={shortcut.key} className="text-mobile-sm">
                    <span className="text-primary-400 font-medium">{shortcut.key}</span>
                    <span className="text-neutral-400"> - {shortcut.description}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Focus Visible Toggle */}
            <div className="flex items-center justify-between p-mobile-sm bg-neutral-800/50 rounded-mobile-sm">
              <div className="flex items-center gap-mobile-sm">
                <Eye className="w-5 h-5 text-green-400" />
                <div>
                  <div className="text-mobile-sm font-medium">Indicador de foco</div>
                  <div className="text-mobile-xs text-neutral-400">
                    Mostrar foco visible
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleSettingToggle('focusVisible')}
                className={cn(
                  'w-10 h-6 rounded-full transition-colors relative',
                  settings.focusVisible ? 'bg-primary-600' : 'bg-neutral-600'
                )}
                aria-label={`${settings.focusVisible ? 'Desactivar' : 'Activar'} indicador de foco`}
              >
                <div className={cn(
                  'w-4 h-4 bg-white rounded-full transition-transform absolute top-1',
                  settings.focusVisible ? 'translate-x-5' : 'translate-x-1'
                )} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileAccessibilitySettings;
