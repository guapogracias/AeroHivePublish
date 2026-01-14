import DroneSwarmASCII from "./DroneSwarmASCII";

export default function Hero() {
  return (
    <section className="relative w-full min-h-[100vh] grid-bg overflow-hidden border-b border-[var(--divider)]">
      {/* Full-width container (fill desktop viewport) */}
      <div className="relative h-full min-h-[100vh] w-full px-6 md:px-16">
        {/* Mobile: 2-column grid, Desktop: 4-column grid */}
        <div 
          className="hero-grid relative grid h-full min-h-[100vh]"
        >
          {/* Swarm background (full-screen) */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <DroneSwarmASCII />
          </div>
          
          {/* Left-aligned cover overlay (temporary copy; you’ll replace later) */}
          <div className="absolute inset-0 z-10">
            <div className="relative h-full min-h-[100vh]">
              {/* Headline + subcopy */}
              <div className="absolute left-0 top-[22%] md:top-[26%] -translate-y-[192px] max-w-[720px]">
                <h1 className="relative text-black font-medium text-[48px] leading-[54px] md:text-[76px] md:leading-[82px] tracking-[-1.5px] md:tracking-[-2.2px]">
                  Aerial accounting
                  <br />
                  for the <span className="text-emerald-500">physical world</span>
                </h1>
                <p className="relative mt-5 text-black/75 text-[14px] leading-[20px] md:text-[16px] md:leading-[22px] max-w-[520px]">
                  AeroHive keeps a running record of what’s on the ground and how it changes over time, so problems can be seen early and decisions can be made with confidence.
                </p>
              </div>

              {/* Bottom cards (horizontal scroll) */}
              <div className="absolute left-0 right-0 bottom-[10%] md:bottom-[8%] -translate-y-[96px]">
                <div className="flex justify-center gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-2 md:px-0">
                  {[
                    {
                      title: "1. Where",
                      body:
                        "We show what exists and where it is. AeroHive creates a clear map of assets and conditions that stays consistent over time.",
                    },
                    {
                      title: "2. Why",
                      body:
                        "Because change creates risk. By comparing what’s happening now to what happened before, AeroHive surfaces issues before they become expensive.",
                    },
                    {
                      title: "3. How",
                      body:
                        "By collecting data automatically and analyzing it with AI. Repeated flights turn real-world change into clear signals that guide action.",
                    },
                  ].map((card) => (
                    <div
                      key={card.title}
                      className="snap-start shrink-0 w-[300px] md:w-[360px] rounded-xl bg-white/55 backdrop-blur-sm border border-black/10 p-6"
                    >
                      <div className="text-black font-medium text-[22px] leading-[28px]">
                        {card.title}
                      </div>
                      <div className="mt-3 text-black/70 text-[12px] leading-[18px]">
                        {card.body}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

