export default function Mission() {
  return (
    <section className="relative border-b border-[var(--divider)]">
        <div className="container-main relative">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-16 md:py-24">
                {/* Mission section - Mobile: full width, Desktop: spans columns 1-2 */}
                <div className="col-span-2 md:col-span-2 px-4">
                  {/* Height is based on content */}
                  <h2 className="text-h3 text-[var(--text-primary)] mb-4">
                    The Problem
                  </h2>
                  <p className="text-h2 text-[var(--text-primary)] mb-6 max-w-[380px]">
                    Farmers, foresters, and land owners make multimillion-dollar decisions with almost no real visibility.
                  </p>
                  <p className="text-body-md text-[var(--text-secondary)] mb-8 max-w-[384px]">
                    They guess yields, guess biomass, guess risk, and guess the state of their land. Even today most operations rely on manual scouting, 2D imaging through satellites, and gut feeling to run their business. This lack of certainty creates direct financial pains.
                  </p>
                  <p className="text-body-md text-[var(--text-secondary)] max-w-[384px]">
                    Farmers hedge blindly on futures and often lose money. Foresters can’t measure biomass or disease spread at scale. Energy and infrastructure companies can’t quickly assess the state of large assets. Everyone is flying blind.
                  </p>
                </div>

                {/* Right side / Solution - Desktop: spans columns 3-4 */}
                <div className="col-span-2 md:col-span-2 px-4 mt-12 md:mt-0">
                    <h2 className="text-h3 text-[var(--text-primary)] mb-4">
                        The Solution
                    </h2>
                    <p className="text-h2 text-[var(--text-primary)] mb-6">
                        AeroHive eliminates uncertainty.
                    </p>
                    <p className="text-body-md text-[var(--text-secondary)] mb-6 max-w-[480px]">
                        We provide high-accuracy 3D models of land, crops, and assets not once per season but, whenever it matters. Our drone software allows customers to maintain an autonomous drone swarm, with actionable intelligence that tells them what's happening, where, and what it means for their bottom line.
                    </p>
                </div>
            </div>
        </div>
    </section>
  );
}

