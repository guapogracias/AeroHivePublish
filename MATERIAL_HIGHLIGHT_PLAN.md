# Material Highlight Implementation Plan

## Goal
When a component section is active, highlight the corresponding layer in the 3D model with an emissive glow effect.

---

## Implementation Steps

### Step 1: Material Management
- **Store original materials**: When scene loads, cache original materials for each layer
- **Clone materials**: Clone materials before modifying (to avoid affecting other objects)
- **Restore on change**: When focus changes, restore previous layer's material

### Step 2: Highlight Effect
- **Find layer object**: Use `scene.getObjectByName(focusLayer)` 
- **Apply emissive**: Set material `emissive` color (e.g., bright blue/cyan)
- **Animate intensity**: Use `useFrame` to pulse emissive intensity smoothly

### Step 3: Animation
- **Pulse effect**: Oscillate emissive intensity between 0.3 and 0.8
- **Smooth transition**: Lerp material changes for smooth appearance/disappearance
- **Timing**: ~2 second pulse cycle

---

## Technical Details

### Material Handling
```typescript
// Pseudo-code structure:
1. On scene load:
   - Traverse scene to find layer objects
   - Store original materials in Map<layerName, Material>

2. On focusLayer change:
   - Restore previous layer's material (if exists)
   - Clone current layer's material
   - Apply emissive color
   - Store reference for animation

3. In useFrame:
   - Animate emissive intensity with sin wave
   - Update material.emissiveIntensity
```

### Color Choice
- **Emissive color**: Cyan/Blue (`#00ffff` or `#4da6ff`) - tech feel
- **Intensity range**: 0.3 to 0.8 (subtle but visible)
- **Transition speed**: Smooth lerp over ~0.5 seconds

---

## Edge Cases to Handle

1. **Layer not found**: Log warning, gracefully skip
2. **Multiple materials**: Handle objects with multiple materials (MeshStandardMaterial array)
3. **Material sharing**: Clone before modifying to avoid affecting other objects
4. **Focus cleared**: Restore all materials when focusLayer is null
5. **Rapid switching**: Ensure smooth transitions between layers

---

## Future Enhancements (Option F)

Once Option B works:
- Add gentle camera movement toward layer (not exact positioning)
- Add 3D text label near the layer
- Combine all effects for maximum clarity

---

## Questions to Consider

1. **Color**: What color should the glow be? (Cyan/Blue suggested)
2. **Intensity**: How bright should it be? (Subtle vs dramatic)
3. **Animation**: Should it pulse continuously or fade in once?
4. **Multiple objects**: Some layers might have multiple meshes - highlight all?

