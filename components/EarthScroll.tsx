"use client";

import { useEffect, useRef, useState, Suspense, useMemo } from "react";
import type { LucideIcon } from "lucide-react";
import { Satellite, Plane, Boxes, Tractor } from "lucide-react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useDroneSwarm } from "./useDroneSwarm";
import SectionBlock from "@/components/SectionBlock";
import { Section, isComponentSection } from "@/types/sections";
import dynamic from "next/dynamic";

const DroneModel3D = dynamic(() => import("@/components/DroneModel"), { ssr: false });

interface Layer {
  id: number;
  title: string;
  subtitle: string;
  altitude: string;
  icon: LucideIcon;
  image: string;
  bgColor: string;
  centerImage: string;
}

const CAMERA_PRESETS: Record<string, { position: [number, number, number]; lookAt: [number, number, number]; fov: number }> = {
  PX4: { position: [1, 1.5, 2], lookAt: [0, 0.1, 0], fov: 50 },
  Jetson: { position: [0.5, 2, 1.5], lookAt: [0, 0.1, 0], fov: 50 },
  camera: { position: [1.5, 0.5, 2], lookAt: [0, 0.1, 0], fov: 50 },
  LiDAR: { position: [2, 1, 1.5], lookAt: [0, 0.1, 0], fov: 50 },
};

const systemSections: Section[] = [
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
    caption: "Component 01.01",
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
    caption: "Component 02.01",
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
    caption: "Component 03.01",
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
  // CV components (placeholders; adjust content/camera as needed)
  {
    id: "component-cv-01",
    type: "component",
    caption: "Component 03.02",
    title: "CV Part 1",
    content:
      "Users can upload their own images to define what they want the system to recognize. A set of example photos across angles, distances, and lighting helps the model learn the patterns that matter instead of relying on fixed, predefined categories.",
    layerName: "camera",
    media: undefined,
    cameraConfig: {
      position: [1.5, 0.5, 2],
      lookAtOffset: [0, 0, 0],
      distance: 1.5,
    },
  },
  {
    id: "component-cv-02",
    type: "component",
    caption: "Component 03.03",
    title: "CV Part 2",
    content: "Example video feed demonstrating the recognition pipeline.",
    layerName: "camera",
    media: { type: "video", src: "/videos/CV.mp4" },
    cameraConfig: {
      position: [1.5, 0.5, 2],
      lookAtOffset: [0, 0, 0],
      distance: 1.5,
    },
  },
  {
    id: "component-cv-03",
    type: "component",
    caption: "",
    title: "",
    content: "",
    layerName: "camera",
    media: { type: "diagram" },
    cameraConfig: {
      position: [1.5, 0.5, 2],
      lookAtOffset: [0, 0, 0],
      distance: 1.5,
    },
  },
  {
    id: "component-cv-04",
    type: "component",
    caption: "Component 03.05",
    title: "CV Part 4",
    content:
      "Once trained on those examples, the drone uses its onboard sensors and cameras to identify the same patterns during flight. As it scans an area, the system matches what it sees against the uploaded references in real time, allowing it to detect, locate, and map user-defined items such as that specific car directly within the environment. Because detections are tied to spatial data, identified items are placed precisely on the map and can be tracked across passes, making it possible to see where they appear, when they were last observed, and how their surroundings or condition change over time.",
    layerName: "camera",
    media: undefined,
    cameraConfig: {
      position: [1.5, 0.5, 2],
      lookAtOffset: [0, 0, 0],
      distance: 1.5,
    },
  },
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
    caption: "Component 04.01",
    title: "LiDAR",
    content:
      "Because a point cloud captures structure rather than appearance, the environment becomes something that can be measured instead of merely viewed. Distances, volumes, canopy height, slope, spacing, and terrain variation can be calculated directly, removing the need for visual estimation or manual interpretation.",
    layerName: "LiDAR",
    media: undefined,
    cameraConfig: {
      position: [2, 1, 1.5],
      lookAtOffset: [0, 0, 0],
      distance: 1.8,
    },
  },
  {
    id: "component-04-02",
    type: "component",
    caption: "Component 04.02",
    title: "Single Photo vs Point Cloud",
    content: "",
    media: { type: "slider" },
    layerName: "LiDAR",
    cameraConfig: {
      position: [2, 3, 1.5],
      lookAtOffset: [0, 0, 0],
      distance: 1.8,
    },
  },
  {
    id: "component-04-03",
    type: "component",
    caption: "Component 04.03",
    title: "LiDAR Part 3",
    content:
      "That same structural record makes change detectable over time. By aligning scans collected on different dates, growth, loss, movement, or deformation can be identified with precision that photos or human observation cannot reliably achieve, producing a consistent and objective representation that software can analyze the same way across locations and seasons.",
    layerName: "LiDAR",
    media: undefined,
    cameraConfig: {
      position: [2, 1, 1.5],
      lookAtOffset: [0, 0, 0],
      distance: 1.8,
    },
  },
  {
    id: "component-04-04",
    type: "component",
    caption: "Component 04.04",
    title: "LiDAR Part 4",
    content: "LiDAR module: Part 4",
    layerName: "LiDAR",
    media: { type: "video", src: "/videos/LiDAR.webm" },
    cameraConfig: {
      position: [2, 1, 1.5],
      lookAtOffset: [0, 0, 0],
      distance: 1.8,
    },
  },
];

