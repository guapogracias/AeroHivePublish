import SilverMapleViewer from "./SilverMapleViewer";

export default function Mission() {
  return (
    <section className="relative border-b border-[var(--divider)]">
        {/* Full-width layout: push text toward page edges to maximize center space for the model */}
        <div className="w-full relative px-6 md:px-10">
            <div className="grid grid-cols-2 md:grid-cols-12 gap-6 md:gap-8 py-16 md:py-24 items-stretch">
                {/* Problem */}
                <div className="col-span-2 md:col-span-3">
                  {/* Height is based on content */}
                  <h2 className="text-h3 text-[var(--text-primary)] mb-4">
                    The Problem
                  </h2>
                  <p className="text-h2 text-[var(--text-primary)] mb-6">
                    Farmers, foresters, and land owners make multimillion-dollar decisions with almost no real visibility.
                  </p>
                  <p className="text-body-md text-[var(--text-secondary)] mb-8">
                    They guess yields, guess biomass, guess risk, and guess the state of their land. Even today most operations rely on manual scouting, 2D imaging through satellites, and gut feeling to run their business. This lack of certainty creates direct financial pains.
                  </p>
                  <p className="text-body-md text-[var(--text-secondary)]">
                    Farmers hedge blindly on futures and often lose money. Foresters can’t measure biomass or disease spread at scale. Energy and infrastructure companies can’t quickly assess the state of large assets. Everyone is flying blind.
                  </p>
                </div>

                {/* Center: 3D model (between Problem and Solution) */}
                <div className="col-span-2 md:col-span-6 mt-10 md:mt-0 flex items-stretch justify-center">
                  {/* No “box” styling — just a full-bleed canvas area */}
                  <SilverMapleViewer />
                </div>

                {/* Solution */}
                <div className="col-span-2 md:col-span-3 mt-12 md:mt-0">
                    <h2 className="text-h3 text-[var(--text-primary)] mb-4">
                        The Solution
                    </h2>
                    <p className="text-h2 text-[var(--text-primary)] mb-6">
                        AeroHive eliminates uncertainty.
                    </p>
                    <p className="text-body-md text-[var(--text-secondary)] mb-6">
                        We provide high-accuracy 3D models of land, crops, and assets not once per season but, whenever it matters. Our drone software allows customers to maintain an autonomous drone swarm, with actionable intelligence that tells them what's happening, where, and what it means for their bottom line.
                    </p>
                </div>
            </div>
        </div>
    </section>
  );
}

