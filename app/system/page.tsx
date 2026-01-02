"use client";

import { useEffect, useLayoutEffect, useState, useCallback, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import SectionBlock from "@/components/SectionBlock";
import { Section, isComponentSection } from "@/types/sections";

// Dynamic import for the 3D model to avoid SSR issues
const DroneModel = dynamic(() => import("@/components/DroneModel"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-[var(--text-muted)]">Loading model...</div>
    </div>
  ),
});

const sections: Section[] = [
  // PX4 (content + component)
  {
    id: "section-01",
    type: "content",
    caption: "Section 01",
    title: "Natural Language Control",
    content:
      "Users can describe missions in any language, and those instructions are converted into drone-ready commands using PX4, ensuring safe and regulation-compliant operation. The system connects user intent directly to flight behavior without manual configuration. This makes complex missions easy to launch and repeat.",
  },
  {
    id: "component-01",
    type: "component",
    caption: "Component 01",
    title: "PX4",
    content: "",
    layerName: "PX4",
    media: { type: "video", src: "/videos/PX4.mp4" },
    cameraConfig: {
      position: [1, 1.5, 2],
      lookAtOffset: [0, 0, 0],
      distance: 2,
    },
  },

  // Jetson (content + component)
  {
    id: "section-02",
    type: "content",
    caption: "Section 02",
    title: "Coordinated & Scalable Operations",
    content:
      "Flight paths are automatically planned to maximize coverage while adapting drone formations to the task. Jetson Nano enables onboard coordination and decision-making, allowing multiple drones to operate together efficiently without overlap. This architecture scales smoothly from small deployments to large-area operations.",
  },
  {
    id: "component-02",
    type: "component",
    caption: "Component 02",
    title: "Jetson",
    content: "",
    layerName: "Jetson",
    media: { type: "video", src: "/videos/Jetson.mp4" },
    cameraConfig: {
      position: [0.5, 2, 1.5],
      lookAtOffset: [0, 0, 0],
      distance: 1.8,
    },
  },

  // Camera (content + component)
  {
    id: "section-03",
    type: "content",
    caption: "Section 03",
    title: "Camera & Sensing Framework",
    content:
      "Using computer vision, the system processes camera data in real time to recognize user-defined objects trained from example images or online datasets. This allows drones to detect and focus on specific targets or features during flight. Recognition improves as more labeled data is added over time.",
  },
  {
    id: "component-03",
    type: "component",
    caption: "Component 03",
    title: "Camera System",
    content: "",
    layerName: "camera",
    media: { type: "video", src: "/videos/CV.mp4" },
    cameraConfig: {
      position: [1.5, 0.5, 2],
      lookAtOffset: [0, 0, 0],
      distance: 1.5,
    },
  },

  // LiDAR (content + component)
  {
    id: "section-04",
    type: "content",
    caption: "Section 04",
    title: "Autonomous Decision Making",
    content:
      "The onboard AI processes environmental data to make real-time decisions during flight. Drones can adapt to changing conditions, avoid obstacles, and optimize their paths without human intervention. This enables truly autonomous operations in dynamic and unpredictable environments.",
  },
  {
    id: "component-04",
    type: "component",
    caption: "Component 04",
    title: "LiDAR",
    content: "",
    layerName: "LiDAR",
    media: { type: "video", src: "/videos/LiDAR.webm" },
    cameraConfig: {
      position: [2, 1, 1.5],
      lookAtOffset: [0, 0, 0],
      distance: 1.8,
    },
  },
];

