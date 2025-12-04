import { useState, useRef, useCallback, useEffect } from 'react';

export type VoiceDemoState = 'idle' | 'loading' | 'playing' | 'error';

interface UseVoiceDemoOptions {
  apiEndpoint: string;
  scripts: Record<string, string>;
}

interface UseVoiceDemoReturn {
  state: VoiceDemoState;
  selectedVoice: string;
  error: string | null;
  audioContext: AudioContext | null;
  analyser: AnalyserNode | null;
  dataArray: Uint8Array | null;
  selectVoice: (voiceId: string) => void;
  playAudio: (voiceId: string) => Promise<void>;
  stopAudio: () => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const audioCache = new Map<string, string>();

export function useVoiceDemo({ apiEndpoint, scripts }: UseVoiceDemoOptions): UseVoiceDemoReturn {
  const [state, setState] = useState<VoiceDemoState>('idle');
  const [selectedVoice, setSelectedVoice] = useState<string>('simon');
  const [error, setError] = useState<string | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [dataArray, setDataArray] = useState<Uint8Array | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);

  // Setup Web Audio API
  const setupAudioAnalyser = useCallback(async () => {
    if (!audioRef.current) return;

    try {
      // Create or resume AudioContext
      let ctx = audioContext;
      if (!ctx) {
        ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        setAudioContext(ctx);
      }

      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      // Create analyser if not exists
      if (!analyser) {
        const analyserNode = ctx.createAnalyser();
        analyserNode.fftSize = 256;
        setAnalyser(analyserNode);
        setDataArray(new Uint8Array(analyserNode.frequencyBinCount));
      }

      // Connect audio element to analyser
      // Note: createMediaElementSource can only be called once per audio element
      if (!sourceNodeRef.current && audioRef.current) {
        try {
          const source = ctx.createMediaElementSource(audioRef.current);
          sourceNodeRef.current = source;
          source.connect(analyser!);
          analyser!.connect(ctx.destination);
        } catch (err) {
          // Si l'audio source existe déjà, on peut juste connecter l'analyser
          console.warn('Audio source already exists, reusing:', err);
          if (analyser) {
            analyser.connect(ctx.destination);
          }
        }
      }
    } catch (err) {
      console.error('Error setting up audio analyser:', err);
      setError('Erreur de configuration audio');
      setState('error');
    }
  }, [audioContext, analyser]);

  // Draw audio visualization
  const drawVisualization = useCallback(() => {
    if (!canvasRef.current || !analyser || !dataArray || state !== 'playing') {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    analyser.getByteFrequencyData(dataArray as Uint8Array<ArrayBuffer>);

    // Get CSS dimensions (context is already scaled by devicePixelRatio)
    const rect = canvas.getBoundingClientRect();
    const WIDTH = rect.width;
    const HEIGHT = rect.height;

    // Clear canvas using actual pixel dimensions
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = (WIDTH / (dataArray.length / 2)) * 1.5;
    let x = 0;

    for (let i = 0; i < dataArray.length / 2; i++) {
      const barHeight = (dataArray[i] / 255) * HEIGHT * 0.8; // Scale to 80% of height
      const opacity = Math.min(barHeight / (HEIGHT * 0.4), 1);
      
      ctx.fillStyle = `rgba(191, 169, 122, ${opacity})`;
      // Use CSS dimensions since context is already scaled
      ctx.fillRect(x, HEIGHT / 2 - barHeight / 2, barWidth, barHeight);
      x += barWidth + 1;
    }

    animationFrameIdRef.current = requestAnimationFrame(drawVisualization);
  }, [analyser, dataArray, state]);

  // Start visualization when playing
  useEffect(() => {
    if (state === 'playing' && analyser && dataArray) {
      drawVisualization();
    } else if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
      
      // Clear canvas and redraw baseline
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const rect = canvas.getBoundingClientRect();
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          // Draw baseline using CSS dimensions (context is already scaled)
          ctx.beginPath();
          ctx.moveTo(0, rect.height / 2);
          ctx.lineTo(rect.width, rect.height / 2);
          ctx.strokeStyle = '#E0E0E0';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }
    }

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [state, analyser, dataArray, drawVisualization]);

