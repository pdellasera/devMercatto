import React, { useState } from 'react';
import { Settings, Volume2, VolumeX, Smartphone, SmartphoneOff, TestTube } from 'lucide-react';
import { cn } from '../../utils/cn';
import useMobileHaptic from '../../hooks/useMobileHaptic';

interface MobileHapticSettingsProps {
  className?: string;
  onSettingsChange?: (settings: {
    hapticEnabled: boolean;
    soundEnabled: boolean;
    volume: number;
    intensity: number;
  }) => void;
}

const MobileHapticSettings: React.FC<MobileHapticSettingsProps> = ({
  className,
  onSettingsChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [intensity, setIntensity] = useState(0.5);

  const haptic = useMobileHaptic({
    enabled: true,
    soundEnabled,
    hapticEnabled,
    defaultVolume: volume,
    defaultIntensity: intensity,
  });

  const handleHapticToggle = () => {
    const newHapticEnabled = !hapticEnabled;
    setHapticEnabled(newHapticEnabled);
    onSettingsChange?.({
      hapticEnabled: newHapticEnabled,
      soundEnabled,
      volume,
      intensity,
    });
  };

  const handleSoundToggle = () => {
    const newSoundEnabled = !soundEnabled;
    setSoundEnabled(newSoundEnabled);
    onSettingsChange?.({
      hapticEnabled,
      soundEnabled: newSoundEnabled,
      volume,
      intensity,
    });
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    onSettingsChange?.({
      hapticEnabled,
      soundEnabled,
      volume: newVolume,
      intensity,
    });
  };

  const handleIntensityChange = (newIntensity: number) => {
    setIntensity(newIntensity);
    onSettingsChange?.({
      hapticEnabled,
      soundEnabled,
      volume,
      intensity: newIntensity,
    });
  };

  const testHaptic = () => {
    haptic.triggerClick();
  };

  const testSound = () => {
    haptic.playSound({ type: 'click', volume });
  };

  const testSuccess = () => {
    haptic.triggerSuccess();
  };

  const testError = () => {
    haptic.triggerError();
  };

  const testNotification = () => {
    haptic.triggerNotification();
  };

  return (
    <div className={cn(
      'bg-neutral-900/90 backdrop-blur-sm border border-white/10 rounded-mobile-lg p-mobile-md',
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between mb-mobile-md">
        <div className="flex items-center gap-mobile-sm">
          <Settings className="w-5 h-5 text-primary-500" />
          <h3 className="text-mobile-base font-semibold">Feedback Háptico</h3>
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-mobile-xs rounded-mobile-sm bg-neutral-800 hover:bg-neutral-700 transition-colors mobile-touch-feedback"
        >
          <span className="text-mobile-xs">
            {isExpanded ? '▼' : '▶'}
          </span>
        </button>
      </div>

      {/* Estado de soporte */}
      <div className="grid grid-cols-2 gap-mobile-sm mb-mobile-md">
        <div className="bg-neutral-800/50 rounded-mobile-sm p-mobile-sm">
          <div className="flex items-center gap-mobile-xs mb-mobile-xs">
            <Smartphone className={cn('w-3 h-3', haptic.isVibrationSupported ? 'text-green-400' : 'text-red-400')} />
            <span className="text-mobile-xs text-neutral-400">Vibración</span>
          </div>
          <div className="text-mobile-sm font-medium">
            {haptic.isVibrationSupported ? 'Soportado' : 'No soportado'}
          </div>
        </div>

        <div className="bg-neutral-800/50 rounded-mobile-sm p-mobile-sm">
          <div className="flex items-center gap-mobile-xs mb-mobile-xs">
            <Volume2 className={cn('w-3 h-3', haptic.isAudioSupported ? 'text-green-400' : 'text-red-400')} />
            <span className="text-mobile-xs text-neutral-400">Audio</span>
          </div>
          <div className="text-mobile-sm font-medium">
            {haptic.isAudioSupported ? 'Soportado' : 'No soportado'}
          </div>
        </div>
      </div>

      {/* Detalles expandidos */}
      {isExpanded && (
        <div className="space-y-mobile-sm pt-mobile-md border-t border-white/10">
          {/* Toggle de vibración */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-mobile-sm">
              {hapticEnabled ? (
                <Smartphone className="w-4 h-4 text-green-400" />
              ) : (
                <SmartphoneOff className="w-4 h-4 text-neutral-400" />
              )}
              <span className="text-mobile-sm">Vibración</span>
            </div>
            <button
              onClick={handleHapticToggle}
              disabled={!haptic.isVibrationSupported}
              className={cn(
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors mobile-touch-feedback',
                hapticEnabled ? 'bg-primary-600' : 'bg-neutral-600',
                !haptic.isVibrationSupported && 'opacity-50 cursor-not-allowed'
              )}
            >
              <span
                className={cn(
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  hapticEnabled ? 'translate-x-6' : 'translate-x-1'
                )}
              />
            </button>
          </div>

          {/* Toggle de sonido */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-mobile-sm">
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-green-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-neutral-400" />
              )}
              <span className="text-mobile-sm">Sonido</span>
            </div>
            <button
              onClick={handleSoundToggle}
              disabled={!haptic.isAudioSupported}
              className={cn(
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors mobile-touch-feedback',
                soundEnabled ? 'bg-primary-600' : 'bg-neutral-600',
                !haptic.isAudioSupported && 'opacity-50 cursor-not-allowed'
              )}
            >
              <span
                className={cn(
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  soundEnabled ? 'translate-x-6' : 'translate-x-1'
                )}
              />
            </button>
          </div>

          {/* Control de volumen */}
          {soundEnabled && haptic.isAudioSupported && (
            <div className="space-y-mobile-xs">
              <div className="flex items-center justify-between">
                <span className="text-mobile-sm text-neutral-400">Volumen</span>
                <span className="text-mobile-sm font-medium">{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full slider"
              />
            </div>
          )}

          {/* Control de intensidad */}
          {hapticEnabled && haptic.isVibrationSupported && (
            <div className="space-y-mobile-xs">
              <div className="flex items-center justify-between">
                <span className="text-mobile-sm text-neutral-400">Intensidad</span>
                <span className="text-mobile-sm font-medium">{Math.round(intensity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={intensity}
                onChange={(e) => handleIntensityChange(parseFloat(e.target.value))}
                className="w-full slider"
              />
            </div>
          )}

          {/* Pruebas */}
          <div className="pt-mobile-sm border-t border-white/10">
            <div className="flex items-center gap-mobile-xs mb-mobile-sm">
              <TestTube className="w-4 h-4 text-neutral-400" />
              <span className="text-mobile-sm text-neutral-400">Pruebas</span>
            </div>
            <div className="grid grid-cols-2 gap-mobile-sm">
              <button
                onClick={testHaptic}
                disabled={!hapticEnabled || !haptic.isVibrationSupported}
                className="px-mobile-sm py-mobile-xs bg-neutral-800 hover:bg-neutral-700 rounded-mobile-sm transition-colors mobile-touch-feedback disabled:opacity-50 disabled:cursor-not-allowed text-mobile-xs"
              >
                Click
              </button>
              <button
                onClick={testSound}
                disabled={!soundEnabled || !haptic.isAudioSupported}
                className="px-mobile-sm py-mobile-xs bg-neutral-800 hover:bg-neutral-700 rounded-mobile-sm transition-colors mobile-touch-feedback disabled:opacity-50 disabled:cursor-not-allowed text-mobile-xs"
              >
                Sonido
              </button>
              <button
                onClick={testSuccess}
                disabled={(!hapticEnabled && !soundEnabled) || (!haptic.isVibrationSupported && !haptic.isAudioSupported)}
                className="px-mobile-sm py-mobile-xs bg-green-600 hover:bg-green-700 rounded-mobile-sm transition-colors mobile-touch-feedback disabled:opacity-50 disabled:cursor-not-allowed text-mobile-xs"
              >
                Éxito
              </button>
              <button
                onClick={testError}
                disabled={(!hapticEnabled && !soundEnabled) || (!haptic.isVibrationSupported && !haptic.isAudioSupported)}
                className="px-mobile-sm py-mobile-xs bg-red-600 hover:bg-red-700 rounded-mobile-sm transition-colors mobile-touch-feedback disabled:opacity-50 disabled:cursor-not-allowed text-mobile-xs"
              >
                Error
              </button>
            </div>
            <button
              onClick={testNotification}
              disabled={(!hapticEnabled && !soundEnabled) || (!haptic.isVibrationSupported && !haptic.isAudioSupported)}
              className="w-full mt-mobile-sm px-mobile-sm py-mobile-xs bg-blue-600 hover:bg-blue-700 rounded-mobile-sm transition-colors mobile-touch-feedback disabled:opacity-50 disabled:cursor-not-allowed text-mobile-xs"
            >
              Notificación
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileHapticSettings;
