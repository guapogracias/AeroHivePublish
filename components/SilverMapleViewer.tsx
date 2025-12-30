"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

// Lower = bigger on screen (camera fits tighter).
const FIT_PADDING = 1;
// Increase to move the tree DOWN in the frame (more headroom at the top).
const CAMERA_Y_FACTOR = 0.25;
// Increase to also bias the look target upward (can help if crown still clips).
const LOOK_AT_Y_FACTOR = 0.0;

function Model() {
  // NOTE: optimized with EXT_meshopt_compression, so enable meshopt decoder (3rd arg).
  const { scene } = useGLTF("/models/silver_maple-optimized.glb", false, true);
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  const { scale, centeredScene, maxDimScaled } = useMemo(() => {
    const cloned = scene.clone(true);
    const box = new THREE.Box3().setFromObject(cloned);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    // Center the model at origin.
    cloned.position.sub(center);

    // Fit to a consistent size.
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const target = 5; // scene units
    const s = target / maxDim;

    return { scale: s, centeredScene: cloned, maxDimScaled: maxDim * s };
  }, [scene]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    // Very slow spin.
    groupRef.current.rotation.y += delta * 0.12;
  });

  // Keep the tree fully inside the canvas bounds (no visual clipping).
  // We compute a distance from the camera FOV and the model size.
  useMemo(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return;
    const fov = THREE.MathUtils.degToRad(camera.fov);
    const dist = (maxDimScaled / (2 * Math.tan(fov / 2))) * FIT_PADDING;
    camera.position.set(0, maxDimScaled * CAMERA_Y_FACTOR, dist);
    camera.near = Math.max(0.01, dist / 100);
    camera.far = dist * 10;
    camera.updateProjectionMatrix();
    camera.lookAt(0, maxDimScaled * LOOK_AT_Y_FACTOR, 0);
  }, [camera, maxDimScaled]);

  return (
    <group ref={groupRef} scale={scale}>
      <primitive object={centeredScene} />
    </group>
  );
}

export default function SilverMapleViewer() {
  return (
    <div className="w-full h-full min-h-[520px] md:min-h-[720px]">
      <Canvas
        camera={{ position: [0, 0.2, 5], fov: 42 }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          {/* Unlit model: ambient is enough, but keep an environment for subtle reflections if present */}
          <ambientLight intensity={1.0} />
          <Model />
          <Environment preset="city" />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/silver_maple-optimized.glb", false, true);


