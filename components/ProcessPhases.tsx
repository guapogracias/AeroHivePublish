interface ProcessStepProps {
  number: string;
  title: string;
  description: string;
  showDivider?: boolean;
}

function ProcessStep({ number, title, description, showDivider = true }: ProcessStepProps) {
  return (
    <div className="relative">
      <div className="px-8 py-8 flex flex-col justify-between min-h-[132px]">
        {/* Number at top */}
        <div className="text-body mb-2 text-[var(--text-primary)]">
          {number}.
        </div>
        {/* Title and Description at bottom */}
        <div className="flex flex-col gap-2" style={{ maxWidth: '384px' }}>
          <div className="text-body text-[var(--text-primary)] font-medium">
            {title}
          </div>
          <div className="text-body text-[var(--text-secondary)]">
            {description}
          </div>
        </div>
      </div>
      {/* Solid divider at the bottom */}
      {showDivider && (
        <div 
          className="absolute left-0 right-0 bottom-0 border-b border-[var(--divider)]"
        />
      )}
    </div>
  );
}

export default function ProcessPhases() {
  return (
    <div className="relative border-b border-[var(--divider)]">
      {/* Title - left aligned with same spacing as "Our investors" */}
      <div className="container-main relative mb-6 pt-16">
        <div className="grid header-grid">
          <div className="col-span-2 md:col-span-4 px-1">
            <h3 className="text-body-md text-[var(--text-primary)]">
              Our Roadmap
            </h3>
          </div>
        </div>
      </div>

      {/* Mobile: Stacked layout, Desktop: Two boxes side by side */}
      <div className="relative pb-16">
        <div className="container-main relative">
          <div className="grid -mx-4 items-stretch flex-col md:grid md:grid-cols-4">
            {/* Left box - Mobile: small height, Desktop: spans 2 columns */}
            <div className="relative col-span-2 bg-[#0F0F0F] border-t border-b border-l border-r md:border-r-0 border-[var(--divider)] flex flex-col min-h-[200px] md:min-h-auto">
              {/* Mobile: Small box with minimal padding, Desktop: Full height sticky */}
              <div className="relative flex-1">
                <div className="px-8 py-4 md:sticky md:px-8 md:py-8 flex items-center md:items-start" style={{ top: '54px', bottom: '32px' }}>
                  <div className="text-h2 text-[var(--text-primary)] font-medium" style={{ maxWidth: '384px' }}>
                    From Service to SaaS: Scaling the Drone Workforce.
                  </div>
                </div>
              </div>
              {/* Dotted divider on the right - Desktop only */}
              <div className="hidden md:block absolute right-0 top-0 bottom-0 dotted-line" />
            </div>

            {/* Right box - Mobile: stacked, Desktop: spans 2 columns */}
            <div className="relative col-span-2 bg-[#0F0F0F] border-t border-b border-l border-r md:border-l-0 border-[var(--divider)] flex flex-col">
              <div className="flex flex-col">
                <div className="relative">
                  <ProcessStep
                    number="Phase 1"
                    title="Service & Validation"
                    description="We operate the system. We deploy drones, run scans, and deliver 3D analysis for $20/acre. This generates immediate revenue, removes customer headache, and trains our AI on real-world crop disease libraries."
                    showDivider={true}
                  />
                </div>
                <div className="relative">
                  <ProcessStep
                    number="Phase 2"
                    title="SaaS Expansion"
                    description="We transition to software. We sell modular hardware and license the swarm-management platform. Customers run their own fleets via natural language commands. We become the operating system for large-scale land intelligence."
                    showDivider={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