const layers: Layer[] = [
  {
    id: 1,
    title: "Stratosphere",
    subtitle: "Satellites",
    altitude: "20,000 km",
    icon: Satellite,
    image: "/images/earth/satillite.jpeg",
    bgColor: "#0f172a",
    centerImage: "/images/earth/satillite.jpeg",
  },
  {
    id: 2,
    title: "Above Canopy",
    subtitle: "Crop Dusters",
    altitude: "10 meters",
    icon: Plane,
    image: "/images/earth/cropduster.png",
    bgColor: "#0369a1",
    centerImage: "/images/earth/cropduster.png",
  },
  {
    id: 3,
    title: "Under Canopy",
    subtitle: "Drones",
    altitude: "3 meters",
    icon: Boxes,
    image: "/images/earth/drone.png",
    bgColor: "#047857",
    centerImage: "/images/earth/drone.png",
  },
  {
    id: 4,
    title: "Ground Level",
    subtitle: "Ground Vechicles",
    altitude: "0 meters",
    icon: Tractor,
    image: "/images/earth/ground.jpg",
    bgColor: "#78350f",
    centerImage: "/images/earth/ground.jpg",
  },
];

const GROUND_LAYOUT = {
  y: -0.02, // sinks the wheels slightly into the soil plane
  // Angles are in radians; tweak yaw for heading, pitch for tilt toward/away camera, roll to lean.
  tractor: { screenX: 0.27, screenY: 0.37, yaw: 3.23, pitch: -0.06, roll: -0.02 },
  excavator: { screenX: 0.2, screenY: 0.6, yaw: 1.29, pitch: -0.04, roll: -0.01 },
};

// Mirror the entire Ground layer horizontally (background + model placement + excavator motion).
const MIRROR_GROUND = true;

// Top-left text overlays per layer index (0=satellite, 1=crop duster, 2=drones, 3=ground).
// Edit these strings to change the visible labels + body copy.
const LAYER_TOP_LEFT_CONTENT: Partial<
  Record<
    number,
    {
      title: string;
      body?: string;
    }
  >
> = {
  0: {
    title: "Without AeroHive, satellite data remains descriptive",
    body:
      "Satellites provide broad visibility but limited resolution and infrequent updates. They can suggest where issues might exist, but they cannot measure structures, track individual assets, or reconcile change precisely over time.",
  },
  1: {
    title: "Without AeroHive, aerial intervention is blind",
    body:
      "Crop dusters are efficient at applying treatments, but they rely on pre-defined maps or manual scouting to decide where to act. This leads to blanket application, delayed response, or missed risk.",
  },
  3: {
    title: "Without AeroHive, equipment operates on imprecise data",
    body:
      "Ground equipment executes work at scale, but it depends entirely on the quality of the instructions it receives. When those instructions are based on averages or outdated assumptions, execution becomes inefficient and wasteful.",
  },
};

