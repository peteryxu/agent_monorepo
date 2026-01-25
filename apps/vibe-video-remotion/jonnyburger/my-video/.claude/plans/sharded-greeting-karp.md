# Plan: 3D Metallic REMOTION Logo Composition

## Overview
Create a 3D composition that displays the REMOTION logo image with a metallic material, proper lighting, and smooth animation. The composition will be 2 seconds (60 frames at 30fps, 1280×720).

## Implementation Strategy

### 1. Install Dependencies
```bash
npx remotion add @remotion/three
npm install @react-three/drei
```

This installs:
- `@remotion/three` - Remotion's Three.js integration with ThreeCanvas
- `three` - Three.js library for 3D rendering
- `@react-three/fiber` - React renderer for Three.js
- `@types/three` - TypeScript types
- `@react-three/drei` - Utilities for textures and helpers

### 2. Move Image Asset
Move the image from parent directory to public folder:
- Source: `/Users/xup/CODE/REPOs/gh/_peteryxu/agent_monorepo/apps/remotions/jonnyb/image.png`
- Destination: `/Users/xup/CODE/REPOs/gh/_peteryxu/agent_monorepo/apps/remotions/jonnyb/my-video/public/image.png`

Remotion requires assets in `public/` folder for proper `staticFile()` loading.

## Critical Files

### Files to Create

#### 1. `src/components/Scene.tsx`
**Purpose:** Lighting setup and scene management

**Key Implementation Details:**
- Multiple light sources to showcase metallic reflections:
  - `ambientLight` with intensity 0.3 for soft overall illumination
  - `pointLight` at `[10, 10, 5]` with intensity 1.5 for main highlight
  - `pointLight` at `[-10, -5, -5]` with intensity 0.8 and blue color for rim light
  - `directionalLight` at `[0, 5, 5]` with intensity 0.5 for fill light
- Render the `MetallicLogo` component

**Why this lighting:** Metallic materials need multiple light sources at varied angles to display their reflective properties effectively.

#### 2. `src/components/MetallicLogo.tsx`
**Purpose:** 3D mesh with logo texture and metallic material

**Key Implementation Details:**
- Load texture using `useTexture(staticFile('image.png'))` from `@react-three/drei`
- Use `planeGeometry` with args `[6, 3.375]` to maintain image aspect ratio (1280:720)
- Apply `meshStandardMaterial` with:
  - `metalness={0.9}` - High metalness for chrome-like appearance
  - `roughness={0.1}` - Low roughness for shiny reflections
  - `map={texture}` - Apply the logo texture
- Implement frame-driven animations using `useCurrentFrame()`:
  - **Entrance (frames 0-20):** Scale from 0 to 1 using `spring()` with `damping: 200` (smooth, no bounce)
  - **Rotation (frames 0-60):** Rotate 90° (π/2 radians) on Y-axis using `interpolate()` to show depth

**Animation Code Pattern:**
```tsx
const frame = useCurrentFrame();
const { fps } = useVideoConfig();

// Entrance animation
const scaleProgress = spring({ frame, fps, config: { damping: 200 } });

// Rotation animation
const rotationY = interpolate(frame, [0, 60], [0, Math.PI * 0.5], {
  extrapolateRight: 'clamp',
});
```

### Files to Modify

#### 3. `src/Composition.tsx`
**Current State:** Returns `null`

**Changes Needed:**
- Import `ThreeCanvas` from `@remotion/three`
- Import `useVideoConfig` to get dimensions (1280x720)
- Import `Scene` component
- Wrap scene in `ThreeCanvas` with:
  - `width` and `height` props from `useVideoConfig()` (required by Remotion)
  - Camera config: `position: [0, 0, 8]`, `fov: 45` for proper perspective
- Optional: Add gradient background wrapper for visual appeal

**Code Structure:**
```tsx
export const MyComposition = () => {
  const { width, height } = useVideoConfig();

  return (
    <ThreeCanvas
      width={width}
      height={height}
      camera={{ position: [0, 0, 8], fov: 45 }}
    >
      <Scene />
    </ThreeCanvas>
  );
};
```

### Files Unchanged

- `src/Root.tsx` - Composition already registered correctly
- `package.json` - Will be updated by install commands

## Remotion Best Practices Applied

1. **Frame-driven animations:** All animations use `useCurrentFrame()` and Remotion helpers (`spring`, `interpolate`)
   - Never use `useFrame()` from react-three/fiber
   - Never use CSS animations or transitions
   - Ensures frame-perfect rendering

2. **ThreeCanvas requirements:**
   - Always pass `width` and `height` props from `useVideoConfig()`
   - Required for proper rendering in Remotion

3. **Asset loading:**
   - Images in `public/` folder
   - Reference with `staticFile('image.png')`
   - Ensures proper encoding during render and deployment

4. **Timing best practices:**
   - Use `spring()` for natural entrance motion
   - Config `{ damping: 200 }` for smooth animation without bounce
   - Combine with `interpolate()` for custom ranges (rotation)

## Animation Timeline

