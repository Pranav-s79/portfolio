import fs from 'node:fs'
import path from 'node:path'

const SRC = 'assets/source/low-poly-humanoid-robot/low_poly_humanoid_robot.glb'
const OUT = 'public/models/portfolio-robot.glb'
const REPORT = 'public/models/portfolio-robot-report.json'
const SOURCE_URL =
  'https://sketchfab.com/3d-models/low-poly-humanoid-robot-bad584b9fbe04c85bc57438842969270'

const GLB_MAGIC = 0x46546c67
const JSON_CHUNK = 0x4e4f534a
const BIN_CHUNK = 0x004e4942
const FLOAT = 5126

function align4(n) {
  return (n + 3) & ~3
}

function parseGlb(file) {
  const buf = fs.readFileSync(file)
  if (buf.readUInt32LE(0) !== GLB_MAGIC) throw new Error(`${file} is not a GLB`)

  let offset = 12
  let json = null
  let bin = Buffer.alloc(0)
  while (offset < buf.length) {
    const length = buf.readUInt32LE(offset)
    const type = buf.readUInt32LE(offset + 4)
    const chunk = buf.slice(offset + 8, offset + 8 + length)
    if (type === JSON_CHUNK) json = JSON.parse(chunk.toString('utf8').trim())
    if (type === BIN_CHUNK) bin = chunk
    offset += 8 + length
  }
  if (!json) throw new Error('GLB JSON chunk missing')
  return { json, bin }
}

function writeGlb(json, bin, file) {
  const jsonText = JSON.stringify(json)
  const jsonPaddedLength = align4(Buffer.byteLength(jsonText))
  const jsonBuf = Buffer.alloc(jsonPaddedLength, 0x20)
  jsonBuf.write(jsonText, 0, 'utf8')

  const binPaddedLength = align4(bin.length)
  const binBuf = Buffer.alloc(binPaddedLength)
  bin.copy(binBuf)

  const totalLength = 12 + 8 + jsonBuf.length + 8 + binBuf.length
  const out = Buffer.alloc(totalLength)
  out.writeUInt32LE(GLB_MAGIC, 0)
  out.writeUInt32LE(2, 4)
  out.writeUInt32LE(totalLength, 8)
  out.writeUInt32LE(jsonBuf.length, 12)
  out.writeUInt32LE(JSON_CHUNK, 16)
  jsonBuf.copy(out, 20)
  const binHeader = 20 + jsonBuf.length
  out.writeUInt32LE(binBuf.length, binHeader)
  out.writeUInt32LE(BIN_CHUNK, binHeader + 4)
  binBuf.copy(out, binHeader + 8)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, out)
}

function qNormalize(q) {
  const l = Math.hypot(q[0], q[1], q[2], q[3]) || 1
  return [q[0] / l, q[1] / l, q[2] / l, q[3] / l]
}

function qMul(a, b) {
  const [ax, ay, az, aw] = a
  const [bx, by, bz, bw] = b
  return qNormalize([
    aw * bx + ax * bw + ay * bz - az * by,
    aw * by - ax * bz + ay * bw + az * bx,
    aw * bz + ax * by - ay * bx + az * bw,
    aw * bw - ax * bx - ay * by - az * bz,
  ])
}

function qAxis(axis, angle) {
  const [x, y, z] = axis
  const h = angle / 2
  const s = Math.sin(h)
  return qNormalize([x * s, y * s, z * s, Math.cos(h)])
}

function compose(rest, rotations) {
  return rotations.reduce((q, r) => qMul(q, qAxis(r.axis, r.angle)), rest)
}

function nodeRotation(json, index) {
  return json.nodes[index]?.rotation || [0, 0, 0, 1]
}

function nodeIndex(json, name) {
  return json.nodes.findIndex((node) => node.name === name)
}

function writeFloatData(parts, values, type, min, max) {
  const start = parts.bytes
  const bytes = Buffer.alloc(values.length * 4)
  values.forEach((value, index) => bytes.writeFloatLE(value, index * 4))
  parts.chunks.push(bytes)
  parts.bytes += align4(bytes.length)
  const padding = parts.bytes - start - bytes.length
  if (padding > 0) parts.chunks.push(Buffer.alloc(padding))
  return { start, byteLength: bytes.length, count: values.length / (type === 'VEC4' ? 4 : 1), type, min, max }
}

