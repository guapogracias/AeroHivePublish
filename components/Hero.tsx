import ProfoundIsotypeASCII from './ProfoundIsotypeASCII';
import BlurText from './BlurText';

export default function Hero() {
  return (
    <section className="relative w-full h-screen bg-[#000000] overflow-hidden">
      {/* Container with max-width and padding */}
      <div className="container-main relative h-full">
        {/* Mobile: 2-column grid, Desktop: 4-column grid */}
        <div 
          className="hero-grid relative grid h-full"
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
          
          {/* Overlay content - centered vertically, following grid layout */}
          <div className="col-span-2 md:col-span-4 flex flex-col items-center justify-center h-full relative z-10 pt-8 md:pt-0">
            {/* ASCII art logo */}
            <div className="mt-0 opacity-100">
                <ProfoundIsotypeASCII />
            </div>
            
            {/* Main heading */}
            <BlurText
              text="Transforming complex landscapes to confident decisions"
              delay={100}
               animateBy="words"
              direction="top"
              className="text-[32px] leading-[40px] tracking-[-1.5px] md:text-[56px] md:leading-[64px] md:tracking-[-2.94px] font-medium text-[var(--text-primary)] text-center mb-4 md:mb-6 max-w-4xl px-4 md:px-0"
            />
            
            {/* Subheading */}
            <p className="text-[16px] leading-[22px] tracking-[-0.2px] md:text-[18px] md:leading-[24px] md:tracking-[-0.045px] text-[var(--text-primary)] text-center mb-6 md:mb-8 max-w-xl px-4 md:px-0 opacity-80">
              AeroHive: Modular drones, 3D AI, Fleet autonomy
            </p>
            
            {/* Button */}
            <button 
              className="bg-white text-[var(--text-dark)] px-6 py-3 rounded-lg font-semibold text-sm md:text-base transition-opacity hover:opacity-80"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

