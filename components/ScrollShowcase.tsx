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
    title: "Set Boundaries",
    description:
      "Define where work can and cannot happen. Create clear zones and permissions so operations stay within approved areas.",
    imageSrc: "/images/features/1.boundaries.png",
    imageAlt: "Define operational boundaries",
  },
  {
    label: "Plan",
    title: "Adapt to Conditions",
    description:
      "Account for weather, terrain, obstacles, and access so missions adjust to real conditions, not ideal ones.",
    imageSrc: "/images/features/2.weather.png",
    imageAlt: "Real-world flight conditions",
  },
  {
    label: "Plan",
    title: "Reuse Missions",
    description:
      "Create repeatable flight templates so data is collected the same way across locations and over time.",
    imageSrc: "/images/features/3.reusablemission.png",
    imageAlt: "Reusable missions",
  },
  // Analyze (3)
  {
    label: "Analyze",
    title: "Track Change",
    description:
      "Compare repeated scans to see growth, movement, or decline that single snapshots can’t reveal.",
    imageSrc: "/images/features/4.temporalchange.png",
    imageAlt: "Temporal change",
  },
  {
    label: "Analyze",
    title: "Send to Equipment",
    description:
      "Turn results into files that machinery can use to guide where and how work is done.",
    imageSrc: "/images/features/5.exportXIOMSL.png",
    imageAlt: "Export to machinery",
  },
  {
    label: "Analyze",
    title: "Track Assets",
    description:
      "Assign persistent IDs so assets can be located and monitored consistently over time.",
    imageSrc: "/images/features/6.permanetID.png",
    imageAlt: "Persistent asset IDs",
  },
  // Act (3)
  {
    label: "Act",
    title: "Automate Flights",
    description:
      "Schedule missions to run automatically, ensuring coverage happens on time without constant oversight.",
    imageSrc: "/images/features/7.setschedule.png",
    imageAlt: "Automated scheduling",
  },
  {
    label: "Act",
    title: "Simulate Routes",
    description:
      "Test routes in advance to reduce overlap, avoid restricted areas, and save time and resources.",
    imageSrc: "/images/features/8.learning.png",
    imageAlt: "Route simulation",
  },
  {
    label: "Act",
    title: "Generate Reports",
    description:
      "Automatically produce logs, summaries, and compliance documentation from each operation.",
    imageSrc: "/images/features/9.compliance.png",
    imageAlt: "Compliance and reporting",
  },
];

