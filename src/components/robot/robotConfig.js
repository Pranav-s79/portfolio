// ============================================================
// Robot configuration — single source of truth.
// Bone names verified against public/models/portfolio-robot-report.json.
// NOTE: bones are renamed at load time (spaces → underscores) so
// animation track names bind reliably; names here are the
// post-rename forms.
// ============================================================

// Base-aware so it resolves under a GitHub Pages subpath (e.g. /portfolio/).
export const ROBOT_MODEL_PATH = `${import.meta.env.BASE_URL}models/portfolio-robot.glb`

// exact (post-rename) bone names for this rig
export const BONES = {
  pelvis: 'lpBip_Pelvis_02',
  spine: 'lpBip_Spine_03',
  spine1: 'lpBip_Spine1_04',
  neck: 'lpBip_Neck_05',
  head: 'lpBip_Head_06',
  leftClavicle: 'lpBip_L_Clavicle_08',
  leftUpperArm: 'lpBip_L_UpperArm_09',
  leftForearm: 'lpBip_L_Forearm_010',
  leftHand: 'lpBip_L_Hand_011',
  rightClavicle: 'lpBip_R_Clavicle_018',
  rightUpperArm: 'lpBip_R_UpperArm_019',
  rightForearm: 'lpBip_R_Forearm_020',
  rightHand: 'lpBip_R_Hand_021',
}

// fallback aliases, matched case-insensitively after stripping
// non-alphanumerics (covers mixamo / biped / blender conventions)
export const BONE_ALIASES = {
  rightUpperArm: ['rightarm', 'rightupperarm', 'upperarmr', 'mixamorigrightarm', 'bip01rupperarm', 'rupperarm'],
  leftUpperArm: ['leftarm', 'leftupperarm', 'upperarml', 'mixamorigleftarm', 'bip01lupperarm', 'lupperarm'],
  rightClavicle: ['rightshoulder', 'shoulderr', 'mixamorigrightshoulder', 'rclavicle'],
  leftClavicle: ['leftshoulder', 'shoulderl', 'mixamorigleftshoulder', 'lclavicle'],
  rightForearm: ['rightforearm', 'forearmr', 'mixamorigrightforearm', 'rforearm'],
  leftForearm: ['leftforearm', 'forearml', 'mixamorigleftforearm', 'lforearm'],
  rightHand: ['righthand', 'handr', 'rhand'],
  leftHand: ['lefthand', 'handl', 'lhand'],
  head: ['head'],
  neck: ['neck'],
  spine: ['spine'],
  spine1: ['spine1', 'chest', 'upperchest'],
  pelvis: ['pelvis', 'hips'],
}

// Aiming behavior (degrees / shares per spec)
export const AIM = {
  yawMaxDeg: 32,
  pitchMaxDeg: 36,
  shoulderShare: 0.28, // clavicle carries ~28% of the motion
  smoothing: 7.5, // exponential smoothing rate (1/s)
}

// Throw clip timing
export const THROW = {
  duration: 1.45, // seconds
  peak: 0.6, // normalized release point — onPeak fires here
  fadeIn: 0.12,
  fadeOut: 0.25,
}

// Idle clip
export const IDLE = {
  duration: 4.2, // seconds, seamless loop
  fadeIn: 0.5,
}

// Waist crop, in normalized model space (model is scaled to
// height = 2 with feet at y = -1). Pelvis sits near y ≈ +0.02.
export const CROP = {
  y: -0.06, // clip everything below this world y
}

// Material recolor targets (white-and-black scheme)
export const PALETTE = {
  shell: [0xf2, 0xf2, 0xf0], // warm off-white shells
  graphiteLight: [0x2a, 0x2c, 0x30], // secondary structure
  graphiteDark: [0x101, 0x11, 0x14].map((n) => (n > 255 ? 0x10 : n)), // joints
  accentTint: [0x6f, 0x86, 0x9c], // muted steel — replaces purple emissive
  emissiveStrength: 0.5,
}

// Per-variant camera framing (model space: feet -1 … head +1).
// hero frames the robot large and waist-up, centered.
export const FRAMING = {
  hero: { position: [0, 0.78, 1.46], target: [0, 0.56, 0], fov: 33 },
  bust: { position: [0, 0.74, 1.15], target: [0, 0.66, 0], fov: 34 },
  side: { position: [0, 0.5, 1.9], target: [0, 0.32, 0], fov: 40 },
}
