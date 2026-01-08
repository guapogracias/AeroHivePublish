"use client";

import { useEffect, useRef, useState, Suspense, useMemo } from "react";
import type { LucideIcon } from "lucide-react";
import { Satellite, Plane, Boxes, Tractor } from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls, useGLTF, Stage } from "@react-three/drei";

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
                filter: isActive ? "brightness(0.78)" : "brightness(0.55)",
              }}
            />
          );
        })}

        {/* Color Overlay */}
        <div
          className="absolute inset-0 transition-all duration-700"
          style={{
            backgroundColor: layer.bgColor,
            opacity: 0.35,
          }}
        />

        {/* Center 3D models per layer */}
        <div className="absolute inset-0 pointer-events-none" key={currentLayer}>
          <Canvas
            camera={{ position: [0, 0.8, 4], fov: 45 }}
            gl={{ antialias: true, alpha: true }}
            onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
            className="w-full h-full"
          >
            <ambientLight intensity={1.1} />
            <directionalLight position={[3, 5, 3]} intensity={1.2} />
            <Suspense fallback={null}>
              <LayerScene layerId={layer.id} />
            </Suspense>
            <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
          </Canvas>
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
  return <primitive object={scene} scale={1.5} rotation={[-3, Math.PI / 4, -0.3]} />;
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
  return <primitive object={cloned} position={position} scale={0.007} rotation={[0, Math.PI / 3, 0]} />;
}

function TractorModel() {
  const { scene } = useGLTF("/models/tractor-optimized.glb");
  // Slightly smaller (0.7 * 0.95 ≈ 0.665) to sit behind the excavator without overlap.
  return <primitive object={scene} scale={0.005} rotation={[0, -Math.PI / 5, 0]} position={[0, 0, -2]} />;
}

function ExcavatorModel() {
  const { scene } = useGLTF("/models/excavator_cat-optimized.glb");
  // Larger by +0.3 (0.7 -> 1.0) to better match the tractor size.
  return <primitive object={scene} scale={23.0} rotation={[0, Math.PI / 6, 0]} position={[0, 0, 2]} />;
}

function Spin({ speed = 0.25, children }: { speed?: number; children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * speed;
  });
  return <group ref={ref}>{children}</group>;
}

function LayerScene({ layerId }: { layerId: number }) {
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
      return (
        <>
          <Spin speed={0.3}>
            <DroneModel position={[-0.8, -0.01, 0]} />
          </Spin>
          <Spin speed={0.35}>
            <DroneModel position={[0, -0.01, 0]} />
          </Spin>
          <Spin speed={0.28}>
            <DroneModel position={[0.8, -0.01, 0]} />
          </Spin>
        </>
      );
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

