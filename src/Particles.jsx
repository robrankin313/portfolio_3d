import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uMouse;
  attribute float aSize;
  attribute float aSeed;
  varying float vDepth;
  void main() {
    vec3 p = position;
    p.z = mod(p.z + uScroll * 14.0 + 22.0, 30.0) - 22.0;
    p.x += sin(uTime * 0.2 + aSeed * 6.28) * 0.3;
    p.y += cos(uTime * 0.25 + aSeed * 6.28) * 0.3;
    vec2 d = p.xy - uMouse;
    float f = smoothstep(2.2, 0.0, length(d));
    p.xy += normalize(d + 1e-4) * f * 1.4;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vDepth = clamp(1.0 - (-mv.z) / 26.0, 0.0, 1.0);
    gl_PointSize = aSize * (34.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`

const fragment = /* glsl */ `
  uniform vec3 uColor;
  varying float vDepth;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d) * vDepth;
    gl_FragColor = vec4(uColor * 1.6, a);
  }
`

export default function Particles({ colorRef, count = 2500 }) {
  const mat = useRef()
  const { viewport } = useThree()

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const pos = new Float32Array(count * 3)
    const size = new Float32Array(count)
    const seed = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 26
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16
      pos[i * 3 + 2] = Math.random() * 30 - 22
      size[i] = 0.5 + Math.random() * 1.5
      seed[i] = Math.random()
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('aSize', new THREE.BufferAttribute(size, 1))
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))
    return g
  }, [count])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uMouse: { value: new THREE.Vector2(99, 99) },
      uColor: { value: new THREE.Color('#7cf3d0') },
    }),
    [],
  )

  useFrame((state) => {
    const u = uniforms
    u.uTime.value = state.clock.elapsedTime
    u.uScroll.value = window.scrollY / Math.max(1, window.innerHeight)
    u.uMouse.value.set((state.pointer.x * viewport.width) / 2, (state.pointer.y * viewport.height) / 2)
    if (colorRef.current) u.uColor.value.copy(colorRef.current)
  })

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={mat}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
