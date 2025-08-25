import { useCallback, useRef, useEffect } from 'react';

interface HapticPattern {
  type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'custom';
  duration?: number;
  intensity?: number;
}

interface SoundPattern {
  type: 'click' | 'success' | 'error' | 'notification' | 'custom';
  volume?: number;
  pitch?: number;
}

interface UseMobileHapticOptions {
  enabled?: boolean;
  soundEnabled?: boolean;
  hapticEnabled?: boolean;
  defaultVolume?: number;
  defaultIntensity?: number;
}

const useMobileHaptic = (options: UseMobileHapticOptions = {}) => {
  const {
    enabled = true,
    soundEnabled = true,
    hapticEnabled = true,
    defaultVolume = 0.5,
    defaultIntensity = 0.5,
  } = options;

  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Verificar soporte para vibración
  const isVibrationSupported = 'vibrate' in navigator;
  
  // Verificar soporte para Web Audio API
  const isAudioSupported = typeof window !== 'undefined' && 'AudioContext' in window;

  // Inicializar AudioContext
  useEffect(() => {
    if (isAudioSupported && soundEnabled) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [isAudioSupported, soundEnabled]);

  // Patrones de vibración predefinidos
  const hapticPatterns: Record<string, number[]> = {
    light: [10],
    medium: [20],
    heavy: [30],
    success: [10, 50, 10],
    warning: [20, 100, 20],
    error: [30, 100, 30, 100, 30],
    custom: [],
  };

  // Patrones de sonido predefinidos
  const soundPatterns: Record<string, { frequency: number; duration: number; type: OscillatorType }> = {
    click: { frequency: 800, duration: 50, type: 'sine' },
    success: { frequency: 1000, duration: 200, type: 'sine' },
    error: { frequency: 400, duration: 300, type: 'sawtooth' },
    notification: { frequency: 600, duration: 150, type: 'triangle' },
    custom: { frequency: 800, duration: 100, type: 'sine' },
  };

  // Función para vibrar
  const vibrate = useCallback((pattern: HapticPattern | number[]) => {
    if (!enabled || !hapticEnabled || !isVibrationSupported) return;

    let vibrationPattern: number[];

    if (Array.isArray(pattern)) {
      vibrationPattern = pattern;
    } else {
      const basePattern = hapticPatterns[pattern.type] || hapticPatterns.light;
      const intensity = pattern.intensity || defaultIntensity;
      
      vibrationPattern = basePattern.map(duration => 
        Math.round(duration * intensity)
      );
    }

    try {
      navigator.vibrate(vibrationPattern);
    } catch (error) {
      console.warn('Error al ejecutar vibración:', error);
    }
  }, [enabled, hapticEnabled, isVibrationSupported, defaultIntensity]);

  // Función para reproducir sonido
  const playSound = useCallback((pattern: SoundPattern | { frequency: number; duration: number; type?: OscillatorType }) => {
    if (!enabled || !soundEnabled || !isAudioSupported || !audioContextRef.current) return;

    const audioContext = audioContextRef.current;
    
    // Reanudar contexto si está suspendido
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    let soundConfig: { frequency: number; duration: number; type: OscillatorType };

    if ('type' in pattern && typeof pattern.type === 'string') {
      // Patrón predefinido
      soundConfig = soundPatterns[pattern.type] || soundPatterns.click;
    } else {
      // Configuración personalizada
      soundConfig = {
        frequency: pattern.frequency,
        duration: pattern.duration,
        type: pattern.type || 'sine',
      };
    }

    try {
      // Crear oscilador
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Configurar oscilador
      oscillator.frequency.setValueAtTime(soundConfig.frequency, audioContext.currentTime);
      oscillator.type = soundConfig.type;

      // Configurar volumen
      const volume = 'volume' in pattern ? pattern.volume || defaultVolume : defaultVolume;
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + soundConfig.duration / 1000);

      // Reproducir
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + soundConfig.duration / 1000);

      // Limpiar referencias
      oscillator.onended = () => {
        oscillator.disconnect();
        gainNode.disconnect();
      };

    } catch (error) {
      console.warn('Error al reproducir sonido:', error);
    }
  }, [enabled, soundEnabled, isAudioSupported, defaultVolume]);

  // Función combinada para feedback háptico y sonoro
  const triggerFeedback = useCallback((
    hapticPattern?: HapticPattern | number[],
    soundPattern?: SoundPattern | { frequency: number; duration: number; type?: OscillatorType }
  ) => {
    if (hapticPattern) {
      vibrate(hapticPattern);
    }
    
    if (soundPattern) {
      playSound(soundPattern);
    }
  }, [vibrate, playSound]);

  // Funciones de conveniencia para patrones comunes
  const triggerClick = useCallback(() => {
    triggerFeedback({ type: 'light' }, { type: 'click' });
  }, [triggerFeedback]);

  const triggerSuccess = useCallback(() => {
    triggerFeedback({ type: 'success' }, { type: 'success' });
  }, [triggerFeedback]);

  const triggerError = useCallback(() => {
    triggerFeedback({ type: 'error' }, { type: 'error' });
  }, [triggerFeedback]);

  const triggerWarning = useCallback(() => {
    triggerFeedback({ type: 'warning' }, { type: 'notification' });
  }, [triggerFeedback]);

  const triggerNotification = useCallback(() => {
    triggerFeedback({ type: 'light' }, { type: 'notification' });
  }, [triggerFeedback]);

  // Función para detener vibración
  const stopVibration = useCallback(() => {
    if (isVibrationSupported) {
      navigator.vibrate(0);
    }
  }, [isVibrationSupported]);

  // Función para verificar permisos de audio
  const requestAudioPermission = useCallback(async () => {
    if (!isAudioSupported || !audioContextRef.current) return false;

    try {
      await audioContextRef.current.resume();
      return true;
    } catch (error) {
      console.warn('Error al solicitar permisos de audio:', error);
      return false;
    }
  }, [isAudioSupported]);

  // Función para configurar volumen global
  const setVolume = useCallback((volume: number) => {
    if (volume < 0 || volume > 1) {
      console.warn('El volumen debe estar entre 0 y 1');
      return;
    }
    
    // El volumen se aplica en cada llamada a playSound
    // Esta función podría usarse para configurar un volumen global
  }, []);

  // Función para configurar intensidad de vibración
  const setIntensity = useCallback((intensity: number) => {
    if (intensity < 0 || intensity > 1) {
      console.warn('La intensidad debe estar entre 0 y 1');
      return;
    }
    
    // La intensidad se aplica en cada llamada a vibrate
    // Esta función podría usarse para configurar una intensidad global
  }, []);

  return {
    // Estado
    isVibrationSupported,
    isAudioSupported,
    enabled,
    soundEnabled,
    hapticEnabled,

    // Funciones principales
    vibrate,
    playSound,
    triggerFeedback,

    // Funciones de conveniencia
    triggerClick,
    triggerSuccess,
    triggerError,
    triggerWarning,
    triggerNotification,

    // Control
    stopVibration,
    requestAudioPermission,
    setVolume,
    setIntensity,

    // Patrones predefinidos
    patterns: {
      haptic: hapticPatterns,
      sound: soundPatterns,
    },
  };
};

export default useMobileHaptic;
