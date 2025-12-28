# Camera Focus System - Fresh Plan

## Goal

When user navigates to a component section (Camera, LiDAR, PX4, Jetson), the 3D camera should smoothly move to show that specific part of the drone model.

---

## Key Questions to Decide

### 1. How do we find layer positions?

**Option A: Hardcoded camera positions**
- Manually define camera position + lookAt for each layer
- Pros: Full control, predictable results
- Cons: Need to manually find good positions, won't adapt if model changes

**Option B: Dynamic from model**
- Query the GLB at runtime to find layer positions
- Pros: Automatic, adapts to model changes
- Cons: More complex, positions might not be ideal

**Option C: Hybrid**
- Query model for layer center, but use hardcoded offsets/distances
- Pros: Best of both worlds
- Cons: Still needs some manual tuning

### 2. How do we animate the camera?

**Option A: Control camera directly with useFrame + lerp**
- Disable OrbitControls, manually position camera each frame
- Pros: Full control
- Cons: Lose orbit functionality, more code

**Option B: Animate OrbitControls target**
- Keep OrbitControls, just change its `target` property
- Pros: Keeps orbit functionality, simpler
- Cons: Less control over exact camera position

**Option C: Use camera-controls library**
- Use `@react-three/drei` CameraControls with setLookAt
- Pros: Built-in smooth transitions, good API
- Cons: Additional dependency behavior to learn

### 3. What happens during focus?

**Option A: Camera moves, model stays still**
- Model doesn't rotate when focused
- Camera moves to show the layer

**Option B: Model rotates to show layer**
- Rotate the model so the layer faces the camera
- Camera stays relatively fixed

**Option C: Both move**
- Camera moves closer, model rotates slightly

### 4. What are the target layers?

From `blender2-layers.txt`:
```
[1] Camera Folded
[3] LiDAR
[38] PX4
[39] Jetson
```

---

## Proposed Approach

**Recommendation: Option A (Hardcoded) for camera positions**

Why: 
- Most reliable
- We can test and tune each position visually
- No risk of pivot point issues
- Simple to implement and debug

**Structure:**
```typescript
const LAYER_CAMERA_CONFIGS = {
  "Camera Folded": {
    cameraPosition: [x, y, z],
    lookAt: [x, y, z],
  },
  "LiDAR": {
    cameraPosition: [x, y, z],
    lookAt: [x, y, z],
  },
  // etc.
};
```

---

## Next Steps

1. **First**: Visually inspect the model to find good camera angles for each layer
2. **Then**: Implement simple camera animation with hardcoded positions
3. **Finally**: Add smooth transitions with lerp

---

## Questions for You

1. **Hardcoded vs Dynamic**: Do you prefer hardcoded camera positions (reliable) or dynamic positions from the model (automatic)?

2. **Animation style**: Should OrbitControls stay enabled during focus, or should we take full camera control?

3. **Model behavior**: Should the model stop rotating when focused on a layer, or keep a slow rotation?

4. **Finding positions**: Do you want me to create a debug tool to help find the ideal camera positions for each layer?

