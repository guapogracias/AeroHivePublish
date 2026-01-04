import ImageCompareSlider from "./ImageCompareSlider";

export default function Mission() {
  return (
    <section className="relative border-y border-[var(--divider)]">
      {/* Full-screen panel: intro paragraph above, images, then two paragraphs below */}
      <div className="mx-auto w-full max-w-[1920px] px-6 md:px-10">
        {/* Don't force a full-viewport height — it creates a large blank gap before the next section. */}
        <div className="py-12 md:py-16 flex flex-col gap-8">
          {/* Title + byline above the slider */}
          <div className="text-center">
            <div className="text-h1 text-[var(--text-primary)]">Single Photo vs Point Cloud</div>
            <div className="text-body-lg text-[var(--text-secondary)] mt-3">
              One captures what you see. The other captures everything that exists.
            </div>
          </div>

          {/* Slider comparison (overlap photo + point cloud) */}
          {/* Wider side columns so the text reads parallel to the compare area */}
          <div className="grid grid-cols-1 md:grid-cols-[1.6fr_3fr_1.6fr] gap-6 md:gap-8 items-stretch">
            {/* Left text column (placeholder for now) */}
            <div className="order-2 md:order-1">
              <p className="text-body-lg text-[var(--text-secondary)]">
                Because a point cloud captures structure rather than appearance, the environment
                becomes something that can be measured instead of merely viewed. Distances, volumes,
                canopy height, slope, spacing, and terrain variation can be calculated directly,
                removing the need for visual estimation or manual interpretation.
              </p>
            </div>

            {/* Center feature (60% on desktop) */}
            <div className="order-1 md:order-2">
              <ImageCompareSlider
                leftLabel="Single Photo"
                rightLabel="Point Cloud"
                leftImageSrc="/images/islandphoto.png"
                rightImageSrc="/images/island_gif~1.gif"
                initial={0.6}
                // Crop out the black bars by zooming the GIF slightly.
                rightImageStyle={{
                  transform: "scale(1.18) translateY(-2%)",
                  transformOrigin: "center",
                }}
                // Apply the same crop to the photo so both layers align.
                leftImageStyle={{
                  transform: "scale(1.18) translateY(-2%)",
                  transformOrigin: "center",
                }}
              />
            </div>

            {/* Right text column (placeholder for now) */}
            <div className="order-3">
              <p className="text-body-lg text-[var(--text-secondary)]">
                That same structural record makes change detectable over time. By aligning scans
                collected on different dates, growth, loss, movement, or deformation can be
                identified with precision that photos or human observation cannot reliably achieve,
                producing a consistent and objective representation that software can analyze the
                same way across locations and seasons.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

