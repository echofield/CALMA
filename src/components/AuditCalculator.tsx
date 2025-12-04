import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

export function AuditCalculator() {
  const [callsPerDay, setCallsPerDay] = useState('');
  const [responseRate, setResponseRate] = useState('');
  const [averageTicket, setAverageTicket] = useState('');
  const [showResults, setShowResults] = useState(false);

  const calculateLosses = () => {
    const calls = parseFloat(callsPerDay) || 0;
    const rate = parseFloat(responseRate) || 0;
    const ticket = parseFloat(averageTicket) || 0;

    if (calls && rate && ticket) {
      setShowResults(true);
    }
  };

  const missedCalls = parseFloat(callsPerDay) * (1 - parseFloat(responseRate) / 100);
  const monthlyLostRevenue = missedCalls * 30 * parseFloat(averageTicket) * 0.3;
  const uncalledClients = missedCalls * 30;
  const missedEvents = Math.floor(missedCalls * 30 * 0.15);
  const noShows = Math.floor(parseFloat(callsPerDay) * 30 * 0.08);

  return (
    <div className="bg-white border border-[#E0E0E0] p-8 md:p-12 max-w-4xl mx-auto shadow-sm">
      <h3 className="text-[#0B1E17] text-center mb-8">
        Mini-Audit CALMA : Combien perdez-vous sans le savoir ?
      </h3>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <div className="space-y-2">
          <Label htmlFor="calls" className="text-[#6E7E72]">
            Appels par jour
          </Label>
          <Input
            id="calls"
            type="number"
            placeholder="15"
            value={callsPerDay}
            onChange={(e) => setCallsPerDay(e.target.value)}
            className="bg-white border-[#E0E0E0] focus:border-[#BFA67A] focus:ring-[#BFA67A]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="response" className="text-[#6E7E72]">
            Taux de réponse (%)
          </Label>
          <Input
            id="response"
            type="number"
            placeholder="60"
            value={responseRate}
            onChange={(e) => setResponseRate(e.target.value)}
            className="bg-white border-[#E0E0E0] focus:border-[#BFA67A] focus:ring-[#BFA67A]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ticket" className="text-[#6E7E72]">
            Panier moyen (€)
          </Label>
          <Input
            id="ticket"
            type="number"
            placeholder="45"
            value={averageTicket}
            onChange={(e) => setAverageTicket(e.target.value)}
            className="bg-white border-[#E0E0E0] focus:border-[#BFA67A] focus:ring-[#BFA67A]"
          />
        </div>
      </div>

      <div className="text-center mb-8">
        <Button
          onClick={calculateLosses}
          className="bg-[#1E3C34] hover:bg-[#BFA67A] hover:text-[#0B1E17] text-white px-8 py-6 transition-all duration-300"
          style={{ letterSpacing: '0.15em' }}
        >
          CALCULER MES PERTES
        </Button>
      </div>

      {showResults && callsPerDay && responseRate && averageTicket && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="h-px bg-[#E0E0E0] my-8"></div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-[#FAF8F5] p-6 border border-[#E0E0E0]">
              <div className="text-[2.5rem] text-[#1E3C34] mb-2 font-playfair">
                {monthlyLostRevenue.toLocaleString('fr-FR', { maximumFractionDigits: 0 })}€
              </div>
              <p className="text-[#6E7E72]">CA perdu / mois</p>
            </div>

            <div className="bg-[#FAF8F5] p-6 border border-[#E0E0E0]">
              <div className="text-[2.5rem] text-[#1E3C34] mb-2 font-playfair">
                {uncalledClients.toLocaleString('fr-FR', { maximumFractionDigits: 0 })}
              </div>
              <p className="text-[#6E7E72]">Clients non rappelés</p>
            </div>

            <div className="bg-[#FAF8F5] p-6 border border-[#E0E0E0]">
              <div className="text-[2.5rem] text-[#1E3C34] mb-2 font-playfair">
                {missedEvents}
              </div>
              <p className="text-[#6E7E72]">Événements non captés</p>
            </div>

            <div className="bg-[#FAF8F5] p-6 border border-[#E0E0E0]">
              <div className="text-[2.5rem] text-[#1E3C34] mb-2 font-playfair">
                {noShows}
              </div>
              <p className="text-[#6E7E72]">No-shows évitables</p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Button
              className="bg-[#BFA67A] hover:bg-[#1E3C34] text-[#0B1E17] hover:text-white px-8 py-6 transition-all duration-300"
              style={{ letterSpacing: '0.15em' }}
            >
              OBTENIR L'AUDIT COMPLET (GRATUIT)
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
