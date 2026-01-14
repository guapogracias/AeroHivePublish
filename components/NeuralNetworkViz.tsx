"use client";

import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";

type Node = {
  x: number;
  y: number;
  activation: number;
};

export default function NeuralNetworkViz({
  variant = "full",
}: {
  variant?: "full" | "compact" | "panel";
}) {
  const [hoveredOutput, setHoveredOutput] = useState<number | null>(null);

  // Use a local image (no external dependency).
  const demoImage = "/images/cars.jpg";

  const layers = useMemo(
    () => [
      { nodes: 6, label: "Input Layer" },
      { nodes: 8, label: "Hidden Layer 1" },
      { nodes: 8, label: "Hidden Layer 2" },
      { nodes: 5, label: "Output Layer" },
    ],
    []
  );

  const outputs = useMemo(() => ["Car", "Bus", "Train", "Plane", "Ship"], []);
  const outputActivations = useMemo(() => [0.92, 0.12, 0.08, 0.15, 0.05], []);

  const allNodes = useMemo(() => {
    // Match the SVG viewBox width so the network is centered (equal left/right margins).
    const layerWidth = 600;
    const layerHeight = 240;
    const xSpacing = layerWidth / (layers.length + 1);

    const getNodePositions = (numNodes: number, layerIndex: number): Node[] => {
      const x = xSpacing * (layerIndex + 1);
      const ySpacing = layerHeight / (numNodes + 1);

      const nodes: Node[] = [];
      for (let i = 0; i < numNodes; i++) {
        // Deterministic activations (avoid Math.random() → hydration differences).
        const activation = ((i + 1) * (layerIndex + 3)) % 11 / 10; // 0..1-ish
        nodes.push({
          x,
          y: ySpacing * (i + 1) + 30,
          activation,
        });
      }
      return nodes;
    };

    return layers.map((layer, idx) => getNodePositions(layer.nodes, idx));
  }, [layers]);

  const isCompact = variant === "compact";
  const isPanel = variant === "panel";

  return (
    <div className="w-full">
      {/* Title (full only) */}
      {!isCompact && !isPanel ? (
        <div className="text-center mb-8 md:mb-10">
          <div className="text-h1 text-[var(--text-primary)]">Custom Object Recognition</div>
        </div>
      ) : null}

      {/* Layout */}
      <div
        className={
          isPanel
            ? "grid grid-cols-1 gap-5 items-start"
            : isCompact
            ? "grid grid-cols-1 md:grid-cols-[minmax(150px,0.85fr)_8px_auto_8px_minmax(190px,0.9fr)] gap-2 items-start"
            : "grid grid-cols-1 md:grid-cols-[minmax(240px,1fr)_220px_28px_minmax(560px,2.2fr)_28px_240px_minmax(240px,1fr)] gap-6 items-start"
        }
      >
        {/* Left paragraph (full only) */}
        {!isCompact && !isPanel ? (
          <div className="order-2 md:order-none text-body-md text-[var(--text-secondary)] leading-relaxed">
            Users can upload their own images to define what they want the system to recognize.
            Instead of a single reference, this requires a set of example photos showing the object
            or condition from different angles, distances, and lighting. Using many examples allows
            the computer vision models to learn the visual patterns that matter, rather than relying
            on fixed, predefined categories. For example, a user could upload multiple images of a
            specific type of car to teach the system exactly what that vehicle looks like in
            different contexts.
          </div>
        ) : null}

        {/* 1. Input */}
        <div
          className={
            isPanel ? "order-1 min-w-0" : isCompact ? "order-1 md:order-none min-w-0" : "order-1 md:order-none"
          }
        >
          <div className="space-y-3">
            <div className="text-body-md text-[var(--text-primary)] font-medium">1. Input Image</div>
            <div className="bg-[var(--surface-1)] border border-[var(--divider)] rounded-2xl p-3 aspect-square flex items-center justify-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={demoImage}
                alt="Demo input"
                className="w-full h-full object-cover rounded-xl"
                draggable={false}
              />
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div className={`hidden md:flex justify-center items-center pt-10 ${isPanel ? "hidden" : ""}`}>
          <ArrowRight className="w-7 h-7 text-[var(--text-muted)]" />
        </div>

        {/* 2. Network */}
        <div className={isPanel ? "order-2 min-w-0" : "order-3 md:order-none min-w-0"}>
          <div className="space-y-3">
            <div className="text-body-md text-[var(--text-primary)] font-medium">
              2. Neural Network Processing
            </div>
            <div
              className={
                isPanel
                  ? "bg-[var(--surface-1)] rounded-2xl p-4 border border-[var(--divider)] relative flex items-center justify-center min-h-[260px]"
                  : isCompact
                  ? "bg-[var(--surface-1)] rounded-md p-0.5 border border-[var(--divider)] relative inline-flex items-center justify-center w-fit justify-self-start"
                  : "bg-[var(--surface-1)] rounded-2xl p-8 border border-[var(--divider)] relative flex items-center justify-center min-h-[360px] md:min-h-[460px]"
              }
            >
              <svg
                viewBox={isCompact ? "90 -10 420 290" : "-40 -30 680 340"}
                preserveAspectRatio="xMidYMid meet"
                className={
                  isCompact
                    ? "block w-[300px] md:w-[340px] h-[208px] md:h-[237px]"
                    : "w-full h-full overflow-visible"
                }
                overflow="visible"
              >
                <g
                  transform={
                    isCompact
                      ? undefined
                      : `translate(300 140) scale(${isPanel ? 1.05 : 1.5}) translate(-300 -140)`
                  }
                >
                  {/* Connections */}
                  {allNodes.map((layer, layerIdx) => {
                    if (layerIdx === allNodes.length - 1) return null;
                    const nextLayer = allNodes[layerIdx + 1];

                    return layer.flatMap((node, nodeIdx) =>
                      nextLayer.map((nextNode, nextNodeIdx) => {
                        const isDirectConnectionToHovered =
                          hoveredOutput !== null &&
                          layerIdx === allNodes.length - 2 &&
                          nextNodeIdx === hoveredOutput;

                        const isPartOfPath =
                          hoveredOutput !== null &&
                          layerIdx < allNodes.length - 2 &&
                          (nodeIdx + nextNodeIdx) % 3 === hoveredOutput % 3;

                        const isHighlighted = isDirectConnectionToHovered || isPartOfPath;

                        const isActive = (nodeIdx + nextNodeIdx) % 4 === 0;
                        const opacity = isHighlighted ? 0.7 : isActive ? 0.22 : 0.06;
                        const strokeWidth = isHighlighted ? 3 : isActive ? 1.2 : 0.6;
                        const color = isHighlighted ? "#10b981" : "var(--text-primary)";

                        return (
                          <line
                            key={`${layerIdx}-${nodeIdx}-${nextNodeIdx}`}
                            x1={node.x}
                            y1={node.y}
                            x2={nextNode.x}
                            y2={nextNode.y}
                            stroke={color}
                            strokeWidth={strokeWidth}
                            opacity={opacity}
                          />
                        );
                      })
                    );
                  })}

                  {/* Nodes */}
                  {allNodes.flatMap((layer, layerIdx) =>
                    layer.map((node, nodeIdx) => {
                      const isOutputLayer = layerIdx === allNodes.length - 1;
                      const isHighlighted = hoveredOutput === nodeIdx && isOutputLayer;
                      const isActive = node.activation > 0.5;

                      return (
                        <g key={`${layerIdx}-${nodeIdx}`}>
                          {(isActive || isHighlighted) && (
                            <circle
                              cx={node.x}
                              cy={node.y}
                              r={24}
                              fill={isHighlighted ? "#10b981" : "var(--text-primary)"}
                              opacity={0.14}
                            />
                          )}
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r={13}
                            fill={
                              isHighlighted
                                ? "#10b981"
                                : isActive
                                  ? "var(--text-primary)"
                                  : "rgba(148, 163, 184, 0.35)"
                            }
                            stroke="rgba(148, 163, 184, 0.7)"
                            strokeWidth={1.6}
                            opacity={0.95}
                          />
                        </g>
                      );
                    })
                  )}

                  {/* Labels */}
                  {layers.map((layer, idx) => {
                    const x = allNodes[idx][0]?.x ?? 0;
                    return (
                      <text
                        key={idx}
                        x={x}
                        y={22}
                        textAnchor="middle"
                        fill="rgba(107,114,128,0.95)"
                        fontSize="12"
                        fontWeight="500"
                      >
                        {layer.label}
                      </text>
                    );
                  })}
                </g>
              </svg>
            </div>
            {!isCompact && !isPanel ? (
              <div className="text-body-sm text-[var(--text-muted)]">
                Hover over the classification results to see pathways light up.
              </div>
            ) : null}
          </div>
        </div>

        {/* Arrow */}
        <div className={`hidden md:flex justify-center items-center pt-10 ${isPanel ? "hidden" : ""}`}>
          <ArrowRight className="w-7 h-7 text-[var(--text-muted)]" />
        </div>

        {/* 3. Classification */}
        <div className={isPanel ? "order-3 min-w-0" : "order-4 md:order-none min-w-0"}>
          <div className="space-y-3">
            <div
              className={
                isCompact
                  ? "text-[14px] leading-[18px] text-[var(--text-primary)] font-medium"
                  : "text-body-md text-[var(--text-primary)] font-medium"
              }
            >
              3. Classification
            </div>
            <div className="space-y-3">
              {outputs.map((label, idx) => (
                <div
                  key={label}
                  className="transition-all duration-200 cursor-pointer min-w-0"
                  onMouseEnter={() => setHoveredOutput(idx)}
                  onMouseLeave={() => setHoveredOutput(null)}
                >
                  <div
                    className="rounded-lg overflow-hidden border transition-colors"
                    style={{
                      borderColor: hoveredOutput === idx ? "#10b981" : "var(--divider)",
                      background: "var(--surface-1)",
                    }}
                  >
                    <div
                      className={`flex items-center justify-between relative overflow-hidden ${
                        isCompact ? "h-9 px-2" : "h-10 px-3"
                      }`}
                    >
                      <div
                        className="absolute inset-y-0 left-0"
                        style={{
                          width: `${outputActivations[idx] * 100}%`,
                          background:
                            outputActivations[idx] > 0.5
                              ? "linear-gradient(to right, #10b981, #059669)"
                              : "linear-gradient(to right, rgba(107,114,128,0.55), rgba(75,85,99,0.55))",
                        }}
                      />
                      <span
                        className={`relative z-10 font-medium ${isCompact ? "text-[13px]" : ""}`}
                        style={{
                          color: outputActivations[idx] > 0.5 ? "#ffffff" : "var(--text-primary)",
                        }}
                      >
                        {label}
                      </span>
                      <span
                        className={`relative z-10 font-mono ${isCompact ? "text-[12px]" : "text-sm"}`}
                        style={{
                          color: outputActivations[idx] > 0.5 ? "#ffffff" : "var(--text-muted)",
                        }}
                      >
                        {(outputActivations[idx] * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div
              className={`border border-[var(--divider)] bg-[var(--surface-1)] ${
                isCompact ? "mt-2 p-2.5 rounded-md" : "mt-3 p-3 rounded-lg"
              }`}
            >
              <div className={`text-[var(--text-muted)] font-medium ${isCompact ? "text-[12px] mb-0.5" : "mb-1"}`}>
                Identified as:
              </div>
              <div className={`text-[var(--text-primary)] ${isCompact ? "text-xl" : "text-2xl"}`}>Car</div>
              <div className={`text-[var(--text-muted)] ${isCompact ? "text-[12px] mt-0.5" : "text-sm mt-1"}`}>
                92% confidence
              </div>
            </div>
          </div>
        </div>

        {/* Right paragraph (full only) */}
        {!isCompact && !isPanel ? (
          <div className="order-5 md:order-none text-body-md text-[var(--text-secondary)] leading-relaxed">
            Once trained on those examples, the drone uses its onboard sensors and cameras to
            identify the same patterns during flight. As it scans an area, the system matches what
            it sees against the uploaded references in real time, allowing it to detect, locate,
            and map user-defined items such as that specific car directly within the environment.
            Because detections are tied to spatial data, identified items are placed precisely on
            the map and can be tracked across passes, making it possible to see where they appear,
            when they were last observed, and how their surroundings or condition change over time.
          </div>
        ) : null}
      </div>
    </div>
  );
}