export function EarthScroll() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [currentLayer, setCurrentLayer] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [focusStage, setFocusStage] = useState<"idle" | "focusing" | "pinned">("idle");
  const camRef = useRef<THREE.PerspectiveCamera | null>(null);
  const [currentSystemIndex, setCurrentSystemIndex] = useState(0);
  const currentSystemSection = systemSections[currentSystemIndex];
  const isWideOverlay =
    !!currentSystemSection &&
    isComponentSection(currentSystemSection) &&
    (currentSystemSection.media?.type === "diagram" || currentSystemSection.media?.type === "slider");
  const isSliderOverlay =
    !!currentSystemSection &&
    isComponentSection(currentSystemSection) &&
    currentSystemSection.media?.type === "slider";
  const [suppressFocus, setSuppressFocus] = useState(false);
  const lastWheelRef = useRef(0);
  const activeCameraPreset =
    currentLayer === 2 &&
    focusStage !== "idle" &&
    currentSystemSection &&
    isComponentSection(currentSystemSection)
      ? {
          position: currentSystemSection.cameraConfig.position,
          lookAt: currentSystemSection.cameraConfig.lookAtOffset ?? [0, 0, 0],
          fov: 50,
        }
      : null;

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!containerRef.current) return;
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = containerRef.current!.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        const totalScrollable = rect.height - vh;
        if (totalScrollable <= 0) {
          setCurrentLayer(0);
          setScrollProgress(0);
          ticking = false;
          return;
        }
        const traveled = Math.min(Math.max(-rect.top, 0), totalScrollable);
        const ratio = traveled / totalScrollable;
        const targetLayer = Math.round(ratio * (layers.length - 1));
        setCurrentLayer(targetLayer);
        setScrollProgress(ratio * 100);
        ticking = false;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // Trigger focus when scrolling past 75% of this section
  useEffect(() => {
    // Only trigger focus while on the Drones layer (index 2) and past 75% scroll of the section.
    if (currentLayer !== 2) {
      if (focusStage !== "idle") {
        setFocusedIndex(null);
        setFocusStage("idle");
      }
      return;
    }
    if (!suppressFocus && focusStage === "idle" && scrollProgress > 75) {
      setFocusedIndex(0);
      setFocusStage("focusing");
    }
  }, [focusStage, scrollProgress, currentLayer, suppressFocus]);

  // Allow re-focus after user exits once they scroll back above the threshold
  useEffect(() => {
    if (suppressFocus && scrollProgress < 60) {
      setSuppressFocus(false);
    }
  }, [scrollProgress, suppressFocus]);

  // Reset system index when entering focus
  useEffect(() => {
    if (focusStage === "focusing") {
      setCurrentSystemIndex(0);
    }
  }, [focusStage]);

  // Scroll wheel to cycle presets when pinned/focusing on drones layer
  useEffect(() => {
    if (currentLayer !== 2 || focusStage === "idle") return;
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 5) return;
      const now = performance.now();
      if (now - lastWheelRef.current < 600) return; // throttle rapid switching
      lastWheelRef.current = now;
      const isLast = currentSystemIndex === systemSections.length - 1;
      const isFirst = currentSystemIndex === 0;
      if (e.deltaY > 0 && isLast) {
        // advance to ground layer and reset focus
        setCurrentLayer(3);
        setFocusStage("idle");
        setFocusedIndex(null);
        setCurrentSystemIndex(0);
        setSuppressFocus(true);
        return;
      }
      if (e.deltaY < 0 && isFirst) {
        // exit back to swarm
        setFocusStage("idle");
        setFocusedIndex(null);
        setSuppressFocus(true);
        return;
      }
      setCurrentSystemIndex((idx) => {
        const next = e.deltaY > 0 ? idx + 1 : idx - 1;
        return Math.min(Math.max(next, 0), systemSections.length - 1);
      });
    };
    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [currentLayer, focusStage, currentSystemIndex]);

  const layer = layers[currentLayer];
  const CurrentIcon = layer.icon;

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-visible"
      style={{ height: `calc(${layers.length} * 100vh)` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden border-y border-[var(--divider)]">
        {/* Background Image Layers */}
        {layers.map((l, index) => {
          const isActive = index === currentLayer;
          const isPast = index < currentLayer;
          const isFuture = index > currentLayer;
          const isGroundLayer = l.id === 4;
          const baseTransform = isPast
            ? "scale(1.15) translateY(-30%)"
            : isFuture
              ? "scale(0.9) translateY(30%)"
              : "scale(1) translateY(0)";

          return (
            <div
              key={l.id}
              className="absolute inset-0 transition-all duration-700 ease-out"
              style={{
                backgroundImage: `url(${l.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: isActive ? 1 : 0,
                transform:
                  isGroundLayer && MIRROR_GROUND ? `${baseTransform} scaleX(-1)` : baseTransform,
                filter: "none",
              }}
            />
          );
        })}

        {/* Top-left overlays (kept off when the System overlay card is showing) */}
        {focusStage === "idle" && LAYER_TOP_LEFT_CONTENT[currentLayer]?.body ? (
          <div className="absolute top-[160px] left-[4%] md:left-[5%] z-30 pointer-events-none">
            <div className="relative max-w-[680px]">
              {/* Scrim to keep text legible on bright backgrounds (consistent across layers) */}
              <div
                className="absolute -inset-x-6 -inset-y-5 rounded-2xl z-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.40) 100%)",
                  filter: "blur(0px)",
                }}
              />
              <div className="relative z-10">
                <div
                  className="text-h2 text-white"
                  style={{ textShadow: "0 2px 18px rgba(0,0,0,0.55)" }}
                >
                  {LAYER_TOP_LEFT_CONTENT[currentLayer]!.title}
                </div>
                <p
                  className="mt-2 text-body-md text-white whitespace-normal leading-relaxed"
                  style={{ textShadow: "0 2px 22px rgba(0,0,0,0.75)" }}
                >
                  {LAYER_TOP_LEFT_CONTENT[currentLayer]!.body}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {/* Drone layer title (matches System page). Shown only during swarm view, hidden when overlay cards show. */}
        {currentLayer === 2 && focusStage === "idle" && (
          <div className="absolute top-[80px] left-[4%] md:left-[5%] z-30 pointer-events-none">
            <h2 className="text-h1 text-[var(--text-primary)]">Our Drone Model</h2>
          </div>
        )}

        {/* Center 3D models per layer */}
        {currentLayer === 2 && focusStage !== "idle" ? (
          <>
            <div className="absolute inset-0">
              <DroneModel3D
                focusLayer={
                  currentSystemSection && isComponentSection(currentSystemSection)
                    ? currentSystemSection.layerName
                    : null
                }
              />
            </div>
            {currentSystemSection && (
              <div
                className={`absolute bottom-[8%] left-[4%] md:left-[5%] z-30 pointer-events-auto ${
                  isWideOverlay
                    ? isSliderOverlay
                      ? "w-[90%] md:w-[39%] max-w-[690px]"
                      : "w-[92%] md:w-[52%] max-w-[920px]"
                    : "w-[90%] md:w-[35%] max-w-[450px]"
                }`}
              >
                <div className="bg-[var(--bg-black)]/80 backdrop-blur-md rounded-lg p-6 md:p-8 border border-[var(--divider)]">
                  {(() => {
                    const isLast = currentSystemIndex === systemSections.length - 1;
                    const isFirst = currentSystemIndex === 0;
                    return (
                    <SectionBlock
                      key={currentSystemSection.id}
                      caption={currentSystemSection.caption}
                      title={currentSystemSection.title}
                      content={currentSystemSection.content}
                      media={isComponentSection(currentSystemSection) ? currentSystemSection.media : undefined}
                      onBack={() => {
                        if (!isFirst) {
                          setCurrentSystemIndex((i) => Math.max(i - 1, 0));
                        } else {
                          setFocusStage("idle");
                          setFocusedIndex(null);
                          setSuppressFocus(true);
                        }
                      }}
                      onNext={() => {
                        if (!isLast) {
                          setCurrentSystemIndex((i) => Math.min(i + 1, systemSections.length - 1));
                        } else {
                          // advance to ground layer and reset focus
                          setCurrentLayer(3);
                          setFocusStage("idle");
                          setFocusedIndex(null);
                          setCurrentSystemIndex(0);
                          setSuppressFocus(true);
                        }
                      }}
                      canGoBack={true}
                      canGoNext={true}
                    />
                    );
                  })()}
                </div>
              </div>
            )}
          </>
        ) : (
        <div className="absolute inset-0 pointer-events-none" key={currentLayer}>
          <Canvas
            camera={{ position: [0, 0.8, 4], fov: 45 }}
            gl={{ antialias: true, alpha: true }}
            onCreated={({ gl, camera }) => {
              gl.setClearColor(0x000000, 0);
              camRef.current = camera as THREE.PerspectiveCamera;
            }}
            className="w-full h-full"
          >
            <CameraLerper
              camRef={camRef}
              focusStage={focusStage}
              active={currentLayer === 2}
                activePreset={activeCameraPreset}
              onArrive={() => {
                if (focusStage === "focusing") setFocusStage("pinned");
              }}
            />
            <ambientLight intensity={1.1} />
            <directionalLight position={[3, 5, 3]} intensity={1.2} />
            <Suspense fallback={null}>
              <LayerScene layerId={layer.id} focusedIndex={focusedIndex} focusStage={focusStage} />
            </Suspense>
            <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
          </Canvas>
        </div>
        )}

        {/* Layer Indicator - Right Side */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20">
          <div className="space-y-6">
            {layers.map((l, index) => {
              const LayerIcon = l.icon;
              const isActive = index === currentLayer;
              const isPast = index < currentLayer;
              return (
                <div
                  key={l.id}
                  className="flex items-center gap-4 transition-all duration-500"
                  style={{
                    opacity: isPast ? 0.4 : isActive ? 1 : 0.6,
                    transform: isActive ? "scale(1.1)" : "scale(1)",
                  }}
                >
                  <div className="text-right">
                    <div className="text-xs font-mono text-white/70">{l.altitude}</div>
                    <div
                      className={`text-sm font-bold transition-all ${
                        isActive ? "text-white" : "text-white/60"
                      }`}
                    >
                      {l.subtitle}
                    </div>
                  </div>
                  <div className={`p-2 rounded-lg transition-all ${isActive ? "bg-white/20" : "bg-white/5"}`}>
                    <LayerIcon className={`w-5 h-5 transition-all ${isActive ? "text-white" : "text-white/50"}`} />
                  </div>
                  <div className={`h-0.5 transition-all ${isActive ? "w-16 bg-white" : "w-8 bg-white/30"}`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Descent Progress - Bottom Left */}
        <div className="absolute bottom-8 left-8 text-white z-20">
          <div className="text-xs font-mono opacity-70 mb-1">DESCENT PROGRESS</div>
          <div className="text-4xl font-bold mb-2">
            {currentLayer + 1} / {layers.length}
          </div>
          <div className="text-sm opacity-80">{layer.title}</div>

          <div className="w-48 h-2 bg-white/20 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-300 ease-out"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
        </div>

        {/* Falling Animation Indicators */}
        <div className="absolute inset-x-0 top-0 h-32 pointer-events-none overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-16 bg-white/30"
              style={{
                left: `${20 + i * 15}%`,
                top: "-20px",
                animation: "fall 2s linear infinite",
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fall {
          0% { transform: translateY(-20px); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(150vh); opacity: 0; }
        }
      `}</style>
    </section>
  );
}

function SatelliteModel() {
  const { scene } = useGLTF("/models/satellite-optimized.glb");
  return <primitive object={scene} scale={1.5} />;
}

const SAT_ORBIT = {
  radius: 0.8,
  height: 0.35,
  speed: -0.001, // pinned position
  baseAngle: -1.25, // controls where it sits around Earth
  spinSpeed: 0.16, // blade-like roll around the look axis (20% speed)
};

function SatelliteOrbit() {
  const ref = useRef<THREE.Group>(null);
  const tOrbitRef = useRef(0);
  const tSpinRef = useRef(0);
  const up = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const target = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  const m4 = useMemo(() => new THREE.Matrix4(), []);
  // Spin around the panel axis (local Y) so the wings rotate without changing the dish aim.
  const spinAxisLocal = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const forwardLocal = useMemo(() => new THREE.Vector3(0, 0, -1), []);
  const spinAxisWorld = useMemo(() => new THREE.Vector3(), []);
  const flipQuat = useMemo(() => new THREE.Quaternion(), []);
  const spinQuat = useMemo(() => new THREE.Quaternion(), []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    tOrbitRef.current += delta * SAT_ORBIT.speed;
    tSpinRef.current += delta * SAT_ORBIT.spinSpeed;
    const angle = SAT_ORBIT.baseAngle + tOrbitRef.current;

    const x = Math.cos(angle) * SAT_ORBIT.radius;
    const z = Math.sin(angle) * SAT_ORBIT.radius;
    const y = SAT_ORBIT.height;

    ref.current.position.set(x, y, z);

    // Look at Earth center, then apply the model's base offset.
    m4.lookAt(ref.current.position, target, up);
    const lookQuat = new THREE.Quaternion().setFromRotationMatrix(m4);

    // Flip the model 180° around the forward axis so it faces the opposite way while still aiming at Earth.
    const forwardAxisWorld = forwardLocal.clone().applyQuaternion(lookQuat).normalize();
    flipQuat.setFromAxisAngle(forwardAxisWorld, Math.PI);
    const baseQuat = flipQuat.clone().multiply(lookQuat);

    // Spin around the panel axis (local Y) after the flip so blades rotate correctly.
    spinAxisWorld.copy(spinAxisLocal).applyQuaternion(baseQuat).normalize();
    spinQuat.setFromAxisAngle(spinAxisWorld, tSpinRef.current);

    ref.current.quaternion.copy(spinQuat.multiply(baseQuat));
  });

  return (
    <group ref={ref}>
      <SatelliteModel />
    </group>
  );
}

function CropDusterModel() {
  const { scene } = useGLTF("/models/crop_duster-optimized.glb");
  // Further reduced (~20% more → 0.308) and pitched to show more of the top.
  return <primitive object={scene} scale={0.2} rotation={[1.3, -Math.PI / 9, 0]} position={[0, 0.1, 0]} />;
}

function CropDusterFlight() {
  const ref = useRef<THREE.Group>(null);
  const tRef = useRef(0);

  useFrame((_, delta) => {
    if (!ref.current) return;
    // Slow forward drift with a gentle lateral sway; loop to keep it on screen.
    tRef.current = (tRef.current + delta * 0.22) % 8;
    const x = 1.2 - tRef.current * 0.35; // move left across the frame
    const z = Math.sin(tRef.current * 0.6) * 0.35; // slight weaving
    ref.current.position.set(x, 0.1, z);
  });

  return (
    <group ref={ref}>
      <CropDusterModel />
    </group>
  );
}

function DroneModel({ position = [0, 0, 0] as [number, number, number] }) {
  const { scene } = useGLTF("/models/Blend2.2-optimized.glb");
  // Clone the GLTF scene so multiple instances can render simultaneously.
  const cloned = useMemo(() => scene.clone(true), [scene]);
  // Slightly larger so all three are visible at once.
  return <primitive object={cloned} position={position} scale={0.005} />;
}

function TractorModel() {
  const { scene } = useGLTF("/models/tractor-optimized.glb");
  // Slightly smaller (0.7 * 0.95 ≈ 0.665) to sit behind the excavator without overlap.
  return <primitive object={scene} scale={0.0043} rotation={[0, 0, 0]} position={[0.7, 0, 0]} />;
}

function ExcavatorModel() {
  const { scene } = useGLTF("/models/excavator_cat-optimized.glb");
  // Larger by +0.3 (0.7 -> 1.0) to better match the tractor size.
  return <primitive object={scene} scale={27.0} rotation={[0, 0, 0]} position={[-0.3, 0, 0]} />;
}

function groundAnchorFromScreen(camera: THREE.PerspectiveCamera, screenX: number, screenY: number, groundY: number) {
  const ndc = new THREE.Vector3(screenX * 2 - 1, -(screenY * 2 - 1), 0.5);
  const origin = camera.position.clone();
  const direction = ndc.unproject(camera).sub(origin).normalize();
  const dirY = Math.abs(direction.y) < 1e-4 ? (direction.y < 0 ? -1e-4 : 1e-4) : direction.y;
  const distance = (groundY - origin.y) / dirY;
  return origin.add(direction.multiplyScalar(distance));
}

function GroundVehicles() {
  const { camera } = useThree();
  const excavatorRef = useRef<THREE.Group>(null);
  const tractorRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  // Animate a subtle yaw swivel for digging; keep tractor static.
  useFrame((_, delta) => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return;
    timeRef.current += delta;

    const excavatorPos = groundAnchorFromScreen(
      camera,
      MIRROR_GROUND ? 1 - GROUND_LAYOUT.excavator.screenX : GROUND_LAYOUT.excavator.screenX,
      GROUND_LAYOUT.excavator.screenY,
      GROUND_LAYOUT.y,
    );
    const tractorPos = groundAnchorFromScreen(
      camera,
      MIRROR_GROUND ? 1 - GROUND_LAYOUT.tractor.screenX : GROUND_LAYOUT.tractor.screenX,
      GROUND_LAYOUT.tractor.screenY,
      GROUND_LAYOUT.y,
    );

    if (excavatorRef.current) {
      const baseYaw = GROUND_LAYOUT.excavator.yaw ?? 0;
      const animYaw = MIRROR_GROUND
        ? -baseYaw - Math.sin(timeRef.current * 1.1) * 0.06
        : baseYaw + Math.sin(timeRef.current * 1.1) * 0.06; // gentle left-right swivel
      excavatorRef.current.position.copy(excavatorPos);
      excavatorRef.current.rotation.set(
        GROUND_LAYOUT.excavator.pitch ?? 0,
        animYaw,
        MIRROR_GROUND ? -(GROUND_LAYOUT.excavator.roll ?? 0) : (GROUND_LAYOUT.excavator.roll ?? 0),
      );
    }

    if (tractorRef.current) {
      tractorRef.current.position.copy(tractorPos);
      tractorRef.current.rotation.set(
        GROUND_LAYOUT.tractor.pitch ?? 0,
        MIRROR_GROUND ? -(GROUND_LAYOUT.tractor.yaw ?? 0) : (GROUND_LAYOUT.tractor.yaw ?? 0),
        MIRROR_GROUND ? -(GROUND_LAYOUT.tractor.roll ?? 0) : (GROUND_LAYOUT.tractor.roll ?? 0),
      );
    }
  });

  // Initial placement before the first frame runs.
  const initialExcavator = camera instanceof THREE.PerspectiveCamera
    ? groundAnchorFromScreen(camera, GROUND_LAYOUT.excavator.screenX, GROUND_LAYOUT.excavator.screenY, GROUND_LAYOUT.y)
    : new THREE.Vector3();
  const initialTractor = camera instanceof THREE.PerspectiveCamera
    ? groundAnchorFromScreen(camera, GROUND_LAYOUT.tractor.screenX, GROUND_LAYOUT.tractor.screenY, GROUND_LAYOUT.y)
    : new THREE.Vector3();

  return (
    <>
      <group ref={excavatorRef} position={initialExcavator}>
        <ExcavatorModel />
      </group>
      <group ref={tractorRef} position={initialTractor}>
        <TractorModel />
      </group>
    </>
  );
}

function Spin({ speed = 0.25, children }: { speed?: number; children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * speed;
  });
  return <group ref={ref}>{children}</group>;
}

function DronesScene({
  focusedIndex,
  focusStage,
}: {
  focusedIndex: number | null;
  focusStage: "idle" | "focusing" | "pinned";
}) {
  const refs: React.RefObject<THREE.Group>[] = [
    useRef<THREE.Group>(null!),
    useRef<THREE.Group>(null!),
    useRef<THREE.Group>(null!),
  ];

  // Run swarm only when not focusing/pinned.
  useDroneSwarm(refs, {
    bounds: { minX: -2.6, maxX: 2.6, minZ: -1.8, maxZ: 1.8, yBase: 0.02, yAmp: 0.12 },
    speed: 0.6,
    separationRadius: 0.4,
    separationStrength: 1.6,
    boundaryPadding: 0.25,
    boundaryStrength: 1.6,
    yawFollow: 3.5,
    scanChancePerSec: 0.16,
    enabled: focusStage === "idle",
  } as any);

  const focusTarget = useMemo(() => new THREE.Vector3(0, 0.05, 0), []);

  useFrame((_, delta) => {
    if (focusStage === "idle" || focusedIndex === null) return;
    refs.forEach((ref, i) => {
      if (!ref.current) return;
      if (i !== focusedIndex) {
        ref.current.visible = false;
        return;
      }
      ref.current.visible = true;
      // Gently lerp the focused drone to center and smooth its yaw
      ref.current.position.lerp(focusTarget, 1 - Math.exp(-4 * delta));
      const euler = ref.current.rotation;
      euler.y = THREE.MathUtils.lerp(euler.y, 0, 1 - Math.exp(-4 * delta));
    });
  });

  return (
    <>
      <group ref={refs[0]}>
        <DroneModel />
      </group>
      <group ref={refs[1]}>
        <DroneModel />
      </group>
      <group ref={refs[2]}>
        <DroneModel />
      </group>
    </>
  );
}

function SystemOverlayLite({ title, body, visible }: { title?: string; body?: string; visible: boolean }) {
  if (!visible) return null;
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-30">
      <div className="bg-black/60 backdrop-blur-sm text-white p-4 rounded-lg border border-cyan-400 shadow-lg max-w-md text-center">
        <div className="text-cyan-300 font-semibold mb-2">{title}</div>
        <div className="text-sm text-white/90 leading-relaxed">{body}</div>
      </div>
    </div>
  );
}

function CameraLerper({
  camRef,
  focusStage,
  active,
  activePreset,
  onArrive,
}: {
  camRef: React.RefObject<THREE.PerspectiveCamera | null>;
  focusStage: "idle" | "focusing" | "pinned";
  active: boolean;
  activePreset: { position: [number, number, number]; lookAt: [number, number, number]; fov: number } | null;
  onArrive: () => void;
}) {
  const targetRef = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  const desiredLook = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  const desiredPos = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const cam = camRef.current;
    if (!cam) return;

    if (!active || focusStage === "idle" || !activePreset) {
      desiredPos.set(0, 0.8, 4);
      desiredLook.set(0, 0, 0);
    } else {
      desiredPos.set(...activePreset.position);
      desiredLook.set(...activePreset.lookAt);
    }

    cam.position.lerp(desiredPos, 1 - Math.exp(-4 * delta));
    targetRef.lerp(desiredLook, 1 - Math.exp(-4 * delta));
    cam.lookAt(targetRef);

    if (cam instanceof THREE.PerspectiveCamera && activePreset) {
      cam.fov += (activePreset.fov - cam.fov) * (1 - Math.exp(-4 * delta));
      cam.updateProjectionMatrix();
    }

    if (focusStage === "focusing" && cam.position.distanceTo(desiredPos) < 0.08) {
      onArrive();
    }
  });

  return null;
}

function LayerScene({
  layerId,
  focusedIndex,
  focusStage,
}: {
  layerId: number;
  focusedIndex: number | null;
  focusStage: "idle" | "focusing" | "pinned";
}) {
  switch (layerId) {
    case 1:
      return <SatelliteOrbit />;
    case 2:
      return <CropDusterFlight />;
    case 3:
      return <DronesScene focusedIndex={focusedIndex} focusStage={focusStage} />;
    case 4:
    default:
      return (
        <GroundVehicles />
      );
  }
}

useGLTF.preload("/models/satellite-optimized.glb");
useGLTF.preload("/models/crop_duster-optimized.glb");
useGLTF.preload("/models/Blend2.2-optimized.glb");
useGLTF.preload("/models/excavator_cat-optimized.glb");
useGLTF.preload("/models/tractor-optimized.glb");

