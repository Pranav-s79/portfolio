import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import {
  ROBOT_MODEL_PATH,
  BONES,
  BONE_ALIASES,
  AIM,
  THROW,
  IDLE,
  PALETTE,
  FRAMING,
} from './robotConfig.js'
import { createPeakTracker, safeInvoke } from './robotLogic.js'

// ============================================================
// RobotScene — imperative Three.js mount for the low-poly humanoid.
//
// Deliberately NOT react-three-fiber: this rig + the dev pipeline hit a
// silent non-render under R3F's reconciler, while a plain renderer draws
// it reliably (matches the standalone GLB test). One GLTF is loaded and
// cached module-side; each mount restores the source bone pose before
// applying the procedural rest pose.
//
// Exposes the documented handle: aimArm / clearArmAim / playThrow /
// resetPose. Arm aiming is layered after the mixer each frame; the throw
// fires onPeak once at 60% via a threshold tracker, then returns to Idle.
// ============================================================

let gltfPromise = null
const loadGltf = () => {
  if (!gltfPromise) gltfPromise = new GLTFLoader().loadAsync(ROBOT_MODEL_PATH)
  return gltfPromise
}

const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '')

function resolveBones(rootObj) {
  const all = []
  rootObj.traverse((o) => {
    if (o.isBone) all.push(o)
  })
  const out = {}
  for (const [key, exact] of Object.entries(BONES)) {
    let bone = all.find((b) => b.name === exact || normalize(b.name) === normalize(exact))
    if (!bone) {
      for (const alias of BONE_ALIASES[key] || []) {
        bone = all.find((b) => normalize(b.name).includes(alias))
        if (bone) break
      }
    }
    if (bone) out[key] = bone
  }
  return out
}

// Recolor a palette texture by remapping each pixel. All accents (purple,
// green, etc.) collapse to the black/white scheme — no saturated hues remain.
function remapTex(tex, fn) {
  if (!tex?.image) return null
  const img = tex.image
  const cv = document.createElement('canvas')
  cv.width = img.width
  cv.height = img.height
  const cx = cv.getContext('2d')
  cx.drawImage(img, 0, 0)
  const id = cx.getImageData(0, 0, cv.width, cv.height)
  const d = id.data
  for (let i = 0; i < d.length; i += 4) fn(d, i)
  cx.putImageData(id, 0, 0)
  const out = new THREE.CanvasTexture(cv)
  out.flipY = tex.flipY
  out.colorSpace = tex.colorSpace
  out.needsUpdate = true
  return out
}

let baseTexCache
let emisTexCache
let sourceBoneRotations = null
let sourceRootTransform = null
function recolorMaterial(mat) {
  const { shell, graphiteLight, graphiteDark, accentTint } = PALETTE
  if (baseTexCache === undefined) {
    baseTexCache = remapTex(mat.map, (d, i) => {
      const r = d[i]
      const g = d[i + 1]
      const b = d[i + 2]
      const max = Math.max(r, g, b)
      const min = Math.min(r, g, b)
      const sat = max === 0 ? 0 : (max - min) / max
      const lum = max / 255
      if (sat > 0.18) {
        // any colored accent → graphite (dark) so no purple survives
        const t = lum > 0.55 ? graphiteLight : graphiteDark
        d[i] = t[0]
        d[i + 1] = t[1]
        d[i + 2] = t[2]
      } else if (lum > 0.6) {
        d[i] = shell[0]
        d[i + 1] = shell[1]
        d[i + 2] = shell[2]
      } else {
        const t = lum > 0.3 ? graphiteLight : graphiteDark
        d[i] = t[0]
        d[i + 1] = t[1]
        d[i + 2] = t[2]
      }
    })
    // emissive accent lines: recolor purple → subtle cool tint
    emisTexCache = remapTex(mat.emissiveMap, (d, i) => {
      const max = Math.max(d[i], d[i + 1], d[i + 2])
      if (max > 12) {
        d[i] = accentTint[0]
        d[i + 1] = accentTint[1]
        d[i + 2] = accentTint[2]
      }
    })
  }
  if (baseTexCache) mat.map = baseTexCache
  if (emisTexCache) {
    mat.emissiveMap = emisTexCache
    mat.emissive = new THREE.Color(0xffffff)
    mat.emissiveIntensity = 0.5
  }
  mat.metalness = 0.25
  mat.roughness = 0.5
  mat.needsUpdate = true
}

const LOGICAL_BONE_FOR = { left: 'right', right: 'left' }

