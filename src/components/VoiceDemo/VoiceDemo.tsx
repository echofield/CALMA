import { useEffect } from 'react';
import { Play, Pause, Loader2, AlertCircle, X } from 'lucide-react';
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
    initializeAudio,
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

    if (open) {
      updateCanvasSize();
    }
    
    const handleResize = () => {
      updateCanvasSize();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [canvasRef, open]);

  // Initialize audio when modal opens
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      console.log('VoiceDemo modal opened');
      // Initialize audio system once when modal opens
      initializeAudio().catch((err) => {
        console.error('Failed to initialize audio:', err);
      });
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open, initializeAudio]);

  const handlePlayPause = () => {
    if (state === 'playing') {
      stopAudio();
    } else {
      playAudio(selectedVoice);
    }
  };

  const getStatusText = () => {
    switch (state) {
      case 'idle': return 'Prêt pour la démonstration';
      case 'loading': return 'Génération de la voix...';
      case 'playing': return 'CALMA Voice parle...';
      case 'error': return error || 'Erreur';
      default: return '';
    }
  };

  const selectedVoiceConfig = Object.values(VOICE_DEMO_CONFIG.voices).find(
    (v) => v.id === selectedVoice
  );

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 9998,
        }}
        onClick={() => onOpenChange(false)}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '32px',
          width: '90%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflowY: 'auto',
          zIndex: 9999,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #E0E0E0',
        }}
      >
        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Fermer la modal"
        >
          <X style={{ width: '20px', height: '20px', color: '#6B6B6B' }} />
        </button>

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ 
            color: '#1A1A1A', 
            fontSize: '1.5rem', 
            fontWeight: 500,
            fontFamily: 'Montserrat, sans-serif',
            marginBottom: '8px',
          }}>
            Découvrez CALMA Voice
          </h2>
          <p style={{ 
            color: '#6B6B6B', 
            fontSize: '0.95rem',
            fontFamily: 'Montserrat, sans-serif',
          }}>
            Écoutez nos voix et découvrez comment CALMA accueille vos clients.
          </p>
        </div>

        {/* Voice Selector */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ 
            display: 'block',
            fontSize: '0.75rem', 
            color: '#6B6B6B', 
            marginBottom: '8px',
            fontFamily: 'Montserrat, sans-serif',
          }}>
            Choisissez une voix
          </label>
          <div style={{
            display: 'flex',
            gap: '8px',
            padding: '4px',
            backgroundColor: '#EFF0ED',
            borderRadius: '999px',
            border: '1px solid #E0E0E0',
          }}>
            {Object.values(VOICE_DEMO_CONFIG.voices).map((voice) => {
              const isSelected = selectedVoice === voice.id;
              return (
                <button
                  key={voice.id}
                  onClick={() => selectVoice(voice.id)}
                  disabled={state === 'playing' || state === 'loading'}
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    borderRadius: '999px',
                    border: 'none',
                    cursor: state === 'playing' || state === 'loading' ? 'not-allowed' : 'pointer',
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    transition: 'all 0.3s ease',
                    backgroundColor: isSelected ? '#BFA97A' : 'transparent',
                    color: isSelected ? '#FFFFFF' : '#6B6B6B',
                    opacity: state === 'playing' || state === 'loading' ? 0.5 : 1,
                  }}
                  aria-label={`Sélectionner la voix ${voice.label}`}
                >
                  {voice.label}
                </button>
              );
            })}
          </div>
          {selectedVoiceConfig && (
            <p style={{ 
              fontSize: '0.75rem', 
              color: '#6B6B6B', 
              marginTop: '8px',
              fontStyle: 'italic',
              fontFamily: 'Montserrat, sans-serif',
            }}>
              {selectedVoiceConfig.description}
            </p>
          )}
        </div>

        {/* Play Button */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <button
            onClick={handlePlayPause}
            disabled={state === 'loading'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 32px',
              backgroundColor: '#BFA97A',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              cursor: state === 'loading' ? 'not-allowed' : 'pointer',
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '0.95rem',
              fontWeight: 500,
              letterSpacing: '0.05em',
              opacity: state === 'loading' ? 0.7 : 1,
              transition: 'all 0.3s ease',
            }}
            aria-label={state === 'playing' ? 'Arrêter la lecture' : 'Lancer la lecture'}
          >
            {state === 'loading' ? (
              <>
                <Loader2 style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite' }} />
                Génération...
              </>
            ) : state === 'playing' ? (
              <>
                <Pause style={{ width: '20px', height: '20px' }} />
                Arrêter
              </>
            ) : (
              <>
                <Play style={{ width: '20px', height: '20px' }} />
                Lancer la démo
              </>
            )}
          </button>
        </div>

        {/* Canvas Visualization */}
        <div style={{ marginBottom: '16px' }}>
          {state === 'playing' && (
            <div style={{
              textAlign: 'center',
              marginBottom: '12px',
              padding: '8px 16px',
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              border: '1px solid #E0E0E0',
              display: 'inline-block',
              width: '100%',
            }}>
              <p style={{
                fontSize: '0.9rem',
                color: '#BFA97A',
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 500,
                margin: 0,
              }}>
                Lecture en cours...
              </p>
            </div>
          )}
          <div style={{ 
            height: '80px', 
            backgroundColor: '#F5EEDF',
            borderRadius: '12px',
            padding: '12px',
            border: '1px solid #E0E0E0'
          }}>
            <canvas
              ref={canvasRef}
              style={{ width: '100%', height: '100%', display: 'block' }}
              aria-label="Visualisation audio"
            />
          </div>
          {state === 'playing' && (
            <p style={{
              textAlign: 'center',
              marginTop: '8px',
              fontSize: '0.85rem',
              color: '#1A1A1A',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 400,
            }}>
              CALMA parle...
            </p>
          )}
        </div>

        {/* Status */}
        <div style={{ textAlign: 'center' }}>
          {error && state === 'error' ? (
            <div style={{ 
              color: '#d4183d', 
              fontSize: '0.85rem', 
              fontFamily: 'Montserrat, sans-serif',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}>
              <AlertCircle style={{ width: '16px', height: '16px' }} />
              <span>{error}</span>
            </div>
          ) : (
            <p style={{ 
              fontSize: '0.75rem', 
              color: '#6B6B6B',
              fontFamily: 'Montserrat, sans-serif',
            }}>
              {getStatusText()}
            </p>
          )}
        </div>
      </div>

      {/* Hidden audio */}
      <audio ref={audioRef} style={{ display: 'none' }} />

      {/* Keyframe for spinner */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
