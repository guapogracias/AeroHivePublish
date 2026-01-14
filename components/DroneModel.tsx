"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import { Suspense, useEffect, useRef, useMemo } from "react";
import * as THREE from "three";

const IS_DEV = process.env.NODE_ENV !== "production";

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
  // Camera smoothing is time-based (see useFrame). Higher = faster settle.
  cameraLerpSpeed: 5.0,
};

const LAYER_NAMES = ["camera", "LiDAR", "PX4", "Jetson"];

// Hardcoded camera positions for each layer
const LAYER_CAMERA_POSITIONS: Record<string, {
  position: [number, number, number];
  rotation: [number, number, number];
  fov: number;
}> = {
  "camera": {
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

// For layers where we want a consistent *relative* view (not an absolute camera pose),
// compute a camera pose from the focused object's position.
const LAYER_ORBIT_PRESETS: Record<
  string,
  { offset: [number, number, number]; fov: number; lookAtOffset?: [number, number, number] }
> = {
  // Low, side-on profile view exposing the wiring bay / board area.
  // If the angle needs tweaking, adjust the offset and refresh.
  Jetson: { offset: [2.6, 1.2, 0.9], fov: 55, lookAtOffset: [0, 0.05, 0] },
};

interface LayerData {
  object: THREE.Object3D;
  meshes: THREE.Mesh[];
  originalMaterials: THREE.Material[][];
}

function restoreAnyHighlightedMeshes(root: THREE.Object3D) {
  root.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    const prev = (child.userData as any).__aerohivePrevMaterial as
      | THREE.Material
      | THREE.Material[]
      | undefined;
    if (!prev) return;
    child.material = prev as any;
    delete (child.userData as any).__aerohivePrevMaterial;
  });
}

function createHighlightMaterial(origMat: THREE.Material): THREE.MeshStandardMaterial {
  const origAsAny = origMat as any;
  const sourceOpacity =
    typeof origAsAny.opacity === "number" ? (origAsAny.opacity as number) : 1;
  const sourceTransparent =
    typeof origAsAny.transparent === "boolean" ? (origAsAny.transparent as boolean) : false;
  const sourceColorWrite =
    typeof origAsAny.colorWrite === "boolean" ? (origAsAny.colorWrite as boolean) : true;

  const isMarkerInvisible =
    sourceOpacity <= 0.01 || sourceColorWrite === false || (sourceTransparent && sourceOpacity <= 0.05);

  // Prefer cloning PBR materials (keeps most settings)
  if (origMat instanceof THREE.MeshStandardMaterial) {
    const cloned = origMat.clone();
    cloned.emissive.copy(HIGHLIGHT_CONFIG.emissiveColor);
    cloned.emissiveIntensity = isMarkerInvisible ? 1.0 : HIGHLIGHT_CONFIG.minIntensity;

    // If the source is intentionally invisible (common for marker meshes),
    // force a visible overlay so the highlight can be seen.
    if (isMarkerInvisible) {
      cloned.transparent = true;
      cloned.opacity = 0.35;
      cloned.depthWrite = false;
      cloned.depthTest = false;
      cloned.blending = THREE.AdditiveBlending;
      cloned.side = THREE.DoubleSide;
      cloned.toneMapped = false;
      cloned.polygonOffset = true;
      cloned.polygonOffsetFactor = -1;
      cloned.polygonOffsetUnits = -1;
    }

    return cloned;
  }

  // Fallback: convert other material types (e.g., Phong/Basic) to Standard so emissive works.
  // Preserve common visual properties where possible.
  const anyMat = origMat as unknown as {
    color?: THREE.Color;
    map?: THREE.Texture;
    normalMap?: THREE.Texture;
    roughnessMap?: THREE.Texture;
    metalnessMap?: THREE.Texture;
    emissiveMap?: THREE.Texture;
    aoMap?: THREE.Texture;
    alphaMap?: THREE.Texture;
    transparent?: boolean;
    opacity?: number;
    side?: THREE.Side;
    alphaTest?: number;
    depthWrite?: boolean;
    depthTest?: boolean;
    wireframe?: boolean;
    roughness?: number;
    metalness?: number;
    envMapIntensity?: number;
    aoMapIntensity?: number;
  };

  const mat = new THREE.MeshStandardMaterial({
    color: anyMat.color?.clone?.() ?? new THREE.Color(0xffffff),
    map: anyMat.map ?? null,
    normalMap: anyMat.normalMap ?? null,
    roughnessMap: anyMat.roughnessMap ?? null,
    metalnessMap: anyMat.metalnessMap ?? null,
    emissiveMap: anyMat.emissiveMap ?? null,
    aoMap: anyMat.aoMap ?? null,
    alphaMap: anyMat.alphaMap ?? null,
    transparent: anyMat.transparent ?? false,
    opacity: anyMat.opacity ?? 1,
    side: anyMat.side ?? THREE.FrontSide,
    alphaTest: anyMat.alphaTest ?? 0,
    depthWrite: anyMat.depthWrite ?? true,
    depthTest: anyMat.depthTest ?? true,
    wireframe: anyMat.wireframe ?? false,
    roughness: typeof anyMat.roughness === "number" ? anyMat.roughness : 1,
    metalness: typeof anyMat.metalness === "number" ? anyMat.metalness : 0,
    envMapIntensity: typeof anyMat.envMapIntensity === "number" ? anyMat.envMapIntensity : 1,
    aoMapIntensity: typeof anyMat.aoMapIntensity === "number" ? anyMat.aoMapIntensity : 1,
  });

  // If the source material is intentionally invisible (common for marker meshes),
  // force a visible overlay so the highlight can be seen.
  if (isMarkerInvisible) {
    mat.transparent = true;
    mat.opacity = 0.35;
    mat.depthWrite = false;
    mat.depthTest = false;
    mat.blending = THREE.AdditiveBlending;
    mat.side = THREE.DoubleSide;
    mat.toneMapped = false;
    mat.polygonOffset = true;
    mat.polygonOffsetFactor = -1;
    mat.polygonOffsetUnits = -1;
  }

  mat.emissive.copy(HIGHLIGHT_CONFIG.emissiveColor);
  mat.emissiveIntensity = isMarkerInvisible ? 1.0 : HIGHLIGHT_CONFIG.minIntensity;
  return mat;
}

