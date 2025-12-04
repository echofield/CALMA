import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Mail, Phone, User, Building2, Check } from 'lucide-react';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    establishment: '',
    email: '',
    phone: '',
    message: ''
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitted(true);
    setIsSubmitting(false);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        establishment: '',
        email: '',
        phone: '',
        message: ''
      });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (isSubmitted) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center py-20 px-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-20 h-20 rounded-full bg-[#BFA97A] flex items-center justify-center mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Check className="w-10 h-10 text-[#1A1A1A]" />
        </motion.div>
        <h3 className="text-[#F5EEDF] font-montserrat text-2xl mb-3" style={{ fontWeight: 300 }}>
          Message envoyé
        </h3>
        <p className="text-[#EFF0ED]/70 font-montserrat text-center" style={{ fontWeight: 300 }}>
          Nous vous répondrons sous 24h.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Field */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <label 
          htmlFor="name" 
          className="block text-[#F5EEDF] font-montserrat text-sm mb-2 uppercase tracking-wider"
          style={{ fontWeight: 300, letterSpacing: '0.1em' }}
        >
          Nom & Prénom
        </label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#BFA97A]" />
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full pl-12 pr-4 py-4 bg-white border border-[#E0E0E0] rounded-md font-montserrat text-[#1A1A1A] placeholder-[#B0B0B0] focus:outline-none focus:border-[#BFA97A] transition-colors duration-300"
            style={{ fontWeight: 300 }}
            placeholder="Votre nom complet"
          />
        </div>
      </motion.div>

      {/* Establishment Field */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <label 
          htmlFor="establishment" 
          className="block text-[#F5EEDF] font-montserrat text-sm mb-2 uppercase tracking-wider"
          style={{ fontWeight: 300, letterSpacing: '0.1em' }}
        >
          Établissement
        </label>
        <div className="relative">
          <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#BFA97A]" />
          <input
            type="text"
            id="establishment"
            name="establishment"
            required
            value={formData.establishment}
            onChange={handleChange}
            className="w-full pl-12 pr-4 py-4 bg-white border border-[#E0E0E0] rounded-md font-montserrat text-[#1A1A1A] placeholder-[#B0B0B0] focus:outline-none focus:border-[#BFA97A] transition-colors duration-300"
            style={{ fontWeight: 300 }}
            placeholder="Nom de votre restaurant, hôtel ou café"
          />
        </div>
      </motion.div>

      {/* Email & Phone Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <label 
            htmlFor="email" 
            className="block text-[#F5EEDF] font-montserrat text-sm mb-2 uppercase tracking-wider"
            style={{ fontWeight: 300, letterSpacing: '0.1em' }}
          >
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#BFA97A]" />
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-4 bg-white border border-[#E0E0E0] rounded-md font-montserrat text-[#1A1A1A] placeholder-[#B0B0B0] focus:outline-none focus:border-[#BFA97A] transition-colors duration-300"
              style={{ fontWeight: 300 }}
              placeholder="votre@email.com"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <label 
            htmlFor="phone" 
            className="block text-[#F5EEDF] font-montserrat text-sm mb-2 uppercase tracking-wider"
            style={{ fontWeight: 300, letterSpacing: '0.1em' }}
          >
            Téléphone
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#BFA97A]" />
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-4 bg-white border border-[#E0E0E0] rounded-md font-montserrat text-[#1A1A1A] placeholder-[#B0B0B0] focus:outline-none focus:border-[#BFA97A] transition-colors duration-300"
              style={{ fontWeight: 300 }}
              placeholder="+33 6 00 00 00 00"
            />
          </div>
        </motion.div>
      </div>

      {/* Message Field */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <label 
          htmlFor="message" 
          className="block text-[#F5EEDF] font-montserrat text-sm mb-2 uppercase tracking-wider"
          style={{ fontWeight: 300, letterSpacing: '0.1em' }}
        >
          Message <span className="text-[#B0B0B0] normal-case">(optionnel)</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={formData.message}
          onChange={handleChange}
          className="w-full px-4 py-4 bg-white border border-[#E0E0E0] rounded-md font-montserrat text-[#1A1A1A] placeholder-[#B0B0B0] focus:outline-none focus:border-[#BFA97A] transition-colors duration-300 resize-none"
          style={{ fontWeight: 300 }}
          placeholder="Parlez-nous de votre établissement et de vos besoins..."
        />
      </motion.div>

      {/* Submit Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="pt-4"
      >
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#232323] hover:bg-[#1A1A1A] text-[#F5EEDF] py-5 transition-all duration-400 font-montserrat disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ 
            letterSpacing: '0.12em',
            fontWeight: 500,
            fontSize: '0.95rem',
            borderRadius: '6px',
          }}
        >
          {isSubmitting ? 'ENVOI EN COURS...' : 'ENVOYER'}
        </Button>
      </motion.div>
    </form>
  );
}