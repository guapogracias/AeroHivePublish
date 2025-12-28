"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import { Suspense, useEffect, useRef, useMemo } from "react";
import * as THREE from "three";

interface DroneModelProps {
  focusLayer?: string | null;
}

const MODEL_SCALE = 0.04; // 10% larger: 0.042 * 1.1
const ANCHOR_OFFSET_X = 0.5; // Move anchor point to the right

const HIGHLIGHT_CONFIG = {
  emissiveColor: new THREE.Color(0x4da6ff),
  minIntensity: 0.3,
  maxIntensity: 0.8,
  pulseSpeed: 0.4,
  rotationSpeed: 0.05,
  cameraLerpSpeed: 0.02, // Slower for smoother, longer transitions
};

const LAYER_NAMES = ["Camera Folded", "LiDAR", "PX4", "Jetson"];

// Hardcoded camera positions for each layer
const LAYER_CAMERA_POSITIONS: Record<string, {
  position: [number, number, number];
  rotation: [number, number, number];
  fov: number;
}> = {
  "Camera Folded": {
    position: [2.054439966956498, 0.40741873602981604, -5.797696645712311],
    rotation: [-3.0714354689432573, 0.33977415909113695, 3.1181769192697133],
    fov: 50,
  },
  "LiDAR": {
    position: [1.6918970977214163, -0.8732958626227199, -5.8630059310090825],
    rotation: [2.993729570269003, 0.2780301219618628, -3.1007342447043307],
    fov: 50,
  },
  "PX4": {
    position: [-0.0000061620354486461314, 6.164414002965892, 1.7122829677297934e-7],
    rotation: [-1.5707962990179989, -9.99614147678851e-7, -1.5430158560082932],
    fov: 50,
  },
};

interface LayerData {
  object: THREE.Object3D;
  meshes: THREE.Mesh[];
  originalMaterials: THREE.Material[][];
}

