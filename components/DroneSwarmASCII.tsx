"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PROFOUND_ISOTYPE_ASCII_CONTENT } from "./ProfoundIsotypeASCII";

type SwarmNode = {
  id: string;
  /** Position in % of container */
  xPct: number;
  yPct: number;
  scale: number;
  /** Drift tuning (deterministic) */
  ampPx: number;
  speed: number;
};

// Explicit, deterministic connections (prevents long diagonals + avoids any layout-dependent graph changes).
// Split into a few “groups” (not all drones connected).
const EDGES: Array<[string, string]> = [
  // Group A (top / center-ish)
  ["a", "b"],
  ["b", "c"],
  ["b", "k"],
  // Group B (left side)
  ["d", "e"],
  ["e", "f"],
  // Group C (right side)
  ["g", "h"],
  ["h", "i"],
  // Group D (bottom)
  ["j", "l"],
];

function normalizeAsciiArt(raw: string) {
  const lines = raw.replace(/\r/g, "").split("\n");
  // Trim empty top/bottom
  while (lines.length && lines[0].trim() === "") lines.shift();
  while (lines.length && lines[lines.length - 1].trim() === "") lines.pop();
  const nonEmpty = lines.filter((l) => l.trim() !== "");
  const minIndent =
    nonEmpty.length === 0
      ? 0
      : Math.min(
          ...nonEmpty.map((l) => {
            const m = l.match(/^(\s*)/);
            return m ? m[1].length : 0;
          })
        );
  return lines.map((l) => l.slice(minIndent)).join("\n");
}

const DRONE_ASCII = normalizeAsciiArt(PROFOUND_ISOTYPE_ASCII_CONTENT);

function hashId(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}

function driftOffset(node: SwarmNode, tSec: number) {
  // Deterministic phases per id so it never “randomizes” on reload.
  const h = hashId(node.id);
  const phase1 = ((h % 360) * Math.PI) / 180;
  const phase2 = (((h >>> 8) % 360) * Math.PI) / 180;
  const dx = Math.sin(tSec * node.speed + phase1) * node.ampPx;
  const dy = Math.cos(tSec * (node.speed * 0.9) + phase2) * (node.ampPx * 0.75);
  return { dx, dy };
}

export default function DroneSwarmASCII() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const [tMs, setTMs] = useState(0);

  // Tuned to resemble the reference: drones spread across the hero, leaving the center for text.
  const nodes: SwarmNode[] = useMemo(
    () => [
      // Uneven / organic spread (deterministic, no randomness on reload)
      { id: "a", xPct: 20, yPct: 16, scale: 0.76, ampPx: 3.2, speed: 0.55 },
      { id: "b", xPct: 56, yPct: 12, scale: 0.84, ampPx: 3.6, speed: 0.52 },
      { id: "c", xPct: 86, yPct: 20, scale: 0.74, ampPx: 3.0, speed: 0.58 },
      { id: "k", xPct: 38, yPct: 30, scale: 0.66, ampPx: 2.8, speed: 0.62 },

      { id: "d", xPct: 12, yPct: 48, scale: 0.72, ampPx: 3.2, speed: 0.60 },
      { id: "e", xPct: 26, yPct: 58, scale: 0.64, ampPx: 2.6, speed: 0.70 },
      { id: "f", xPct: 18, yPct: 78, scale: 0.70, ampPx: 3.0, speed: 0.57 },

      { id: "g", xPct: 78, yPct: 44, scale: 0.70, ampPx: 3.0, speed: 0.63 },
      { id: "h", xPct: 90, yPct: 58, scale: 0.64, ampPx: 2.6, speed: 0.68 },
      { id: "i", xPct: 82, yPct: 76, scale: 0.70, ampPx: 3.0, speed: 0.56 },

      { id: "j", xPct: 44, yPct: 86, scale: 0.78, ampPx: 3.4, speed: 0.50 },
      { id: "l", xPct: 64, yPct: 90, scale: 0.70, ampPx: 3.0, speed: 0.54 },
    ],
    []
  );

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const compute = () => {
      const r = el.getBoundingClientRect();
      setSize({ w: r.width, h: r.height });
    };
    compute();
    const ro = new ResizeObserver(() => compute());
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = () => {
      setTMs(performance.now() - start);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const points = useMemo(() => {
    const w = Math.max(1, size.w);
    const h = Math.max(1, size.h);
    const tSec = tMs / 1000;
    return nodes.map((n) => ({
      id: n.id,
      ...(() => {
        const baseX = (n.xPct / 100) * w;
        const baseY = (n.yPct / 100) * h;
        const { dx, dy } = driftOffset(n, tSec);
        return { x: baseX + dx, y: baseY + dy };
      })(),
    }));
  }, [nodes, size.h, size.w, tMs]);

  const pointById = useMemo(() => {
    const m = new Map<string, { x: number; y: number }>();
    points.forEach((p) => m.set(p.id, { x: p.x, y: p.y }));
    return m;
  }, [points]);

  return (
    <div ref={wrapRef} className="relative w-full h-full">
      {/* Connector lines (behind drones) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        viewBox={`0 0 ${Math.max(1, size.w)} ${Math.max(1, size.h)}`}
        preserveAspectRatio="none"
      >
        {EDGES.map(([aId, bId]) => {
          const a = pointById.get(aId);
          const b = pointById.get(bId);
          if (!a || !b) return null;
          return (
            <line
              key={`${aId}-${bId}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              // Pitch black lines, always.
              stroke="#000"
              strokeWidth={3}
              strokeLinecap="round"
              opacity={1}
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {nodes.map((n) => (
        (() => {
          const tSec = tMs / 1000;
          const { dx, dy } = driftOffset(n, tSec);
          return (
        <div
          key={n.id}
          className="absolute pointer-events-none select-none z-10"
          style={{
            left: `${n.xPct}%`,
            top: `${n.yPct}%`,
            transform: `translate(-50%, -50%) translate3d(${dx}px, ${dy}px, 0) scale(${n.scale})`,
          }}
        >
          <pre
            className="font-mono text-[var(--text-primary)] whitespace-pre"
            style={{
              // Fixed sizing so it doesn't "jump" on reload/breakpoint timing.
              fontSize: "6px",
              lineHeight: "5.2px",
              opacity: 0.75,
              // Mask any line passing behind the drone so it never looks "on top".
              // Uses theme background (white in light mode, dark in dark mode).
              textShadow:
                "0 0 6px var(--bg-black), 0 0 10px var(--bg-black), 0 0 14px var(--bg-black)",
            }}
          >
            {DRONE_ASCII}
          </pre>
        </div>
          );
        })()
      ))}
    </div>
  );
}


