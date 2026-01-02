import ProfoundIsotypeASCII from './ProfoundIsotypeASCII';

export default function Hero() {
  return (
    <section className="relative w-full min-h-[100vh] bg-[var(--bg-black)] overflow-hidden">
      {/* Container with max-width and padding */}
      <div className="container-main relative h-full min-h-[100vh]">
        {/* Mobile: 2-column grid, Desktop: 4-column grid */}
        <div 
          className="hero-grid relative grid h-full min-h-[100vh]"
        >
          {/* Mobile: 3 vertical dotted lines, Desktop: 5 vertical dotted lines */}
          {/* Left border line */}
          <div className="absolute left-0 top-0 bottom-0 dotted-line" />
          
          {/* Divider after column 1 - Mobile: 50%, Desktop: 25% */}
          <div className="absolute left-[50%] md:left-[25%] top-0 bottom-0 dotted-line" />
          
          {/* Divider after column 2 - Desktop only: 50% */}
          <div className="hidden md:block absolute left-[50%] top-0 bottom-0 dotted-line" />
          
          {/* Divider after column 3 - Desktop only: 75% */}
          <div className="hidden md:block absolute left-[75%] top-0 bottom-0 dotted-line" />
          
          {/* Right border line */}
          <div className="absolute right-0 top-0 bottom-0 dotted-line" />
          
          {/* Overlay content - positioned higher on screen */}
          <div className="col-span-2 md:col-span-4 flex flex-col items-center justify-start min-h-[100vh] relative z-10 pt-16 md:pt-12 pb-8">
            {/* Title (same sizing as the previous main heading) */}
            <h1 className="text-[32px] leading-[40px] tracking-[-1.5px] md:text-[56px] md:leading-[64px] md:tracking-[-2.94px] font-medium text-[var(--text-primary)] text-center mb-6 md:mb-8 max-w-4xl px-4 md:px-0">
              AeroHive
            </h1>

            {/* ASCII drone */}
            <div className="mt-0 opacity-100">
              <ProfoundIsotypeASCII />
            </div>
            
            {/* Subheading */}
            <p className="text-[22px] leading-[30px] tracking-[-0.2px] md:text-[32px] md:leading-[40px] md:tracking-[-0.6px] text-[var(--text-primary)] text-center mb-6 md:mb-10 max-w-2xl px-4 md:px-0 opacity-80">
              Modular drones, 3D AI, Fleet autonomy
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