export default function ScrollShowcase({
  heading = (
    <>
      World&apos;s <span className="text-emerald-500">most advanced</span>
      <br />
      farm management platform
    </>
  ),
  subheading,
  items = DEFAULT_ITEMS,
}: {
  heading?: React.ReactNode;
  subheading?: string;
  items?: ShowcaseItem[];
}) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const [activeWithinGroup, setActiveWithinGroup] = useState(0);

  const [frameWidth, setFrameWidth] = useState(0);
  const [frameHeight, setFrameHeight] = useState(0);
  const [prevGroupIndex, setPrevGroupIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionAnimate, setTransitionAnimate] = useState(false);
  const [transitionDir, setTransitionDir] = useState<1 | -1>(1);

  // Layout constants (px). These ensure cards never look related across categories,
  // and that scaled cards don't get clipped by the viewport.
  const CARD_GAP_PX = 16; // tighter gaps so cards can be wider (3-up)
  const GROUP_SIDE_PADDING_PX = 16; // keep cards wide, still avoid edge clipping
  // Match the smaller reference cards: keep a large image area but don't let cards fill the whole stage.
  const TEXT_PANEL_H_PX = 160;
  const CARD_MAX_H_PX = 680;
  const ACTIVE_SCALE = 1.02;
  const INACTIVE_SCALE = 0.99;
  // When the active card scales up, we need a little extra breathing room so it never clips.
  const ACTIVE_CLIP_SAFETY_PX = 24;
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
    const compute = () => {
      const rect = el.getBoundingClientRect();
      setFrameWidth(rect.width);
      setFrameHeight(rect.height);
    };
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
      className="relative w-full grid-bg border-y border-[var(--divider)]"
      // Tall section to create scroll distance that advances across 9 cards.
      // Keep scrollytelling, but avoid a huge "dead" scroll gap before the next section.
      // Smaller multiplier = you progress through cards faster and reach Roadmap sooner.
      style={{ height: `calc(${Math.max(items.length, 1)} * 55vh)` }}
    >
      {/* Full-viewport pinned stage (like the reference). Scrolling the page advances steps. */}
      <div
        className="sticky flex items-start w-full"
        style={{ top: HEADER_HEIGHT_PX, height: `calc(100vh - ${HEADER_HEIGHT_PX}px)` }}
      >
        {/* Tighten vertical padding so cards can fill the stage like the reference */}
        {/* NOTE: Don't use `container-main` here — its CSS is defined after Tailwind and will override `max-w-*`.
           We want this section to be much wider (reference proportions). */}
        <div className="mx-auto w-full max-w-[1920px] h-full px-4 md:px-8 pt-2 pb-1 md:pt-3 md:pb-2">
          <div className="flex flex-col h-full">
            <div className="relative z-30 flex flex-col gap-2 pb-2 md:flex-row md:items-end md:justify-between">
              <div className="max-w-[680px]">
                <h2 className="text-h1 text-[var(--text-primary)]">{heading}</h2>
                {subheading ? (
                  <p className="text-body-lg text-[var(--text-secondary)] mt-3">
                    {subheading}
                  </p>
                ) : null}
              </div>

              {/* Pill nav (like the reference) */}
              <div className="flex items-center gap-2 bg-white border border-[var(--divider)] rounded-full p-1.5 w-fit md:-translate-y-[24px]">
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
                          ? "bg-emerald-500 text-white"
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
            <div className="flex-1 flex items-stretch min-h-0 pt-3 md:pt-3">
              <div
                ref={frameRef}
                className="mx-auto w-full flex-1 overflow-visible md:flex-none md:w-[71.428vw]"
                style={{
                  paddingLeft: GROUP_SIDE_PADDING_PX,
                  paddingRight: GROUP_SIDE_PADDING_PX,
                  paddingTop: 0,
                  paddingBottom: 0,
                  height: "100%",
                }}
              >
            {(() => {
              const usableW = frameWidth ? Math.max(1, frameWidth - GROUP_SIDE_PADDING_PX * 2) : 0;
              const cardW = usableW ? Math.floor((usableW - CARD_GAP_PX * 2) / 3) : undefined;
              const stageH = frameHeight || 0;
              // Keep the whole card within the pinned stage.
              // Use nearly the full available rail height (lets the 3 cards "take up the screen").
              const cardH = stageH
                ? Math.max(
                    540,
                    Math.min(CARD_MAX_H_PX, Math.floor(stageH - ACTIVE_CLIP_SAFETY_PX))
                  )
                : undefined;

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
                            "rounded-xl border bg-neutral-100 flex flex-col",
                            isActive ? "border-[var(--wheel-stroke)]" : "border-[var(--divider)]",
                            "transition-transform duration-300 ease-out",
                          ].join(" ")}
                          style={{
                            width: cardW ? `${cardW}px` : "33.333%",
                            height: cardH ? `${cardH}px` : undefined,
                            // Prevent bottom clipping when scaling the active card by growing upward.
                            transformOrigin: "center bottom",
                            transform: `scale(${isActive ? ACTIVE_SCALE : INACTIVE_SCALE})`,
                          }}
                        >
                          <div className="relative w-full flex-1 overflow-hidden rounded-t-xl bg-neutral-100">
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
                          <div className="p-6 shrink-0" style={{ height: TEXT_PANEL_H_PX }}>
                            {/* Keep titles on one line consistently */}
                            <div className="text-[20px] leading-[28px] md:text-[22px] md:leading-[30px] font-medium text-[var(--text-primary)] truncate">
                              {item.title}
                            </div>
                            <div className="text-body text-[var(--text-secondary)] mt-3 line-clamp-4">
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
                    height: cardH ? `${cardH}px` : "auto",
                    minHeight: cardH ? `${cardH}px` : 10,
                  }}
                >
                  {/* Preserve layout height */}
                  <div className="invisible flex gap-4">
                    {(groups[activeGroupIndex] ?? []).map((_, withinIdx) => (
                      <div
                        key={`sizer-${withinIdx}`}
                        className="rounded-xl"
                        style={{
                          width: cardW ? `${cardW}px` : "33.333%",
                          height: cardH ? `${cardH}px` : undefined,
                        }}
                      >
                        {/* Match the live card proportions for stable layout height */}
                        <div className="w-full flex-1" />
                        <div className="p-6 shrink-0" style={{ height: TEXT_PANEL_H_PX }}>
                          <div className="text-[18px] leading-[26px] font-medium">Sizer</div>
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


