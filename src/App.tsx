import { Button } from './components/ui/button';
import { AuditCalculatorPro } from './components/AuditCalculatorPro';
import { VoiceTestTool } from './components/VoiceTestTool';
import { ProspectionTool } from './components/ProspectionTool';
import { Header } from './components/Header';
import { Logo } from './components/Logo';
import { ContactForm } from './components/ContactForm';
import { MiroirCalma } from './components/MiroirCalma';
import { VoiceDemo } from './components/VoiceDemo';
import { motion } from 'motion/react';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function App() {
  const [activeTool, setActiveTool] = useState<'voice' | 'audit' | 'prospection' | null>(null);
  const [voiceDemoOpen, setVoiceDemoOpen] = useState(false);

  const scrollToTools = () => {
    const element = document.getElementById('tools-display');
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

  const handleToolClick = (tool: 'voice' | 'audit' | 'prospection') => {
    setActiveTool(tool);
    setTimeout(() => scrollToTools(), 100);
  };

  return (
    <div className="min-h-screen bg-[#F5EEDF]">
      <Header />
      
      {/* HERO — TECH PREMIUM B2B */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Modern tech background */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1741852197045-cc35920a3aa0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJlc3RhdXJhbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjM1MTE2NDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.4) saturate(0.7)',
          }}
        />
        
        {/* Anthracite overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(26, 26, 26, 0.85) 0%, rgba(35, 35, 35, 0.90) 100%)'
          }}
        />

        {/* Content */}
        <div className="relative z-10 px-6 py-32 w-full">
          <div className="mx-auto max-w-4xl">
            <motion.div 
              className="text-center space-y-12"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 1.2, 
                ease: [0.22, 1, 0.36, 1]
              }}
            >
              {/* Logo CALMA */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="pt-12"
              >
                <Logo variant="light" showSubtitle={false} className="mx-auto" />
              </motion.div>

              {/* Main Title */}
              <motion.h1 
                className="text-[#F5EEDF] font-montserrat px-4"
                style={{ 
                  fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                  fontWeight: 200,
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
              >
                Tout s'aligne,<br />
                Tout s'organise.
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                className="text-[#EFF0ED] font-montserrat max-w-2xl mx-auto px-4"
                style={{
                  fontSize: 'clamp(0.75rem, 1.5vw, 0.95rem)',
                  fontWeight: 200,
                  lineHeight: 1.8,
                  opacity: 0.6,
                  letterSpacing: '0.25em'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
              >
                Réception vocale · Consulting opérationnel · Prospection
              </motion.p>

              {/* Bronze divider */}
              <motion.div
                className="flex justify-center py-6"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
              >
                <div className="w-20 h-[1px] bg-[#BFA97A]/40" />
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Minimal Scroll Indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 1, 
            delay: 1,
            repeat: Infinity,
            repeatType: "reverse",
            repeatDelay: 0.8
          }}
        >
          <div className="w-5 h-9 border border-[#BFA97A]/30 rounded-full flex items-start justify-center p-1.5">
            <div className="w-0.5 h-1.5 bg-[#BFA97A]/60 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* SECTION 1 — MISSION */}
      <section id="mission" className="px-6 py-32 bg-white border-t border-[#E0E0E0]">
        <div className="mx-auto max-w-4xl">
          <motion.div 
            className="text-center space-y-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div 
              className="w-16 h-px bg-[#BFA97A] mx-auto mb-8"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            
            <h2 className="text-[#1A1A1A] font-montserrat mb-8 text-center" style={{ 
              fontWeight: '500',
              fontSize: '1.5rem'
            }}>
              Notre mission
            </h2>

            {/* Bullet points */}
            <div className="space-y-4 mb-12 max-w-2xl mx-auto">
              <div className="flex items-start gap-4 text-left">
                <span className="text-[#BFA97A] mt-1.5">•</span>
                <p className="text-[#232323] font-montserrat" style={{ 
                  lineHeight: '1.6', 
                  fontSize: '1.05rem',
                  fontWeight: '300'
                }}>
                  Alléger les équipes
                </p>
              </div>
              <div className="flex items-start gap-4 text-left">
                <span className="text-[#BFA97A] mt-1.5">•</span>
                <p className="text-[#232323] font-montserrat" style={{ 
                  lineHeight: '1.6', 
                  fontSize: '1.05rem',
                  fontWeight: '300'
                }}>
                  Capter chaque opportunité
                </p>
              </div>
              <div className="flex items-start gap-4 text-left">
                <span className="text-[#BFA97A] mt-1.5">•</span>
                <p className="text-[#232323] font-montserrat" style={{ 
                  lineHeight: '1.6', 
                  fontSize: '1.05rem',
                  fontWeight: '300'
                }}>
                  Moderniser l'accueil, sans complexité
                </p>
              </div>
            </div>
            
            <div className="space-y-6 text-left max-w-3xl mx-auto">
              <p className="text-[#232323] leading-relaxed font-montserrat" style={{ 
                lineHeight: '1.8', 
                fontSize: '1.125rem',
                fontWeight: '300'
              }}>
                Vingt années passées aux côtés <em className="italic">d'établissements d'excellence</em> — groupes internationaux, restaurants iconiques, hôtellerie de caractère — nous ont confirmé la même vérité : <em className="italic">la qualité n'est jamais le problème</em>. C'est la surcharge opérationnelle qui épuise et qui coûte.
              </p>
              
              <p className="text-[#232323] leading-relaxed font-montserrat" style={{ 
                lineHeight: '1.8', 
                fontSize: '1.125rem',
                fontWeight: '300'
              }}>
                CALMA associe expertise terrain, méthode organisationnelle et technologie discrète pour restaurer le calme, renforcer le service et révéler le potentiel réel de chaque maison.
              </p>
              
              <p className="text-[#1A1A1A] leading-relaxed font-montserrat" style={{ 
                lineHeight: '1.8', 
                fontSize: '1.125rem',
                fontWeight: '500'
              }}>
                <em className="italic">Votre signature reste la vôtre.</em><br />
                Nous allégeons tout ce qui fatigue et tout ce qui fait perdre.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2.5 — PROBLÈME → CONSÉQUENCE → SOLUTION */}
      <section id="services" className="px-6 py-[100px] bg-white border-t border-[#E0E0E0]">
        <div className="mx-auto max-w-[1200px]">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-[#1A1A1A] font-montserrat mb-6">
              Nos services.
            </h2>
            <motion.div 
              className="w-[30px] h-[2px] bg-[#BFA97A] mx-auto"
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            />
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            {/* Card 1 — Réception Vocale */}
            <motion.div
              className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border border-[#E0E0E0] flex flex-col"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="flex-1">
                <h3 className="text-[#1A1A1A] font-montserrat mb-4" style={{ fontSize: '1.35rem', lineHeight: '1.4', fontWeight: 500 }}>
                  Réception vocale
                </h3>
                <p className="text-[#6B6B6B] font-montserrat mb-6" style={{ fontSize: '0.85rem', lineHeight: '1.5', fontWeight: '400', fontStyle: 'italic' }}>
                  Le cœur : accueil, réservations, charge opérationnelle.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="text-[#232323] font-montserrat flex items-start" style={{ fontSize: '0.95rem', lineHeight: '1.6', fontWeight: '300' }}>
                    <span className="text-[#BFA97A] mr-3 mt-1">•</span>
                    <span>Votre accueil répond toujours, sans pression sur l'équipe.</span>
                  </li>
                  <li className="text-[#232323] font-montserrat flex items-start" style={{ fontSize: '0.95rem', lineHeight: '1.6', fontWeight: '300' }}>
                    <span className="text-[#BFA97A] mr-3 mt-1">•</span>
                    <span>Réservations, modifications et annulations gérées automatiquement, 24/7.</span>
                  </li>
                  <li className="text-[#232323] font-montserrat flex items-start" style={{ fontSize: '0.95rem', lineHeight: '1.6', fontWeight: '300' }}>
                    <span className="text-[#BFA97A] mr-3 mt-1">•</span>
                    <span>Rappels, confirmations et collecte d'informations clés sans effort.</span>
                  </li>
                  <li className="text-[#232323] font-montserrat flex items-start" style={{ fontSize: '0.95rem', lineHeight: '1.6', fontWeight: '300' }}>
                    <span className="text-[#BFA97A] mr-3 mt-1">•</span>
                    <span>Vos clients sont reconnus, rassurés et bien servis, même hors horaires.</span>
                  </li>
                  <li className="text-[#232323] font-montserrat flex items-start" style={{ fontSize: '0.95rem', lineHeight: '1.6', fontWeight: '300' }}>
                    <span className="text-[#BFA97A] mr-3 mt-1">•</span>
                    <span>Un accueil fluide, humain, à votre image — sans surcharge.</span>
                  </li>
                </ul>
              </div>
              
              <motion.button
                onClick={() => {
                  console.log('Button clicked, opening VoiceDemo');
                  setVoiceDemoOpen(true);
                }}
                className={`mt-auto w-full px-6 py-3 rounded-lg border-2 transition-all duration-300 group flex items-center justify-center gap-2 font-montserrat ${
                  activeTool === 'voice'
                    ? 'bg-[#BFA97A] border-[#BFA97A] text-white'
                    : 'bg-transparent border-[#BFA97A] text-[#1A1A1A] hover:bg-[#BFA97A] hover:text-white'
                }`}
                style={{ letterSpacing: '0.08em', fontWeight: 500 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Essayer CALMA Voice
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>

            {/* Card 2 — Consulting Opérationnel */}
            <motion.div
              className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border border-[#E0E0E0] flex flex-col"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex-1">
                <h3 className="text-[#1A1A1A] font-montserrat mb-4" style={{ fontSize: '1.35rem', lineHeight: '1.4', fontWeight: 500 }}>
                  Consulting opérationnel
                </h3>
                <p className="text-[#6B6B6B] font-montserrat mb-6" style={{ fontSize: '0.85rem', lineHeight: '1.5', fontWeight: '400', fontStyle: 'italic' }}>
                  Le cœur : méthode, structure, anti-chaos, stabilité.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="text-[#232323] font-montserrat flex items-start" style={{ fontSize: '0.95rem', lineHeight: '1.6', fontWeight: '300' }}>
                    <span className="text-[#BFA97A] mr-3 mt-1">•</span>
                    <span>Nous analysons vos flux, clarifions vos process et allégeons vos charges.</span>
                  </li>
                  <li className="text-[#232323] font-montserrat flex items-start" style={{ fontSize: '0.95rem', lineHeight: '1.6', fontWeight: '300' }}>
                    <span className="text-[#BFA97A] mr-3 mt-1">•</span>
                    <span>Vos équipes respirent mieux : moins d'oublis, moins de rush, moins d'imprévus.</span>
                  </li>
                  <li className="text-[#232323] font-montserrat flex items-start" style={{ fontSize: '0.95rem', lineHeight: '1.6', fontWeight: '300' }}>
                    <span className="text-[#BFA97A] mr-3 mt-1">•</span>
                    <span>Menus, stocks, commandes ou organisation : tout devient simple et cohérent.</span>
                  </li>
                  <li className="text-[#232323] font-montserrat flex items-start" style={{ fontSize: '0.95rem', lineHeight: '1.6', fontWeight: '300' }}>
                    <span className="text-[#BFA97A] mr-3 mt-1">•</span>
                    <span>Vous reprenez le contrôle sur votre service et votre quotidien.</span>
                  </li>
                  <li className="text-[#232323] font-montserrat flex items-start" style={{ fontSize: '0.95rem', lineHeight: '1.6', fontWeight: '300' }}>
                    <span className="text-[#BFA97A] mr-3 mt-1">•</span>
                    <span>Une méthode qui stabilise votre maison sans jamais la dénaturer.</span>
                  </li>
                </ul>
              </div>
              
              <motion.button
                onClick={() => handleToolClick('audit')}
                className={`mt-auto w-full px-6 py-3 rounded-lg border-2 transition-all duration-300 group flex items-center justify-center gap-2 font-montserrat ${
                  activeTool === 'audit'
                    ? 'bg-[#BFA97A] border-[#BFA97A] text-white'
                    : 'bg-transparent border-[#BFA97A] text-[#1A1A1A] hover:bg-[#BFA97A] hover:text-white'
                }`}
                style={{ letterSpacing: '0.08em', fontWeight: 500 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Estimez vos pertes invisibles
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>

            {/* Card 3 — Prospection */}
            <motion.div
              className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border border-[#E0E0E0] flex flex-col"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex-1">
                <h3 className="text-[#1A1A1A] font-montserrat mb-4" style={{ fontSize: '1.35rem', lineHeight: '1.4', fontWeight: 500 }}>
                  Prospection
                </h3>
                <p className="text-[#6B6B6B] font-montserrat mb-6" style={{ fontSize: '0.85rem', lineHeight: '1.5', fontWeight: '400', fontStyle: 'italic' }}>
                  Le cœur : groupes, entreprises, événements, tables creuses.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="text-[#232323] font-montserrat flex items-start" style={{ fontSize: '0.95rem', lineHeight: '1.6', fontWeight: '300' }}>
                    <span className="text-[#BFA97A] mr-3 mt-1">•</span>
                    <span>Les groupes, entreprises et événements importants sont détectés et activés.</span>
                  </li>
                  <li className="text-[#232323] font-montserrat flex items-start" style={{ fontSize: '0.95rem', lineHeight: '1.6', fontWeight: '300' }}>
                    <span className="text-[#BFA97A] mr-3 mt-1">•</span>
                    <span>Offres personnalisées générées instantanément selon la demande.</span>
                  </li>
                  <li className="text-[#232323] font-montserrat flex items-start" style={{ fontSize: '0.95rem', lineHeight: '1.6', fontWeight: '300' }}>
                    <span className="text-[#BFA97A] mr-3 mt-1">•</span>
                    <span>Calendrier, saisonnalité et opportunités locales travaillées en continu.</span>
                  </li>
                  <li className="text-[#232323] font-montserrat flex items-start" style={{ fontSize: '0.95rem', lineHeight: '1.6', fontWeight: '300' }}>
                    <span className="text-[#BFA97A] mr-3 mt-1">•</span>
                    <span>Votre établissement devient visible pour les bons acteurs, au bon moment.</span>
                  </li>
                  <li className="text-[#232323] font-montserrat flex items-start" style={{ fontSize: '0.95rem', lineHeight: '1.6', fontWeight: '300' }}>
                    <span className="text-[#BFA97A] mr-3 mt-1">•</span>
                    <span>Une prospection élégante, précise, sans démarchage agressif.</span>
                  </li>
                </ul>
              </div>
              
              <motion.button
                onClick={() => handleToolClick('prospection')}
                className={`mt-auto w-full px-6 py-3 rounded-lg border-2 transition-all duration-300 group flex items-center justify-center gap-2 font-montserrat ${
                  activeTool === 'prospection'
                    ? 'bg-[#BFA97A] border-[#BFA97A] text-white'
                    : 'bg-transparent border-[#BFA97A] text-[#1A1A1A] hover:bg-[#BFA97A] hover:text-white'
                }`}
                style={{ letterSpacing: '0.08em', fontWeight: 500 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Démarrer la prospection
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>
          </div>

          {/* Tool Display Area */}
          {activeTool && (
            <motion.div
              id="tools-display"
              className="mt-16"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {activeTool === 'voice' && <VoiceTestTool />}
              {activeTool === 'audit' && (
                <div className="bg-gradient-to-br from-[#F5EEDF] to-white rounded-xl p-10 md:p-16 shadow-lg border border-[#E0E0E0]">
                  <div className="text-center mb-8 max-w-2xl mx-auto">
                    <h3 className="text-[#1A1A1A] font-montserrat mb-4" style={{ fontSize: '1.75rem', fontWeight: 500 }}>
                      Calculez l'impact réel de votre organisation
                    </h3>
                    <p className="text-[#6B6B6B] font-montserrat" style={{ fontSize: '1.05rem', lineHeight: '1.7', fontWeight: 300 }}>
                      En 30 secondes, identifiez les pertes invisibles qui freinent votre établissement.
                    </p>
                  </div>
                  <AuditCalculatorPro />
                </div>
              )}
              {activeTool === 'prospection' && <ProspectionTool />}
            </motion.div>
          )}
        </div>
      </section>

      {/* SECTION 5 — HYPERPERSONNALISATION */}
      <section className="px-6 py-[100px] bg-[#EFF0ED]">
        <div className="mx-auto max-w-[1080px]">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <h3 className="text-[#1A1A1A] font-montserrat mb-6" style={{ fontWeight: 500 }}>
              Hyperpersonnalisation intégrée.
            </h3>
            
            <motion.div 
              className="w-[30px] h-[2px] bg-[#BFA97A] mx-auto mb-10"
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            />

            <p className="text-[#232323] font-montserrat" style={{ 
              fontSize: '1.05rem',
              fontWeight: '400',
              lineHeight: '1.6'
            }}>
              Une seule technologie. Des milliers de styles d'accueil. Le vôtre.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h4 className="text-[#1A1A1A] font-montserrat" style={{ fontSize: '1.25rem', fontWeight: 500 }}>
                Votre ton.
              </h4>
              <p className="text-[#6B6B6B] font-montserrat" style={{ 
                lineHeight: '1.7',
                fontSize: '0.95rem',
                fontWeight: '300'
              }}>
                Chaleureux, direct, raffiné ou décontracté — CALMA adopte votre manière de parler, vos formules et votre hospitalité.
              </p>
            </motion.div>

            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4 className="text-[#1A1A1A] font-montserrat" style={{ fontSize: '1.25rem', fontWeight: 500 }}>
                Votre cadence.
              </h4>
              <p className="text-[#6B6B6B] font-montserrat" style={{ 
                lineHeight: '1.7',
                fontSize: '0.95rem',
                fontWeight: '300'
              }}>
                Réponse rapide et dynamique pour un café animé. Plus posée et élégante pour un lieu haut de gamme. CALMA reflète votre rythme.
              </p>
            </motion.div>

            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h4 className="text-[#1A1A1A] font-montserrat" style={{ fontSize: '1.25rem', fontWeight: 500 }}>
                Votre clientèle.
              </h4>
              <p className="text-[#6B6B6B] font-montserrat" style={{ 
                lineHeight: '1.7',
                fontSize: '0.95rem',
                fontWeight: '300'
              }}>
                Habitués, touristes, familles, business. Chaque interaction est adaptée automatiquement au profil détecté.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 6 — CHIFFRES */}
      <section id="resultats" className="px-6 py-32 bg-white border-t border-[#E0E0E0]">
        <div className="mx-auto max-w-7xl">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[#1A1A1A] mb-6 font-montserrat">
              Nous prenons l'accueil.<br />Vous reprenez le calme.
            </h2>
            <motion.div 
              className="w-24 h-px bg-[#BFA97A] mx-auto"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </motion.div>
          <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-4">
            {[
              { value: "+40%", label: "réponses instantanées" },
              { value: "–70%", label: "charge mentale" },
              { value: "+25%", label: "réservations confirmées" },
              { value: "+35%", label: "bookings événements" }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center space-y-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="text-[clamp(3rem,5vw,5rem)] text-[#1A1A1A] font-montserrat" style={{ fontWeight: 300 }}>
                  {stat.value}
                </div>
                <p className="text-[#6B6B6B] font-montserrat" style={{ fontWeight: 400 }}>
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7.75 — MIROIR CALMA */}
      <section id="miroir" className="border-t border-[#E0E0E0]">
        <MiroirCalma />
      </section>

      {/* SECTION 7.5 — CONTACT FORM */}
      <section id="contact" className="px-6 py-24 bg-white border-t border-[#E0E0E0]">
        <div className="mx-auto max-w-2xl">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[#1A1A1A] font-montserrat mb-6">
              Parlons de votre établissement.
            </h2>
            <motion.div 
              className="w-16 h-px bg-[#BFA97A] mx-auto mb-6"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            <p className="text-[#6B6B6B] font-montserrat max-w-xl mx-auto" style={{ fontWeight: 300, lineHeight: '1.7' }}>
              Laissez-nous vos coordonnées. Nous vous recontactons sous 24h pour un échange sans engagement.
            </p>
          </motion.div>

          <motion.div
            className="bg-[#1A1A1A] rounded-xl p-8 md:p-12 shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </section>

      {/* SECTION 8 — CTA FINAL */}
      <section className="px-6 py-32 bg-[#232323]">
        <div className="mx-auto max-w-4xl text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="w-24 h-px bg-[#BFA97A] mx-auto mb-8"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
            <h2 className="text-[#F5EEDF] mb-6 font-montserrat">
              On passe vous voir.
            </h2>
            <p className="text-[#EFF0ED]/80 text-lg max-w-2xl mx-auto font-montserrat" style={{ lineHeight: '1.7', fontWeight: 300 }}>
              Audit gratuit, simple, sans engagement.
            </p>
            <div className="mt-12">
              <Button 
                size="lg" 
                className="bg-[#F5EEDF] hover:bg-white text-[#1A1A1A] px-8 py-6 transition-all duration-300 font-montserrat"
                style={{ letterSpacing: '0.15em', fontWeight: 500 }}
              >
                RÉSERVER UN AUDIT
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Voice Demo Modal */}
      <VoiceDemo open={voiceDemoOpen} onOpenChange={setVoiceDemoOpen} />

      {/* FOOTER */}
      <footer className="px-6 py-12 bg-[#1A1A1A]">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-8 border-b border-[#BFA97A]/20">
            <Logo variant="bronze" showSubtitle={true} />
            <div className="flex gap-8 items-center">
              <a href="mailto:contact@calma-hospitality.com" className="text-[#F5EEDF]/60 hover:text-[#BFA97A] transition-colors text-sm font-montserrat">
                contact@calma-hospitality.com
              </a>
              <a href="#" className="text-[#F5EEDF]/60 hover:text-[#BFA97A] transition-colors text-sm font-montserrat">
                Mentions légales
              </a>
            </div>
          </div>
          <div className="pt-8 text-center">
            <p className="text-[#F5EEDF]/40 text-xs uppercase tracking-wider font-montserrat" style={{ letterSpacing: '0.1em', fontWeight: 300 }}>
              © 2024 CALMA — L'élégance n'est pas se faire remarquer, mais être inoubliable.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}