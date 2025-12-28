import ProfoundIsotypeASCII from './ProfoundIsotypeASCII';

export default function Footer() {
  return (
    <footer className="relative w-full bg-[var(--bg-black)] border-t border-[var(--divider)]">
      <div className="container-main relative py-12">
        <div className="flex flex-col items-center justify-center">
          {/* ASCII Art Logo - Small */}
          <div className="overflow-hidden mb-1" style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ transform: 'scale(0.2)', transformOrigin: 'center center' }}>
              <ProfoundIsotypeASCII />
            </div>
          </div>
          
          {/* Company Name */}
          <h2 className="text-h3 text-[var(--text-primary)] mb-0.5 leading-tight">
            AeroHive
          </h2>
          
          {/* Tagline */}
          <p className="text-body-sm text-[var(--text-secondary)] text-center max-w-[600px] px-4 leading-tight">
            Transforming complex landscapes into confident decisions
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[var(--divider)] pt-8 pb-8">
        <div className="container-main relative">
          <div className="flex items-center justify-between px-4">
            {/* Copyright */}
            <div
              className="text-body-sm font-normal"
              style={{ color: "#464646" }}
            >
              © 2025 AeroHive
            </div>

            {/* System Status */}
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#28FDB0]" />
              <span
                className="text-body-sm font-normal"
                style={{ color: "#28FDB0" }}
              >
                All systems normal
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

