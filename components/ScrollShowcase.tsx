"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type ShowcaseItem = {
  /** Short label shown in the pill nav (e.g. Plan / Analyze / Act) */
  label: string;
  /** Title shown in the step */
  title: string;
  /** Supporting text shown in the step */
  description: string;
  /** Optional image to display for this step */
  imageSrc?: string;
  imageAlt?: string;
};

const HEADER_HEIGHT_PX = 64;

const DEFAULT_ITEMS: ShowcaseItem[] = [
  // Plan (3)
  {
    label: "Plan",
    title: "Define operational boundaries and restricted areas",
    description:
      "Set clear geographic limits for where work can and cannot happen, including exclusion zones, permissions, and areas of interest that guide all operations.",
    imageSrc: "/images/platformoverview/spatialscope.png",
    imageAlt: "Spatial Scope",
  },
  {
    label: "Plan",
    title: "Account for real-world context like weather, terrain, and access",
    description:
      "Incorporate environmental and operational conditions to understand feasibility, data quality, and risk before and during execution.",
    imageSrc: "/images/platformoverview/assertregistry.png",
    imageAlt: "Asset Registry",
  },
  {
    label: "Plan",
    title: "Design reusable missions and data-collection workflows",
    description:
      "Create repeatable templates that define how data is collected, which sensors are used, and what rules or constraints apply, ensuring consistency across missions.",
    imageSrc: "/images/platformoverview/missiondesign.png",
    imageAlt: "Mission Design",
  },
  // Analyze (3)
  {
    label: "Analyze",
    title: "Detect change over time across repeated scans",
    description:
      "Compare data from different points in time to reveal movement, growth, degradation, or other meaningful changes that would be hard to detect manually.",
    imageSrc: "/images/platformoverview/temporalchange.png",
    imageAlt: "Temporal Change Analysis",
  },
  {
    label: "Analyze",
    title: "Assess condition, health, and risk",
    description:
      "Evaluate the current state of land, structures, or assets using derived indicators that highlight stress, deterioration, or potential failure.",
    imageSrc: "/images/platformoverview/conditionintelligence.png",
    imageAlt: "Condition Intelligence",
  },
  {
    label: "Analyze",
    title: "Maintain an inventory of assets",
    description:
      "Assets are given persistent IDs and linked to exact locations, making it possible to locate them and see when they were last observed.",
    imageSrc: "/images/platformoverview/operationalcontext.png",
    imageAlt: "Operational Context",
  },
  // Act (3)
  {
    label: "Act",
    title: "Generate and prioritize recommended actions",
    description:
      "Translate insights into clear, location-specific actions such as inspections, maintenance, or follow-ups, ranked by urgency and impact.",
    imageSrc: "/images/platformoverview/actionplanning.png",
    imageAlt: "Action Planning",
  },
  {
    label: "Act",
    title: "Learn from outcomes to improve future decisions and plans",
    description:
      "Use results and feedback from completed actions to refine recommendations, improve planning, and continuously improve performance over time.",
    imageSrc: "/images/platformoverview/executionmanagement.png",
    imageAlt: "Execution Management",
  },
  {
    label: "Act",
    title: "Compliance & Reporting",
    description:
      "Generate regulatory, operational, and client-facing documentation including flight logs, audit records, and inspection reports.",
    imageSrc: "/images/platformoverview/compliancereporting.png",
    imageAlt: "Compliance & Reporting",
  },
];

