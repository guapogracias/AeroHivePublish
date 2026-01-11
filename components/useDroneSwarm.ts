"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

type Bounds = {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  yBase: number;
  yAmp: number;
};

type SwarmOptions = {
  count: number;
  bounds: Bounds;
  enabled?: boolean;

  speed: number;
  maxAccel: number;
  wanderStrength: number;
  wanderRate: number;

  separationRadius: number;
  separationStrength: number;

  boundaryPadding: number;
  boundaryStrength: number;

  yawFollow: number;
  scanChancePerSec: number;
  scanDuration: [number, number];
  scanYaw: [number, number];
};

type DroneState = {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  wanderAngle: number;
  wanderRateJitter: number;
  yaw: number;
  scanT: number;
  scanPhase: number;
  scanMaxYaw: number;
};

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}

function lerpAngle(a: number, b: number, t: number) {
  const delta = ((((b - a) % (Math.PI * 2)) + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
  return a + delta * t;
}

function randBetween(rng: () => number, a: number, b: number) {
  return a + (b - a) * rng();
}

// tiny seeded RNG so each drone is deterministic across reloads
function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

export function useDroneSwarm(
  refs: React.RefObject<THREE.Group>[],
  options?: Partial<SwarmOptions>
) {
  const opts: SwarmOptions = {
    count: refs.length,
    bounds: { minX: -2.6, maxX: 2.6, minZ: -1.8, maxZ: 1.8, yBase: 0.02, yAmp: 0.12 },
    enabled: true,

    speed: 0.55,
    maxAccel: 1.2,
    wanderStrength: 0.9,
    wanderRate: 0.8,

    separationRadius: 0.4,
    separationStrength: 1.6,

    boundaryPadding: 0.25,
    boundaryStrength: 1.6,

    yawFollow: 3.5,
    scanChancePerSec: 0.16,
    scanDuration: [0.9, 1.8],
    scanYaw: [0.35, 0.9],

    ...options,
  };

  const statesRef = useRef<DroneState[] | null>(null);

  statesRef.current ??= (() => {
    const arr: DroneState[] = [];
    for (let i = 0; i < opts.count; i++) {
      const rng = mulberry32(1337 + i * 99991);
      const x = randBetween(rng, opts.bounds.minX * 0.5, opts.bounds.maxX * 0.5);
      const z = randBetween(rng, opts.bounds.minZ * 0.5, opts.bounds.maxZ * 0.5);
      const heading = randBetween(rng, -Math.PI, Math.PI);
      const vel = new THREE.Vector3(Math.cos(heading), 0, Math.sin(heading)).multiplyScalar(opts.speed);
      arr.push({
        pos: new THREE.Vector3(x, opts.bounds.yBase, z),
        vel,
        wanderAngle: randBetween(rng, -Math.PI, Math.PI),
        wanderRateJitter: randBetween(rng, 0.6, 1.4),
        yaw: heading,
        scanT: 0,
        scanPhase: randBetween(rng, 0, Math.PI * 2),
        scanMaxYaw: 0,
      });
    }
    return arr;
  })();

  const tmp = useMemo(() => {
    return {
      accel: new THREE.Vector3(),
      desired: new THREE.Vector3(),
      sep: new THREE.Vector3(),
      bound: new THREE.Vector3(),
      wander: new THREE.Vector3(),
      rngs: Array.from({ length: opts.count }, (_, i) => mulberry32(9001 + i * 424242)),
    };
  }, [opts.count]);

  useFrame((state, delta) => {
    if (!opts.enabled) return;
    const dt = Math.min(delta, 1 / 30);
    const drones = statesRef.current!;
    const b = opts.bounds;

    for (let i = 0; i < opts.count; i++) {
      const s = drones[i];
      const rng = tmp.rngs[i];

      tmp.accel.set(0, 0, 0);

      // wander
      s.wanderAngle += (rng() - 0.5) * opts.wanderRate * s.wanderRateJitter * dt;
      const forward = s.vel.clone().normalize();
      if (forward.lengthSq() < 1e-6) forward.set(1, 0, 0);

      tmp.wander.set(Math.cos(s.wanderAngle), 0, Math.sin(s.wanderAngle)).normalize();
      tmp.desired.copy(forward).addScaledVector(tmp.wander, 0.65).normalize().multiplyScalar(opts.speed);
      tmp.accel.addScaledVector(tmp.desired.sub(s.vel), opts.wanderStrength);

      // separation
      tmp.sep.set(0, 0, 0);
      for (let j = 0; j < opts.count; j++) {
        if (j === i) continue;
        const other = drones[j];
        const dx = s.pos.x - other.pos.x;
        const dz = s.pos.z - other.pos.z;
        const d2 = dx * dx + dz * dz;
        const r = opts.separationRadius;
        if (d2 > 1e-6 && d2 < r * r) {
          const d = Math.sqrt(d2);
          const strength = 1 - d / r;
          tmp.sep.x += (dx / d) * strength;
          tmp.sep.z += (dz / d) * strength;
        }
      }
      if (tmp.sep.lengthSq() > 1e-6) {
        tmp.sep.normalize().multiplyScalar(opts.separationStrength);
        tmp.accel.add(tmp.sep);
      }

      // bounds
      tmp.bound.set(0, 0, 0);
      const pad = opts.boundaryPadding;
      const left = b.minX + pad;
      const right = b.maxX - pad;
      const near = b.minZ + pad;
      const far = b.maxZ - pad;
      if (s.pos.x < left) tmp.bound.x += (left - s.pos.x) / pad;
      if (s.pos.x > right) tmp.bound.x -= (s.pos.x - right) / pad;
      if (s.pos.z < near) tmp.bound.z += (near - s.pos.z) / pad;
      if (s.pos.z > far) tmp.bound.z -= (s.pos.z - far) / pad;
      if (tmp.bound.lengthSq() > 1e-6) {
        tmp.bound.normalize().multiplyScalar(opts.boundaryStrength);
        tmp.accel.add(tmp.bound);
      }

      // clamp accel
      const aLen = tmp.accel.length();
      if (aLen > opts.maxAccel) tmp.accel.multiplyScalar(opts.maxAccel / aLen);

      // integrate velocity and clamp around target speed
      s.vel.addScaledVector(tmp.accel, dt);
      const sp = s.vel.length();
      if (sp > 1e-6) {
        const target = opts.speed;
        const k = clamp(target / sp, 0.6, 1.6);
        s.vel.multiplyScalar(k);
      }
      s.pos.addScaledVector(s.vel, dt);
      s.pos.x = clamp(s.pos.x, b.minX, b.maxX);
      s.pos.z = clamp(s.pos.z, b.minZ, b.maxZ);

      // bobbing
      const t = state.clock.elapsedTime;
      const bob = Math.sin(t * 1.8 + i * 2.1) * b.yAmp;

      // scan / yaw
      const velYaw = Math.atan2(s.vel.z, s.vel.x);
      if (s.scanT <= 0) {
        const p = 1 - Math.exp(-opts.scanChancePerSec * dt);
        if (rng() < p) {
          s.scanT = randBetween(rng, opts.scanDuration[0], opts.scanDuration[1]);
          s.scanPhase = randBetween(rng, 0, Math.PI * 2);
          s.scanMaxYaw = randBetween(rng, opts.scanYaw[0], opts.scanYaw[1]);
        }
      }
      let scanOffset = 0;
      if (s.scanT > 0) {
        s.scanT -= dt;
        s.scanPhase += dt * 6.0;
        scanOffset = Math.sin(s.scanPhase) * s.scanMaxYaw;
      }
      const targetYaw = velYaw + scanOffset;
      s.yaw = lerpAngle(s.yaw, targetYaw, 1 - Math.exp(-opts.yawFollow * dt));

      // apply to group
      const g = refs[i]?.current;
      if (g) {
        g.position.set(s.pos.x, b.yBase + bob, s.pos.z);
        g.rotation.set(0, s.yaw, 0);
      }
    }
  });

  return statesRef;
}

