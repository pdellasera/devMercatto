import { useState, useEffect, useCallback, useRef } from 'react';

interface VoiceCommand {
  command: string;
  action: () => void;
  description: string;
  category: string;
}

interface UseMobileVoiceCommandsOptions {
  enabled?: boolean;
  language?: string;
  continuous?: boolean;
  onCommandRecognized?: (command: string, confidence: number) => void;
  onError?: (error: string) => void;
}

interface UseMobileVoiceCommandsReturn {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  confidence: number;
  commands: VoiceCommand[];
  startListening: () => void;
  stopListening: () => void;
  addCommand: (command: VoiceCommand) => void;
  removeCommand: (commandText: string) => void;
  clearCommands: () => void;
  getAvailableCommands: () => VoiceCommand[];
}

const useMobileVoiceCommands = (
  options: UseMobileVoiceCommandsOptions = {}
): UseMobileVoiceCommandsReturn => {
  const {
    enabled = false,
    language = 'es-ES',
    continuous = false,
    onCommandRecognized,
    onError,
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [commands, setCommands] = useState<VoiceCommand[]>([]);
  
  const recognitionRef = useRef<any>(null);
  const isInitializedRef = useRef(false);

  // Verificar soporte de reconocimiento de voz
  useEffect(() => {
    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      
      // Configurar reconocimiento
      recognitionRef.current.continuous = continuous;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = language;
      recognitionRef.current.maxAlternatives = 3;
      
      // Event listeners
      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setTranscript('');
        setConfidence(0);
      };
      
      recognitionRef.current.onresult = (event: any) => {
        const result = event.results[event.results.length - 1];
        const transcriptText = result[0].transcript.trim().toLowerCase();
        const confidenceScore = result[0].confidence;
        
        setTranscript(transcriptText);
        setConfidence(confidenceScore);
        
        // Buscar comando que coincida
        const matchedCommand = commands.find(cmd => 
          transcriptText.includes(cmd.command.toLowerCase())
        );
        
        if (matchedCommand && confidenceScore > 0.7) {
          matchedCommand.action();
          onCommandRecognized?.(transcriptText, confidenceScore);
        }
      };
      
      recognitionRef.current.onerror = (event: any) => {
        setIsListening(false);
        const errorMessage = getErrorMessage(event.error);
        onError?.(errorMessage);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      isInitializedRef.current = true;
    }
  }, [continuous, language, commands, onCommandRecognized, onError]);

  // Obtener mensaje de error
  const getErrorMessage = (error: string): string => {
    const errorMessages: Record<string, string> = {
      'no-speech': 'No se detectó voz. Intenta hablar más cerca del micrófono.',
      'audio-capture': 'Error al acceder al micrófono. Verifica los permisos.',
      'not-allowed': 'Permiso denegado para acceder al micrófono.',
      'network': 'Error de red. Verifica tu conexión.',
      'service-not-allowed': 'Servicio de reconocimiento de voz no disponible.',
      'bad-grammar': 'Error en la gramática del comando.',
      'language-not-supported': 'Idioma no soportado.',
    };
    
    return errorMessages[error] || `Error de reconocimiento: ${error}`;
  };

  // Iniciar escucha
  const startListening = useCallback(() => {
    if (!isSupported || !recognitionRef.current || isListening) return;
    
    try {
      recognitionRef.current.start();
    } catch (error) {
      onError?.('Error al iniciar el reconocimiento de voz');
    }
  }, [isSupported, isListening, onError]);

  // Detener escucha
  const stopListening = useCallback(() => {
    if (!recognitionRef.current || !isListening) return;
    
    try {
      recognitionRef.current.stop();
    } catch (error) {
      onError?.('Error al detener el reconocimiento de voz');
    }
  }, [isListening, onError]);

  // Agregar comando
  const addCommand = useCallback((command: VoiceCommand) => {
    setCommands(prev => {
      // Evitar duplicados
      const exists = prev.some(cmd => cmd.command === command.command);
      if (exists) return prev;
      
      return [...prev, command];
    });
  }, []);

  // Remover comando
  const removeCommand = useCallback((commandText: string) => {
    setCommands(prev => prev.filter(cmd => cmd.command !== commandText));
  }, []);

  // Limpiar comandos
  const clearCommands = useCallback(() => {
    setCommands([]);
  }, []);

  // Obtener comandos disponibles
  const getAvailableCommands = useCallback(() => {
    return commands;
  }, [commands]);

  // Comandos por defecto
  useEffect(() => {
    if (enabled && commands.length === 0) {
      const defaultCommands: VoiceCommand[] = [
        {
          command: 'ayuda',
          action: () => {
            const helpText = `Comandos disponibles: ${commands.map(cmd => cmd.command).join(', ')}`;
            // Aquí podrías mostrar un modal o anunciar al screen reader
            console.log(helpText);
          },
          description: 'Mostrar comandos disponibles',
          category: 'sistema',
        },
        {
          command: 'parar',
          action: () => stopListening(),
          description: 'Detener reconocimiento de voz',
          category: 'sistema',
        },
        {
          command: 'inicio',
          action: () => {
            // Navegar al inicio
            window.location.href = '/mobile';
          },
          description: 'Ir al inicio',
          category: 'navegación',
        },
        {
          command: 'prospectos',
          action: () => {
            // Navegar a prospectos
            window.location.href = '/mobile/prospects';
          },
          description: 'Ir a prospectos',
          category: 'navegación',
        },
      ];
      
      defaultCommands.forEach(cmd => addCommand(cmd));
    }
  }, [enabled, commands.length, addCommand, stopListening]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening]);

  return {
    isListening,
    isSupported,
    transcript,
    confidence,
    commands,
    startListening,
    stopListening,
    addCommand,
    removeCommand,
    clearCommands,
    getAvailableCommands,
  };
};

export default useMobileVoiceCommands;
