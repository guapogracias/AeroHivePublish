"use client";

import { useMemo, useState } from "react";

type WheelNode = {
  id: string;
  label: string;
  /** Children are rendered as the next wheel when this segment is clicked. */
  children?: WheelNode[];
  /** Image used to texture the wedge. */
  imageSrc?: string;
  imageAlt?: string;
  /** Optional body copy for this node. */
  body?: string;
  /** Media configuration; supports image or video (uses poster/first frame for fill). */
  media?: {
    type: "image" | "video";
    src: string; // for video, this is the video URL; for image, the image URL.
    poster?: string; // used for video preview; if absent, falls back to src.
    alt?: string;
  };
  /** When true, this segment is disabled and shows a "Coming Soon" overlay. */
  disabled?: boolean;
};

const WHEEL_FONT = "var(--font-sans)";

// Placeholder structure — replace labels/counts with your real application taxonomy.
const DEFAULT_TREE: WheelNode = {
  id: "root",
  label: "",
  children: [
    {
      id: "seg-1",
      label: "Agriculture",
      imageSrc: "/images/applicationwheel/parentwheel/agriculture.png",
      children: [
        { id: "seg-1-a", label: "Blueberries", imageSrc: "/images/applicationwheel/childagriculture/blueberries.png", disabled: true },
        { id: "seg-1-b", label: "Cherries", imageSrc: "/images/applicationwheel/childagriculture/cherries.png" },
        { id: "seg-1-c", label: "Coming Soon", imageSrc: "/images/applicationwheel/childagriculture/corn.png" },
        { id: "seg-1-d", label: "Coming Soon", imageSrc: "/images/applicationwheel/childagriculture/grapes.png" },
        { id: "seg-1-e", label: "Coming Soon", imageSrc: "/images/applicationwheel/childagriculture/oranges.png" },
        { id: "seg-1-f", label: "Coming Soon", imageSrc: "/images/applicationwheel/childagriculture/tomatoes.png" },
        { id: "seg-1-g", label: "Coming Soon", imageSrc: "/images/applicationwheel/childagriculture/almonds.png" },
        { id: "seg-1-h", label: "Coming Soon", imageSrc: "/images/applicationwheel/childagriculture/apples.png" },
      ],
    },
    {
      id: "seg-2",
      label: "Segment 2",
      imageSrc: "/images/applicationwheel/parentwheel/construction.png",
      disabled: true,
      children: [],
    },
    {
      id: "seg-3",
      label: "Segment 3",
      imageSrc: "/images/applicationwheel/parentwheel/disaster.png",
      disabled: true,
      children: [],
    },
    {
      id: "seg-4",
      label: "Segment 4",
      imageSrc: "/images/applicationwheel/parentwheel/electric.png",
      disabled: true,
      children: [],
    },
    {
      id: "seg-5",
      label: "Segment 5",
      imageSrc: "/images/applicationwheel/parentwheel/fence.png",
      disabled: true,
      children: [],
    },
    {
      id: "seg-6",
      label: "Segment 6",
      imageSrc: "/images/applicationwheel/parentwheel/pipeline.png",
      disabled: true,
      children: [],
    },
    {
      id: "seg-7",
      label: "Segment 7",
      imageSrc: "/images/applicationwheel/parentwheel/roof.png",
      disabled: true,
      children: [],
    },
    {
      id: "seg-8",
      label: "Segment 8",
      imageSrc: "/images/applicationwheel/parentwheel/tracking.png",
      disabled: true,
      children: [],
    },
  ],
};

