import { useState, useEffect } from 'react';
import { motion, useScroll } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { LogoCompact } from './Logo';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      setIsScrolled(latest > 50);
    });
    return () => unsubscribe();
  }, [scrollY]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setIsMobileMenuOpen(false);
    }
  };

  const navItems = [
    { label: 'Mission', id: 'mission' },
    { label: 'Services', id: 'services' },
    { label: 'Nous contacter', id: 'contact' }
  ];

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#FAF8F5]/95 backdrop-blur-md shadow-sm border-b border-[#E0E0E0]/50' 
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:opacity-80 transition-opacity"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <LogoCompact variant="dark" />
            </motion.button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-sm text-[#1A1A1A] hover:text-[#BFA97A] transition-colors font-montserrat"
                  style={{ letterSpacing: '0.05em', fontWeight: 400 }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  whileHover={{ y: -2 }}
                >
                  {item.label}
                </motion.button>
              ))}
            </nav>

            {/* CTA Button - Desktop */}
            <motion.div
              className="hidden md:block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button
                onClick={() => scrollToSection('miroir')}
                size="sm"
                className="bg-transparent border border-[#BFA97A] text-[#1A1A1A] hover:bg-[#BFA97A] hover:text-[#1A1A1A] px-6 py-2 transition-all duration-300 font-montserrat"
                style={{ letterSpacing: '0.12em', fontWeight: 500 }}
              >
                AUDIT GRATUIT
              </Button>
            </motion.div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-[#1A1A1A] hover:text-[#BFA97A] transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <motion.div
        className={`fixed inset-0 z-40 md:hidden ${isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        initial={false}
        animate={{
          opacity: isMobileMenuOpen ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-[#1A1A1A]/60 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Menu Panel */}
        <motion.div
          className="absolute top-20 left-0 right-0 bg-[#FAF8F5] border-b border-[#E0E0E0] shadow-lg"
          initial={{ y: -20, opacity: 0 }}
          animate={{
            y: isMobileMenuOpen ? 0 : -20,
            opacity: isMobileMenuOpen ? 1 : 0
          }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <nav className="px-6 py-8 space-y-6">
            {navItems.map((item, index) => (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="block w-full text-left text-[#1A1A1A] hover:text-[#BFA97A] transition-colors font-montserrat py-2 border-b border-[#E0E0E0]/30"
                style={{ letterSpacing: '0.05em', fontWeight: 400 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: isMobileMenuOpen ? 1 : 0,
                  x: isMobileMenuOpen ? 0 : -20
                }}
                transition={{ duration: 0.3, delay: 0.05 * index }}
              >
                {item.label}
              </motion.button>
            ))}
            <motion.div
              className="pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: isMobileMenuOpen ? 1 : 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Button
                onClick={() => scrollToSection('miroir')}
                className="w-full bg-transparent border border-[#BFA97A] text-[#1A1A1A] hover:bg-[#BFA97A] hover:text-[#1A1A1A] px-6 py-3 transition-all duration-300 font-montserrat"
                style={{ letterSpacing: '0.12em', fontWeight: 500 }}
              >
                AUDIT GRATUIT
              </Button>
            </motion.div>
          </nav>
        </motion.div>
      </motion.div>
    </>
  );
}