export default function OverviewInsert() {
  return (
    <section className="relative w-full bg-[var(--bg-black)] border-y border-[var(--divider)]">
      <div className="container-main py-12 md:py-16">
        <div className="w-full">
          <div className="text-h3 text-[var(--text-primary)] mb-6">
            How point clouds become decisions
          </div>

          {/* Diagram-style pipeline (like the reference image) */}
          <div className="rounded-2xl border border-[var(--divider)] bg-[var(--surface-1)] px-6 py-8 md:px-8 md:py-10">
            <div className="grid grid-cols-1 md:grid-cols-9 gap-4 md:gap-6 items-stretch">
              {/* Stage 1 */}
              <div className="md:col-span-2 rounded-xl border border-[var(--divider)] bg-[var(--bg-black)] px-5 py-5">
                <div className="text-body-sm text-[var(--text-muted)] mb-2">Input</div>
                <div className="text-body-md text-[var(--text-primary)] font-medium mb-3">
                  Capture
                </div>
                <div className="text-body text-[var(--text-secondary)]">
                  Drone collects imagery and telemetry over a defined area.
                </div>
              </div>

              {/* Arrow */}
              <div className="md:col-span-1 flex items-center justify-center">
                <div className="w-full md:w-auto flex items-center justify-center">
                  <span className="text-[var(--text-muted)] text-[28px] leading-none">→</span>
                </div>
              </div>

              {/* Stage 2 */}
              <div className="md:col-span-2 rounded-xl border border-[var(--divider)] bg-[var(--bg-black)] px-5 py-5">
                <div className="text-body-sm text-[var(--text-muted)] mb-2">Processing</div>
                <div className="text-body-md text-[var(--text-primary)] font-medium mb-3">
                  Reconstruct
                </div>
                <div className="text-body text-[var(--text-secondary)]">
                  Convert captures into a 3D point cloud with depth and geometry.
                </div>
              </div>

              {/* Arrow */}
              <div className="md:col-span-1 flex items-center justify-center">
                <span className="text-[var(--text-muted)] text-[28px] leading-none">→</span>
              </div>

              {/* Stage 3 */}
              <div className="md:col-span-2 rounded-xl border border-[var(--divider)] bg-[var(--bg-black)] px-5 py-5">
                <div className="text-body-sm text-[var(--text-muted)] mb-2">Model</div>
                <div className="text-body-md text-[var(--text-primary)] font-medium mb-3">
                  Measure & detect
                </div>
                <div className="text-body text-[var(--text-secondary)]">
                  Compute metrics and changes (height, slope, volume, anomalies).
                </div>
              </div>

              {/* Arrow */}
              <div className="md:col-span-1 flex items-center justify-center">
                <span className="text-[var(--text-muted)] text-[28px] leading-none">→</span>
              </div>

              {/* Stage 4 */}
              <div className="md:col-span-2 rounded-xl border border-[var(--divider)] bg-[var(--bg-black)] px-5 py-5">
                <div className="text-body-sm text-[var(--text-muted)] mb-2">Output</div>
                <div className="text-body-md text-[var(--text-primary)] font-medium mb-3">
                  Action maps
                </div>
                <div className="text-body text-[var(--text-secondary)]">
                  Export prescriptions and geofenced tasks for equipment and teams.
                </div>
              </div>
            </div>
          </div>

          {/* Optional: small caption line */}
          <div className="text-body-sm text-[var(--text-muted)] mt-4">
            A consistent pipeline turns a one-off photo into measurable, reusable 3D intelligence.
          </div>
        </div>
      </div>
    </section>
  );
}


