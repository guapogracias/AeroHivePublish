# Drone Model Camera & Component Sections Implementation Plan

## Overview

This plan outlines the implementation of scroll-driven camera positioning for the DroneModel component, synchronized with new component sections that highlight specific hardware layers (Camera, LiDAR, PX4, Jetson).

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         SystemPage                                   │
│  ┌──────────────────────┐    ┌────────────────────────────────────┐ │
│  │   Left Panel (40%)   │    │       Right Panel (60%)            │ │
│  │                      │    │                                    │ │
│  │  ┌────────────────┐  │    │   ┌────────────────────────────┐   │ │
│  │  │ Hero Section   │  │    │   │                            │   │ │
│  │  └────────────────┘  │    │   │                            │   │ │
│  │  ┌────────────────┐  │    │   │      DroneModel            │   │ │
│  │  │ Section 01     │──│────│──▶│   (receives focusLayer)    │   │ │
│  │  └────────────────┘  │    │   │                            │   │ │
│  │  ┌────────────────┐  │    │   │   Camera position/rotation │   │ │
│  │  │ Component 01   │──│────│──▶│   controlled by layer      │   │ │
│  │  │ (Camera layer) │  │    │   │                            │   │ │
│  │  └────────────────┘  │    │   └────────────────────────────┘   │ │
│  │  ┌────────────────┐  │    │                                    │ │
│  │  │ Section 02     │  │    │                                    │ │
│  │  └────────────────┘  │    │                                    │ │
│  │  ┌────────────────┐  │    │                                    │ │
│  │  │ Component 02   │  │    │                                    │ │
│  │  │ (LiDAR layer)  │  │    │                                    │ │
│  │  └────────────────┘  │    │                                    │ │
│  │         ...          │    │                                    │ │
│  └──────────────────────┘    └────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Section Configuration & Data Structure

### 1.1 Define Unified Section Types

Create a type-safe configuration that distinguishes between content sections and component (hardware) sections:

```typescript
// types/sections.ts

export type SectionType = 'content' | 'component';

export interface BaseSection {
  id: string;
  caption: string;
  title: string;
  content: string;
  type: SectionType;
}

export interface ContentSection extends BaseSection {
  type: 'content';
}

export interface ComponentSection extends BaseSection {
  type: 'component';
  layerName: string;  // Maps to GLB object name
  cameraConfig: CameraConfig;
}

export interface CameraConfig {
  position: [number, number, number];  // Camera position offset
  lookAtOffset: [number, number, number];  // Offset from layer center
  fov?: number;  // Optional FOV adjustment
  distance?: number;  // Distance multiplier from layer
}

export type Section = ContentSection | ComponentSection;
```

### 1.2 Updated Sections Array

```typescript
// In app/system/page.tsx or separate config file

const sections: Section[] = [
  // --- Section 01 ---
  {
    id: 'section-01',
    type: 'content',
    caption: 'Section 01',
    title: 'Natural Language Control',
    content: 'Users can describe missions in any language...',
  },
  
  // --- Component 01: Camera ---
  {
    id: 'component-01',
    type: 'component',
    caption: 'Component 01',
    title: 'Camera System',
    content: 'Insert content here.',
    layerName: 'Camera Folded',
    cameraConfig: {
      position: [1.5, 0.5, 2],
      lookAtOffset: [0, 0, 0],
      distance: 1.5,
    },
  },
  
  // --- Section 02 ---
  {
    id: 'section-02',
    type: 'content',
    caption: 'Section 02',
    title: 'Coordinated & Scalable Operations',
    content: 'Flight paths are automatically planned...',
  },
  
  // --- Component 02: LiDAR ---
  {
    id: 'component-02',
    type: 'component',
    caption: 'Component 02',
    title: 'LiDAR',
    content: 'Insert content here.',
    layerName: 'LiDAR',
    cameraConfig: {
      position: [2, 1, 1.5],
      lookAtOffset: [0, 0, 0],
      distance: 1.8,
    },
  },
  
  // --- Section 03 ---
  {
    id: 'section-03',
    type: 'content',
    caption: 'Section 03',
    title: 'Camera & Sensing Framework',
    content: 'Using computer vision...',
  },
  
  // --- Component 03: PX4 ---
  {
    id: 'component-03',
    type: 'component',
    caption: 'Component 03',
    title: 'PX4',
    content: 'Insert content here.',
    layerName: 'PX4',
    cameraConfig: {
      position: [1, 1.5, 2],
      lookAtOffset: [0, 0, 0],
      distance: 2,
    },
  },
  
  // --- Section 04 ---
  {
    id: 'section-04',
    type: 'content',
    caption: 'Section 04',
    title: 'Autonomous Decision Making',
    content: 'The onboard AI processes...',
  },
  
  // --- Component 04: Jetson ---
  {
    id: 'component-04',
    type: 'component',
    caption: 'Component 04',
    title: 'Jetson',
    content: 'Insert content here.',
    layerName: 'Jetson',
    cameraConfig: {
      position: [0.5, 2, 1.5],
      lookAtOffset: [0, 0, 0],
      distance: 1.8,
    },
  },
];
```

