import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html, MeshDistortMaterial } from '@react-three/drei'
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import { skills } from './data.js'
import { NODE_COUNT, shapes, hues, buildEdges } from './shapes.js'
import Particles from './Particles.jsx'

const reduced =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const labels = skills.flatMap((s) => s.items)
const HOT = new THREE.Color('#ffffff')
const SIGNALS = 45
const smooth = (t) => t * t * (3 - 2 * t)

function hopDistances(adj, start) {
  const dist = new Array(adj.length).fill(Infinity)
  dist[start] = 0
  const queue = [start]
  while (queue.length) {
    const n = queue.shift()
    adj[n].forEach((m) => {
      if (dist[m] === Infinity) {
        dist[m] = dist[n] + 1
        queue.push(m)
      }
    })
  }
  return dist
}

// Continuous section index (0..5) from the scroll position
function useSectionProgress() {
  const tops = useRef([0])
  useEffect(() => {
    const ids = ['top', 'about', 'skills', 'experience', 'education', 'contact']
    const measure = () => {
      tops.current = ids.map((id) => document.getElementById(id)?.offsetTop ?? 0)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(document.body)
    window.addEventListener('load', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('load', measure)
    }
  }, [])
  return () => {
    const t = tops.current
    const y = window.scrollY + window.innerHeight * 0.4
    let k = 0
    while (k < t.length - 1 && y >= t[k + 1]) k++
    if (k >= t.length - 1) return t.length - 1
    return k + (y - t[k]) / Math.max(1, t[k + 1] - t[k])
  }
}

function Network({ colorRef }) {
  const group = useRef()
  const coreMat = useRef()
  const meshes = useRef([])
  const lines = useRef()
  const signalPts = useRef()
  const ripple = useRef(null)
  const spin = useRef({ vx: 0, vy: reduced ? 0 : 0.0025, dragging: false })
  const progress = useRef(0)
  const lastHue = useRef(-1)
  const [hovered, setHovered] = useState(null)
  const { gl, viewport, camera, clock } = useThree()
  const getSection = useSectionProgress()

  const edges = useMemo(buildEdges, [])
  const adj = useMemo(() => {
    const a = Array.from({ length: NODE_COUNT }, () => [])
    edges.forEach(([i, j]) => {
      a[i].push(j)
      a[j].push(i)
    })
    return a
  }, [edges])
  const cur = useMemo(() => new Float32Array(NODE_COUNT * 3), [])
  const linePos = useMemo(() => new Float32Array(edges.length * 6), [edges])
  const lineCol = useMemo(() => new Float32Array(edges.length * 6), [edges])
  const signals = useMemo(
    () =>
      Array.from({ length: SIGNALS }, () => ({
        e: Math.floor(Math.random() * edges.length),
        t: Math.random(),
        v: 0.4 + Math.random() * 0.8,
      })),
    [edges],
  )
  const signalPos = useMemo(() => new Float32Array(SIGNALS * 3), [])

  // drag to rotate, with inertia
  useEffect(() => {
    const el = gl.domElement
    let last = null
    const down = (e) => {
      last = [e.clientX, e.clientY]
      spin.current.dragging = true
    }
    const move = (e) => {
      if (!last) return
      spin.current.vy = (e.clientX - last[0]) * 0.006
      spin.current.vx = (e.clientY - last[1]) * 0.006
      last = [e.clientX, e.clientY]
    }
    const up = () => {
      last = null
      spin.current.dragging = false
    }
    el.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    return () => {
      el.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
  }, [gl])

  useEffect(() => {
    document.body.style.cursor = hovered !== null ? 'pointer' : ''
    return () => {
      document.body.style.cursor = ''
    }
  }, [hovered])

  useFrame((state, dt) => {
    const g = group.current
    if (!g) return
    const s = spin.current
    const t = state.clock.elapsedTime

    // ---- scroll progress -> morph between formations + accent colour
    const target = getSection()
    progress.current += (target - progress.current) * Math.min(1, dt * 3)
    const k = Math.min(Math.floor(progress.current), shapes.length - 2)
    const f = smooth(Math.min(1, progress.current - k))
    const from = shapes[k]
    const to = shapes[k + 1]

    const h = (((hues[k] + (hues[k + 1] - hues[k]) * f) % 1) + 1) % 1
    colorRef.current.setHSL(h, 0.85, 0.58)
    const hueKey = Math.round(h * 200)
    if (hueKey !== lastHue.current) {
      lastHue.current = hueKey
      document.documentElement.style.setProperty('--accent', `#${colorRef.current.getHexString()}`)
    }

    // ---- node positions + ripple + hover
    const r = ripple.current
    meshes.current.forEach((m, i) => {
      if (!m) return
      const x = from[i][0] + (to[i][0] - from[i][0]) * f
      const y = from[i][1] + (to[i][1] - from[i][1]) * f
      const z = from[i][2] + (to[i][2] - from[i][2]) * f
      cur[i * 3] = x
      cur[i * 3 + 1] = y
      cur[i * 3 + 2] = z
      m.position.set(x, y, z)

      let wave = 0
      if (r && r.dist[i] !== Infinity) {
        const w = (t - r.t0) * 6 - r.dist[i]
        if (w > 0 && w < 2) wave = Math.sin((Math.PI * w) / 2)
      }
      const targetScale = (hovered === i ? 2.2 : 1) + wave * 1.8
      m.scale.setScalar(m.scale.x + (targetScale - m.scale.x) * 0.2)
      m.material.color.copy(colorRef.current).multiplyScalar(2)
      m.material.color.lerp(HOT, Math.min(1, wave + (hovered === i ? 0.8 : 0)))
    })
    if (r && t - r.t0 > 7) ripple.current = null

    // ---- edges: fade long (stretched) links
    edges.forEach(([a, b], i) => {
      const ax = cur[a * 3], ay = cur[a * 3 + 1], az = cur[a * 3 + 2]
      const bx = cur[b * 3], by = cur[b * 3 + 1], bz = cur[b * 3 + 2]
      linePos.set([ax, ay, az, bx, by, bz], i * 6)
      const len = Math.hypot(ax - bx, ay - by, az - bz)
      const a8 = Math.min(1, Math.max(0.05, 1.1 / (len + 0.2) - 0.3)) * 0.7
      for (let v = 0; v < 2; v++) {
        lineCol[i * 6 + v * 3] = colorRef.current.r * a8
        lineCol[i * 6 + v * 3 + 1] = colorRef.current.g * a8
        lineCol[i * 6 + v * 3 + 2] = colorRef.current.b * a8
      }
    })
    const lg = lines.current.geometry
    lg.attributes.position.needsUpdate = true
    lg.attributes.color.needsUpdate = true

    // ---- signals travelling along links
    signals.forEach((sg, i) => {
      sg.t += dt * sg.v
      if (sg.t > 1) {
        sg.t = 0
        sg.e = Math.floor(Math.random() * edges.length)
      }
      const [a, b] = edges[sg.e]
      for (let c = 0; c < 3; c++) {
        signalPos[i * 3 + c] = cur[a * 3 + c] + (cur[b * 3 + c] - cur[a * 3 + c]) * sg.t
      }
    })
    signalPts.current.geometry.attributes.position.needsUpdate = true

    // ---- rotation with inertia
    g.rotation.y += s.vy
    g.rotation.x += s.vx
    if (!s.dragging) {
      s.vx *= 0.95
      s.vy += ((reduced ? 0 : 0.0025) - s.vy) * 0.03
    }

    // ---- hero -> content: slide aside on wide screens, dim slightly
    const p = Math.min(window.scrollY / window.innerHeight, 1)
    const wide = viewport.width > 7
    g.position.x += ((wide ? p * viewport.width * 0.24 : 0) - g.position.x) * 0.1
    g.scale.setScalar(1 - (wide ? 0.25 : 0.4) * p)
    gl.domElement.style.opacity = String(1 - 0.35 * p)

    // ---- core pulse + camera parallax / fly-through
    if (coreMat.current) coreMat.current.color.copy(colorRef.current).multiplyScalar(1.5)
    camera.position.x += (state.pointer.x * 0.6 - camera.position.x) * 0.04
    camera.position.y += (state.pointer.y * 0.4 - camera.position.y) * 0.04
    camera.lookAt(0, 0, 0)
  })

  return (
    <>
      <group ref={group}>
        <mesh>
          <icosahedronGeometry args={[0.55, 4]} />
          <MeshDistortMaterial ref={coreMat} color="#7cf3d0" distort={0.45} speed={reduced ? 0 : 2.2} toneMapped={false} />
        </mesh>

        {Array.from({ length: NODE_COUNT }, (_, i) => (
          <mesh
            key={i}
            ref={(m) => (meshes.current[i] = m)}
            onPointerOver={(e) => {
              e.stopPropagation()
              setHovered(i)
            }}
            onPointerOut={() => setHovered((h) => (h === i ? null : h))}
            onClick={(e) => {
              if (e.delta > 4) return // was a drag, not a click
              e.stopPropagation()
              ripple.current = { t0: clock.elapsedTime, dist: hopDistances(adj, i) }
            }}
          >
            <sphereGeometry args={[0.075, 16, 16]} />
            <meshBasicMaterial color="#7cf3d0" toneMapped={false} />
            {hovered === i && (
              <Html center distanceFactor={8} style={{ pointerEvents: 'none' }}>
                <div className="node-label">{labels[i % labels.length]}</div>
              </Html>
            )}
          </mesh>
        ))}

        <lineSegments ref={lines} frustumCulled={false}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" array={linePos} count={linePos.length / 3} itemSize={3} />
            <bufferAttribute attach="attributes-color" array={lineCol} count={lineCol.length / 3} itemSize={3} />
          </bufferGeometry>
          <lineBasicMaterial vertexColors transparent blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </lineSegments>

        <points ref={signalPts} frustumCulled={false}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" array={signalPos} count={SIGNALS} itemSize={3} />
          </bufferGeometry>
          <pointsMaterial size={0.14} color="#ffffff" transparent blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </points>
      </group>
    </>
  )
}

export default function Scene() {
  const colorRef = useRef(new THREE.Color('#7cf3d0'))
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 50 }}
      dpr={[1, 1.75]}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={['#05070d']} />
      <Particles colorRef={colorRef} />
      <Network colorRef={colorRef} />
      <EffectComposer multisampling={0}>
        <Bloom intensity={1.1} luminanceThreshold={0.15} luminanceSmoothing={0.9} mipmapBlur />
        <Vignette offset={0.25} darkness={0.9} />
      </EffectComposer>
    </Canvas>
  )
}
