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
  initializeAudio: () => Promise<boolean>;
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

  // Initialize Web Audio API - called once when modal opens
  const initializeAudio = useCallback(async () => {
    if (!audioRef.current) return false;

    // Already initialized
    if (sourceNodeRef.current && audioContext && analyser) {
      return true;
    }

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
      let analyserNode = analyser;
      if (!analyserNode) {
        analyserNode = ctx.createAnalyser();
        analyserNode.fftSize = 256;
        setAnalyser(analyserNode);
        setDataArray(new Uint8Array(analyserNode.frequencyBinCount));
      }

      // Connect audio element to analyser
      // CRITICAL: createMediaElementSource can only be called ONCE per audio element
      // If called multiple times, it throws an error
      if (!sourceNodeRef.current && audioRef.current) {
        try {
          const source = ctx.createMediaElementSource(audioRef.current);
          sourceNodeRef.current = source;
          // Connect: source -> analyser -> destination
          source.connect(analyserNode);
          analyserNode.connect(ctx.destination);
          console.log('Audio source initialized successfully');
          return true;
        } catch (err: any) {
          // This should not happen if we check properly, but handle it gracefully
          console.error('Failed to create audio source:', err);
          // If source creation fails, we can't do visualization
          // But we can still play audio without visualization
          return false;
        }
      }
      
      return true;
    } catch (err) {
      console.error('Error initializing audio:', err);
      setError('Erreur de configuration audio');
      setState('error');
      return false;
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

    const barCount = Math.min(dataArray.length / 2, 60); // Limit to 60 bars for better performance
    const barWidth = (WIDTH / barCount) * 0.6; // 60% width, 40% spacing
    const spacing = (WIDTH / barCount) * 0.4;
    let x = spacing / 2;

    // Helper function to draw rounded rectangle
    const drawRoundedRect = (x: number, y: number, width: number, height: number, radius: number) => {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    };

    for (let i = 0; i < barCount; i++) {
      const dataIndex = Math.floor((i / barCount) * (dataArray.length / 2));
      const barHeight = (dataArray[dataIndex] / 255) * HEIGHT * 0.9; // Scale to 90% of height
      const minHeight = HEIGHT * 0.05; // Minimum bar height for visibility
      const finalHeight = Math.max(barHeight, minHeight);
      
      // Calculate position (centered vertically)
      const y = (HEIGHT - finalHeight) / 2;
      const radius = Math.min(barWidth / 2, 4); // Rounded corners
      
      // Create gradient for 3D effect
      const gradient = ctx.createLinearGradient(x, y, x + barWidth, y + finalHeight);
      const baseColor = { r: 191, g: 169, b: 122 }; // CALMA beige
      const intensity = dataArray[dataIndex] / 255;
      
      // Light gradient (lighter at top, darker at bottom)
      gradient.addColorStop(0, `rgba(${baseColor.r + 30}, ${baseColor.g + 30}, ${baseColor.b + 30}, ${intensity * 0.9})`);
      gradient.addColorStop(0.5, `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${intensity * 0.8})`);
      gradient.addColorStop(1, `rgba(${baseColor.r - 20}, ${baseColor.g - 20}, ${baseColor.b - 20}, ${intensity * 0.7})`);
      
      ctx.fillStyle = gradient;
      drawRoundedRect(x, y, barWidth, finalHeight, radius);
      ctx.fill();
      
      x += barWidth + spacing;
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
    console.log('fetchAudio called for voice:', voiceId);
    const text = scripts[voiceId];
    if (!text) {
      throw new Error(`Script non trouvé pour la voix ${voiceId}`);
    }

    // Check cache
    const cacheKey = `${voiceId}-${text}`;
    if (audioCache.has(cacheKey)) {
      console.log('Using cached audio for:', cacheKey);
      return audioCache.get(cacheKey)!;
    }

    console.log('Fetching audio from API:', apiEndpoint);
    console.log('Request payload:', { voice: voiceId, textLength: text.length });
    
    // Fetch from API
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ voice: voiceId, text }),
    });
    
    console.log('API response status:', response.status, response.statusText);

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

    console.log('Reading response as blob...');
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

      // Initialize audio (only once, safe to call multiple times)
      await initializeAudio();

      // Fetch audio from API
      console.log('Fetching audio for voice:', voiceId);
      const audioUrl = await fetchAudio(voiceId);
      console.log('Audio URL received:', audioUrl);

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
      audioRef.current.onerror = (e: string | Event) => {
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
  }, [fetchAudio, initializeAudio]);

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
    initializeAudio,
    canvasRef,
    audioRef,
  };
}

