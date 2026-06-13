# Portfolio Robot Integration

## Source

- Model: "Low Poly Humanoid Robot" by Denys Almaral
- Source: https://sketchfab.com/3d-models/low-poly-humanoid-robot-bad584b9fbe04c85bc57438842969270
- License: Sketchfab Standard License, preserved from GLB metadata
- Source asset: `assets/source/low-poly-humanoid-robot/low_poly_humanoid_robot.glb`
- Runtime asset: `public/models/portfolio-robot.glb`
- Report: `public/models/portfolio-robot-report.json`

## Regenerate

```bash
npm run prepare:robot
```

The script copies the source GLB structure, appends lightweight GLTF clips named `Idle` and `Throw`, and writes the inspection report. It does not edit the source asset.

## Verified Clips

- `walk` - source clip, preserved
- `tpose` - source clip, preserved
- `Idle` - generated loop clip
- `Throw` - generated one-shot clip

## Verified Arm Bones

Runtime names replace spaces with underscores before animation tracks are authored:

- Left clavicle: `lpBip_L_Clavicle_08`
- Left upper arm: `lpBip_L_UpperArm_09`
- Left forearm: `lpBip_L_Forearm_010`
- Left hand: `lpBip_L_Hand_011`
- Right clavicle: `lpBip_R_Clavicle_018`
- Right upper arm: `lpBip_R_UpperArm_019`
- Right forearm: `lpBip_R_Forearm_020`
- Right hand: `lpBip_R_Hand_021`

## Material Mapping

The GLB source texture is preserved. At runtime, `PortfolioRobot` clones materials per instance and remaps the palette:

- Bright shell areas become warm off-white.
- Saturated accent colors become graphite or black.
- Emissive accents become cool white.

This keeps the downloaded source intact while presenting the requested white-and-black robot.

## Arm Aiming

`PortfolioRobot` exposes:

- `aimArm(side, { x, y }, options)`
- `clearArmAim(side?)`
- `playThrow(options)`
- `resetPose()`

`x` and `y` are clamped to `[-1, 1]`. The animation mixer poses the robot first; procedural arm offsets are applied afterward in `useFrame`, then smoothed with quaternion slerp.

## Throw Timing

The release point is configured in `src/components/robot/robotConfig.js`:

```js
export const THROW = {
  peak: 0.6,
}
```

`onPeak` fires once when playback crosses 60 percent. `onComplete` fires once when the mixer finishes the clip.

## Waist Crop

The crop height is configured in `robotConfig.js`:

```js
export const CROP = {
  y: -0.06,
}
```

`RobotScene` enables local clipping on the renderer. `PortfolioRobot` clones each material and applies the waist clipping plane to the cloned material only.

## Camera Framing

Camera presets live in `FRAMING` in `robotConfig.js`:

- `hero` - homepage waist-up framing
- `bust` - corner robot
- `side` - contact and project pages

## Limitations

- Blender was not available in this environment, so Blender import was not verified here.
- Material recolor is runtime-based, not baked into the GLB.
- The generated clips are lightweight and functional; replacing them later with authored animation clips only requires keeping the final names `Idle` and `Throw`.