export default function SystemPage() {
  // Track if we're in hero or sections view
  const [inSectionsView, setInSectionsView] = useState(false);
  // Current section index (0-based, within sections array)
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  // Grid hover state
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);
  const [trailCells, setTrailCells] = useState<Array<{ row: number; col: number; timestamp: number }>>([]);
  const gridRef = useRef<HTMLDivElement>(null);

  // Calculate the current layer to focus on
  const currentLayerName = useMemo(() => {
    const section = sections[currentSectionIndex];
    if (section && isComponentSection(section)) {
      return section.layerName;
    }
    return null; // Content sections return to default view
  }, [currentSectionIndex]);

  // Hide footer on this page for full-viewport experience
  // Set data attribute immediately to prevent flash on reload
  useLayoutEffect(() => {
    // Set body attribute immediately - CSS will hide footer
    if (typeof document !== 'undefined') {
      document.body.setAttribute('data-hide-footer', 'true');
      
      // Also hide directly as backup
      const footer = document.querySelector("footer");
      if (footer) {
        footer.style.display = "none";
      }
    }
    
    return () => {
      // Remove attribute on unmount
      if (typeof document !== 'undefined') {
        document.body.removeAttribute('data-hide-footer');
        const footer = document.querySelector("footer");
        if (footer) {
          footer.style.display = "";
        }
      }
    };
  }, []);
  
  // Also run immediately on mount (before React hydrates) via script
  useEffect(() => {
    // This runs after mount, but the script tag should handle initial load
    if (typeof document !== 'undefined') {
      document.body.setAttribute('data-hide-footer', 'true');
      const footer = document.querySelector("footer");
      if (footer) {
        footer.style.display = "none";
      }
    }
  }, []);

  // Enter sections view from hero
  const enterSectionsView = useCallback(() => {
    setInSectionsView(true);
    setCurrentSectionIndex(0);
  }, []);

  // Navigation handlers
  const goBack = useCallback(() => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex((prev) => prev - 1);
    } else {
      // Go back to hero
      setInSectionsView(false);
    }
  }, [currentSectionIndex]);

  const goNext = useCallback(() => {
    if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex((prev) => prev + 1);
    }
  }, [currentSectionIndex]);

  // Current section data
  const currentSection = sections[currentSectionIndex];
  const canGoBack = true; // Can always go back (to previous section or hero)
  const canGoNext = currentSectionIndex < sections.length - 1;

  // Grid hover handler
  const handleGridMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const gridSize = 40;
    const col = Math.floor(x / gridSize);
    const row = Math.floor(y / gridSize);
    
    setHoveredCell({ row, col });
    
    // Add to trail
    setTrailCells(prev => {
      const newTrail = [...prev, { row, col, timestamp: Date.now() }];
      // Keep only recent trail cells (last 5)
      return newTrail.slice(-5);
    });
  }, []);

  const handleGridMouseLeave = useCallback(() => {
    setHoveredCell(null);
  }, []);

  // Clean up old trail cells
  useEffect(() => {
    const interval = setInterval(() => {
      setTrailCells(prev => 
        prev.filter(cell => Date.now() - cell.timestamp < 300)
      );
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Get active cells (hovered + trail)
  const activeCells = useMemo(() => {
    const cells = new Map<string, { row: number; col: number; opacity: number; isHovered: boolean }>();
    
    if (hoveredCell) {
      cells.set(`${hoveredCell.row}-${hoveredCell.col}`, {
        ...hoveredCell,
        opacity: 1,
        isHovered: true,
      });
    }
    
    trailCells.forEach(trail => {
      const key = `${trail.row}-${trail.col}`;
      if (!cells.has(key)) {
        const trailAge = Date.now() - trail.timestamp;
        const opacity = Math.max(0, 1 - trailAge / 300);
        if (opacity > 0) {
          cells.set(key, {
            row: trail.row,
            col: trail.col,
            opacity: opacity * 0.5,
            isHovered: false,
          });
        }
      }
    });
    
    return Array.from(cells.values());
  }, [hoveredCell, trailCells]);

  return (
    <>
      {/* Blocking script to hide footer immediately on page load/reload */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              if (document.body) {
                document.body.setAttribute('data-hide-footer', 'true');
                var footer = document.querySelector('footer');
                if (footer) footer.style.display = 'none';
              } else {
                document.addEventListener('DOMContentLoaded', function() {
                  document.body.setAttribute('data-hide-footer', 'true');
                  var footer = document.querySelector('footer');
                  if (footer) footer.style.display = 'none';
                });
              }
            })();
          `,
        }}
      />
      <div 
        ref={gridRef}
        className="fixed inset-0 top-[64px] overflow-hidden bg-[var(--bg-black)]"
        onMouseMove={handleGridMouseMove}
        onMouseLeave={handleGridMouseLeave}
        style={{
          backgroundImage: `
            linear-gradient(var(--grid-line) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      >
      {/* Interactive grid overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {activeCells.map((cell) => (
          <div
            key={`${cell.row}-${cell.col}`}
            className="absolute transition-opacity duration-150"
            style={{
              left: `${cell.col * 40}px`,
              top: `${cell.row * 40}px`,
              width: '40px',
              height: '40px',
              backgroundColor: cell.isHovered
                ? 'var(--grid-cell-hover)'
                : 'var(--grid-cell)',
              opacity: cell.opacity,
              pointerEvents: 'none',
            }}
          />
        ))}
      </div>
      {/* Hero Section - shown when not in sections view */}
      {!inSectionsView && (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-8 md:px-16 text-center">
          <p className="text-h3 text-[var(--text-muted)] mb-4">
            AeroHive
          </p>
          <h1 className="text-h1 text-[var(--text-primary)] mb-6 max-w-[600px]">
            Intelligent Autonomous Flight
          </h1>
          <p className="text-body-lg text-[var(--text-secondary)] mb-8 max-w-[600px]">
            A comprehensive platform for autonomous drone operations powered by
            AI and natural language processing, enabling seamless mission
            planning and execution.
          </p>
          <button
            onClick={enterSectionsView}
            className="btn-primary font-semibold w-fit cursor-pointer"
          >
            Explore the system
          </button>
        </div>
      )}

      {/* Sections View - shown when in sections view */}
      {inSectionsView && (
        <div className="absolute inset-0">
          {/* Drone Model Container - Full size frame (desktop only) */}
          <div className="hidden md:block absolute inset-0 w-full h-full">
            {/* Drone Model - Positioned within frame */}
            {/* Adjust the style values below to position the model:
                - top/left/right/bottom: position from edges
                - transform: fine-tune centering
                - width/height: scale the model size */}
            <div 
              className="absolute"
              style={{
                // Position: adjust these to move the model
                top: '50%',
                left: '60%',
                transform: 'translate(-50%, -50%)',
                // Size: adjust these to scale the model
                width: '130%',
                height: '130%',
              }}
            >
              <DroneModel focusLayer={currentLayerName} />
            </div>
          </div>

          {/* Title - Fixed above section component */}
          <h2 className="absolute top-[80px] left-[4%] md:left-[5%] z-10 text-h1 text-[var(--text-primary)]">
            Our Drone Model
          </h2>

          {/* Section Block Overlay - Bottom left */}
          <div className="absolute bottom-[8%] left-[4%] md:left-[5%] z-10 w-[90%] md:w-[35%] max-w-[450px]">
            <div className="bg-[var(--bg-black)]/80 backdrop-blur-md rounded-lg p-6 md:p-8 border border-[var(--divider)]">
              <SectionBlock
                key={currentSection.id}
                caption={currentSection.caption}
                title={currentSection.title}
                content={currentSection.content}
                media={isComponentSection(currentSection) ? currentSection.media : undefined}
                onBack={goBack}
                onNext={goNext}
                canGoBack={canGoBack}
                canGoNext={canGoNext}
              />
            </div>
          </div>

          {/* Mobile: Show simple background since no model */}
          <div className="md:hidden absolute inset-0 bg-[var(--bg-black)]" />
        </div>
      )}
    </div>
    </>
  );
}