function Model({ focusLayer }: { focusLayer?: string | null }) {
  const { scene } = useGLTF("/models/Blend2.2-optimized.glb", true);
  const { camera } = useThree();
  const pivotRef = useRef<THREE.Group>(null);
  const modelRef = useRef<THREE.Group>(null);
  // IMPORTANT: never mutate the cached GLTF `scene` from useGLTF.
  // Other parts of the app (e.g. swarm drones) reuse that cache.
  const modelScene = useMemo(() => scene.clone(true), [scene]);

  // Clone materials once so any highlight mutations stay local to this component.
  useEffect(() => {
    const created: THREE.Material[] = [];

    modelScene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      if (!child.material) return;

      const mats = Array.isArray(child.material) ? child.material : [child.material];
      const cloned = mats.map((m) => {
        const c = m.clone();
        created.push(c);
        return c;
      });

      child.material = Array.isArray(child.material) ? cloned : cloned[0];
    });

    return () => {
      // restore any temporary overrides (safe: only touches modelScene)
      restoreAnyHighlightedMeshes(modelScene);
      created.forEach((m) => m.dispose());
    };
  }, [modelScene]);

  // Cache layer data once on mount
  const layerCache = useMemo(() => {
    const cache = new Map<string, LayerData>();
    
    LAYER_NAMES.forEach((name) => {
      const obj = modelScene.getObjectByName(name);
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
  }, [modelScene]);

  // Calculate model center and setup positioning
  const modelCenter = useMemo(() => {
    const box = new THREE.Box3().setFromObject(modelScene);
    const center = box.getCenter(new THREE.Vector3());
    return center.multiplyScalar(MODEL_SCALE);
  }, [modelScene]);

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
    // Restore any previously-highlighted meshes, regardless of which layer they came from.
    // This prevents "stuck blue" if state ever desyncs.
    restoreAnyHighlightedMeshes(modelScene);

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
      console.warn(`[DroneModel] focusLayer not found in GLB: "${focusLayer}"`);
      return;
    }

    // Clone/convert and modify materials
    const modifiedMats: THREE.MeshStandardMaterial[] = [];
    layerData.meshes.forEach((mesh, i) => {
      if (!mesh.material) return;

      // Save the current material so we can always restore it later.
      // (Avoids relying on layer cache ordering or cloned materials.)
      if (!(mesh.userData as any).__aerohivePrevMaterial) {
        (mesh.userData as any).__aerohivePrevMaterial = Array.isArray(mesh.material)
          ? [...mesh.material]
          : mesh.material;
      }

      const originalMats = layerData.originalMaterials[i];
      const newMats = originalMats.map((origMat) => {
        const highlighted = createHighlightMaterial(origMat);
        modifiedMats.push(highlighted);
        return highlighted;
      });

      mesh.material = Array.isArray(mesh.material) ? newMats : newMats[0];
    });

    highlightState.current = {
      layerName: focusLayer,
      modifiedMaterials: modifiedMats,
    };

    if (
      process.env.NODE_ENV !== "production" &&
      (focusLayer === "Jetson" || focusLayer === "PX4")
    ) {
      console.info("[DroneModel] highlight applied", {
        focusLayer,
        meshes: layerData.meshes.length,
        modifiedMaterials: modifiedMats.length,
        meshNames: layerData.meshes.map((m) => m.name || "(unnamed)"),
        materialTypes: layerData.originalMaterials
          .flat()
          .map((m) => (m as any)?.type ?? m.constructor?.name ?? "Unknown"),
      });
    }

    currentIntensity.current = HIGHLIGHT_CONFIG.minIntensity;

    // Use hardcoded camera position if available
    const cameraConfig = LAYER_CAMERA_POSITIONS[focusLayer];
    if (cameraConfig) {
      targetCameraPosition.current.set(...cameraConfig.position);
      targetCameraRotation.current.set(...cameraConfig.rotation);
      targetCameraFov.current = cameraConfig.fov;
    } else if (LAYER_ORBIT_PRESETS[focusLayer]) {
      // Computed pose relative to the focused object (helps when GLB changes slightly).
      const preset = LAYER_ORBIT_PRESETS[focusLayer];

      const layerPos = new THREE.Vector3();
      layerData.object.getWorldPosition(layerPos);
      layerPos.multiplyScalar(MODEL_SCALE);
      layerPos.sub(modelCenter);
      layerPos.add(new THREE.Vector3(ANCHOR_OFFSET_X, 0, 0));

      const lookAt = layerPos.clone();
      if (preset.lookAtOffset) {
        lookAt.add(new THREE.Vector3(...preset.lookAtOffset));
      }

      const desiredPos = lookAt.clone().add(new THREE.Vector3(...preset.offset));
      targetCameraPosition.current.copy(desiredPos);
      targetCameraFov.current = preset.fov;

      const tmpCam = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
      tmpCam.position.copy(desiredPos);
      tmpCam.lookAt(lookAt);
      targetCameraRotation.current.copy(tmpCam.rotation);
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

      targetRotation.current.set(0, Math.atan2(-direction.x, -direction.z), 0);
    }
  }, [focusLayer, layerCache, modelCenter, camera, modelScene]);

  // Dev helper: press "P" to print the current camera pose to the console.
  // Use it to capture a perfect view for hardcoding into LAYER_CAMERA_POSITIONS.
  useEffect(() => {
    if (!IS_DEV) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "p") return;
      const isPerspective = camera instanceof THREE.PerspectiveCamera;
      // eslint-disable-next-line no-console
      console.log("[DroneModel] camera preset capture", {
        focusLayer: focusLayer ?? null,
        position: [camera.position.x, camera.position.y, camera.position.z],
        rotation: [camera.rotation.x, camera.rotation.y, camera.rotation.z],
        fov: isPerspective ? camera.fov : null,
      });
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [camera, focusLayer]);

  // Animation loop
  useFrame((state, delta) => {
    if (!pivotRef.current) return;

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
    const camT = 1 - Math.exp(-HIGHLIGHT_CONFIG.cameraLerpSpeed * Math.min(delta, 1 / 30));
    camera.position.lerp(targetCameraPosition.current, camT);
    
    // Smoothly interpolate rotation with angle wrapping
    const lerpAngle = (current: number, target: number, t: number) => {
      let diff = target - current;
      if (diff > Math.PI) diff -= Math.PI * 2;
      if (diff < -Math.PI) diff += Math.PI * 2;
      return current + diff * t;
    };
    
    camera.rotation.set(
      lerpAngle(camera.rotation.x, targetCameraRotation.current.x, camT),
      lerpAngle(camera.rotation.y, targetCameraRotation.current.y, camT),
      lerpAngle(camera.rotation.z, targetCameraRotation.current.z, camT)
    );

    // Smoothly interpolate FOV
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov += (targetCameraFov.current - camera.fov) * camT;
      camera.updateProjectionMatrix();
    }
  });

  return (
    <group ref={pivotRef}>
      <group ref={modelRef}>
        <primitive object={modelScene} scale={MODEL_SCALE} />
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
            enableZoom={IS_DEV}
            enablePan={false}
            autoRotate={!focusLayer}
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/Blend2.2-optimized.glb", true);
