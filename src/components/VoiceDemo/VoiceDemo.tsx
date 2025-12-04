import { useEffect } from 'react';
import { Play, Pause, Loader2, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { useVoiceDemo } from './useVoiceDemo';

const VOICE_DEMO_CONFIG = {
  apiEndpoint: 'https://symivoicefinalbackend.onrender.com/api/tts',
  voices: {
    masculine: { id: 'simon', label: 'Gabriel', description: 'Voix masculine, chaleureuse' },
    feminine: { id: 'lena', label: 'CALMA', description: 'Voix féminine, professionnelle' },
  },
  scripts: {
    simon: "Bonjour, bienvenue chez votre établissement. Je suis votre concierge vocal CALMA. Je gère vos réservations, modifications et annulations à toute heure. Vos clients sont accueillis avec attention, même quand votre équipe est en service. Un accueil fluide, à votre image.",
    lena: "Bonjour, ici CALMA, votre conciergerie de table. Je réponds à vos appels 24 heures sur 24, je confirme les réservations et j'envoie les rappels pour éviter les no-shows. Votre équipe se concentre sur le service, je m'occupe du reste.",
  },
};

interface VoiceDemoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VoiceDemo({ open, onOpenChange }: VoiceDemoProps) {
  const {
    state,
    selectedVoice,
    error,
    selectVoice,
    playAudio,
    stopAudio,
    canvasRef,
    audioRef,
  } = useVoiceDemo({
    apiEndpoint: VOICE_DEMO_CONFIG.apiEndpoint,
    scripts: VOICE_DEMO_CONFIG.scripts,
  });

  // Initialize canvas on mount and handle resize
  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        
        // Set actual canvas size
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Scale context to match devicePixelRatio
          ctx.scale(dpr, dpr);
          
          // Draw baseline using CSS dimensions
          ctx.beginPath();
          ctx.moveTo(0, rect.height / 2);
          ctx.lineTo(rect.width, rect.height / 2);
          ctx.strokeStyle = '#E0E0E0';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }
    };

    updateCanvasSize();
    
    const handleResize = () => {
      updateCanvasSize();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [canvasRef, open]); // Re-run when modal opens

  const handlePlayPause = () => {
    if (state === 'playing') {
      stopAudio();
    } else {
      playAudio(selectedVoice);
    }
  };

  const getStatusText = () => {
    switch (state) {
      case 'idle':
        return 'Prêt pour la démonstration';
      case 'loading':
        return 'Génération de la voix...';
      case 'playing':
        return 'CALMA Voice parle...';
      case 'error':
        return error || 'Erreur';
      default:
        return '';
    }
  };

  const selectedVoiceConfig = Object.values(VOICE_DEMO_CONFIG.voices).find(
    (v) => v.id === selectedVoice
  );

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl bg-white border border-[#E0E0E0]">
          <DialogHeader>
            <DialogTitle className="text-[#1A1A1A] font-montserrat text-2xl">
              Découvrez CALMA Voice
            </DialogTitle>
            <DialogDescription className="text-[#6B6B6B] font-montserrat">
              Écoutez nos voix et découvrez comment CALMA accueille vos clients avec élégance.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Voice Selector */}
            <div>
              <label className="text-xs text-[#6B6B6B] mb-2 block font-montserrat">
                Choisissez une voix
              </label>
              <div className="flex gap-2 p-1 bg-[#EFF0ED] rounded-full border border-[#E0E0E0]">
                {Object.values(VOICE_DEMO_CONFIG.voices).map((voice) => {
                  const isSelected = selectedVoice === voice.id;
                  return (
                    <button
                      key={voice.id}
                      onClick={() => selectVoice(voice.id)}
                      disabled={state === 'playing' || state === 'loading'}
                      className={`flex-1 px-4 py-2 rounded-full transition-all duration-300 font-montserrat text-sm ${
                        isSelected
                          ? 'bg-[#BFA97A] text-white shadow-sm'
                          : 'bg-transparent text-[#6B6B6B] hover:text-[#1A1A1A]'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                      aria-label={`Sélectionner la voix ${voice.label}`}
                    >
                      {voice.label}
                    </button>
                  );
                })}
              </div>
              {selectedVoiceConfig && (
                <p className="text-xs text-[#6B6B6B] mt-2 font-montserrat italic">
                  {selectedVoiceConfig.description}
                </p>
              )}
            </div>

            {/* Play/Stop Button */}
            <div className="flex justify-center">
              <Button
                onClick={handlePlayPause}
                disabled={state === 'loading'}
                className="bg-[#BFA97A] hover:bg-[#BFA97A]/90 text-white px-8 py-6 rounded-lg transition-all duration-300 font-montserrat disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ letterSpacing: '0.08em', fontWeight: 500 }}
                aria-label={state === 'playing' ? 'Arrêter la lecture' : 'Lancer la lecture'}
              >
                {state === 'loading' ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Génération...
                  </>
                ) : state === 'playing' ? (
                  <>
                    <Pause className="w-5 h-5 mr-2" />
                    Arrêter
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Lancer la démo
                  </>
                )}
              </Button>
            </div>

            {/* Audio Visualization Canvas */}
            <div className="h-16 flex items-center justify-center">
              <canvas
                ref={canvasRef}
                className="w-full h-full"
                style={{ maxHeight: '64px' }}
                aria-label="Visualisation audio"
              />
            </div>

            {/* Status Display */}
            <div className="h-6 flex items-center justify-center">
              {error && state === 'error' ? (
                <div className="flex items-center gap-2 text-[#d4183d] text-sm font-montserrat">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              ) : (
                <p className="text-xs text-[#6B6B6B] font-montserrat">
                  {getStatusText()}
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hidden audio element */}
      <audio ref={audioRef} className="hidden" />
    </>
  );
}

