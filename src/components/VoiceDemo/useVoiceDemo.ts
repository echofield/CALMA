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
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null | 'exists'>(null);

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
      // CRITICAL: createMediaElementSource can only be called ONCE per audio element
      // If it was already called, we cannot create it again
      if (!sourceNodeRef.current && audioRef.current) {
        try {
          const source = ctx.createMediaElementSource(audioRef.current);
          sourceNodeRef.current = source;
          source.connect(analyser!);
          analyser!.connect(ctx.destination);
        } catch (err: any) {
          // If source already exists, we cannot use visualization
          // But we can still play audio without visualization
          // Set a flag to indicate source exists but we can't use it
          console.warn('Audio source already exists, visualization will be disabled');
          // Set to a special value to indicate "exists but can't use"
          sourceNodeRef.current = 'exists' as any;
        }
      }
    } catch (err) {
      console.error('Error setting up audio analyser:', err);
      // Don't set error state - allow audio to play without visualization
      // setError('Erreur de configuration audio');
      // setState('error');
    }
  }, [audioContext, analyser]);

  // Draw audio visualization
  const drawVisualization = useCallback(() => {
    // Skip visualization if source node doesn't exist or is invalid
    const hasValidSource = sourceNodeRef.current && sourceNodeRef.current !== 'exists';
    if (!canvasRef.current || !analyser || !dataArray || !hasValidSource || state !== 'playing') {
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
    const hasValidSource = sourceNodeRef.current && sourceNodeRef.current !== 'exists';
    if (state === 'playing' && analyser && dataArray && hasValidSource) {
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
    console.log('Fetching audio from:', apiEndpoint, { voice: voiceId, textLength: text.length });
    
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg, application/octet-stream, */*',
      },
      body: JSON.stringify({ voice: voiceId, text }),
      // Ajouter credentials pour les requêtes cross-origin si nécessaire
      credentials: 'omit',
    });

    console.log('API Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Erreur API (${response.status}): ${response.statusText}`;
      
      // Gestion spécifique de l'erreur 401
      if (response.status === 401) {
        errorMessage = 'Erreur d\'authentification. Le service TTS nécessite une configuration serveur. Veuillez contacter le support.';
        console.error('401 Unauthorized - Le serveur nécessite une authentification ou la configuration API est manquante');
      }
      
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error || errorJson.details || errorMessage;
        console.error('API Error JSON:', errorJson);
      } catch {
        if (errorText) {
          errorMessage += ` - ${errorText}`;
          console.error('API Error text:', errorText);
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
    if (!audioRef.current) {
      console.error('Audio ref not available');
      return;
    }

    try {
      setState('loading');
      setError(null);

      // Setup audio analyser (may fail for visualization, but audio should still play)
      try {
        await setupAudioAnalyser();
      } catch (setupErr) {
        console.warn('Audio analyser setup failed, continuing without visualization:', setupErr);
        // Continue anyway - audio can play without visualization
      }

      // Fetch audio
      console.log('Fetching audio for voice:', voiceId);
      const audioUrl = await fetchAudio(voiceId);
      console.log('Audio URL received:', audioUrl);

      if (!audioRef.current) {
        throw new Error('Audio element not available');
      }

      const audio = audioRef.current;

      // Set audio source and play
      console.log('Setting audio source:', audioUrl);
      audio.src = audioUrl;
      
      // Attendre que l'audio soit chargé
      await new Promise((resolve, reject) => {
        const handleCanPlay = () => {
          console.log('Audio can play, readyState:', audio.readyState);
          audio.removeEventListener('canplay', handleCanPlay);
          audio.removeEventListener('error', handleError);
          resolve(undefined);
        };
        
        const handleError = (e: Event) => {
          console.error('Audio load error:', e);
          audio.removeEventListener('canplay', handleCanPlay);
          audio.removeEventListener('error', handleError);
          const audioElement = e.currentTarget as HTMLAudioElement;
          const error = audioElement?.error;
          reject(new Error(`Erreur audio: ${error?.code} - ${error?.message || 'Unknown error'}`));
        };
        
        if (audio.readyState >= 2) {
          // Already loaded
          console.log('Audio already loaded, readyState:', audio.readyState);
          resolve(undefined);
        } else {
          audio.addEventListener('canplay', handleCanPlay);
          audio.addEventListener('error', handleError);
          console.log('Loading audio...');
          audio.load();
        }
      });
      
      // Setup event handlers
      audio.onended = () => {
        console.log('Audio ended');
        setState('idle');
      };
      
      audio.onerror = (e: string | Event) => {
        console.error('Audio playback error:', e);
        let errorMsg = 'Erreur de lecture audio';
        
        if (typeof e !== 'string' && e.currentTarget) {
          const audioElement = e.currentTarget as HTMLAudioElement;
          const error = audioElement?.error;
          if (error) {
            errorMsg = `Erreur audio (code ${error.code}): ${error.message}`;
          }
        }
        
        setError(errorMsg);
        setState('error');
      };

      // Play audio
      console.log('Attempting to play audio...');
      try {
        await audio.play();
        console.log('Audio playing successfully');
        setState('playing');
      } catch (playError: any) {
        console.error('Play failed:', playError);
        // Si play() échoue, c'est souvent à cause d'une politique de navigateur
        // (nécessite interaction utilisateur). On essaie quand même de mettre l'état à playing
        // car l'utilisateur a cliqué sur le bouton
        if (playError.name === 'NotAllowedError') {
          throw new Error('La lecture nécessite une interaction. Veuillez cliquer à nouveau.');
        }
        throw playError;
      }
    } catch (err) {
      console.error('Error playing audio:', err);
      let errorMessage = 'Erreur de lecture';
      
      if (err instanceof Error) {
        errorMessage = err.message;
        // Messages d'erreur plus clairs
        if (err.message.includes('401') || err.message.includes('Unauthorized') || err.message.includes('authentification')) {
          errorMessage = 'Le service TTS nécessite une configuration serveur. Le backend n\'est pas correctement configuré. Veuillez contacter le support technique.';
        } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
          errorMessage = 'Impossible de contacter le serveur. Vérifiez votre connexion ou que le service Render est actif.';
        } else if (err.message.includes('TTS_FAILED')) {
          errorMessage = 'La génération vocale a échoué. Le service backend n\'est pas disponible ou mal configuré.';
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
      if (sourceNodeRef.current && sourceNodeRef.current !== 'exists') {
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