const HOME_ARM_POSES = {
  research: { world: [-0.26, 0.4, 0.22], bend: 0.08, clavicle: 0.02, slamY: -0.07 },
  projects: { world: [-0.13, 0.38, 0.23], bend: 0.08, clavicle: 0.015, slamY: -0.07 },
  skills: { world: [0, 0.38, 0.23], bend: 0.08, clavicle: 0.012, slamY: -0.07 },
  resume: { world: [0.13, 0.38, 0.23], bend: 0.08, clavicle: 0.015, slamY: -0.07 },
  contact: { world: [0.26, 0.4, 0.22], bend: 0.08, clavicle: 0.02, slamY: -0.07 },
}

function getHomeArmPose(pose) {
  return HOME_ARM_POSES[pose] ?? HOME_ARM_POSES.skills
}

const RobotScene = forwardRef(function RobotScene({ variant = 'hero' }, ref) {
  const mountRef = useRef(null)
  const api = useRef(null)

  // stable imperative handle that proxies into the live scene controller
  useImperativeHandle(ref, () => ({
    aimArm: (side, target, options) => api.current?.aimArm(side, target, options),
    clearArmAim: (side) => api.current?.clearArmAim(side),
    slamArm: (side, target, options) => api.current?.slamArm(side, target, options),
    playThrow: (options) => api.current?.playThrow(options) ?? { ok: false },
    resetPose: () => api.current?.resetPose(),
  }))

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return
    let disposed = false
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width = mount.clientWidth || window.innerWidth
    let height = mount.clientHeight || window.innerHeight

    const frame = FRAMING[variant] || FRAMING.hero
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(frame.fov, width / height, 0.1, 100)
    camera.position.set(...frame.position)
    camera.lookAt(...frame.target)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(width, height)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    mount.appendChild(renderer.domElement)

    // studio IBL for the PBR shells
    const pmrem = new THREE.PMREMGenerator(renderer)
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture

    scene.add(new THREE.AmbientLight(0xffffff, 0.5))
    const key = new THREE.DirectionalLight(0xffffff, 1.4)
    key.position.set(-3, 5, 4)
    scene.add(key)
    const fill = new THREE.DirectionalLight(0xfff1e0, 0.5)
    fill.position.set(4, 1.5, 3)
    scene.add(fill)
    const rim = new THREE.DirectionalLight(0xbfd2e0, 0.85)
    rim.position.set(0.5, 3, -5)
    scene.add(rim)

    const controls = {
      aims: {
        left: {
          active: false,
          pose: 'skills',
          weight: 0,
          intensity: 1,
          world: new THREE.Vector3(...HOME_ARM_POSES.skills.world),
          smoothedWorld: new THREE.Vector3(...HOME_ARM_POSES.skills.world),
        },
        right: {
          active: false,
          pose: 'resume',
          weight: 0,
          intensity: 1,
          world: new THREE.Vector3(...HOME_ARM_POSES.resume.world),
          smoothedWorld: new THREE.Vector3(...HOME_ARM_POSES.resume.world),
        },
      },
      slam: {
        active: false,
        side: 'left',
        pose: 'skills',
        t: 0,
        duration: 0.34,
        impactFired: false,
        pulse: 0,
        onImpact: null,
        onComplete: null,
      },
      throwing: false,
      throwT: 0,
      throwSide: 'right',
      peak: createPeakTracker(THROW.peak),
      onPeak: null,
      onComplete: null,
    }

    let frameId = 0
    let bones = {}
    let modelRoot = null
    let modelHolder = null
    let waistFairing = null
    const baseRot = {}
    const clock = new THREE.Clock()
    const _q = new THREE.Quaternion()
    const _q2 = new THREE.Quaternion()
    const _parentQ = new THREE.Quaternion()
    const _targetWorld = new THREE.Vector3()
    const _fromWorld = new THREE.Vector3()
    const _dirWorld = new THREE.Vector3()
    const _handWorld = new THREE.Vector3()
    const _jointWorld = new THREE.Vector3()
    const _toHand = new THREE.Vector3()
    const _toTarget = new THREE.Vector3()
    const _elbowTarget = new THREE.Vector3()
    const _deltaWorld = new THREE.Quaternion()
    const _deltaLocal = new THREE.Quaternion()
    const _identityQ = new THREE.Quaternion()

    loadGltf().then((gltf) => {
      if (disposed) return
      const root = gltf.scene
      if (root.parent) root.parent.remove(root)
      if (!sourceRootTransform) {
        sourceRootTransform = {
          position: root.position.clone(),
          quaternion: root.quaternion.clone(),
          scale: root.scale.clone(),
        }
      } else {
        root.position.copy(sourceRootTransform.position)
        root.quaternion.copy(sourceRootTransform.quaternion)
        root.scale.copy(sourceRootTransform.scale)
      }
      root.updateMatrixWorld(true)
      modelRoot = root

      root.traverse((o) => {
        if (o.isBone) o.name = o.name.replace(/[^a-zA-Z0-9_]/g, '_')
        if (o.isMesh || o.isSkinnedMesh) {
          o.frustumCulled = false
          recolorMaterial(o.material)
        }
      })

      // normalize from the (intact) scene bounds
      root.updateWorldMatrix(true, true)
      const box = new THREE.Box3().setFromObject(root)
      const size = box.getSize(new THREE.Vector3())
      const center = box.getCenter(new THREE.Vector3())
      const s = 2 / (size.y || 1)
      const holder = new THREE.Group()
      holder.scale.setScalar(s)
      holder.position.set(-center.x * s, -box.min.y * s - 1, -center.z * s)
      holder.add(root)
      scene.add(holder)
      modelHolder = holder

      waistFairing = new THREE.Mesh(
        new THREE.CylinderGeometry(0.36, 0.46, 0.58, 6, 1, false),
        new THREE.MeshStandardMaterial({
          color: 0x17191c,
          roughness: 0.62,
          metalness: 0.18,
        })
      )
      waistFairing.position.set(0, -0.36, 0.01)
      waistFairing.rotation.y = Math.PI / 6
      waistFairing.scale.set(1.16, 1, 0.42)
      scene.add(waistFairing)

      bones = resolveBones(root)
      if (!sourceBoneRotations) {
        sourceBoneRotations = {}
        for (const [key, bone] of Object.entries(bones)) {
          sourceBoneRotations[key] = bone.quaternion.clone()
        }
      } else {
        for (const [key, bone] of Object.entries(bones)) {
          if (sourceBoneRotations[key]) bone.quaternion.copy(sourceBoneRotations[key])
        }
        root.updateMatrixWorld(true)
      }

      // Pose arms down from the T-pose: rotate each upper arm ~80° about
      // the body's forward axis so it hangs by the side, plus a gentle
      // elbow bend. This becomes the rest the idle + aim build on.
      const poseArm = (side, sign) => {
        const upper = bones[`${side}UpperArm`]
        const fore = bones[`${side}Forearm`]
        const hand = bones[`${side}Hand`]
        if (upper) {
          upper.rotation.y += sign * 1.43
          upper.rotation.x += 0.02
        }
        if (fore) fore.rotation.y += sign * 0.13
        if (hand) hand.rotation.y += sign * 0.05
      }
      poseArm('left', 1)
      poseArm('right', -1)
      root.updateMatrixWorld(true)

      for (const [k, bone] of Object.entries(bones)) {
        baseRot[k] = bone.quaternion.clone()
      }

      // All motion is procedural (idle sway, aim, throw) built on the
      // arms-down base pose — the GLB's baked clips are T-pose-relative and
      // would fight it, so we don't use the mixer.
      api.current = makeController()
    })

    // Each frame: reset arm/torso/head bones to their base, then add
    // idle sway + aim offset + throw offset. Resetting avoids drift.
    const addLocalAxis = (bone, axis, angle) => {
      _q.setFromAxisAngle(axis, angle)
      bone.quaternion.multiply(_q)
    }
    const AX_Z = new THREE.Vector3(0, 0, 1)
    const AX_X = new THREE.Vector3(1, 0, 0)
    const AX_Y = new THREE.Vector3(0, 1, 0)

    function animate() {
      frameId = requestAnimationFrame(animate)
      const dt = Math.min(clock.getDelta(), 0.05)
      if (!bones.head) {
        renderer.render(scene, camera)
        return
      }

      // reset posed bones to base
      for (const k of Object.keys(bones)) {
        if (baseRot[k]) bones[k].quaternion.copy(baseRot[k])
      }

      // idle breathing/sway — subtle, mechanical-but-alive
      const t = clock.elapsedTime
      const idleAmp = reduced ? 0 : 1
      if (bones.spine) addLocalAxis(bones.spine, AX_Y, Math.sin(t * 0.5) * 0.022 * idleAmp)
      if (bones.spine1) addLocalAxis(bones.spine1, AX_X, Math.sin(t * 1.05) * 0.014 * idleAmp)
      if (bones.head) {
        addLocalAxis(bones.head, AX_Y, Math.sin(t * 0.42 + 1) * 0.05 * idleAmp)
        addLocalAxis(bones.head, AX_X, Math.sin(t * 0.7) * 0.02 * idleAmp)
      }
      const breath = Math.sin(t * 1.1) * 0.016 * idleAmp
      if (bones.leftUpperArm) addLocalAxis(bones.leftUpperArm, AX_Z, -breath)
      if (bones.rightUpperArm) addLocalAxis(bones.rightUpperArm, AX_Z, breath)

      // look toward the active reach (humanlike — eyes/torso follow the hand)
      const la = controls.aims.left
      const ra = controls.aims.right
      const lookW = Math.max(la.weight, ra.weight)
      if (lookW > 0.02 && bones.head) {
        const activeAim = la.weight >= ra.weight ? la : ra
        const tx = THREE.MathUtils.clamp(activeAim.smoothedWorld.x / 0.3, -1, 1)
        const ty = THREE.MathUtils.clamp((activeAim.smoothedWorld.y - 0.36) / 0.18, -1, 1)
        addLocalAxis(bones.head, AX_Y, -tx * 0.32 * lookW)
        addLocalAxis(bones.head, AX_X, -ty * 0.12 * lookW)
        if (bones.spine1) addLocalAxis(bones.spine1, AX_Y, -tx * 0.12 * lookW)
      }

      // throw progress + peak
      if (controls.throwing) {
        controls.throwT += dt
        const prog = Math.min(controls.throwT / THROW.duration, 1)
        controls.peak.update(prog, () => {
          const cb = controls.onPeak
          controls.onPeak = null
          safeInvoke(cb, (err) => console.error('[robot] onPeak', err))
        })
        applyThrow(controls.throwSide, prog)
        if (prog >= 1) {
          controls.throwing = false
          const cb = controls.onComplete
          controls.onComplete = null
          safeInvoke(cb, (err) => console.error('[robot] onComplete', err))
        }
      }

      updateSlam(dt)

      // aim layering — both arms
      applyAim('left', dt)
      applyAim('right', dt)

      renderer.render(scene, camera)
    }
    animate()

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3)
    }

    function updateSlam(dt) {
      const slam = controls.slam
      if (!slam.active) return

      slam.t += dt
      const p = Math.min(slam.t / slam.duration, 1)
      const downEnd = 0.46
      const aim = controls.aims[slam.side]
      aim.active = true
      aim.intensity = 1
      aim.pose = slam.pose
      const pose = getHomeArmPose(slam.pose)
      aim.world.set(...pose.world)

      if (p < downEnd) {
        slam.pulse = easeOutCubic(p / downEnd)
      } else {
        if (!slam.impactFired) {
          slam.impactFired = true
          const cb = slam.onImpact
          slam.onImpact = null
          safeInvoke(cb, (err) => console.error('[robot] onImpact', err))
        }
        const rebound = (p - downEnd) / (1 - downEnd)
        slam.pulse = Math.max(0, 1 - Math.sin(rebound * Math.PI * 0.5))
      }

      if (p >= 1) {
        slam.active = false
        slam.pulse = 0
        const cb = slam.onComplete
        slam.onComplete = null
        safeInvoke(cb, (err) => console.error('[robot] onComplete', err))
      }
    }

    // Rotate `joint` (delta from its current pose) so that the world
    // direction joint→end aligns with joint→target. Roll-preserving: it
    // composes a world-space minimal rotation onto the existing quaternion,
    // converted back to the joint's local space. Slerped by `amount`.
    function aimBoneAt(joint, end, targetWorld, amount) {
      if (!joint || !end || amount <= 0) return
      joint.getWorldPosition(_jointWorld)
      end.getWorldPosition(_handWorld)
      _toHand.copy(_handWorld).sub(_jointWorld)
      _toTarget.copy(targetWorld).sub(_jointWorld)
      if (_toHand.lengthSq() < 1e-6 || _toTarget.lengthSq() < 1e-6) return
      _toHand.normalize()
      _toTarget.normalize()
      _deltaWorld.setFromUnitVectors(_toHand, _toTarget)
      _identityQ.identity()
      _q2.copy(_identityQ).slerp(_deltaWorld, THREE.MathUtils.clamp(amount, 0, 1))
      // local = parentWorld⁻¹ * delta * parentWorld, premultiplied
      joint.parent.getWorldQuaternion(_parentQ)
      _deltaLocal.copy(_parentQ).invert().multiply(_q2).multiply(_parentQ)
      joint.quaternion.premultiply(_deltaLocal)
    }

    // logical aim side → rig bone prefix. From the camera's view the rig's
    // "right" arm is on screen-left, and vice-versa.
    // ---------- aim: shoulder-driven reach toward the target ----------
    // Aims the whole arm at a world point unprojected onto a plane in FRONT
    // of the torso (so the arm crosses the chest, never swings behind), keeps
    // a natural elbow bend, and clamps reach so nothing hyperextends.
    // Roll-preserving (delta from rest) → the shoulder mesh stays intact.
    function applyAim(side, dt) {
      const aim = controls.aims[side]
      const suppressed = controls.throwing && controls.throwSide === side
      const tw = aim.active && !suppressed ? aim.intensity : 0
      const slamming = controls.slam.active && controls.slam.side === side
      const smooth = slamming ? 0.26 : 0.13
      const pose = getHomeArmPose(aim.pose)
      _targetWorld.set(...pose.world)
      if (slamming) _targetWorld.y += pose.slamY * controls.slam.pulse
      aim.world.copy(_targetWorld)
      if (!aim.active && aim.weight < 0.02) {
        aim.smoothedWorld.copy(aim.world)
      }
      aim.smoothedWorld.lerp(aim.world, slamming ? 0.42 : 0.18)
      aim.weight += (tw - aim.weight) * smooth
      if (aim.weight < 0.004) return

      const p = LOGICAL_BONE_FOR[side]
      const upper = bones[`${p}UpperArm`]
      const fore = bones[`${p}Forearm`]
      const hand = bones[`${p}Hand`]
      if (!upper || !fore) return

      scene.updateMatrixWorld(true)

      // target on a plane in front of the torso
      _targetWorld.copy(aim.smoothedWorld)

      // reach length: shoulder→hand at rest; clamp the target inside it
      upper.getWorldPosition(_fromWorld)
      fore.getWorldPosition(_jointWorld)
      ;(hand || fore).getWorldPosition(_handWorld)
      _toTarget.copy(_targetWorld).sub(_fromWorld)
      const dist = Math.max(_toTarget.length(), 1e-4)
      _toTarget.normalize()

      const upperLen = Math.max(_fromWorld.distanceTo(_jointWorld), 1e-4)
      const foreLen = Math.max(_jointWorld.distanceTo(_handWorld), 1e-4)
      const solvedDist = THREE.MathUtils.clamp(
        dist,
        Math.abs(upperLen - foreLen) + 0.001,
        (upperLen + foreLen) * 0.96
      )
      const elbowAlong = THREE.MathUtils.clamp(
        (upperLen * upperLen - foreLen * foreLen + solvedDist * solvedDist) / (2 * solvedDist),
        0,
        upperLen
      )
      const elbowLift = Math.sqrt(Math.max(upperLen * upperLen - elbowAlong * elbowAlong, 0))
      _dirWorld.set(side === 'left' ? -0.18 : 0.18, -0.9, 0.22).normalize()
      _dirWorld.addScaledVector(_toTarget, -_dirWorld.dot(_toTarget)).normalize()
      _elbowTarget
        .copy(_fromWorld)
        .addScaledVector(_toTarget, elbowAlong)
        .addScaledVector(_dirWorld, elbowLift * 0.82)

      // Point the whole arm (rest hand direction) at the target.
      aimBoneAt(upper, fore, _elbowTarget, aim.weight)
      upper.updateWorldMatrix(true, false)
      if (hand) aimBoneAt(fore, hand, _targetWorld, aim.weight)

      // soft elbow bend; less when reaching far so the hand can clear the chip
      const bendSign = side === 'left' ? -1 : 1
      addLocalAxis(fore, AX_Y, bendSign * pose.bend * aim.weight)
      fore.updateWorldMatrix(true, false)

      const clav = bones[`${p}Clavicle`]
      if (clav) addLocalAxis(clav, AX_Z, bendSign * pose.clavicle * aim.weight)
    }

    // ---------- throw: anticipation → wind-up → release → recover ----------
    function applyThrow(side, p) {
      const sign = side === 'left' ? -1 : 1
      const upper = bones[`${side}UpperArm`]
      const fore = bones[`${side}Forearm`]
      // piecewise envelope for the upper-arm pitch (about X)
      // 0–.15 anticipate (low), .15–.4 draw back (high), .4–.6 accel fwd,
      // .6 release (forward), .6–1 follow-through then recover
      let pitch
      let elbow
      if (p < 0.4) {
        const k = p / 0.4
        pitch = THREE.MathUtils.lerp(0.2, 2.1, k) // swing back & up
        elbow = THREE.MathUtils.lerp(0.4, 1.5, k)
      } else if (p < 0.6) {
        const k = (p - 0.4) / 0.2
        pitch = THREE.MathUtils.lerp(2.1, -1.1, k) // whip forward
        elbow = THREE.MathUtils.lerp(1.5, 0.2, k)
      } else {
        const k = (p - 0.6) / 0.4
        pitch = THREE.MathUtils.lerp(-1.1, 0, k) // recover to base
        elbow = THREE.MathUtils.lerp(0.2, 0, k)
      }
      if (upper) {
        addLocalAxis(upper, AX_X, -pitch)
        addLocalAxis(upper, AX_Z, sign * 0.2)
      }
      if (fore) addLocalAxis(fore, AX_X, -elbow)
      // torso coil
      if (bones.spine) addLocalAxis(bones.spine, AX_Y, sign * Math.sin(p * Math.PI) * 0.18)
    }

    // ---------- controller (imperative API) ----------
    function makeController() {
      return {
        aimArm(side, target, options = {}) {
          const aim = controls.aims[side]
          if (!aim || reduced) return
          const poseKey = target?.pose ?? 'skills'
          const pose = getHomeArmPose(poseKey)
          if (!aim.active && aim.weight < 0.02) {
            aim.smoothedWorld.set(...pose.world)
          }
          aim.active = true
          aim.pose = poseKey
          aim.world.set(...pose.world)
          aim.intensity = THREE.MathUtils.clamp(options.intensity ?? 1, 0, 1)
        },
        slamArm(side, target, options = {}) {
          const aim = controls.aims[side]
          if (!aim) return { ok: false, reason: 'unknown-side' }
          const poseKey = target?.pose ?? aim.pose ?? 'skills'
          const pose = getHomeArmPose(poseKey)
          if (reduced) {
            safeInvoke(options.onImpact, (err) => console.error('[robot] onImpact', err))
            setTimeout(() => {
              safeInvoke(options.onComplete, (err) => console.error('[robot] onComplete', err))
            }, 90)
            return { ok: true, reducedMotion: true }
          }
          aim.active = true
          aim.intensity = 1
          aim.pose = poseKey
          aim.world.set(...pose.world)
          if (aim.weight < 0.02) {
            aim.smoothedWorld.set(...pose.world)
          }
          controls.slam.active = true
          controls.slam.side = side
          controls.slam.pose = poseKey
          controls.slam.t = 0
          controls.slam.impactFired = false
          controls.slam.pulse = 0
          controls.slam.onImpact = options.onImpact ?? null
          controls.slam.onComplete = options.onComplete ?? null
          return { ok: true }
        },
        clearArmAim(side) {
          if (side) {
            if (controls.aims[side]) controls.aims[side].active = false
          } else {
            controls.aims.left.active = false
            controls.aims.right.active = false
          }
        },
        playThrow() {
          return { ok: false, reason: 'disabled' }
        },
        resetPose() {
          controls.aims.left.active = false
          controls.aims.right.active = false
          controls.slam.active = false
        },
      }
    }

    // ---------- resize ----------
    const onResize = () => {
      width = mount.clientWidth || window.innerWidth
      height = mount.clientHeight || window.innerHeight
      camera.position.set(...frame.position)
      camera.lookAt(...frame.target)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    const ro = new ResizeObserver(onResize)
    ro.observe(mount)
    window.addEventListener('resize', onResize)
    requestAnimationFrame(onResize)

    return () => {
      disposed = true
      cancelAnimationFrame(frameId)
      ro.disconnect()
      window.removeEventListener('resize', onResize)
      if (modelRoot?.parent) modelRoot.parent.remove(modelRoot)
      if (modelHolder?.parent) modelHolder.parent.remove(modelHolder)
      if (waistFairing) {
        scene.remove(waistFairing)
        waistFairing.geometry?.dispose()
        waistFairing.material?.dispose()
      }
      pmrem.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement)
      }
      api.current = null
    }
  }, [variant])

  return <div ref={mountRef} className="robot-mount" aria-hidden="true" />
})

export default RobotScene
