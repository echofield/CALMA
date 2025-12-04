interface LogoProps {
  variant?: 'dark' | 'light' | 'bronze';
  showSubtitle?: boolean;
  className?: string;
}

export function Logo({ variant = 'dark', showSubtitle = true, className = '' }: LogoProps) {
  const colors = {
    dark: '#1A1A1A',
    light: '#F5EEDF',
    bronze: '#BFA97A'
  };

  const fillColor = colors[variant];

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {/* Modern Minimalist "CALMA" wordmark */}
      <div 
        className="font-montserrat uppercase tracking-[0.25em]"
        style={{ 
          fontSize: '2.5rem',
          color: fillColor,
          fontWeight: 300,
          letterSpacing: '0.3em'
        }}
      >
        CALMA
      </div>
      
      {showSubtitle && (
        <div 
          className="font-montserrat uppercase tracking-[0.25em]"
          style={{ 
            fontSize: '0.65rem',
            color: fillColor,
            opacity: 0.5,
            fontWeight: 400,
            letterSpacing: '0.3em'
          }}
        >
          Hospitality OS
        </div>
      )}
    </div>
  );
}

// Compact horizontal version for header
export function LogoCompact({ variant = 'dark', className = '' }: Omit<LogoProps, 'showSubtitle'>) {
  const colors = {
    dark: '#1A1A1A',
    light: '#F5EEDF',
    bronze: '#BFA97A'
  };

  const fillColor = colors[variant];

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div 
        className="font-montserrat uppercase tracking-[0.2em]"
        style={{ 
          fontSize: '1.25rem',
          color: fillColor,
          fontWeight: 400,
          letterSpacing: '0.25em'
        }}
      >
        CALMA
      </div>
      
      <div 
        className="font-montserrat uppercase tracking-[0.2em]"
        style={{ 
          fontSize: '0.5rem',
          color: fillColor,
          opacity: 0.4,
          fontWeight: 400,
          letterSpacing: '0.25em'
        }}
      >
        Hospitality OS
      </div>
    </div>
  );
}