**Duration:** 60 frames (2 seconds at 30fps)

| Frames | Time | Animation |
|--------|------|-----------|
| 0-20 | 0.0s - 0.67s | Logo scales from 0 to 1 (entrance) |
| 0-60 | 0.0s - 2.0s | Logo rotates 90° on Y-axis (shows depth) |

Both animations run simultaneously:
- Entrance gives smooth appearance
- Rotation showcases 3D depth and metallic reflections

## Material Configuration

**MeshStandardMaterial settings:**
- `metalness: 0.9` - High metalness creates chrome-like appearance
- `roughness: 0.1` - Low roughness creates shiny, reflective surface
- `map: texture` - Applies the logo image as the base color

**Why MeshStandardMaterial:** It's a PBR (Physically Based Rendering) material that properly reacts to lighting, making it perfect for realistic metallic surfaces.

## Implementation Steps

1. **Install 3D dependencies**
   ```bash
   npx remotion add @remotion/three
   npm install @react-three/drei
   ```

2. **Move image asset**
   - Move `image.png` from parent directory to `public/` folder

3. **Create component directory**
   - Create `src/components/` folder

4. **Create Scene.tsx**
   - Set up lighting (ambient, point, directional lights)
   - Render MetallicLogo component

5. **Create MetallicLogo.tsx**
   - Load texture with `useTexture(staticFile('image.png'))`
   - Create plane geometry with aspect ratio matching image
   - Apply metallic material (metalness: 0.9, roughness: 0.1)
   - Implement entrance animation with `spring()`
   - Implement rotation animation with `interpolate()`

6. **Update Composition.tsx**
   - Import ThreeCanvas, useVideoConfig, Scene
   - Replace `null` return with ThreeCanvas setup
   - Configure camera (position: [0, 0, 8], fov: 45)

## Verification Steps

### 1. Development Preview
```bash
npm run dev
```
- Open Remotion Studio in browser
- Verify logo appears in 3D with metallic material
- Check smooth entrance animation (frames 0-20)
- Check rotation animation showcases depth (frames 0-60)
- Scrub timeline to verify frame-perfect rendering
- Inspect metallic reflections under different lighting

### 2. Render Test
```bash
npx remotion render MyComp test-output.mp4
```
- Verify video renders without errors
- Check for flickering (would indicate non-frame-driven animation)
- Confirm metallic appearance is preserved in final render
- Verify smooth 30fps playback

### 3. Quality Checks
- Logo texture is crisp and clear
- Metallic material shows proper reflections and highlights
- Animations are smooth without jitter
- No console errors or TypeScript warnings
- Lighting creates depth and dimension

## Potential Issues & Solutions

### Issue 1: Texture Loading Delay
**Symptom:** Black plane before texture loads
**Solution:** `useTexture` from drei handles loading automatically with suspense

### Issue 2: Flat Metallic Appearance
**Symptom:** Material doesn't look metallic enough
**Solution:**
- Verify multiple light sources are active
- Adjust `metalness` higher (0.95) or `roughness` lower (0.05)
- Optional: Add environment map using `<Environment preset="studio" />` from drei

### Issue 3: Animation Not Smooth
**Symptom:** Jittery or inconsistent animation
**Solution:**
- Verify all animations use `useCurrentFrame()` (not `useFrame`)
- Check spring config damping value
- Ensure no CSS transitions or animations

### Issue 4: Aspect Ratio Distortion
**Symptom:** Logo appears stretched or squashed
**Solution:**
- Verify planeGeometry args maintain 1280:720 ratio
- Use `[6, 3.375]` for correct aspect ratio

## Component Hierarchy

```
MyComposition (src/Composition.tsx)
└── ThreeCanvas (from @remotion/three)
    └── Scene (src/components/Scene.tsx)
        ├── ambientLight
        ├── pointLight (main)
        ├── pointLight (rim)
        ├── directionalLight (fill)
        └── MetallicLogo (src/components/MetallicLogo.tsx)
            └── mesh
                ├── planeGeometry
                └── meshStandardMaterial (metallic)
```

## File Structure Summary

```
my-video/
├── src/
│   ├── Composition.tsx          (MODIFY - add ThreeCanvas wrapper)
│   ├── Root.tsx                 (unchanged)
│   ├── components/              (CREATE folder)
│   │   ├── Scene.tsx           (CREATE - lighting setup)
│   │   └── MetallicLogo.tsx    (CREATE - 3D mesh with metallic material)
│   └── index.css                (unchanged)
├── public/
│   └── image.png                (MOVE from parent directory)
└── package.json                 (auto-updated by install commands)
```

## Success Criteria

- ✅ Logo displays in 3D space with proper perspective
- ✅ Metallic material shows reflections and highlights
- ✅ Smooth entrance animation (0-20 frames)
- ✅ Rotation animation shows depth (0-60 frames)
- ✅ All animations are frame-perfect (no flickering)
- ✅ Renders successfully to video file
- ✅ No TypeScript errors or console warnings
- ✅ Follows Remotion best practices
