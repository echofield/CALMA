import { useState } from 'react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface Answer {
  screen: number;
  value: string | number | string[];
}

interface FormData {
  name: string;
  phone: string;
  email: string;
}

export function MiroirCalma() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [formData, setFormData] = useState<FormData>({ name: '', phone: '', email: '' });
  const [direction, setDirection] = useState(1);

  const handleAnswer = (screenId: number, value: string | number | string[]) => {
    const newAnswers = answers.filter(a => a.screen !== screenId);
    newAnswers.push({ screen: screenId, value });
    setAnswers(newAnswers);
  };

  const getAnswer = (screenId: number): string | number | string[] | undefined => {
    return answers.find(a => a.screen === screenId)?.value;
  };

  const goNext = () => {
    setDirection(1);
    setCurrentScreen(prev => prev + 1);
  };

  const goBack = () => {
    setDirection(-1);
    setCurrentScreen(prev => Math.max(0, prev - 1));
  };

  const canProceed = () => {
    const answer = getAnswer(currentScreen);
    if (currentScreen === 0) return true;
    if (currentScreen === 3 && Array.isArray(answer)) return answer.length > 0;
    return answer !== undefined && answer !== '';
  };

  // CALCUL DES RÉSULTATS
  const calculateResults = () => {
    const rCalls = Number(getAnswer(4)) || 5;
    const panier = getAnswer(7) as string;
    const gManagement = getAnswer(6) as string;
    const hHours = getAnswer(9) as string;

    // 1. Appels non traités
    const appelsNonTraites = ((10 - rCalls) / 10) * 20 * 30;
    const caAppels = Math.round(appelsNonTraites * 25);

    // 2. Groupes non convertis
    let panierMoyen = 400;
    if (panier === '300–500 €') panierMoyen = 400;
    else if (panier === '500–800 €') panierMoyen = 650;
    else if (panier === '800–1 200 €') panierMoyen = 1000;
    else if (panier === '1 200 € +') panierMoyen = 1500;

    let demandesNonConverties = 0;
    if (gManagement?.includes('convertit très peu')) demandesNonConverties = 3;
    else if (gManagement?.includes('difficile à traiter')) demandesNonConverties = 2;
    else if (gManagement?.includes('oublie')) demandesNonConverties = 2;
    else if (gManagement?.includes('tardivement')) demandesNonConverties = 2;
    else if (gManagement?.includes('Aucune méthode')) demandesNonConverties = 3;

    const caGroupes = Math.round(demandesNonConverties * panierMoyen);

    // 3. Charge mentale
    let heuresPerdues = 8;
    if (hHours === '0–5 heures') heuresPerdues = 2.5;
    else if (hHours === '5–10 heures') heuresPerdues = 7.5;
    else if (hHours === '10–20 heures') heuresPerdues = 15;
    else if (hHours === '20+ heures') heuresPerdues = 25;

    const caCharge = Math.round(heuresPerdues * 4 * 20);

    // Scores pour camembert
    const scoreAccueil = 10 - rCalls;
    
    let scoreOpportunites = 5;
    const gManagementStr = String(gManagement || '');
    if (gManagementStr.includes('convertit très peu')) scoreOpportunites = 8;
    else if (gManagementStr.includes('difficile à traiter')) scoreOpportunites = 7;
    else if (gManagementStr.includes('oublie')) scoreOpportunites = 8;
    else if (gManagementStr.includes('tardivement')) scoreOpportunites = 7;
    else if (gManagementStr.includes('Aucune méthode')) scoreOpportunites = 9;

    let scoreOrganisation = 5;
    if (hHours === '0–5 heures') scoreOrganisation = 3;
    else if (hHours === '5–10 heures') scoreOrganisation = 5;
    else if (hHours === '10–20 heures') scoreOrganisation = 8;
    else if (hHours === '20+ heures') scoreOrganisation = 10;

    return {
      caAppels,
      caGroupes,
      caCharge,
      caTotal: caAppels + caGroupes + caCharge,
      heuresPerdues: Math.round(heuresPerdues),
      scoreAccueil,
      scoreOpportunites,
      scoreOrganisation,
      rCalls
    };
  };

  const screens = [
    // SCREEN 0
    {
      id: 0,
      type: 'intro',
      render: () => (
        <div className="text-center space-y-8 max-w-2xl mx-auto">
          <motion.h2 
            className="text-[#1A1A1A] font-montserrat"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Miroir CALMA
          </motion.h2>
          <motion.p 
            className="text-[#6B6B6B] font-montserrat text-xl"
            style={{ lineHeight: '1.6', fontWeight: 300 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            3 minutes pour comprendre ce qui pèse vraiment sur votre établissement.
          </motion.p>
          <motion.p 
            className="text-[#1A1A1A] font-montserrat"
            style={{ lineHeight: '1.7', fontWeight: 400, fontSize: '1.1rem' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Vous n'êtes pas le problème. Votre structure, si.<br />
            Regardons cela ensemble.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button
              onClick={goNext}
              className="bg-[#1A1A1A] hover:bg-[#232323] text-[#F5EEDF] px-12 py-6 font-montserrat"
              style={{ letterSpacing: '0.1em', fontWeight: 500 }}
            >
              Commencer
            </Button>
          </motion.div>
        </div>
      )
    },
    // SCREEN 1
    {
      id: 1,
      question: "Votre établissement, c'est plutôt…",
      options: [
        "Un lieu vivant où tout repose sur l'équipe du jour",
        "Un endroit soigné, mais difficile à garder fluide",
        "Un restaurant reconnu mais sous tension",
        "Un établissement qui tourne, mais pourrait mieux convertir",
        "Une maison de qualité qui manque de structure"
      ]
    },
    // SCREEN 2
    {
      id: 2,
      question: "Quand un client appelle ou écrit, cela ressemble le plus à…",
      options: [
        "On répond, mais souvent trop tard",
        "Ça tombe toujours pendant le rush",
        "Je dois souvent m'en occuper moi-même",
        "On répond quand on peut",
        "Honnêtement : on manque des demandes"
      ]
    },
    // SCREEN 3
    {
      id: 3,
      question: "Ce qui vous pèse le plus dans cette partie :",
      subtitle: "(Vous pouvez en sélectionner plusieurs)",
      multiSelect: true,
      options: [
        "Rater des demandes simples faute de temps",
        "Les messages hors horaires",
        "Revenir sur des conversations en retard",
        "C'est toujours dans l'urgence",
        "Compenser une organisation inexistante"
      ]
    },
    // SCREEN 4
    {
      id: 4,
      type: 'slider',
      question: "Sur 10 demandes reçues, combien obtiennent une réponse ?",
      min: 0,
      max: 10
    },
    // SCREEN 5
    {
      id: 5,
      question: "Pour les groupes et événements :",
      options: [
        "On en reçoit, mais c'est difficile à traiter",
        "On en reçoit, mais on convertit très peu",
        "On en reçoit peu",
        "On ne traite plus ces demandes",
        "On aimerait en avoir, mais c'est trop de charge"
      ]
    },
    // SCREEN 6
    {
      id: 6,
      question: "Votre gestion des demandes importantes ressemble le plus à…",
      options: [
        "Ça passe après le service",
        "On répond tardivement",
        "On oublie parfois",
        "Personne n'est dédié",
        "Aucune méthode aujourd'hui"
      ]
    },
    // SCREEN 7
    {
      id: 7,
      question: "Panier moyen d'un groupe chez vous :",
      options: [
        "300–500 €",
        "500–800 €",
        "800–1 200 €",
        "1 200 € +"
      ]
    },
    // SCREEN 8
    {
      id: 8,
      question: "Ce qui vous épuise le plus au quotidien :",
      options: [
        "Tout gérer en même temps",
        "Faire le travail de deux personnes",
        "La désorganisation permanente",
        "Les demandes qui s'empilent",
        "Courir après les informations"
      ]
    },
    // SCREEN 9
    {
      id: 9,
      question: "Temps perdu chaque semaine en messages, coordination, rattrapage :",
      options: [
        "0–5 heures",
        "5–10 heures",
        "10–20 heures",
        "20+ heures"
      ]
    }
  ];

  const currentScreenData = screens[currentScreen];

  // SCREEN FINAL - RÉSULTATS
  if (currentScreen === 10) {
    const results = calculateResults();
    const chartData = [
      { name: 'Accueil', value: results.scoreAccueil, color: '#BFA97A' },
      { name: 'Opportunités', value: results.scoreOpportunites, color: '#1A1A1A' },
      { name: 'Organisation', value: results.scoreOrganisation, color: '#6B6B6B' }
    ];

    return (
      <div className="min-h-screen bg-[#F5EEDF] px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-12"
          >
            {/* Titre */}
            <div className="text-center space-y-6">
              <h2 className="text-[#1A1A1A] font-montserrat">
                Votre reflet est clair.<br />
                Vous n'êtes pas dépassé : vous êtes surchargé.
              </h2>
              <p className="text-[#232323] font-montserrat text-lg" style={{ lineHeight: '1.7', fontWeight: 300 }}>
                Votre établissement ne manque pas de qualité.<br />
                C'est sa structure qui ne vous porte plus.
              </p>
            </div>

            {/* Bloc résultats */}
            <div className="bg-white rounded-lg p-10 shadow-sm space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-[#E0E0E0] pb-4">
                  <span className="text-[#6B6B6B] font-montserrat" style={{ fontWeight: 400 }}>Appels non traités</span>
                  <span className="text-[#1A1A1A] font-montserrat" style={{ fontWeight: 500, fontSize: '1.25rem' }}>
                    {results.caAppels.toLocaleString('fr-FR')} € / mois
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-[#E0E0E0] pb-4">
                  <span className="text-[#6B6B6B] font-montserrat" style={{ fontWeight: 400 }}>Groupes non convertis</span>
                  <span className="text-[#1A1A1A] font-montserrat" style={{ fontWeight: 500, fontSize: '1.25rem' }}>
                    {results.caGroupes.toLocaleString('fr-FR')} € / mois
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-[#E0E0E0] pb-4">
                  <span className="text-[#6B6B6B] font-montserrat" style={{ fontWeight: 400 }}>Charge mentale opérationnelle</span>
                  <span className="text-[#1A1A1A] font-montserrat" style={{ fontWeight: 500, fontSize: '1.25rem' }}>
                    {results.heuresPerdues}h / semaine
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 bg-[#F5EEDF] -mx-10 px-10 py-6 -mb-10 rounded-b-lg">
                  <span className="text-[#1A1A1A] font-montserrat" style={{ fontWeight: 500, fontSize: '1.1rem' }}>
                    Perte minimale totale
                  </span>
                  <span className="text-[#1A1A1A] font-montserrat" style={{ fontWeight: 600, fontSize: '2rem' }}>
                    {results.caTotal.toLocaleString('fr-FR')} € / mois
                  </span>
                </div>
              </div>
            </div>

            {/* Textes pivot */}
            <div className="text-center space-y-6 py-8">
              <p className="text-[#232323] font-montserrat" style={{ lineHeight: '1.8', fontSize: '1.05rem', fontWeight: 300 }}>
                Ce n'est pas votre cuisine.<br />
                Ce n'est pas votre équipe.<br />
                Ce n'est pas votre concept.<br />
                Vous faites déjà tout. Trop, parfois.
              </p>
              <p className="text-[#1A1A1A] font-montserrat" style={{ lineHeight: '1.8', fontSize: '1.15rem', fontWeight: 500 }}>
                Vous avez tenu jusque-là.<br />
                Vous pouvez changer la suite.
              </p>
              <p className="text-[#232323] font-montserrat max-w-2xl mx-auto" style={{ lineHeight: '1.8', fontSize: '1.05rem', fontWeight: 400 }}>
                Votre établissement mérite une structure qui travaille pour vous.<br />
                Et vous êtes la personne capable d'enclencher ce retour au calme.
              </p>
            </div>

            {/* Camembert + Recommandations */}
            <div className="bg-white rounded-lg p-10 shadow-sm">
              <h3 className="text-[#1A1A1A] font-montserrat text-center mb-8" style={{ fontWeight: 500 }}>
                Vos priorités de reprise en main
              </h3>
              
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Graphique */}
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        formatter={(value) => <span className="font-montserrat text-sm">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Recommandations */}
                <div className="space-y-6">
                  {results.scoreAccueil >= 5 && (
                    <div className="space-y-2">
                      <h4 className="text-[#1A1A1A] font-montserrat" style={{ fontWeight: 500 }}>
                        Réception / Appels
                      </h4>
                      <p className="text-[#6B6B6B] font-montserrat text-sm" style={{ lineHeight: '1.6', fontWeight: 300 }}>
                        Vous récupérez instantanément 100% des demandes sans surcharge.
                      </p>
                    </div>
                  )}
                  {results.scoreOpportunites >= 6 && (
                    <div className="space-y-2">
                      <h4 className="text-[#1A1A1A] font-montserrat" style={{ fontWeight: 500 }}>
                        Groupes / Opportunités
                      </h4>
                      <p className="text-[#6B6B6B] font-montserrat text-sm" style={{ lineHeight: '1.6', fontWeight: 300 }}>
                        Vous captez les demandes à forte valeur sans effort.
                      </p>
                    </div>
                  )}
                  {results.scoreOrganisation >= 5 && (
                    <div className="space-y-2">
                      <h4 className="text-[#1A1A1A] font-montserrat" style={{ fontWeight: 500 }}>
                        Organisation / Charge mentale
                      </h4>
                      <p className="text-[#6B6B6B] font-montserrat text-sm" style={{ lineHeight: '1.6', fontWeight: 300 }}>
                        Vous retrouvez temps, ordre, énergie.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Formulaire */}
            <div className="bg-[#232323] rounded-lg p-10 shadow-lg text-center space-y-8">
              <h3 className="text-[#F5EEDF] font-montserrat" style={{ fontWeight: 500 }}>
                Recevoir mon plan d'action sous 24h
              </h3>
              
              <div className="space-y-4 max-w-md mx-auto">
                <input
                  type="text"
                  placeholder="Nom"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-6 py-4 bg-white/10 border border-[#F5EEDF]/30 rounded-lg text-[#F5EEDF] placeholder-[#F5EEDF]/50 font-montserrat focus:outline-none focus:border-[#BFA97A]"
                />
                <input
                  type="tel"
                  placeholder="Téléphone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-6 py-4 bg-white/10 border border-[#F5EEDF]/30 rounded-lg text-[#F5EEDF] placeholder-[#F5EEDF]/50 font-montserrat focus:outline-none focus:border-[#BFA97A]"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-6 py-4 bg-white/10 border border-[#F5EEDF]/30 rounded-lg text-[#F5EEDF] placeholder-[#F5EEDF]/50 font-montserrat focus:outline-none focus:border-[#BFA97A]"
                />
                
                <Button
                  onClick={() => {
                    alert(`Formulaire soumis !\n\nRésultats:\nCA perdu: ${results.caTotal.toLocaleString('fr-FR')}€/mois\nContact: ${formData.name} - ${formData.email}`);
                  }}
                  disabled={!formData.name || !formData.email || !formData.phone}
                  className="w-full bg-[#BFA97A] hover:bg-[#A89565] text-[#1A1A1A] py-6 font-montserrat disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ letterSpacing: '0.1em', fontWeight: 500 }}
                >
                  Envoyer ma demande
                </Button>
              </div>

              <p className="text-[#F5EEDF]/60 font-montserrat text-xs max-w-md mx-auto" style={{ lineHeight: '1.6' }}>
                Réponse personnalisée sous 24h. Aucune donnée ne sera partagée.
              </p>
            </div>

            {/* Bouton retour */}
            <div className="text-center pt-6">
              <button
                onClick={() => {
                  setCurrentScreen(0);
                  setAnswers([]);
                  setFormData({ name: '', phone: '', email: '' });
                }}
                className="text-[#6B6B6B] hover:text-[#1A1A1A] font-montserrat text-sm transition-colors"
              >
                ← Recommencer l'audit
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // RENDU QUESTIONS
  return (
    <div className="min-h-screen bg-[#F5EEDF] px-6 py-20">
      <div className="max-w-3xl mx-auto">
        {/* Progress bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[#6B6B6B] font-montserrat text-sm">
              Question {currentScreen} sur 9
            </span>
            <span className="text-[#6B6B6B] font-montserrat text-sm">
              {Math.round((currentScreen / 9) * 100)}%
            </span>
          </div>
          <div className="w-full h-1 bg-[#E0E0E0] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#BFA97A]"
              initial={{ width: 0 }}
              animate={{ width: `${(currentScreen / 9) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentScreen}
            custom={direction}
            initial={{ opacity: 0, x: direction * 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -50 }}
            transition={{ duration: 0.3 }}
          >
            {currentScreenData.type === 'intro' ? (
              currentScreenData.render?.()
            ) : currentScreenData.type === 'slider' ? (
              <div className="space-y-8">
                <h3 className="text-[#1A1A1A] font-montserrat text-center" style={{ fontSize: '1.75rem', lineHeight: '1.3', fontWeight: 400 }}>
                  {currentScreenData.question}
                </h3>
                
                <div className="bg-white rounded-lg p-12 shadow-sm space-y-8">
                  <div className="text-center">
                    <div className="text-[#1A1A1A] font-montserrat mb-8" style={{ fontSize: '4rem', fontWeight: 300 }}>
                      {getAnswer(currentScreen) || 5}
                    </div>
                    <input
                      type="range"
                      min={currentScreenData.min}
                      max={currentScreenData.max}
                      value={Number(getAnswer(currentScreen)) || 5}
                      onChange={(e) => handleAnswer(currentScreen, Number(e.target.value))}
                      className="w-full h-2 bg-[#E0E0E0] rounded-lg appearance-none cursor-pointer slider-thumb"
                      style={{
                        background: `linear-gradient(to right, #BFA97A 0%, #BFA97A ${((Number(getAnswer(currentScreen)) || 5) / 10) * 100}%, #E0E0E0 ${((Number(getAnswer(currentScreen)) || 5) / 10) * 100}%, #E0E0E0 100%)`
                      }}
                    />
                    <div className="flex justify-between mt-4">
                      <span className="text-[#6B6B6B] font-montserrat text-sm">0</span>
                      <span className="text-[#6B6B6B] font-montserrat text-sm">10</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="text-center space-y-2">
                  <h3 className="text-[#1A1A1A] font-montserrat" style={{ fontSize: '1.75rem', lineHeight: '1.3', fontWeight: 400 }}>
                    {currentScreenData.question}
                  </h3>
                  {currentScreenData.subtitle && (
                    <p className="text-[#6B6B6B] font-montserrat text-sm">
                      {currentScreenData.subtitle}
                    </p>
                  )}
                </div>
                
                <div className="space-y-3">
                  {currentScreenData.options?.map((option, idx) => {
                    const isSelected = currentScreenData.multiSelect
                      ? (getAnswer(currentScreen) as string[] || []).includes(option)
                      : getAnswer(currentScreen) === option;

                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          if (currentScreenData.multiSelect) {
                            const current = (getAnswer(currentScreen) as string[]) || [];
                            const newValue = current.includes(option)
                              ? current.filter(v => v !== option)
                              : [...current, option];
                            handleAnswer(currentScreen, newValue);
                          } else {
                            handleAnswer(currentScreen, option);
                          }
                        }}
                        className={`w-full px-6 py-5 rounded-lg text-left font-montserrat transition-all duration-200 ${
                          isSelected
                            ? 'bg-[#1A1A1A] text-[#F5EEDF] shadow-md'
                            : 'bg-white text-[#232323] hover:bg-[#EFF0ED] shadow-sm'
                        }`}
                        style={{ lineHeight: '1.5', fontWeight: 400 }}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        {currentScreen > 0 && (
          <div className="flex justify-between items-center mt-12">
            <Button
              onClick={goBack}
              variant="outline"
              className="border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#F5EEDF] font-montserrat"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>

            <Button
              onClick={goNext}
              disabled={!canProceed()}
              className="bg-[#1A1A1A] hover:bg-[#232323] text-[#F5EEDF] px-8 font-montserrat disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ letterSpacing: '0.05em', fontWeight: 500 }}
            >
              {currentScreen === 9 ? 'Voir mon miroir' : 'Continuer'}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>

      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #1A1A1A;
          cursor: pointer;
          border: 3px solid #F5EEDF;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        input[type="range"]::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #1A1A1A;
          cursor: pointer;
          border: 3px solid #F5EEDF;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}