### 1.3 Layer Name Mapping

Reference from `blender2-layers.txt`:

| Component | Layer Name in GLB |
|-----------|-------------------|
| Camera    | `Camera Folded` (or `Camera Folded.001`) |
| LiDAR     | `LiDAR` |
| PX4       | `PX4` |
| Jetson    | `Jetson` |

---

## Phase 2: DroneModel Camera Control System

### 2.1 Props Interface

```typescript
interface DroneModelProps {
  focusLayer?: string | null;  // Layer name to focus on
  transitionDuration?: number;  // Animation duration in ms
  onTransitionComplete?: () => void;  // Callback when camera arrives
}
```

### 2.2 Camera Controller Architecture

```
┌───────────────────────────────────────────────────────┐
│                   DroneModel                          │
│  ┌─────────────────────────────────────────────────┐  │
│  │              CameraController                    │  │
│  │                                                  │  │
│  │  focusLayer prop ──▶ Find Object by Name         │  │
│  │                            │                     │  │
│  │                            ▼                     │  │
│  │                   Calculate Bounding Box         │  │
│  │                            │                     │  │
│  │                            ▼                     │  │
│  │                   Compute Target Position        │  │
│  │                            │                     │  │
│  │                            ▼                     │  │
│  │           useFrame() ──▶ Lerp Camera Position    │  │
│  │                            │                     │  │
│  │                            ▼                     │  │
│  │                   camera.lookAt(target)          │  │
│  └─────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────┘
```

### 2.3 Camera Transition States

```typescript
type CameraState = 'idle' | 'transitioning' | 'holding';

interface CameraTransition {
  from: THREE.Vector3;
  to: THREE.Vector3;
  progress: number;  // 0 to 1
  state: CameraState;
  targetLookAt: THREE.Vector3;
}
```

### 2.4 Performance Optimizations

1. **Memoize layer lookups**: Cache `scene.getObjectByName()` results
2. **Pre-compute bounding boxes**: Calculate once per layer, not every frame
3. **Use `useMemo` for camera configs**: Avoid recalculating on each render
4. **Conditional `useFrame`**: Only run lerp calculations when transitioning
5. **Debounce rapid section changes**: Prevent camera jitter from fast scrolling

---

## Phase 3: Integration with SystemPage

### 3.1 State Flow

```
User Scrolls
     │
     ▼
handleScroll() updates currentSection
     │
     ▼
Determine if section is 'component' type
     │
     ▼
Extract layerName from section config
     │
     ▼
Pass layerName to <DroneModel focusLayer={layerName} />
     │
     ▼
DroneModel animates camera to layer position
```

### 3.2 Props Passing Pattern

```tsx
// In SystemPage
const currentLayerName = useMemo(() => {
  const section = sections[currentSection - 1]; // -1 for hero offset
  if (section?.type === 'component') {
    return section.layerName;
  }
  return null; // Default/overview camera position
}, [currentSection]);

// Pass to DroneModel
<DroneModel focusLayer={currentLayerName} />
```