export default function ScrollShowcase({
  heading = "Features",
  subheading,
  items = DEFAULT_ITEMS,
}: {
  heading?: string;
  subheading?: string;
  items?: ShowcaseItem[];
}) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const [activeWithinGroup, setActiveWithinGroup] = useState(0);

  const [frameWidth, setFrameWidth] = useState(0);
  const [prevGroupIndex, setPrevGroupIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionAnimate, setTransitionAnimate] = useState(false);
  const [transitionDir, setTransitionDir] = useState<1 | -1>(1);

  // Layout constants (px). These ensure cards never look related across categories,
  // and that scaled cards don't get clipped by the viewport.
  const CARD_GAP_PX = 16; // tighter gaps so cards can be wider (3-up)
  const GROUP_SIDE_PADDING_PX = 16; // keep cards wide, still avoid edge clipping
  const CATEGORY_TRANSITION_MS = 420;
  const CATEGORY_TRANSITION_PX = 44;
  const CATEGORY_TRANSITION_BLUR_PX = 6;
  const CATEGORY_TRANSITION_SCALE = 0.985;

  const activeItem = useMemo(
    () => items[Math.min(Math.max(activeIndex, 0), items.length - 1)],
    [activeIndex, items]
  );

  const activeCategory = useMemo(() => {
    const label = activeItem?.label ?? "Plan";
    return label;
  }, [activeItem]);

  const groups = useMemo(() => {
    const out: ShowcaseItem[][] = [];
    for (let i = 0; i < items.length; i += 3) out.push(items.slice(i, i + 3));
    return out;
  }, [items]);

  // Measure the visible frame width so each group can be exactly one "page"
  // (prevents half-cards at rest).
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const compute = () => setFrameWidth(el.getBoundingClientRect().width);
    compute();
    const ro = new ResizeObserver(() => compute());
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Scroll-driven active index + group translation.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let raf = 0;

    const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const viewportH = (window.innerHeight || 1) - HEADER_HEIGHT_PX;

        // We map vertical scroll progress over the section to [0..1].
        // Section is tall so you can scroll through each card.
        const scrollable = Math.max(1, section.offsetHeight - viewportH);
        const progressed = clamp((-rect.top) / scrollable, 0, 1);

        const stepFloat = progressed * (items.length - 1); // 0..8
        // Keep the current card stable for longer; only switch "active" near the midpoints.
        const nextIndex = Math.floor(stepFloat + 0.5);
        if (nextIndex !== activeIndex) setActiveIndex(nextIndex);

        const nextGroup = Math.floor(nextIndex / 3);
        const nextWithin = nextIndex % 3;
        if (nextGroup !== activeGroupIndex) {
          setPrevGroupIndex(activeGroupIndex);
          setTransitionDir(nextGroup > activeGroupIndex ? 1 : -1);
          setIsTransitioning(true);
          setTransitionAnimate(false);
          setActiveGroupIndex(nextGroup);
          // Kick animation on next frame so CSS transitions have a "from" state.
          requestAnimationFrame(() => setTransitionAnimate(true));
          window.setTimeout(() => {
            setIsTransitioning(false);
            setTransitionAnimate(false);
            setPrevGroupIndex(null);
          }, CATEGORY_TRANSITION_MS);
        }
        if (nextWithin !== activeWithinGroup) setActiveWithinGroup(nextWithin);

        // No horizontal intermediate translation: we swap categories via an overlay transition
        // (prevents two categories being visible side-by-side when scrolling slowly).
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length, frameWidth, groups.length, activeIndex, activeGroupIndex, activeWithinGroup]);

  const scrollToCategory = (label: "Plan" | "Analyze" | "Act") => {
    const startIndex = label === "Plan" ? 0 : label === "Analyze" ? 3 : 6;
    const section = sectionRef.current;
    if (!section) return;

    const viewportH = (window.innerHeight || 1) - HEADER_HEIGHT_PX;
    const scrollable = Math.max(1, section.offsetHeight - viewportH);
    const targetProgress = startIndex / Math.max(1, items.length - 1);
    const targetY = window.scrollY + section.getBoundingClientRect().top + targetProgress * scrollable;
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[var(--bg-black)] border-y border-[var(--divider)]"
      // Tall section to create scroll distance that advances across 9 cards.
      style={{ height: `calc(${Math.max(items.length, 1)} * 90vh)` }}
    >
      {/* Full-viewport pinned stage (like the reference). Scrolling the page advances steps. */}
      <div
        className="sticky flex items-start"
        style={{ top: HEADER_HEIGHT_PX, height: `calc(100vh - ${HEADER_HEIGHT_PX}px)` }}
      >
        <div className="container-main max-w-[1680px] w-full py-6 md:py-8">
          <div className="flex flex-col h-full">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-[680px]">
                <h2 className="text-h1 text-[var(--text-primary)]">{heading}</h2>
                {subheading ? (
                  <p className="text-body-lg text-[var(--text-secondary)] mt-3">
                    {subheading}
                  </p>
                ) : null}
              </div>

              {/* Pill nav (like the reference) */}
              <div className="flex items-center gap-2 bg-white/5 border border-[var(--divider)] rounded-full p-1.5 w-fit">
                {(["Plan", "Analyze", "Act"] as const).map((label) => {
                  const isActive = activeCategory === label;
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => scrollToCategory(label)}
                      className={[
                        "px-6 py-3 rounded-full text-body-sm font-medium transition-colors",
                        isActive
                          ? "bg-white text-[var(--text-dark)]"
                          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
                      ].join(" ")}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Horizontal scrollytelling track (3-up pages) */}
            <div className="flex-1 flex items-start pt-6 md:pt-8">
              <div
                ref={frameRef}
                className="w-screen overflow-x-hidden overflow-y-visible"
                style={{
                  // Full-bleed row so each card can be significantly wider.
                  marginLeft: "calc(50% - 50vw)",
                  marginRight: "calc(50% - 50vw)",
                  paddingLeft: GROUP_SIDE_PADDING_PX,
                  paddingRight: GROUP_SIDE_PADDING_PX,
                  paddingTop: 12,
                  paddingBottom: 12,
                }}
              >
            {(() => {
              const usableW = frameWidth ? Math.max(1, frameWidth - GROUP_SIDE_PADDING_PX * 2) : 0;
              const cardW = usableW ? Math.floor((usableW - CARD_GAP_PX * 2) / 3) : undefined;

              const enterFrom = transitionDir === 1 ? CATEGORY_TRANSITION_PX : -CATEGORY_TRANSITION_PX;
              const exitTo = transitionDir === 1 ? -CATEGORY_TRANSITION_PX : CATEGORY_TRANSITION_PX;

              const renderGroup = (
                gIdx: number,
                opts: {
                  opacity: number;
                  offsetX: number;
                  zIndex: number;
                  mode: "current" | "prev";
                  blurPx: number;
                  scale: number;
                }
              ) => {
                const group = groups[gIdx] ?? [];
                const isPrev = opts.mode === "prev";

                return (
                  <div
                    key={`${opts.mode}-group-${gIdx}`}
                    className="absolute inset-0 flex"
                    style={{
                      width: usableW ? `${usableW}px` : "100%",
                      left: "50%",
                      transform: `translateX(-50%) translateX(${opts.offsetX}px) scale(${opts.scale})`,
                      opacity: opts.opacity,
                      zIndex: opts.zIndex,
                      filter: `blur(${opts.blurPx}px)`,
                      transition: `opacity ${CATEGORY_TRANSITION_MS}ms cubic-bezier(.2,.8,.2,1), transform ${CATEGORY_TRANSITION_MS}ms cubic-bezier(.2,.8,.2,1), filter ${CATEGORY_TRANSITION_MS}ms cubic-bezier(.2,.8,.2,1)`,
                      pointerEvents: isPrev ? "none" : "auto",
                    }}
                  >
                    <div className="flex gap-4 w-full">
                    {group.map((item, withinIdx) => {
                      const isActive =
                        !isPrev &&
                        gIdx === activeGroupIndex &&
                        withinIdx === activeWithinGroup;
                      return (
                        <div
                          key={`${item.label}-${gIdx}-${withinIdx}-${opts.mode}`}
                          className={[
                            // NOTE: don't clip the whole card — only clip the image area —
                            // so longer descriptions never get cut off.
                            "rounded-xl border bg-white/5 flex flex-col",
                            isActive ? "border-white/25" : "border-[var(--divider)]",
                            "transition-transform duration-300 ease-out",
                          ].join(" ")}
                          style={{
                            width: cardW ? `${cardW}px` : "33.333%",
                            transform: `scale(${isActive ? 1.03 : 0.99})`,
                          }}
                        >
                          <div className="relative w-full aspect-[16/9] overflow-hidden rounded-t-xl bg-white">
                            {item.imageSrc ? (
                              <Image
                                src={item.imageSrc}
                                alt={item.imageAlt ?? item.title}
                                fill
                                sizes="(min-width: 1024px) 33vw, 90vw"
                                className="object-contain"
                                priority={gIdx === 0 && withinIdx === 0}
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-body-sm text-[var(--text-muted)]">
                                  Image placeholder
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="p-6 flex-1">
                            {/* Keep titles on one line consistently */}
                            <div className="text-[20px] leading-[28px] font-medium text-[var(--text-primary)] truncate">
                              {item.title}
                            </div>
                            <div className="text-body text-[var(--text-secondary)] mt-3">
                              {item.description}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    </div>
                  </div>
                );
              };

              return (
                <div
                  className="relative"
                  style={{
                    height: "auto",
                    minHeight: 10,
                  }}
                >
                  {/* Preserve layout height */}
                  <div className="invisible flex gap-4">
                    {(groups[activeGroupIndex] ?? []).map((_, withinIdx) => (
                      <div
                        key={`sizer-${withinIdx}`}
                        className="rounded-xl"
                        style={{ width: cardW ? `${cardW}px` : "33.333%" }}
                      >
                        {/* Match the live card proportions for stable layout height */}
                        <div className="w-full aspect-[16/9]" />
                        <div className="p-6">
                          <div className="text-[20px] leading-[28px] font-medium">Sizer</div>
                          <div className="text-body mt-3">Sizer line</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Outgoing group (overlaid, fades/slides out) */}
                  {isTransitioning &&
                    prevGroupIndex !== null &&
                    renderGroup(prevGroupIndex, {
                      mode: "prev",
                      zIndex: 2,
                      opacity: transitionAnimate ? 0 : 1,
                      offsetX: transitionAnimate ? exitTo : 0,
                      blurPx: transitionAnimate ? CATEGORY_TRANSITION_BLUR_PX : 0,
                      scale: transitionAnimate ? CATEGORY_TRANSITION_SCALE : 1,
                    })}

                  {/* Incoming/current group (centered, fades/slides in) */}
                  {renderGroup(activeGroupIndex, {
                    mode: "current",
                    zIndex: isTransitioning ? 3 : 1,
                    opacity: isTransitioning ? (transitionAnimate ? 1 : 0) : 1,
                    offsetX: isTransitioning ? (transitionAnimate ? 0 : enterFrom) : 0,
                    blurPx: isTransitioning ? (transitionAnimate ? 0 : CATEGORY_TRANSITION_BLUR_PX) : 0,
                    scale: isTransitioning ? (transitionAnimate ? 1 : CATEGORY_TRANSITION_SCALE) : 1,
                  })}
                </div>
              );
            })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


