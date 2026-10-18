export const NODE_COUNT = 120

const range = (n) => Array.from({ length: n }, (_, i) => i)

const sphere = (r) => (i) => {
  const phi = Math.acos(1 - (2 * (i + 0.5)) / NODE_COUNT)
  const theta = Math.PI * (1 + Math.sqrt(5)) * i
  return [r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi)]
}

const torus = (i) => {
  const u = ((i % 24) / 24) * Math.PI * 2
  const v = (Math.floor(i / 24) / 5) * Math.PI * 2
  const R = 2
  const r = 0.8
  return [(R + r * Math.cos(v)) * Math.cos(u), r * Math.sin(v), (R + r * Math.cos(v)) * Math.sin(u)]
}

const helix = (i) => {
  const t = i / NODE_COUNT
  const a = t * Math.PI * 6 + (i % 2) * Math.PI
  return [Math.cos(a) * 1.3, (t - 0.5) * 5.2, Math.sin(a) * 1.3]
}

const cube = (i) => {
  const s = 0.85
  const x = i % 5
  const y = Math.floor(i / 5) % 5
  const z = Math.floor(i / 25)
  return [(x - 2) * s, (y - 2) * s, (z - 2) * s]
}

const galaxy = (i) => {
  const t = i / NODE_COUNT
  const a = i * 0.42
  const r = 0.3 + t * 2.8
  return [Math.cos(a) * r, Math.sin(i * 0.9) * 0.25, Math.sin(a) * r]
}

// One formation per page section: top, about, skills, experience, education, contact
const makers = [sphere(2.2), torus, helix, cube, galaxy, sphere(2.2)]

export const shapes = makers.map((fn) => range(NODE_COUNT).map(fn))

// Accent hue per section (monotonic so it blends smoothly; wrapped with mod 1)
export const hues = [0.46, 0.58, 0.72, 0.88, 1.08, 1.46]

// Connect each node to its 3 nearest neighbours on the base sphere
export function buildEdges() {
  const pts = shapes[0]
  const seen = new Set()
  const edges = []
  pts.forEach((a, i) => {
    pts
      .map((b, j) => [j, Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])])
      .filter(([j]) => j !== i)
      .sort((x, y) => x[1] - y[1])
      .slice(0, 3)
      .forEach(([j]) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`
        if (!seen.has(key)) {
          seen.add(key)
          edges.push([i, j])
        }
      })
  })
  return edges
}