### 3.3 Default Camera Behavior

When `focusLayer` is `null` (content sections or hero):
- Camera returns to default overview position
- Auto-rotate enabled
- Standard FOV

When `focusLayer` is set (component sections):
- Camera animates to layer position
- Auto-rotate disabled (or slowed)
- Adjusted FOV for close-up

---

## Phase 4: Implementation Steps

### Step 1: Create Types (Optional but Recommended)
- [ ] Create `types/sections.ts` with section type definitions
- [ ] Export types for use across components

### Step 2: Update Section Configuration
- [ ] Add 4 component sections to the sections array in `app/system/page.tsx`
- [ ] Interleave: Section 01 → Component 01 → Section 02 → Component 02 → ...
- [ ] Include `layerName` and `cameraConfig` for each component section

### Step 3: Update DroneModel Component
- [ ] Add `focusLayer` prop interface
- [ ] Implement `useLayerPosition` hook to find and cache layer positions
- [ ] Create `CameraController` sub-component with `useFrame` animation
- [ ] Handle default position when `focusLayer` is null
- [ ] Add smooth interpolation (lerp) for transitions

### Step 4: Connect SystemPage to DroneModel
- [ ] Calculate `currentLayerName` from current section
- [ ] Pass `focusLayer` prop to `DroneModel`
- [ ] Update `totalSections` count for new sections

### Step 5: Polish & Testing
- [ ] Test scroll transitions between all sections
- [ ] Verify camera positions for each layer
- [ ] Adjust camera configs as needed for best visual framing
- [ ] Performance test with React DevTools Profiler

---

## File Changes Summary

| File | Changes |
|------|---------|
| `app/system/page.tsx` | Add component sections, pass focusLayer prop |
| `components/DroneModel.tsx` | Add focusLayer prop, camera controller logic |
| `types/sections.ts` (new) | Type definitions for sections |

---

## Key Design Decisions

### Why pass layer name instead of camera position?

**Modularity**: The DroneModel owns the 3D logic. It knows where layers are positioned in 3D space. The SystemPage only needs to know which layer to focus on, not the implementation details of camera positioning.

### Why use lerp instead of CSS transitions?

Three.js camera positions are updated every frame via `useFrame`. Lerp provides smooth, physically-based interpolation that feels natural. CSS transitions don't work with Three.js camera properties.

### Why cache bounding boxes?

Computing bounding boxes via `new THREE.Box3().setFromObject()` traverses the entire object hierarchy. Caching prevents this on every frame, improving performance significantly.

### Why separate CameraController?

Separation of concerns. The Model component handles rendering, the CameraController handles animation. This makes testing easier and keeps components focused.

---

## Configuration Reference

### GLB Layer Names (from extraction)

```
NODES (Objects/Layers):
  [1] Camera Folded
  [2] Camera Folded.001
  [3] LiDAR
  [38] PX4
  [39] Jetson
```

### Recommended Camera Distances

| Layer | Distance Multiplier | Notes |
|-------|---------------------|-------|
| Camera | 1.5x | Close-up of camera module |
| LiDAR | 1.8x | Show sensor array |
| PX4 | 2.0x | Flight controller board |
| Jetson | 1.8x | Compute module |

---

## Future Enhancements

1. **Click-to-focus**: Allow clicking on model parts to trigger focus
2. **Layer highlighting**: Pulse/glow effect on focused layer
3. **Annotations**: 3D labels that appear near focused components
4. **Transition easing**: Use custom easing curves (ease-out, spring physics)
5. **Mobile support**: Touch gestures for layer navigation

---

## Testing Checklist

- [ ] Hero section shows default camera view
- [ ] Section 01 maintains default camera (or slight adjustment)
- [ ] Component 01 transitions camera to Camera layer
- [ ] Scrolling back reverses camera transition
- [ ] Rapid scrolling doesn't break camera state
- [ ] All 4 component layers are reachable and framed correctly
- [ ] No visual jitter during transitions
- [ ] Performance: 60fps maintained during transitions