function Model({ focusLayer }: { focusLayer?: string | null }) {
  const { scene } = useGLTF("/models/Blender2-optimized.glb", true);
  const { camera } = useThree();
  const pivotRef = useRef<THREE.Group>(null);
  const modelRef = useRef<THREE.Group>(null);

  // Cache layer data once on mount
  const layerCache = useMemo(() => {
    const cache = new Map<string, LayerData>();
    
    LAYER_NAMES.forEach((name) => {
      const obj = scene.getObjectByName(name);
      if (!obj) return;

      const meshes: THREE.Mesh[] = [];
      const originalMaterials: THREE.Material[][] = [];

      obj.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          meshes.push(child);
          const mats = Array.isArray(child.material) ? child.material : [child.material];
          originalMaterials.push(mats.map((m) => m.clone())); // Clone originals
        }
      });

      if (meshes.length > 0) {
        cache.set(name, { object: obj, meshes, originalMaterials });
      }
    });

    return cache;
  }, [scene]);

  // Calculate model center and setup positioning
  const modelCenter = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    return center.multiplyScalar(MODEL_SCALE);
  }, [scene]);

  // Current highlight state
  const highlightState = useRef<{
    layerName: string | null;
    modifiedMaterials: THREE.MeshStandardMaterial[];
  }>({ layerName: null, modifiedMaterials: [] });

  // Animation refs
  const pulsePhase = useRef(0);
  const currentIntensity = useRef(0);
  const targetRotation = useRef(new THREE.Euler(0, 0, 0));
  const currentRotation = useRef(new THREE.Euler(0, 0, 0));
  const lastCameraLogTime = useRef(0);

  // Camera animation refs
  const defaultCameraPosition = useRef(new THREE.Vector3(3, 2, 5));
  const defaultCameraRotation = useRef(new THREE.Euler(0, 0, 0));
  const targetCameraPosition = useRef(new THREE.Vector3(3, 2, 5));
  const targetCameraRotation = useRef(new THREE.Euler(0, 0, 0));
  const targetCameraFov = useRef(50);

  // Initialize model position and store default camera
  useEffect(() => {
    if (modelRef.current) {
      // Center model, then offset anchor to the right
      modelRef.current.position.set(
        -modelCenter.x + ANCHOR_OFFSET_X,
        -modelCenter.y,
        -modelCenter.z
      );
    }
    
    // Store default camera position
    defaultCameraPosition.current.copy(camera.position);
    defaultCameraRotation.current.copy(camera.rotation);
    if (camera instanceof THREE.PerspectiveCamera) {
      targetCameraFov.current = camera.fov;
    }
  }, [modelCenter, camera]);

  // Handle focus layer changes
  useEffect(() => {
    // Restore previous layer
    if (highlightState.current.layerName) {
      const prevData = layerCache.get(highlightState.current.layerName);
      if (prevData) {
        prevData.meshes.forEach((mesh, i) => {
          const originalMats = prevData.originalMaterials[i];
          if (originalMats && mesh.material) {
            mesh.material = Array.isArray(mesh.material)
              ? originalMats
              : originalMats[0];
          }
        });
      }
    }

    // Clear state
    highlightState.current.modifiedMaterials = [];
    highlightState.current.layerName = null;
    currentIntensity.current = 0;
    targetRotation.current.set(0, 0, 0);

    // Reset camera to default if no focus layer
    if (!focusLayer) {
      targetCameraPosition.current.copy(defaultCameraPosition.current);
      targetCameraRotation.current.copy(defaultCameraRotation.current);
      if (camera instanceof THREE.PerspectiveCamera) {
        targetCameraFov.current = 50;
      }
      return;
    }

    // Apply new highlight

    const layerData = layerCache.get(focusLayer);
    if (!layerData) {
      console.warn(`Layer "${focusLayer}" not found`);
      return;
    }

    // Clone and modify materials
    const modifiedMats: THREE.MeshStandardMaterial[] = [];
    layerData.meshes.forEach((mesh, i) => {
      if (!mesh.material) return;

      const originalMats = layerData.originalMaterials[i];
      const newMats = originalMats.map((origMat) => {
        if (origMat instanceof THREE.MeshStandardMaterial) {
          const cloned = origMat.clone();
          cloned.emissive.copy(HIGHLIGHT_CONFIG.emissiveColor);
          cloned.emissiveIntensity = HIGHLIGHT_CONFIG.minIntensity;
          modifiedMats.push(cloned);
          return cloned;
        }
        return origMat;
      });

      mesh.material = Array.isArray(mesh.material) ? newMats : newMats[0];
    });

    highlightState.current = {
      layerName: focusLayer,
      modifiedMaterials: modifiedMats,
    };

    currentIntensity.current = HIGHLIGHT_CONFIG.minIntensity;

    // Use hardcoded camera position if available
    const cameraConfig = LAYER_CAMERA_POSITIONS[focusLayer];
    if (cameraConfig) {
      targetCameraPosition.current.set(...cameraConfig.position);
      targetCameraRotation.current.set(...cameraConfig.rotation);
      targetCameraFov.current = cameraConfig.fov;
      console.log(`📸 Using hardcoded camera for "${focusLayer}"`, cameraConfig);
    } else {
      // Fallback: Calculate target rotation (no camera movement)
      const layerPos = new THREE.Vector3();
      layerData.object.getWorldPosition(layerPos);
      layerPos.multiplyScalar(MODEL_SCALE);
      layerPos.sub(modelCenter);
      layerPos.add(new THREE.Vector3(ANCHOR_OFFSET_X, 0, 0));

      const cameraPos = new THREE.Vector3();
      camera.getWorldPosition(cameraPos);

      const direction = new THREE.Vector3()
        .subVectors(cameraPos, layerPos)
        .normalize();

      targetRotation.current.set(
        0,
        Math.atan2(-direction.x, -direction.z),
        0
      );
    }
  }, [focusLayer, layerCache, modelCenter, camera]);

  // Animation loop
  useFrame((state, delta) => {
    if (!pivotRef.current) return;

    // Log camera position every second
    const now = Date.now();
    if (now - lastCameraLogTime.current > 1000) {
      const camPos = camera.position;
      const camRot = camera.rotation;
      const fov = camera instanceof THREE.PerspectiveCamera ? camera.fov : null;
      console.log("📷 Camera Position:", {
        position: [camPos.x, camPos.y, camPos.z],
        rotation: [camRot.x, camRot.y, camRot.z],
        fov: fov,
        focusLayer: focusLayer || "none",
      });
      lastCameraLogTime.current = now;
    }

    const { modifiedMaterials, layerName } = highlightState.current;

    // Pulse animation
    if (layerName && modifiedMaterials.length > 0) {
      pulsePhase.current += delta * HIGHLIGHT_CONFIG.pulseSpeed * Math.PI * 2;
      const targetIntensity =
        HIGHLIGHT_CONFIG.minIntensity +
        (HIGHLIGHT_CONFIG.maxIntensity - HIGHLIGHT_CONFIG.minIntensity) *
          (Math.sin(pulsePhase.current) * 0.5 + 0.5);

      currentIntensity.current +=
        (targetIntensity - currentIntensity.current) * 0.1;

      modifiedMaterials.forEach((mat) => {
        mat.emissiveIntensity = currentIntensity.current;
      });
    }

    // Rotation animation
    currentRotation.current.x +=
      (targetRotation.current.x - currentRotation.current.x) *
      HIGHLIGHT_CONFIG.rotationSpeed;
    currentRotation.current.y +=
      (targetRotation.current.y - currentRotation.current.y) *
      HIGHLIGHT_CONFIG.rotationSpeed;
    currentRotation.current.z +=
      (targetRotation.current.z - currentRotation.current.z) *
      HIGHLIGHT_CONFIG.rotationSpeed;

    pivotRef.current.rotation.copy(currentRotation.current);

    // Animate camera position and rotation with smooth, longer transitions
    camera.position.lerp(targetCameraPosition.current, HIGHLIGHT_CONFIG.cameraLerpSpeed);
    
    // Smoothly interpolate rotation with angle wrapping
    const lerpAngle = (current: number, target: number, t: number) => {
      let diff = target - current;
      if (diff > Math.PI) diff -= Math.PI * 2;
      if (diff < -Math.PI) diff += Math.PI * 2;
      return current + diff * t;
    };
    
    camera.rotation.set(
      lerpAngle(camera.rotation.x, targetCameraRotation.current.x, HIGHLIGHT_CONFIG.cameraLerpSpeed),
      lerpAngle(camera.rotation.y, targetCameraRotation.current.y, HIGHLIGHT_CONFIG.cameraLerpSpeed),
      lerpAngle(camera.rotation.z, targetCameraRotation.current.z, HIGHLIGHT_CONFIG.cameraLerpSpeed)
    );

    // Smoothly interpolate FOV
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov += (targetCameraFov.current - camera.fov) * HIGHLIGHT_CONFIG.cameraLerpSpeed;
      camera.updateProjectionMatrix();
    }
  });

  return (
    <group ref={pivotRef}>
      <group ref={modelRef}>
        <primitive object={scene} scale={MODEL_SCALE} />
      </group>
    </group>
  );
}

export default function DroneModel({ focusLayer }: DroneModelProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [3, 2, 5], fov: 50 }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Model focusLayer={focusLayer} />
          <Environment preset="city" />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={!focusLayer}
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/Blender2-optimized.glb", true);
