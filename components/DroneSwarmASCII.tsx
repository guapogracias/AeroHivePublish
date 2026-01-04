"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PROFOUND_ISOTYPE_ASCII_CONTENT } from "./ProfoundIsotypeASCII";

type SwarmNode = {
  id: string;
  /** Position in % of container */
  xPct: number;
  yPct: number;
  scale: number;
  delayS: number;
  durS: number;
};

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

function dist2(a: { x: number; y: number }, b: { x: number; y: number }) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}

export default function DroneSwarmASCII() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  // Tuned to resemble the reference: drones spread across the hero, leaving the center for text.
  const nodes: SwarmNode[] = useMemo(
    () => [
      // Slightly larger than before (~20%) and spread wider to fill the hero.
      { id: "a", xPct: 12, yPct: 18, scale: 0.74, delayS: 0.0, durS: 6.6 },
      { id: "b", xPct: 50, yPct: 12, scale: 0.82, delayS: 0.4, durS: 6.9 },
      { id: "c", xPct: 88, yPct: 18, scale: 0.74, delayS: 0.8, durS: 6.4 },
      { id: "d", xPct: 8, yPct: 48, scale: 0.70, delayS: 0.2, durS: 7.1 },
      { id: "e", xPct: 92, yPct: 48, scale: 0.70, delayS: 0.6, durS: 7.3 },
      { id: "f", xPct: 14, yPct: 82, scale: 0.74, delayS: 0.3, durS: 6.8 },
      { id: "g", xPct: 50, yPct: 88, scale: 0.82, delayS: 0.7, durS: 7.0 },
      { id: "h", xPct: 86, yPct: 82, scale: 0.74, delayS: 0.5, durS: 6.7 },
      { id: "i", xPct: 30, yPct: 70, scale: 0.68, delayS: 0.1, durS: 7.4 },
      { id: "j", xPct: 70, yPct: 70, scale: 0.68, delayS: 0.9, durS: 7.2 },
      // Extra nodes to cover more space
      { id: "k", xPct: 24, yPct: 34, scale: 0.66, delayS: 0.15, durS: 7.6 },
      { id: "l", xPct: 76, yPct: 34, scale: 0.66, delayS: 0.55, durS: 7.8 },
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

  const points = useMemo(() => {
    const w = Math.max(1, size.w);
    const h = Math.max(1, size.h);
    return nodes.map((n) => ({
      id: n.id,
      x: (n.xPct / 100) * w,
      y: (n.yPct / 100) * h,
    }));
  }, [nodes, size.h, size.w]);

  const edges = useMemo(() => {
    // Connect each node to its nearest neighbor (proximity graph).
    const out: Array<{ a: string; b: string }> = [];
    const seen = new Set<string>();
    for (let i = 0; i < points.length; i++) {
      let bestJ = -1;
      let bestD = Number.POSITIVE_INFINITY;
      for (let j = 0; j < points.length; j++) {
        if (i === j) continue;
        const d = dist2(points[i], points[j]);
        if (d < bestD) {
          bestD = d;
          bestJ = j;
        }
      }
      if (bestJ !== -1) {
        const a = points[i].id;
        const b = points[bestJ].id;
        const key = [a, b].sort().join("-");
        if (!seen.has(key)) {
          seen.add(key);
          out.push({ a, b });
        }
      }
    }
    return out;
  }, [points]);

  const pointById = useMemo(() => {
    const m = new Map<string, { x: number; y: number }>();
    points.forEach((p) => m.set(p.id, { x: p.x, y: p.y }));
    return m;
  }, [points]);

  return (
    <div ref={wrapRef} className="relative w-full h-full">
      <style jsx>{`
        @keyframes swarmFloat {
          0% {
            transform: translate(-50%, -50%) translate3d(-2px, 1px, 0) rotate(-0.4deg)
              scale(var(--swarm-scale));
          }
          50% {
            transform: translate(-50%, -50%) translate3d(2px, -3px, 0) rotate(0.6deg)
              scale(var(--swarm-scale));
          }
          100% {
            transform: translate(-50%, -50%) translate3d(-1px, 2px, 0) rotate(-0.2deg)
              scale(var(--swarm-scale));
          }
        }
      `}</style>

      {/* Connector lines (behind drones) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        viewBox={`0 0 ${Math.max(1, size.w)} ${Math.max(1, size.h)}`}
        preserveAspectRatio="none"
      >
        {edges.map((e) => {
          const a = pointById.get(e.a);
          const b = pointById.get(e.b);
          if (!a || !b) return null;
          return (
            <line
              key={`${e.a}-${e.b}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="var(--divider)"
              strokeWidth={1.5}
              opacity={0.35}
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {nodes.map((n) => (
        <div
          key={n.id}
          className="absolute pointer-events-none select-none z-10"
          style={{
            left: `${n.xPct}%`,
            top: `${n.yPct}%`,
            ["--swarm-scale" as any]: n.scale,
            animation: `swarmFloat ${n.durS}s ease-in-out ${n.delayS}s infinite`,
          }}
        >
          <pre className="font-mono text-[4.4px] leading-[3.9px] md:text-[6.4px] md:leading-[5.4px] text-[var(--text-primary)] opacity-75 whitespace-pre">
            {DRONE_ASCII}
          </pre>
        </div>
      ))}
    </div>
  );
}


