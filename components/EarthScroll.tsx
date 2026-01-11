"use client";

import { useEffect, useRef, useState, Suspense, useMemo } from "react";
import type { LucideIcon } from "lucide-react";
import { Satellite, Plane, Boxes, Tractor } from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useDroneSwarm } from "./useDroneSwarm";

const SYSTEM_PRESETS = [
  {
    layer: "PX4",
    title: "PX4",
    body: "Natural Language Control: describe missions in any language; converted to drone-ready commands via PX4 for safe, compliant ops.",
    camera: { position: [1, 1.5, 2] as [number, number, number], lookAt: [0, 0.1, 0] as [number, number, number], fov: 50 },
  },
  {
    layer: "Jetson",
    title: "Jetson",
    body: "Coordinated & Scalable Operations: onboard coordination/decision-making for multi-drone coverage without overlap.",
    camera: { position: [0.5, 2, 1.5] as [number, number, number], lookAt: [0, 0.1, 0] as [number, number, number], fov: 50 },
  },
  {
    layer: "camera",
    title: "Camera System",
    body: "Camera & Sensing Framework: real-time CV recognizes user-defined objects trained from examples or datasets.",
    camera: { position: [1.5, 0.5, 2] as [number, number, number], lookAt: [0, 0.1, 0] as [number, number, number], fov: 50 },
  },
  {
    layer: "LiDAR",
    title: "LiDAR",
    body: "Autonomous Decision Making: onboard AI adapts to changing conditions, avoids obstacles, and optimizes paths.",
    camera: { position: [2, 1, 1.5] as [number, number, number], lookAt: [0, 0.1, 0] as [number, number, number], fov: 50 },
  },
];

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
    subtitle: "Tractors",
    altitude: "0 meters",
    icon: Tractor,
    image: "/images/earth/ground.jpg",
    bgColor: "#78350f",
    centerImage: "/images/earth/ground.jpg",
  },
];

export function EarthScroll() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [currentLayer, setCurrentLayer] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [focusStage, setFocusStage] = useState<"idle" | "focusing" | "pinned">("idle");
  const camRef = useRef<THREE.PerspectiveCamera | null>(null);
  const [activePresetIdx, setActivePresetIdx] = useState(0);
  const activePreset =
    currentLayer === 2 && focusStage !== "idle" ? SYSTEM_PRESETS[activePresetIdx] : null;

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
    if (focusStage === "idle" && scrollProgress > 75) {
      setFocusedIndex(0);
      setFocusStage("focusing");
    }
  }, [focusStage, scrollProgress, currentLayer]);

  // Reset preset index when entering focus
  useEffect(() => {
    if (focusStage === "focusing") {
      setActivePresetIdx(0);
    }
  }, [focusStage]);

  // Scroll wheel to cycle presets when pinned/focusing on drones layer
  useEffect(() => {
    if (currentLayer !== 2 || focusStage === "idle") return;
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 5) return;
      setActivePresetIdx((idx) => {
        const next = e.deltaY > 0 ? idx + 1 : idx - 1;
        return Math.min(Math.max(next, 0), SYSTEM_PRESETS.length - 1);
      });
    };
    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [currentLayer, focusStage]);

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

          return (
            <div
              key={l.id}
              className="absolute inset-0 transition-all duration-700 ease-out"
              style={{
                backgroundImage: `url(${l.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: isActive ? 1 : 0,
                transform: isPast
                  ? "scale(1.15) translateY(-30%)"
                  : isFuture
                    ? "scale(0.9) translateY(30%)"
                    : "scale(1) translateY(0)",
                filter: "none",
              }}
            />
          );
        })}

        {/* Center 3D models per layer */}
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
              activePreset={activePreset}
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
          <SystemOverlayLite
            visible={currentLayer === 2 && focusStage === "pinned" && !!activePreset}
            title={activePreset?.title}
            body={activePreset?.body}
          />
        </div>

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
  // 300% larger than before (0.5 → 1.5).
  return <primitive object={scene} scale={1.5} rotation={[0.2, Math.PI / 4, 3]} />;
}

function CropDusterModel() {
  const { scene } = useGLTF("/models/crop_duster-optimized.glb");
  // Further reduced (~20% more → 0.308) and pitched to show more of the top.
  return <primitive object={scene} scale={0.2} rotation={[1.3, -Math.PI / 9, 0]} position={[0, 0.1, 0]} />;
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
  return <primitive object={scene} scale={0.004} rotation={[0, 0, 0]} position={[0.7, 0, 0]} />;
}

function ExcavatorModel() {
  const { scene } = useGLTF("/models/excavator_cat-optimized.glb");
  // Larger by +0.3 (0.7 -> 1.0) to better match the tractor size.
  return <primitive object={scene} scale={15.0} rotation={[0, 0, 0]} position={[-0.3, 0, 0]} />;
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
  activePreset: { camera: { position: [number, number, number]; lookAt: [number, number, number]; fov: number } } | null;
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
      desiredPos.set(...activePreset.camera.position);
      desiredLook.set(...activePreset.camera.lookAt);
    }

    cam.position.lerp(desiredPos, 1 - Math.exp(-4 * delta));
    targetRef.lerp(desiredLook, 1 - Math.exp(-4 * delta));
    cam.lookAt(targetRef);

    if (cam instanceof THREE.PerspectiveCamera && activePreset) {
      cam.fov += (activePreset.camera.fov - cam.fov) * (1 - Math.exp(-4 * delta));
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
      return (
        <Spin speed={0.2}>
          <SatelliteModel />
        </Spin>
      );
    case 2:
      return (
        // No spin for the plane; show it stable, top-leaning angle.
        <CropDusterModel />
      );
    case 3:
      return <DronesScene focusedIndex={focusedIndex} focusStage={focusStage} />;
    case 4:
    default:
      return (
        <>
          <Spin speed={0.2}>
            <ExcavatorModel />
          </Spin>
          <Spin speed={0.18}>
            <TractorModel />
          </Spin>
        </>
      );
  }
}

useGLTF.preload("/models/satellite-optimized.glb");
useGLTF.preload("/models/crop_duster-optimized.glb");
useGLTF.preload("/models/Blend2.2-optimized.glb");
useGLTF.preload("/models/excavator_cat-optimized.glb");
useGLTF.preload("/models/tractor-optimized.glb");

