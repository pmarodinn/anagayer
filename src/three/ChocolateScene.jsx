import { useMemo } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'

// Chocolate derretido: superfície sedosa com ondas lentas e um fio
// caindo, que forma ondulações no ponto de impacto. Tudo no shader.

const POUR = new THREE.Vector2(-0.55, -0.35)

const HEIGHT_GLSL = /* glsl */ `
  uniform float uTime;
  uniform vec2 uPour;
  float hgt(vec2 p) {
    float t = uTime * 0.32;
    vec2 q = p + 0.38 * vec2(sin(p.y * 1.2 + t), cos(p.x * 1.05 - t * 0.8));
    float v = 0.0;
    v += 0.105 * sin(q.x * 1.55 + t * 1.15);
    v += 0.07 * sin(q.y * 2.05 - t * 0.85 + q.x * 0.55);
    v += 0.03 * sin((q.x + q.y) * 3.4 + t * 1.6);
    float r = length(p - uPour);
    v += 0.022 * sin(r * 11.0 - uTime * 2.4) * exp(-r * 1.4);
    v -= 0.05 * exp(-r * r * 14.0);
    return v;
  }
`

function chocolateMaterial(kind) {
  const m = new THREE.MeshPhysicalMaterial({
    color: '#2f150a',
    roughness: 0.26,
    clearcoat: 1,
    clearcoatRoughness: 0.14,
    sheen: 0.3,
    sheenColor: new THREE.Color('#a0583a'),
    envMapIntensity: 1.25,
  })
  const uniforms = { uTime: { value: 0 }, uPour: { value: POUR } }
  m.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms)
    shader.vertexShader = shader.vertexShader.replace('#include <common>', `#include <common>\n${HEIGHT_GLSL}`)
    if (kind === 'surface') {
      shader.vertexShader = shader.vertexShader
        .replace(
          '#include <beginnormal_vertex>',
          `float e = 0.012;
           vec2 pp = position.xz;
           float dx = (hgt(pp + vec2(e, 0.0)) - hgt(pp - vec2(e, 0.0))) / (2.0 * e);
           float dz = (hgt(pp + vec2(0.0, e)) - hgt(pp - vec2(0.0, e))) / (2.0 * e);
           vec3 objectNormal = normalize(vec3(-dx, 1.0, -dz));`,
        )
        .replace('#include <begin_vertex>', 'vec3 transformed = position; transformed.y += hgt(position.xz);')
    } else {
      // fio: leve ondulação lateral e afinamento perto do topo
      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `vec3 transformed = position;
         float k = 1.0 - smoothstep(-1.4, 1.6, position.y) * 0.45;
         transformed.xz *= k * (1.0 + 0.08 * sin(position.y * 9.0 - uTime * 7.0));
         transformed.x += sin(position.y * 2.2 + uTime * 1.3) * 0.03;`,
      )
    }
  }
  m.customProgramCacheKey = () => `chocolate-${kind}`
  m.userData.uniforms = uniforms
  return m
}

function Chocolate({ mobile }) {
  const surface = useMemo(() => {
    const g = new THREE.PlaneGeometry(9, 9, mobile ? 180 : 300, mobile ? 180 : 300)
    g.rotateX(-Math.PI / 2)
    return g
  }, [mobile])
  const stream = useMemo(() => new THREE.CylinderGeometry(0.065, 0.065, 3.2, 32, 80, true), [])
  const mSurface = useMemo(() => chocolateMaterial('surface'), [])
  const mStream = useMemo(() => chocolateMaterial('stream'), [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    mSurface.userData.uniforms.uTime.value = t
    mStream.userData.uniforms.uTime.value = t
    state.camera.position.x = 0.35 + Math.sin(t * 0.08) * 0.12
    state.camera.lookAt(-0.25, -0.05, -0.6)
  })

  return (
    <group>
      <mesh geometry={surface} material={mSurface} />
      <mesh geometry={stream} material={mStream} position={[POUR.x, 1.55, POUR.y]} />
    </group>
  )
}

export default function ChocolateScene({ active, mobile }) {
  return (
    <Canvas
      dpr={mobile ? [1, 1.4] : [1, 1.8]}
      camera={{ position: [0.35, 0.95, 2.5], fov: 36, near: 0.05, far: 30 }}
      gl={{ antialias: true, toneMapping: THREE.NeutralToneMapping }}
      frameloop={active ? 'always' : 'never'}
    >
      <color attach="background" args={['#eadfd2']} />
      <fog attach="fog" args={['#eadfd2', 3.1, 7]} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[-2, 3, 1]} intensity={1.4} color="#fff3e6" />
      <directionalLight position={[3, 2, -3]} intensity={1.6} color="#ffc08f" />
      <Environment resolution={48} frames={1}>
        <color attach="background" args={['#cfc4b8']} />
        <Lightformer form="rect" intensity={1.6} color="#ffffff" position={[0, 5, -4]} rotation-x={Math.PI / 2.5} scale={[12, 3, 1]} />
        <Lightformer form="rect" intensity={2.2} color="#fff4ea" position={[-5, 1.5, -1]} scale={[0.8, 6, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={2.4} color="#ffd2ad" position={[5, 1.5, -2]} scale={[0.8, 6, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={1} color="#ffffff" position={[0, 2, 5]} scale={[8, 2, 1]} target={[0, 0, 0]} />
      </Environment>
      <Chocolate mobile={mobile} />
    </Canvas>
  )
}
