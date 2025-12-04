import { motion } from 'motion/react';
import { Phone, Info } from 'lucide-react';

export function VoiceTestTool() {
  return (
    <motion.div
      className="bg-gradient-to-br from-[#F5EEDF] to-white rounded-xl p-10 md:p-16 shadow-lg border border-[#E0E0E0]"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Icon */}
        <motion.div
          className="w-20 h-20 bg-[#BFA97A]/10 rounded-full flex items-center justify-center mx-auto"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
        >
          <Phone className="w-10 h-10 text-[#BFA97A]" />
        </motion.div>

        {/* Title */}
        <div>
          <h3 className="text-[#1A1A1A] font-montserrat mb-4" style={{ fontSize: '1.75rem', fontWeight: 500 }}>
            Testez l'accueil vocal CALMA
          </h3>
          <p className="text-[#6B6B6B] font-montserrat" style={{ fontSize: '1.05rem', lineHeight: '1.7', fontWeight: 300 }}>
            Appelez notre agent CALMA Voice et vivez l'expérience en conditions réelles.
          </p>
        </div>

        {/* Phone Number */}
        <motion.div
          className="bg-white rounded-lg p-8 shadow-sm border-2 border-[#BFA97A]"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <a 
            href="tel:+33184000000" 
            className="block group"
          >
            <div className="flex items-center justify-center gap-4">
              <Phone className="w-6 h-6 text-[#BFA97A] group-hover:animate-pulse" />
              <span className="text-[#1A1A1A] font-montserrat" style={{ fontSize: '2rem', fontWeight: 300, letterSpacing: '0.05em' }}>
                01 84 XX XX XX
              </span>
            </div>
            <p className="text-[#6B6B6B] text-sm font-montserrat mt-4" style={{ fontWeight: 300 }}>
              Cliquez pour appeler
            </p>
          </a>
        </motion.div>

        {/* Info Box */}
        <motion.div
          className="bg-[#EFF0ED] rounded-lg p-6 text-left"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-start gap-4">
            <Info className="w-5 h-5 text-[#BFA97A] mt-1 flex-shrink-0" />
            <div>
              <p className="text-[#232323] font-montserrat" style={{ fontSize: '0.95rem', lineHeight: '1.7', fontWeight: 300 }}>
                <strong className="font-medium">Cet agent répond comme votre établissement</strong>, 24/7, avec voix naturelle et gestion complète des réservations, modifications et confirmations. Aucune attente, aucune pression sur vos équipes.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
