interface ValueProps {
  number: string;
  category: string;
  title: string;
  description: string;
  height?: string | number;
  borderClasses?: string;
  showRightDivider?: boolean;
}

function Value({
  number,
  category,
  title,
  description,
  height = '396px',
  borderClasses = 'border-t border-b border-l border-[var(--divider)]',
  showRightDivider = true,
}: ValueProps) {
  return (
    <div 
      className={`relative col-span-2 md:col-span-1 bg-[var(--bg-primary)] ${borderClasses}`}
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
    >
      <div className="h-full px-8 py-8 flex flex-col">
        {/* Top: Number / Category */}
        <div className="text-body-sm mb-36">
          <span className="text-[var(--text-secondary)]">{number}.</span>
          <span className="text-[var(--text-primary)]"> / {category}</span>
        </div>
        
        {/* Title and Description */}
        <div className="flex flex-col gap-2">
          <div className="text-h3 text-[var(--text-primary)] font-medium">
            {title}
          </div>
          <div className="text-body text-[var(--text-secondary)]">
            {description}
          </div>
        </div>
      </div>
      {/* Dotted divider on the right */}
      {showRightDivider && <div className="absolute right-0 top-0 bottom-0 dotted-line" />}
    </div>
  );
}

export default function EdgeValues() {
  return (
    <div className="relative border-b border-[var(--divider)] pb-16">
      {/* Title - left aligned */}
      <div className="container-main relative mb-6 pt-16">
        <div className="grid header-grid">
          <div className="col-span-2 md:col-span-4 px-1">
            <h3 className="text-body-md text-[var(--text-primary)]">
              Our Edge
            </h3>
          </div>
        </div>
      </div>

      {/* Mobile: Stacked values, Desktop: 2x2 grid */}
      <div className="relative">
        <div className="container-main relative">
          <div className="grid -mx-4 grid-cols-2 md:grid-cols-4">
            {/* Row 1 - Left */}
            <Value
              number="01"
              category="Intelligence"
              title="Interpretation is Key"
              description="Our edge isn't just the drones—it's the data. We turn raw 3D scans into clear, confident decisions that directly affect revenue, cost, and risk."
              borderClasses="border-t border-b border-l border-r md:border-r-0 border-[var(--divider)]"
              showRightDivider={true}
            />
            {/* Row 1 - Right */}
            <Value
              number="02"
              category="Speed"
              title="Autonomy at Scale"
              description="Autonomous swarms cover entire operations in minutes, not days. Zero additional labor required."
              borderClasses="border-t border-b border-l border-r md:border-l-0 border-[var(--divider)]"
              showRightDivider={false}
            />

            {/* Row 2 - Left */}
            <Value
              number="03"
              category="Reach"
              title="Massive Market"
              description="Agriculture, construction, forestry, insurance, utilities, disaster response. Any industry struggling with scale without clarity."
              borderClasses="border-t border-b border-l border-r md:border-r-0 border-[var(--divider)]"
              showRightDivider={true}
            />
            {/* Row 2 - Right */}
            <Value
              number="04"
              category="Future"
              title="The Operating System"
              description="We're building the operating system for the autonomous drone workforce of the future."
              borderClasses="border-t border-b border-l border-r md:border-l-0 border-[var(--divider)]"
              showRightDivider={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

