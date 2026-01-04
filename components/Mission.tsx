export default function Mission() {
  return (
    <section className="relative border-y border-[var(--divider)]">
      {/* Full-screen panel: intro paragraph above, images, then two paragraphs below */}
      <div className="mx-auto w-full max-w-[1920px] px-6 md:px-10">
        <div className="min-h-[calc(100vh-64px)] py-12 md:py-16 flex flex-col gap-8">
          {/* Top: paragraph 1 */}
          <div className="rounded-2xl border border-[var(--divider)] bg-[var(--surface-1)] px-8 py-8 md:px-10 md:py-10">
            <p className="text-body-md text-[var(--text-secondary)]">
              A single photo or human observation captures what something looks like from one
              angle, at one moment in time. A point cloud captures the full structure of an
              environment in three dimensions, recording depth, height, and precise spatial
              position across the entire scene rather than a single viewpoint.
            </p>
          </div>

          {/* Middle: two images spanning the page */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 flex-1 items-stretch">
            <div className="rounded-2xl border border-[var(--divider)] overflow-hidden bg-[var(--surface-1)] min-h-[280px] md:min-h-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/islandphoto.png"
                alt="Island photo"
                className="block w-full h-full object-cover"
              />
            </div>
            <div className="rounded-2xl border border-[var(--divider)] overflow-hidden bg-[var(--surface-1)] min-h-[280px] md:min-h-0">
              {/* Keep <img> for animated GIF */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/island_gif~1.gif"
                alt="Island point cloud"
                className="block w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Bottom: paragraphs 2–3 */}
          <div className="rounded-2xl border border-[var(--divider)] bg-[var(--surface-1)] px-8 py-8 md:px-10 md:py-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <p className="text-body-md text-[var(--text-secondary)]">
                Because every point exists in 3D space, the environment becomes directly
                measurable. Distances, volumes, canopy height, slope, spacing, and terrain variation
                can be calculated rather than estimated by eye. This turns the physical world into
                structured data that can be queried, compared, and reused, instead of a static image
                that must be reinterpreted each time it is viewed.
              </p>
              <p className="text-body-md text-[var(--text-secondary)]">
                Point clouds also allow change to be analyzed over time by aligning scans collected
                on different dates. Growth, loss, movement, or deformation can be detected with
                precision that photos or human observation cannot reliably achieve. Unlike visual
                inspection, which varies by person, lighting, and angle, point clouds provide a
                consistent, objective record that software can analyze the same way across scans and
                across seasons.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