  // Fetch audio from API
  const fetchAudio = useCallback(async (voiceId: string): Promise<string> => {
    const text = scripts[voiceId];
    if (!text) {
      throw new Error(`Script non trouvé pour la voix ${voiceId}`);
    }

    // Check cache
    const cacheKey = `${voiceId}-${text}`;
    if (audioCache.has(cacheKey)) {
      return audioCache.get(cacheKey)!;
    }

    // Fetch from API
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ voice: voiceId, text }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Erreur API (${response.status}): ${response.statusText}`;
      
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error || errorJson.details || errorMessage;
      } catch {
        if (errorText) {
          errorMessage += ` - ${errorText}`;
        }
      }
      
      throw new Error(errorMessage);
    }

    const blob = await response.blob();
    
    // Vérifier que c'est bien un fichier audio
    // Le serveur peut retourner audio/mpeg ou application/octet-stream
    if (blob.size === 0) {
      throw new Error('Réponse serveur vide');
    }
    
    // Log pour debug
    console.log('Audio blob received:', {
      size: blob.size,
      type: blob.type,
      cacheKey
    });
    
    const url = URL.createObjectURL(blob);
    audioCache.set(cacheKey, url);
    return url;
  }, [apiEndpoint, scripts]);

  // Play audio
  const playAudio = useCallback(async (voiceId: string) => {
    if (!audioRef.current) return;

    try {
      setState('loading');
      setError(null);

      // Setup audio analyser
      await setupAudioAnalyser();

      // Fetch audio
      const audioUrl = await fetchAudio(voiceId);

      // Set audio source and play
      audioRef.current.src = audioUrl;
      
      // Attendre que l'audio soit chargé
      await new Promise((resolve, reject) => {
        if (!audioRef.current) {
          reject(new Error('Audio element not available'));
          return;
        }
        
        const audio = audioRef.current;
        
        const handleCanPlay = () => {
          audio.removeEventListener('canplay', handleCanPlay);
          audio.removeEventListener('error', handleError);
          resolve(undefined);
        };
        
        const handleError = (e: Event) => {
          audio.removeEventListener('canplay', handleCanPlay);
          audio.removeEventListener('error', handleError);
          const audioElement = e.currentTarget as HTMLAudioElement;
          const error = audioElement?.error;
          reject(new Error(`Erreur audio: ${error?.code} - ${error?.message || 'Unknown error'}`));
        };
        
        if (audio.readyState >= 2) {
          // Already loaded
          resolve(undefined);
        } else {
          audio.addEventListener('canplay', handleCanPlay);
          audio.addEventListener('error', handleError);
          audio.load();
        }
      });
      
      audioRef.current.onended = () => {
        setState('idle');
      };
      audioRef.current.onerror = (e: Event) => {
        const audioElement = e.currentTarget as HTMLAudioElement;
        const error = audioElement?.error;
        const errorMsg = error 
          ? `Erreur audio (code ${error.code}): ${error.message}`
          : 'Erreur de lecture audio';
        setError(errorMsg);
        setState('error');
      };

      await audioRef.current.play();
      setState('playing');
    } catch (err) {
      console.error('Error playing audio:', err);
      let errorMessage = 'Erreur de lecture';
      
      if (err instanceof Error) {
        errorMessage = err.message;
        // Messages d'erreur plus clairs
        if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
          errorMessage = 'Impossible de contacter le serveur. Vérifiez votre connexion ou que le service Render est actif.';
        } else if (err.message.includes('404')) {
          errorMessage = 'Endpoint non trouvé. Vérifiez l\'URL du serveur.';
        } else if (err.message.includes('500')) {
          errorMessage = 'Erreur serveur. Le service TTS peut être temporairement indisponible.';
        }
      }
      
      setError(errorMessage);
      setState('error');
    }
  }, [fetchAudio, setupAudioAnalyser]);

  // Stop audio
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setState('idle');
    setError(null);
  }, []);

  // Select voice
  const selectVoice = useCallback((voiceId: string) => {
    if (state === 'playing') return;
    setSelectedVoice(voiceId);
    setError(null);
  }, [state]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      if (sourceNodeRef.current) {
        sourceNodeRef.current.disconnect();
      }
      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close();
      }
    };
  }, [audioContext]);

  return {
    state,
    selectedVoice,
    error,
    audioContext,
    analyser,
    dataArray,
    selectVoice,
    playAudio,
    stopAudio,
    canvasRef,
    audioRef,
  };
}