function polarToCartesian(cx: number, cy: number, r: number, angleRad: number) {
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

function fmt(n: number) {
  // Prevent SSR/CSR float drift causing hydration mismatches.
  // 3 decimals is more than enough precision for our UI.
  return n.toFixed(3);
}

function donutWedgePath(opts: {
  cx: number;
  cy: number;
  rOuter: number;
  rInner: number;
  startAngle: number; // radians
  endAngle: number; // radians
}) {
  const { cx, cy, rOuter, rInner, startAngle, endAngle } = opts;

  const p1 = polarToCartesian(cx, cy, rOuter, startAngle);
  const p2 = polarToCartesian(cx, cy, rOuter, endAngle);
  const p3 = polarToCartesian(cx, cy, rInner, endAngle);
  const p4 = polarToCartesian(cx, cy, rInner, startAngle);

  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

  // Outer arc (p1 -> p2), line to inner arc start (p3), inner arc back (p3 -> p4), close.
  return [
    `M ${fmt(p1.x)} ${fmt(p1.y)}`,
    `A ${fmt(rOuter)} ${fmt(rOuter)} 0 ${largeArc} 1 ${fmt(p2.x)} ${fmt(p2.y)}`,
    `L ${fmt(p3.x)} ${fmt(p3.y)}`,
    `A ${fmt(rInner)} ${fmt(rInner)} 0 ${largeArc} 0 ${fmt(p4.x)} ${fmt(p4.y)}`,
    "Z",
  ].join(" ");
}

function BackArrowIcon({ className }: { className?: string }) {
  // Simple left-turn arrow (inline SVG), similar to your provided reference.
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M26 20 L14 32 L26 44"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 32 H38 C48 32 54 26 54 18"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ApplicationWheel({
  tree = DEFAULT_TREE,
}: {
  tree?: WheelNode;
}) {
  const [path, setPath] = useState<WheelNode[]>([tree]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showCherryModal, setShowCherryModal] = useState(false);

  const node = path[path.length - 1];
  const segments = node.children ?? [];
  const canGoBack = path.length > 1;
  const isRoot = path.length === 1;

  const geometry = useMemo(() => {
    const size = 760;
    const cx = size / 2;
    const cy = size / 2;
    const rOuter = 330;
    const rInner = 150;
    const centerR = 120;
    return { size, cx, cy, rOuter, rInner, centerR };
  }, []);

  const onSegmentClick = (seg: WheelNode) => {
    if (seg.id === "seg-1-b") {
      setShowCherryModal(true);
      return;
    }
    if (seg.children && seg.children.length > 0) {
      setPath((prev) => [...prev, seg]);
    }
  };

  const onBack = () => setPath((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));

  return (
    <div className="w-full flex flex-col items-center justify-center py-10">
      <div className="w-full max-w-[900px] px-4 flex flex-col items-center gap-6">
        {/* Intentionally no title; parent instructions live in the center of the wheel */}

        <div className="w-full flex items-center justify-center">
          <svg
            width="100%"
            viewBox={`0 0 ${geometry.size} ${geometry.size}`}
            className="max-w-[900px]"
            style={{ fontFamily: WHEEL_FONT }}
            role="img"
            aria-label="Application navigation wheel"
          >
            <defs>
              {segments.map((seg) => {
                // Choose an image to use for the pattern (supports media.image or media.video via poster).
                const patternSrc =
                  seg.media?.type === "image"
                    ? seg.media.src
                    : seg.media?.type === "video"
                      ? seg.media.poster || seg.media.src
                      : seg.imageSrc;

                return (
                <pattern
                  key={`pat-${seg.id}`}
                  id={`pat-${seg.id}`}
                  patternUnits="objectBoundingBox"
                  patternContentUnits="objectBoundingBox"
                  width="1"
                  height="1"
                >
                  {patternSrc ? (
                    <image
                      href={patternSrc}
                      xlinkHref={patternSrc}
                      x="0"
                      y="0"
                      width="1"
                      height="1"
                      preserveAspectRatio="xMidYMid slice"
                    />
                  ) : (
                    <rect x="0" y="0" width="1" height="1" fill="var(--wheel-fill)" />
                  )}
                </pattern>
              );
              })}
            </defs>

            {/* Ring segments */}
            {segments.map((seg, i) => {
              const n = segments.length || 1;
              const gap = 0.06; // radians (visual separation)
              const full = (Math.PI * 2) / n;
              const start = i * full + gap / 2 - Math.PI / 2;
              const end = (i + 1) * full - gap / 2 - Math.PI / 2;
              const mid = (start + end) / 2;
              const midR = (geometry.rOuter + geometry.rInner) / 2;
              // Round to avoid SSR/CSR float drift that can cause hydration mismatches.
              const labelX = Number(fmt(geometry.cx + midR * Math.cos(mid)));
              const labelY = Number(fmt(geometry.cy + midR * Math.sin(mid)));

              const d = donutWedgePath({
                cx: geometry.cx,
                cy: geometry.cy,
                rOuter: geometry.rOuter,
                rInner: geometry.rInner,
                startAngle: start,
                endAngle: end,
              });

              const isHovered = hoveredId === seg.id;
              const isDisabled = !!seg.disabled;
              const isClickable = !isDisabled && !!(seg.children && seg.children.length > 0);

              return (
                <g key={seg.id}>
                  <path
                    d={d}
                    fill={
                      seg.imageSrc || seg.media
                        ? `url(#pat-${seg.id})`
                        : "var(--wheel-fill)"
                    }
                    stroke="var(--wheel-stroke)"
                    strokeWidth={isHovered && !seg.disabled ? 3 : 2}
                    strokeLinejoin="round"
                    paintOrder="stroke"
                    style={{ cursor: isClickable ? "pointer" : "default" }}
                    onMouseEnter={() => setHoveredId(seg.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => {
                      if (!seg.disabled) onSegmentClick(seg);
                    }}
                    opacity={isDisabled ? 0.9 : 1}
                  />
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="18"
                    fontFamily={WHEEL_FONT}
                    fontWeight={700}
                    fill="#fff"
                    transform={`rotate(${(mid * 180) / Math.PI + 90} ${labelX} ${labelY})`}
                  >
                    {seg.disabled ? "Coming Soon" : seg.label}
                  </text>
                </g>
              );
            })}

            {/* Center button */}
            {isRoot ? (
              <>
                <text
                  x={geometry.cx}
                  y={geometry.cy - 4}
                  textAnchor="middle"
                  fontSize="16"
                  fontFamily={WHEEL_FONT}
                  fill="var(--wheel-text)"
                >
                  Select a segment
                </text>
                <text
                  x={geometry.cx}
                  y={geometry.cy + 18}
                  textAnchor="middle"
                  fontSize="16"
                  fontFamily={WHEEL_FONT}
                  fill="var(--wheel-text)"
                >
                  to explore.
                </text>
              </>
            ) : (
              <g>
                <circle
                  cx={geometry.cx}
                  cy={geometry.cy}
                  r={geometry.centerR}
                  fill="var(--wheel-fill)"
                  stroke="var(--wheel-stroke)"
                  strokeWidth="1"
                  style={{ cursor: canGoBack ? "pointer" : "default" }}
                  onClick={canGoBack ? onBack : undefined}
                />
                <foreignObject
                  x={geometry.cx - 44}
                  y={geometry.cy - 44}
                  width={88}
                  height={88}
                  style={{ pointerEvents: "none" }}
                >
                  <div className="w-full h-full flex items-center justify-center text-[var(--text-primary)]">
                    <BackArrowIcon className="w-12 h-12" />
                  </div>
                </foreignObject>
              </g>
            )}
          </svg>
        </div>

            {/* Optional: label list for accessibility and quick testing */}
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-2">
          {segments.map((seg) => (
            <button
              key={`${node.id}-${seg.id}`}
              type="button"
              onClick={() => {
                if (!seg.disabled) onSegmentClick(seg);
              }}
              className="text-left rounded-lg border border-[var(--divider)] bg-white/5 px-3 py-2 text-body-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              style={{
                opacity: seg.disabled ? 0.5 : 1,
                cursor: seg.disabled ? "default" : "pointer",
              }}
              disabled={seg.disabled}
            >
              {seg.label}
              {seg.children?.length ? (
                <span className="text-[var(--text-muted)]">{" "}({seg.children.length})</span>
              ) : null}
              {seg.disabled ? (
                <span className="block text-[var(--text-muted)]">Coming Soon</span>
              ) : null}
            </button>
          ))}
        </div>
      </div>
      {showCherryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative bg-[var(--bg-primary)] text-[var(--text-primary)] rounded-2xl shadow-2xl border border-[var(--divider)] max-w-lg w-[90%] p-6">
            <button
              onClick={() => setShowCherryModal(false)}
              className="absolute top-3 right-3 text-sm px-3 py-1 rounded-md bg-[var(--bg-muted)] text-[var(--text-primary)] border border-[var(--divider)] hover:bg-[var(--bg-hover)] transition"
            >
              Back
            </button>
            <h3 className="text-xl font-semibold mb-3">Cherries</h3>
            <div className="space-y-3 text-sm leading-relaxed text-[var(--text-secondary)] max-h-[60vh] overflow-auto pr-1">
              <p>
                Michigan produces roughly 70% of the United States’ tart cherries, making it the backbone of domestic cherry supply.
                Cherry orchards are perennial, capital-intensive assets that take years to establish and only generate value if disease
                and weather risks are managed precisely. In recent seasons, growers have faced rising pressure from weather-driven disease,
                higher labor costs, and tighter margins. USDA forecasts indicate that up to 40% of cherry yields can be lost in a single year
                due to weather-borne disease, making cherries one of the highest-risk specialty crops in U.S. agriculture.
              </p>
              <p className="font-semibold text-[var(--text-primary)]">The Problem on the Ground</p>
              <p>
                Michigan cherry growers already have machinery, sprayers, and satellite imagery. What they lack is a reliable way to understand
                where disease begins, how it spreads, and whether past treatments actually worked. Current practices rely on slow and subjective
                manual scouting, satellite imagery that is too coarse and infrequent, and blanket spraying that wastes inputs while still missing
                disease hotspots. The result is higher costs, environmental damage, and late discovery of problems that can impact multiple future
                seasons. The core issue is not execution, but lack of accounting.
              </p>
              <p className="font-semibold text-[var(--text-primary)]">Introducing Aerial Accounting to the Orchard</p>
              <p>
                AeroHive treats the orchard as a system that can be measured, recorded, and reconciled over time. Autonomous drone flights repeatedly
                survey the same cherry blocks at tree-level resolution. Each flight updates a spatial record of tree locations, canopy structure, and
                areas of stress or disease, along with how those conditions change after weather events or treatment. Instead of isolated snapshots,
                growers gain a living record of the orchard, allowing the system to distinguish normal seasonal variation from abnormal change that
                signals risk.
              </p>
              <p className="font-semibold text-[var(--text-primary)]">What Changes for the Grower</p>
              <p>
                With AeroHive, orchard management shifts from reactive to predictive. After major weather events, drones can quickly reassess conditions.
                AI compares new data against historical baselines to highlight emerging disease risk earlier than traditional methods. Rather than spraying
                entire blocks, AeroHive generates precise treatment zones that guide aerial or ground equipment, reducing chemical use while improving
                effectiveness. Over time, growers can see which areas repeatedly develop disease, which interventions reduced loss, and how canopy changes
                relate to yield outcomes. This turns orchard management from guesswork into a measurable process.
              </p>
              <p className="font-semibold text-[var(--text-primary)]">Economic Impact</p>
              <p>
                The U.S. cherry industry is valued at approximately $19.7B across roughly 100,000 acres. Even within cherries alone, AeroHive’s pricing
                model, reduced pesticide waste, and avoided yield loss represent a multi-million-dollar annual opportunity. For individual growers, the value
                is clear: fewer missed disease outbreaks, lower input costs, better documentation of decisions, and stronger long-term orchard health.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


