import SilverMapleViewer from "./SilverMapleViewer";

export default function Mission() {
  return (
    <section className="relative border-y border-[var(--divider)]">
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
                    The world’s most valuable assets are still measured blindly.
                  </p>
                  <p className="text-body-md text-[var(--text-secondary)] mb-6">
                    Farmers, foresters, and landowners make high-stakes decisions with limited visibility. They rely on estimates, manual scouting, or outdated imagery to understand growth, risk, and change.
                  </p>
                  <p className="text-body-md text-[var(--text-secondary)]">
                    Without accurate spatial understanding, they can’t reliably measure health, predict outcomes, or act early. This uncertainty leads to wasted resources, missed yield, delayed intervention, and preventable losses.
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
                        AeroHive turns the physical world into intelligence.
                    </p>
                    <p className="text-body-md text-[var(--text-secondary)] mb-6">
                        We generate high-fidelity 3D representations of land, crops, and infrastructure using autonomous drones. These models capture real structure and depth — not just photos — providing a precise digital view of the physical environment.
                    </p>
                    <p className="text-body-md text-[var(--text-secondary)] mb-6">
                        AI then interprets these point clouds to understand what exists in the scene, how it is changing, and why it matters. The system identifies structure, growth patterns, anomalies, and spatial relationships that are invisible to traditional imagery. Over time, repeated scans allow changes to be measured, compared, and predicted.
                    </p>
                    <p className="text-body-md text-[var(--text-secondary)]">
                        Instead of delivering raw data, AeroHive produces understanding. Users receive clear, actionable insight into what’s happening, where it’s happening, and what it means for operations, risk, and decision-making on the ground.
                    </p>
                </div>
            </div>
        </div>
    </section>
  );
}