function addAnimationData(json, bin, animationDefs) {
  json.buffers ||= [{ byteLength: 0 }]
  json.bufferViews ||= []
  json.accessors ||= []
  json.animations ||= []
  json.buffers[0].byteLength = bin.length

  const parts = { chunks: [], bytes: align4(bin.length) }
  if (parts.bytes > bin.length) parts.chunks.push(Buffer.alloc(parts.bytes - bin.length))

  for (const def of animationDefs) {
    if (json.animations.some((animation) => animation.name === def.name)) continue
    const samplers = []
    const channels = []
    const inputCache = new Map()

    for (const track of def.tracks) {
      const node = nodeIndex(json, track.node)
      if (node < 0) continue

      const timeKey = track.times.join(',')
      let inputAccessor = inputCache.get(timeKey)
      if (inputAccessor == null) {
        const data = writeFloatData(parts, track.times, 'SCALAR', [track.times[0]], [track.times.at(-1)])
        const view = json.bufferViews.push({
          buffer: 0,
          byteOffset: data.start,
          byteLength: data.byteLength,
        }) - 1
        inputAccessor = json.accessors.push({
          bufferView: view,
          componentType: FLOAT,
          count: data.count,
          type: data.type,
          min: data.min,
          max: data.max,
        }) - 1
        inputCache.set(timeKey, inputAccessor)
      }

      const values = track.values.flat()
      const data = writeFloatData(parts, values, 'VEC4')
      const view = json.bufferViews.push({
        buffer: 0,
        byteOffset: data.start,
        byteLength: data.byteLength,
      }) - 1
      const outputAccessor = json.accessors.push({
        bufferView: view,
        componentType: FLOAT,
        count: data.count,
        type: 'VEC4',
      }) - 1

      const sampler = samplers.push({
        input: inputAccessor,
        output: outputAccessor,
        interpolation: 'LINEAR',
      }) - 1
      channels.push({ sampler, target: { node, path: 'rotation' } })
    }

    if (channels.length) json.animations.push({ name: def.name, samplers, channels })
  }

  const appended = Buffer.concat(parts.chunks)
  const outBin = Buffer.concat([bin, appended])
  json.buffers[0].byteLength = outBin.length
  return outBin
}

function buildClips(json) {
  const rest = (name) => nodeRotation(json, nodeIndex(json, name))
  const idleTimes = [0, 1.05, 2.1, 3.15, 4.2]
  const throwTimes = [0, 0.22, 0.58, 0.87, 1.16, 1.45]

  const idle = {
    name: 'Idle',
    tracks: [
      {
        node: 'lpBip Spine_03',
        times: idleTimes,
        values: idleTimes.map((_, i) =>
          compose(rest('lpBip Spine_03'), [{ axis: [0, 1, 0], angle: [0, 0.018, 0, -0.018, 0][i] }])
        ),
      },
      {
        node: 'lpBip Head_06',
        times: idleTimes,
        values: idleTimes.map((_, i) =>
          compose(rest('lpBip Head_06'), [{ axis: [0, 1, 0], angle: [0, -0.018, 0.012, -0.01, 0][i] }])
        ),
      },
      {
        node: 'lpBip L UpperArm_09',
        times: idleTimes,
        values: idleTimes.map((_, i) =>
          compose(rest('lpBip L UpperArm_09'), [{ axis: [0, 0, 1], angle: [0, 0.015, 0, -0.012, 0][i] }])
        ),
      },
      {
        node: 'lpBip R UpperArm_019',
        times: idleTimes,
        values: idleTimes.map((_, i) =>
          compose(rest('lpBip R UpperArm_019'), [{ axis: [0, 0, 1], angle: [0, -0.015, 0, 0.012, 0][i] }])
        ),
      },
    ],
  }

  const upperAngles = [0, -0.45, -0.95, 0.82, 0.35, 0]
  const foreAngles = [0, -0.2, -0.74, 0.38, 0.18, 0]
  const torsoAngles = [0, 0.08, 0.18, -0.16, -0.05, 0]
  const throwClip = {
    name: 'Throw',
    tracks: [
      {
        node: 'lpBip R UpperArm_019',
        times: throwTimes,
        values: upperAngles.map((angle, i) =>
          compose(rest('lpBip R UpperArm_019'), [
            { axis: [0, 0, 1], angle },
            { axis: [1, 0, 0], angle: [0, -0.2, -0.42, 0.22, 0.12, 0][i] },
          ])
        ),
      },
      {
        node: 'lpBip R Forearm_020',
        times: throwTimes,
        values: foreAngles.map((angle) =>
          compose(rest('lpBip R Forearm_020'), [{ axis: [0, 0, 1], angle }])
        ),
      },
      {
        node: 'lpBip Spine_03',
        times: throwTimes,
        values: torsoAngles.map((angle) =>
          compose(rest('lpBip Spine_03'), [{ axis: [0, 1, 0], angle }])
        ),
      },
    ],
  }

  return [idle, throwClip]
}

