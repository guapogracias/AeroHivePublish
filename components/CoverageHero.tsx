export default function CoverageHero() {
  return (
    <section className="relative w-full bg-[var(--bg-black)] border-b border-[var(--divider)]">
      <div className="container-main relative">
        <div className="grid grid-cols-2 md:grid-cols-4 min-h-[60vh] md:min-h-[600px]">
          {/* Vertical Dotted Lines */}
          <div className="absolute left-0 top-0 bottom-0 dotted-line" />
          <div className="absolute left-[50%] md:left-[25%] top-0 bottom-0 dotted-line" />
          <div className="hidden md:block absolute left-[50%] top-0 bottom-0 dotted-line" />
          <div className="hidden md:block absolute left-[75%] top-0 bottom-0 dotted-line" />
          <div className="absolute right-0 top-0 bottom-0 dotted-line" />

          {/* Content */}
          <div className="col-span-2 md:col-span-4 flex flex-col items-center justify-center relative z-10 px-4">
            <h1 className="text-[32px] leading-[40px] tracking-[-1.5px] md:text-[56px] md:leading-[64px] md:tracking-[-2.94px] font-medium text-[var(--text-primary)] text-center mb-6 max-w-4xl">
              From agriculture to infrastructure, AeroHive adapts to your needs
            </h1>
            <p className="text-[16px] leading-[22px] tracking-[-0.2px] md:text-[18px] md:leading-[24px] md:tracking-[-0.045px] text-[var(--text-secondary)] text-center max-w-2xl mb-8">
              One platform, endless applications. Discover how our autonomous drone swarms are transforming industries by providing real-time, actionable intelligence.
            </p>
            <a href="/demo" className="btn-primary font-semibold">
              Get a demo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

