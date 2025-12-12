import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MapContainer, TileLayer, Circle, Marker, useMap } from 'react-leaflet';
import { TrendingUp, ArrowRight, Eye } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix pour les icônes Leaflet par défaut
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Composant pour ajuster la vue de la carte quand le radius change
function MapUpdater({ center, radius }: { center: [number, number]; radius: number }) {
  const map = useMap();
  
  useEffect(() => {
    // Ajuster le zoom pour que le cercle soit visible
    const meters = radius * 1000;
    const bounds = L.latLng(center).toBounds(meters);
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [map, center, radius]);

  return null;
}

export function ProspectionTool() {
  const [range, setRange] = useState(10);
  const [targetType, setTargetType] = useState('entreprises');
  const [hasInteracted, setHasInteracted] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([48.8566, 2.3522]); // Paris par défaut

  // Géolocalisation au chargement
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter([position.coords.latitude, position.coords.longitude]);
        },
        () => {
          // Si la géolocalisation échoue, on garde Paris
          console.log('Géolocalisation non disponible, utilisation de Paris par défaut');
        }
      );
    }
  }, []);

  // Estimation basée sur les paramètres (calcul interne, jamais affiché exactement)
  const calculateProspects = () => {
    const baseMultiplier = targetType === 'entreprises' ? 15 : targetType === 'agences' ? 8 : 12;
    const rangeMultiplier = range / 10;
    return Math.round(baseMultiplier * rangeMultiplier * (80 + Math.random() * 40));
  };

  const estimatedProspects = calculateProspects();

  // Fonction pour obtenir le teaser basé sur le nombre réel
  const getTeaserText = (count: number): string => {
    if (count < 100) return "Quelques dizaines";
    if (count < 500) return "100+";
    if (count < 1000) return "500+";
    if (count < 3000) return "1 000+";
    return "Potentiel majeur";
  };

  // Détecter l'interaction avec le slider
  useEffect(() => {
    if (range !== 10) {
      setHasInteracted(true);
    }
  }, [range]);

  // Scroll vers le formulaire de contact
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Convertir km en mètres pour Leaflet
  const radiusInMeters = range * 1000;

  return (
    <motion.div
      className="bg-gradient-to-br from-white to-[#EFF0ED] rounded-xl p-6 md:p-10 lg:p-16 shadow-lg border border-[#E0E0E0]"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div
            className="w-20 h-20 bg-[#BFA97A]/10 rounded-full flex items-center justify-center mx-auto"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
          >
            <TrendingUp className="w-10 h-10 text-[#BFA97A]" />
          </motion.div>

          <h3 className="text-[#1A1A1A] font-montserrat" style={{ fontSize: '1.75rem', fontWeight: 500 }}>
            Découvrez votre potentiel B2B immédiat
          </h3>
          <p className="text-[#6B6B6B] font-montserrat max-w-2xl mx-auto" style={{ fontSize: '1.05rem', lineHeight: '1.7', fontWeight: 300 }}>
            Explorez votre zone de prospection sur la carte et découvrez les opportunités autour de vous.
          </p>
        </div>

        {/* Carte Leaflet */}
        <div className="relative rounded-xl overflow-hidden border border-[#E0E0E0] shadow-md" style={{ height: '400px' }}>
          <MapContainer
            center={mapCenter}
            zoom={12}
            style={{ height: '100%', width: '100%', zIndex: 1 }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapUpdater center={mapCenter} radius={range} />
            <Circle
              center={mapCenter}
              radius={radiusInMeters}
              pathOptions={{
                color: '#BFA97A',
                fillColor: '#BFA97A',
                fillOpacity: 0.2,
                weight: 2,
              }}
            />
            <Marker position={mapCenter} />
          </MapContainer>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          {/* Range Slider */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[#1A1A1A] font-montserrat" style={{ fontSize: '1.1rem', fontWeight: 500 }}>
                Périmètre de prospection
              </label>
              <span className="text-[#BFA97A] font-montserrat" style={{ fontSize: '1.5rem', fontWeight: 300 }}>
                {range} km
              </span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="3"
                max="30"
                step="1"
                value={range}
                onChange={(e) => setRange(Number(e.target.value))}
                className="w-full h-2 bg-[#E0E0E0] rounded-lg appearance-none cursor-pointer slider-thumb"
                style={{
                  background: `linear-gradient(to right, #BFA97A 0%, #BFA97A ${((range - 3) / 27) * 100}%, #E0E0E0 ${((range - 3) / 27) * 100}%, #E0E0E0 100%)`
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-[#6B6B6B] font-montserrat">
              <span>3 km</span>
              <span>30 km</span>
            </div>
          </div>
        </div>

        {/* Results - Teaser Version */}
        <motion.div
          className="bg-white rounded-xl p-8 shadow-md border border-[#BFA97A]"
          key={`${range}-${targetType}`}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="text-center space-y-6">
            <p className="text-[#6B6B6B] font-montserrat text-sm uppercase tracking-wider" style={{ letterSpacing: '0.1em' }}>
              Opportunités estimées
            </p>
            
            {!hasInteracted ? (
              <div className="space-y-2">
                <p className="text-[#6B6B6B] font-montserrat text-lg" style={{ fontWeight: 300 }}>
                  Ajustez le périmètre pour estimer
                </p>
              </div>
            ) : (
              <>
                <div className="relative">
                  <div className="text-[#BFA97A] font-montserrat" style={{ fontSize: '3.5rem', fontWeight: 200 }}>
                    {getTeaserText(estimatedProspects)}
                    {estimatedProspects >= 100 && <span className="text-2xl">+</span>}
                  </div>
                  <div 
                    className="absolute inset-0 cursor-pointer group"
                    onClick={scrollToContact}
                    title="Contactez-nous pour révéler le chiffre exact"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#BFA97A]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                  </div>
                </div>
                <p className="text-[#232323] font-montserrat" style={{ fontSize: '1.05rem', lineHeight: '1.7', fontWeight: 300 }}>
                  opportunités B2B identifiées dans votre zone
                </p>
              </>
            )}

            {/* CTA Button */}
            {hasInteracted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="pt-4"
              >
                <button
                  onClick={scrollToContact}
                  className="w-full bg-[#BFA97A] hover:bg-[#BFA97A]/90 text-white px-8 py-4 rounded-lg transition-all duration-300 font-montserrat group flex items-center justify-center gap-2"
                  style={{ letterSpacing: '0.08em', fontWeight: 500 }}
                >
                  <Eye className="w-5 h-5" />
                  Révéler mon potentiel
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-[#6B6B6B] font-montserrat text-xs mt-3" style={{ fontWeight: 300 }}>
                  Analyse personnalisée en 24h • Sans engagement
                </p>
              </motion.div>
            )}

            <div className="mt-6 pt-6 border-t border-[#E0E0E0]">
              <p className="text-[#6B6B6B] font-montserrat text-sm text-center" style={{ lineHeight: '1.6', fontWeight: 300 }}>
                <strong className="text-[#1A1A1A] font-medium">CALMA Prospect</strong> identifie, contacte et qualifie ces opportunités automatiquement. Vous ne gérez que les réservations confirmées.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #BFA97A;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(191, 169, 122, 0.4);
          transition: transform 0.2s;
        }
        .slider-thumb::-webkit-slider-thumb:hover {
          transform: scale(1.15);
        }
        .slider-thumb::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #BFA97A;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(191, 169, 122, 0.4);
          transition: transform 0.2s;
        }
        .slider-thumb::-moz-range-thumb:hover {
          transform: scale(1.15);
        }
        .leaflet-container {
          font-family: 'Montserrat', sans-serif;
        }
      `}</style>
    </motion.div>
  );
}