function inspect(json, source, output) {
  const skin = (json.skins || [])[0]
  const nodeName = (i) => json.nodes[i]?.name ?? `node_${i}`
  const bones = skin ? skin.joints.map(nodeName) : []

  let triangles = 0
  for (const mesh of json.meshes || []) {
    for (const prim of mesh.primitives || []) {
      if (prim.indices != null) triangles += json.accessors[prim.indices].count / 3
    }
  }

  let min = [Infinity, Infinity, Infinity]
  let max = [-Infinity, -Infinity, -Infinity]
  for (const mesh of json.meshes || []) {
    for (const prim of mesh.primitives || []) {
      const acc = json.accessors[prim.attributes?.POSITION]
      if (acc?.min && acc?.max) {
        min = min.map((v, i) => Math.min(v, acc.min[i]))
        max = max.map((v, i) => Math.max(v, acc.max[i]))
      }
    }
  }

  return {
    source,
    output,
    exportDate: new Date().toISOString(),
    model: 'Low Poly Humanoid Robot',
    author: 'Denys Almaral',
    sourceUrl: SOURCE_URL,
    license: json.asset?.extras?.license ?? 'Sketchfab Standard License',
    generator: json.asset?.generator ?? null,
    availableFormats: ['glb'],
    armature: !!skin,
    skinned: !!skin,
    boneCount: bones.length,
    bones,
    animations: (json.animations || []).map((a) => ({
      name: a.name,
      channels: a.channels?.length ?? 0,
    })),
    meshes: (json.meshes || []).map((m) => m.name),
    materials: (json.materials || []).map((m) => m.name),
    textures: (json.images || []).map((img, i) => ({
      index: i,
      mimeType: img.mimeType,
      bytes: json.bufferViews[img.bufferView]?.byteLength ?? 0,
    })),
    boundingBox: { min, max },
    dimensions: {
      x: max[0] - min[0],
      y: max[1] - min[1],
      z: max[2] - min[2],
    },
    orientation: 'Source orientation preserved; runtime camera frames waist-up.',
    pose: 'Source includes a tpose clip; rest pose is humanoid rig compatible.',
    triangleCount: triangles,
    blenderImport: 'Not verified on this machine.',
    materialPlan:
      'Runtime material remap converts saturated accents to graphite and bright shell areas to warm off-white.',
    problemsAndAssumptions: [
      'Blender was not required for this environment; the script injects lightweight GLTF Idle and Throw clips without altering the original source asset.',
      'The original walk and tpose clips are preserved.',
      'The runtime still includes fallback clip authoring if an older GLB without Idle or Throw is loaded.',
      'Material recolor is runtime-based to avoid destructive source edits.',
    ],
  }
}

const { json, bin } = parseGlb(SRC)
const clips = buildClips(json)
const outBin = addAnimationData(json, bin, clips)
writeGlb(json, outBin, OUT)

const report = inspect(json, SRC, OUT)
fs.mkdirSync(path.dirname(REPORT), { recursive: true })
fs.writeFileSync(REPORT, `${JSON.stringify(report, null, 2)}\n`)

console.log(`prepared ${OUT}`)
console.log(`report   ${REPORT}`)
console.log(`clips    ${report.animations.map((a) => a.name).join(', ')}`)
console.log(`bones    ${report.boneCount}, triangles ${report.triangleCount}`)
