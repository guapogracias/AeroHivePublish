"use client";

import { useEffect, useMemo, useRef, useState } from "react";

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export default function ImageCompareSlider({
  leftLabel = "Single Photo",
  rightLabel = "Point Cloud",
  leftImageSrc,
  rightImageSrc,
  leftImageStyle,
  rightImageStyle,
  initial = 0.6,
}: {
  leftLabel?: string;
  rightLabel?: string;
  leftImageSrc: string;
  rightImageSrc: string;
  /** Optional style overrides for the left image (e.g. to match a crop/zoom) */
  leftImageStyle?: React.CSSProperties;
  /** Optional style overrides for the right image (e.g. to crop black bars) */
  rightImageStyle?: React.CSSProperties;
  /** 0..1, position of divider from left */
  initial?: number;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  // Keep the divider away from the edges so it never visually collides with adjacent columns.
  // Also keep it away from the top-right/left pills so it never intersects those bubbles.
  const MIN = 0.18;
  const MAX = 0.82;
  const [value, setValue] = useState(() => clamp(initial, MIN, MAX));
  const [dragging, setDragging] = useState(false);

  const clipStyle = useMemo(() => {
    const pct = clamp(value, 0, 1) * 100;
    // Show left image only up to divider (left side visible).
    return { clipPath: `inset(0 ${100 - pct}% 0 0)` } as React.CSSProperties;
  }, [value]);

  useEffect(() => {
    const onUp = () => setDragging(false);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: PointerEvent) => {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const next = (e.clientX - r.left) / Math.max(1, r.width);
      setValue(clamp(next, MIN, MAX));
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [dragging]);

  return (
    <div
      ref={wrapRef}
      className="relative w-full rounded-2xl border border-[var(--divider)] overflow-hidden bg-[var(--surface-1)]"
      style={{
        height: "min(62vh, 680px)",
        minHeight: 420,
      }}
    >
      {/* Right/base image (point cloud) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={rightImageSrc}
        alt={rightLabel}
        className="absolute inset-0 w-full h-full object-cover"
        style={rightImageStyle}
        draggable={false}
      />

      {/* Left/overlay image (photo), clipped */}
      <div className="absolute inset-0" style={clipStyle}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={leftImageSrc}
          alt={leftLabel}
          className="absolute inset-0 w-full h-full object-cover"
          style={leftImageStyle}
          draggable={false}
        />
      </div>

      {/* Top pills */}
      <div className="absolute left-5 top-5 z-20">
        <div className="px-5 py-2.5 rounded-full bg-white text-black font-medium text-body-sm shadow-sm border border-black/10">
          {leftLabel}
        </div>
      </div>
      <div className="absolute right-5 top-5 z-20">
        <div className="px-5 py-2.5 rounded-full bg-white text-black font-medium text-body-sm shadow-sm border border-black/10">
          {rightLabel}
        </div>
      </div>

      {/* Divider line */}
      <div
        // Keep the divider behind the pills so it never appears on top of them.
        className="absolute z-10"
        style={{
          left: `${clamp(value, 0, 1) * 100}%`,
          width: 2,
          transform: "translateX(-1px)",
          top: 0,
          bottom: 0,
          background: "rgba(255,255,255,0.95)",
          boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
        }}
      />

      {/* Handle */}
      <button
        type="button"
        aria-label="Drag to compare"
        onPointerDown={(e) => {
          (e.currentTarget as HTMLButtonElement).setPointerCapture(e.pointerId);
          setDragging(true);
        }}
        className="absolute z-40 grid place-items-center"
        style={{
          left: `${clamp(value, 0, 1) * 100}%`,
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 44,
          height: 44,
          borderRadius: 9999,
          background: "#ffffff",
          border: "1px solid rgba(0,0,0,0.12)",
          boxShadow: "0 8px 18px rgba(0,0,0,0.18)",
          touchAction: "none",
          cursor: "ew-resize",
        }}
      >
        {/* Horizontal arrows */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M9 6 L3 12 L9 18"
            stroke="#111827"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15 6 L21 12 L15 18"
            stroke="#111827"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}


