import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { motion } from 'motion/react';

export function AuditCalculatorPro() {
  const [formData, setFormData] = useState({
    callsPerDay: '',
    responseRate: '',
    conversionRate: '',
    averageTicket: '',
    eventsPerMonth: '',
    eventTicket: '',
    noShowsPerMonth: '',
    employeeCost: ''
  });
  const [showResults, setShowResults] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateLosses = () => {
    const calls = parseFloat(formData.callsPerDay) || 0;
    const response = parseFloat(formData.responseRate) || 0;
    const conversion = parseFloat(formData.conversionRate) || 0;
    const ticket = parseFloat(formData.averageTicket) || 0;
    const _events = parseFloat(formData.eventsPerMonth) || 0;
    const _eventTicket = parseFloat(formData.eventTicket) || 0;
    const _noShows = parseFloat(formData.noShowsPerMonth) || 0;
    const _employeeCost = parseFloat(formData.employeeCost) || 0;

    if (calls && response && conversion && ticket) {
      setShowResults(true);
    }
  };

  // Calculs
  const calls = parseFloat(formData.callsPerDay) || 0;
  const responseRate = parseFloat(formData.responseRate) || 0;
  const conversionRate = parseFloat(formData.conversionRate) || 0;
  const avgTicket = parseFloat(formData.averageTicket) || 0;
  const eventsMonth = parseFloat(formData.eventsPerMonth) || 0;
  const eventTicketValue = parseFloat(formData.eventTicket) || 0;
  const noShowsMonth = parseFloat(formData.noShowsPerMonth) || 0;
  const employeeHourlyCost = parseFloat(formData.employeeCost) || 0;

  const missedCalls = calls * (1 - responseRate / 100);
  const monthlyMissedCalls = missedCalls * 30;
  const lostReceptions = monthlyMissedCalls * (conversionRate / 100);
  const lostReceptionRevenue = lostReceptions * avgTicket;

  const missedEvents = eventsMonth * 0.3; // 30% d'événements manqués
  const lostEventRevenue = missedEvents * eventTicketValue;

  const noShowCost = noShowsMonth * avgTicket * 0.5;

  const timeSaved = monthlyMissedCalls * 3; // 3 min par appel
  const moneySaved = (timeSaved / 60) * employeeHourlyCost;

  return (
    <motion.div 
      className="bg-[#F7F4EC] border border-[#6C2E2F]/30 rounded-xl p-8 md:p-12 max-w-6xl mx-auto"
      style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)' }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center mb-12">
        <h3 className="text-[#1F3D33] mb-4 font-playfair">
          Estimez vos pertes invisibles
        </h3>
        <motion.div 
          className="w-24 h-px bg-[#6C2E2F] mx-auto"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-4 mb-8">
        {/* Row 1 */}
        <div className="space-y-2">
          <Label htmlFor="calls" className="text-[#6C2E2F] text-xs uppercase tracking-wider">
            Appels par jour
          </Label>
          <Input
            id="calls"
            type="number"
            placeholder="15"
            value={formData.callsPerDay}
            onChange={(e) => handleInputChange('callsPerDay', e.target.value)}
            className="bg-white border-[#C1C1B3] focus:border-[#6C2E2F] focus:ring-[#6C2E2F] rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="response" className="text-[#6C2E2F] text-xs uppercase tracking-wider">
            Taux de réponse (%)
          </Label>
          <Input
            id="response"
            type="number"
            placeholder="60"
            value={formData.responseRate}
            onChange={(e) => handleInputChange('responseRate', e.target.value)}
            className="bg-white border-[#C1C1B3] focus:border-[#6C2E2F] focus:ring-[#6C2E2F] rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="conversion" className="text-[#6C2E2F] text-xs uppercase tracking-wider">
            Taux de conversion (%)
          </Label>
          <Input
            id="conversion"
            type="number"
            placeholder="30"
            value={formData.conversionRate}
            onChange={(e) => handleInputChange('conversionRate', e.target.value)}
            className="bg-white border-[#C1C1B3] focus:border-[#6C2E2F] focus:ring-[#6C2E2F] rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ticket" className="text-[#6C2E2F] text-xs uppercase tracking-wider">
            Panier moyen (€)
          </Label>
          <Input
            id="ticket"
            type="number"
            placeholder="45"
            value={formData.averageTicket}
            onChange={(e) => handleInputChange('averageTicket', e.target.value)}
            className="bg-white border-[#C1C1B3] focus:border-[#6C2E2F] focus:ring-[#6C2E2F] rounded-lg"
          />
        </div>

        {/* Row 2 */}
        <div className="space-y-2">
          <Label htmlFor="events" className="text-[#6C2E2F] text-xs uppercase tracking-wider">
            Événements par mois
          </Label>
          <Input
            id="events"
            type="number"
            placeholder="5"
            value={formData.eventsPerMonth}
            onChange={(e) => handleInputChange('eventsPerMonth', e.target.value)}
            className="bg-white border-[#C1C1B3] focus:border-[#6C2E2F] focus:ring-[#6C2E2F] rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="eventTicket" className="text-[#6C2E2F] text-xs uppercase tracking-wider">
            Panier événement (€)
          </Label>
          <Input
            id="eventTicket"
            type="number"
            placeholder="800"
            value={formData.eventTicket}
            onChange={(e) => handleInputChange('eventTicket', e.target.value)}
            className="bg-white border-[#C1C1B3] focus:border-[#6C2E2F] focus:ring-[#6C2E2F] rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="noShows" className="text-[#6C2E2F] text-xs uppercase tracking-wider">
            No-shows par mois
          </Label>
          <Input
            id="noShows"
            type="number"
            placeholder="8"
            value={formData.noShowsPerMonth}
            onChange={(e) => handleInputChange('noShowsPerMonth', e.target.value)}
            className="bg-white border-[#C1C1B3] focus:border-[#6C2E2F] focus:ring-[#6C2E2F] rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="employeeCost" className="text-[#6C2E2F] text-xs uppercase tracking-wider">
            Coût horaire employé (€)
          </Label>
          <Input
            id="employeeCost"
            type="number"
            placeholder="18"
            value={formData.employeeCost}
            onChange={(e) => handleInputChange('employeeCost', e.target.value)}
            className="bg-white border-[#C1C1B3] focus:border-[#6C2E2F] focus:ring-[#6C2E2F] rounded-lg"
          />
        </div>
      </div>

      <div className="text-center mb-8">
        <Button
          onClick={calculateLosses}
          className="bg-[#1F3D33] hover:bg-[#6C2E2F] text-white px-10 py-6 rounded-lg transition-all duration-300"
          style={{ letterSpacing: '0.15em' }}
        >
          CALCULER MES PERTES
        </Button>
      </div>

      {showResults && formData.callsPerDay && formData.responseRate && (
        <motion.div 
          className="space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="h-px bg-[#6C2E2F]/20 my-8"></div>
          
          <div className="grid gap-6 md:grid-cols-2">
            {/* Bloc 1 */}
            <motion.div 
              className="bg-white p-8 rounded-lg border border-[#C1C1B3]/40"
              style={{ boxShadow: '0 2px 12px rgba(0, 0, 0, 0.03)' }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <h4 className="text-[#1F3D33] text-sm uppercase tracking-wider mb-3 font-playfair">
                CA perdu accueil
              </h4>
              <div className="text-[3rem] text-[#6C2E2F] mb-2 font-playfair leading-none">
                {(lostReceptionRevenue || 0).toLocaleString('fr-FR', { maximumFractionDigits: 0 })}€
              </div>
              <p className="text-[#C1C1B3] text-sm leading-relaxed">
                Par mois en réservations non converties
              </p>
            </motion.div>

            {/* Bloc 2 */}
            <motion.div 
              className="bg-white p-8 rounded-lg border border-[#C1C1B3]/40"
              style={{ boxShadow: '0 2px 12px rgba(0, 0, 0, 0.03)' }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <h4 className="text-[#1F3D33] text-sm uppercase tracking-wider mb-3 font-playfair">
                CA perdu événements
              </h4>
              <div className="text-[3rem] text-[#6C2E2F] mb-2 font-playfair leading-none">
                {(lostEventRevenue || 0).toLocaleString('fr-FR', { maximumFractionDigits: 0 })}€
              </div>
              <p className="text-[#C1C1B3] text-sm leading-relaxed">
                Opportunités événementielles manquées
              </p>
            </motion.div>

            {/* Bloc 3 */}
            <motion.div 
              className="bg-white p-8 rounded-lg border border-[#C1C1B3]/40"
              style={{ boxShadow: '0 2px 12px rgba(0, 0, 0, 0.03)' }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <h4 className="text-[#1F3D33] text-sm uppercase tracking-wider mb-3 font-playfair">
                Coût no-shows
              </h4>
              <div className="text-[3rem] text-[#6C2E2F] mb-2 font-playfair leading-none">
                {(noShowCost || 0).toLocaleString('fr-FR', { maximumFractionDigits: 0 })}€
              </div>
              <p className="text-[#C1C1B3] text-sm leading-relaxed">
                Coût des réservations non honorées
              </p>
            </motion.div>

            {/* Bloc 4 */}
            <motion.div 
              className="bg-white p-8 rounded-lg border border-[#C1C1B3]/40"
              style={{ boxShadow: '0 2px 12px rgba(0, 0, 0, 0.03)' }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <h4 className="text-[#1F3D33] text-sm uppercase tracking-wider mb-3 font-playfair">
                Temps/argent économisés
              </h4>
              <div className="text-[3rem] text-[#6C2E2F] mb-2 font-playfair leading-none">
                {(moneySaved || 0).toLocaleString('fr-FR', { maximumFractionDigits: 0 })}€
              </div>
              <p className="text-[#C1C1B3] text-sm leading-relaxed">
                Avec automatisation CALMA ({Math.round((timeSaved || 0) / 60)}h économisées)
              </p>
            </motion.div>
          </div>

          <div className="text-center mt-12">
            <Button
              className="bg-[#6C2E2F] hover:bg-[#1F3D33] text-white px-10 py-6 rounded-lg transition-all duration-300"
              style={{ letterSpacing: '0.15em' }}
            >
              OBTENIR MON AUDIT COMPLET (GRATUIT)
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}