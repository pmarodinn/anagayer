import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer, Text } from '@react-three/drei'
import { getEmblem } from './emblem'
import { M } from './materials'
import { LAYOUT, Sweet } from './Sweets'
import serifFont from '@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-normal.woff?url'

// ── dimensões da caixa ─────────────────────────────────────
const W = 3.2 // largura/profundidade externas da base
const H = 0.62 // altura da base
const T = 0.05 // espessura das paredes
const LW = W + 0.08 // tampa
const LH = 0.3
const GAP = 0.92 // distância entre cavidades
const INSERT_TOP = 0.4
const INSERT_BOTTOM = 0.12
const HOLE = 0.33

const clamp01 = (v) => Math.min(1, Math.max(0, v))
const smooth = (t) => t * t * (3 - 2 * t)
const range = (v, a, b) => clamp01((v - a) / (b - a))

// interpolação por keyframes [[p, valor], ...] com suavização
function kf(P, frames) {
  if (P <= frames[0][0]) return frames[0][1]
  for (let i = 0; i < frames.length - 1; i++) {
    const [p0, v0] = frames[i]
    const [p1, v1] = frames[i + 1]
    if (P <= p1) {
      const t = smooth((P - p0) / (p1 - p0))
      if (Array.isArray(v0)) return v0.map((a, k) => a + (v1[k] - a) * t)
      return v0 + (v1 - v0) * t
    }
  }
  return frames[frames.length - 1][1]
}

function roundedRect(w, d, r) {
  const s = new THREE.Shape()
  const x = -w / 2
  const y = -d / 2
  s.moveTo(x + r, y)
  s.lineTo(x + w - r, y)
  s.quadraticCurveTo(x + w, y, x + w, y + r)
  s.lineTo(x + w, y + d - r)
  s.quadraticCurveTo(x + w, y + d, x + w - r, y + d)
  s.lineTo(x + r, y + d)
  s.quadraticCurveTo(x, y + d, x, y + d - r)
  s.lineTo(x, y + r)
  s.quadraticCurveTo(x, y, x + r, y)
  return s
}

// anel quadrado (paredes) extrudado para cima
function ringGeometry(w, thick, h, r = 0.03) {
  const outer = roundedRect(w, w, r)
  const inner = roundedRect(w - thick * 2, w - thick * 2, Math.max(0.005, r - thick))
  outer.holes.push(inner)
  const g = new THREE.ExtrudeGeometry(outer, { depth: h, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.006, bevelSegments: 2, curveSegments: 6 })
  g.rotateX(-Math.PI / 2)
  return g
}

function slabGeometry(w, h, r = 0.03, holes = []) {
  const s = roundedRect(w, w, r)
  holes.forEach(([x, z]) => {
    const p = new THREE.Path()
    p.absarc(x, -z, HOLE, 0, Math.PI * 2, true)
    s.holes.push(p)
  })
  const g = new THREE.ExtrudeGeometry(s, { depth: h, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.006, bevelSegments: 2, curveSegments: 32 })
  g.rotateX(-Math.PI / 2)
  return g
}

const CELLS = LAYOUT.map((_, i) => [((i % 3) - 1) * GAP, (Math.floor(i / 3) - 1) * GAP])

function Box({ progress, intro, mobile }) {
  const lid = useRef()
  const insert = useRef()
  const sweets = useRef([])
  const root = useRef()
  const { camera, size } = useThree()
  const s = useRef({ p: 0, intro: 0, mx: 0, my: 0 })
  const target = useMemo(() => new THREE.Vector3(), [])

  const g = useMemo(() => {
    const { frame } = getEmblem()
    return {
      baseWalls: ringGeometry(W, T, H),
      baseFloor: slabGeometry(W - 0.002, T),
      lining: ringGeometry(W - T * 2 + 0.001, 0.012, H - 0.02, 0.012),
      liningFloor: slabGeometry(W - T * 2 - 0.02, 0.07, 0.012),
      insert: slabGeometry(W - T * 2 - 0.03, INSERT_TOP - INSERT_BOTTOM, 0.012, CELLS),
      lidTop: slabGeometry(LW, 0.05, 0.04),
      lidWalls: ringGeometry(LW, T * 0.8, LH - 0.05, 0.04),
      lidLining: new THREE.PlaneGeometry(LW - 0.12, LW - 0.12),
      emblem: frame,
    }
  }, [])

  useEffect(() => {
    // sinaliza que os shaders já foram compilados (o preloader espera por isto)
    let n = 0
    const id = requestAnimationFrame(function tick() {
      if (++n > 3) {
        window.__agHeroReady = true
        window.dispatchEvent(new Event('ag:hero-ready'))
        if (import.meta.env.DEV) console.debug('[ag] hero ready', Math.round(performance.now()))
      }
      else requestAnimationFrame(tick)
    })
    return () => cancelAnimationFrame(id)
  }, [])

  useFrame((state, dt) => {
    const st = s.current
    st.p = THREE.MathUtils.damp(st.p, progress.current.value, 3.2, dt)
    st.intro = THREE.MathUtils.damp(st.intro, intro.current ? 1 : 0, 1.4, dt)
    st.mx = THREE.MathUtils.damp(st.mx, state.pointer.x, 2, dt)
    st.my = THREE.MathUtils.damp(st.my, state.pointer.y, 2, dt)
    const P = st.p

    // ── tampa ───────────────────────────────────────
    const Y0 = H - LH + 0.052
    const lidY = kf(P, [
      [0.08, Y0],
      [0.22, Y0 + 0.55],
      [0.36, Y0 + 3.4],
      [0.74, Y0 + 3.4],
      [0.86, 0.001],
    ])
    const lidZ = kf(P, [
      [0.22, 0],
      [0.36, -1.6],
      [0.74, -1.6],
      [0.86, 0],
    ])
    const lidX = kf(P, [
      [0.74, 0],
      [0.86, W + 0.95],
    ])
    const lidRX = kf(P, [
      [0.1, 0],
      [0.3, -0.28],
      [0.36, -0.55],
      [0.74, -0.55],
      [0.86, 0],
    ])
    const lidRY = kf(P, [
      [0.74, 0],
      [0.86, -0.12],
    ])
    if (lid.current) {
      lid.current.position.set(lidX, lidY, lidZ)
      lid.current.rotation.set(lidRX, lidRY, 0)
      lid.current.visible = !(mobile && P > 0.8)
    }

    // ── vista explodida: berço e doces sobem ────────
    const ex = kf(P, [
      [0.42, 0],
      [0.6, 1],
      [0.7, 1],
      [0.8, 0],
    ])
    if (insert.current) insert.current.position.y = INSERT_BOTTOM + ex * 0.7
    sweets.current.forEach((m, i) => {
      if (!m) return
      const [x, z] = CELLS[i]
      const d = Math.hypot(x, z) / (GAP * 1.42)
      const e = smooth(clamp01((ex - d * 0.25) / 0.75))
      m.position.set(x, INSERT_BOTTOM + e * (1.35 + (i % 2) * 0.12), z)
      m.rotation.y = e * (i % 2 ? 0.6 : -0.6) + Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.04 * e
    })

    // ── câmera ──────────────────────────────────────
    const aspect = size.width / size.height
    const far = aspect < 1 ? Math.min(2.6, 1.12 / aspect) : aspect < 1.4 ? 1.15 : 1
    const side = mobile ? 0 : 1
    const pos = kf(P, [
      [0, [0, 4.1, 7.2]],
      [0.1, [0, 4.3, 7]],
      [0.22, [-1.7 * side + 0.9, 4.8, 6.6]],
      [0.3, [-1.7 * side + 0.6, 6.2, 5.4]],
      [0.42, [1.7 * side, 7.8, 4.4]],
      [0.5, [1.7 * side, 7.8, 4.4]],
      [0.6, [5.4 + 0.9 * side, 5.2, 8.6]],
      [0.72, [5.2 + 0.9 * side, 5.4, 8.8]],
      [0.86, [2.05 * side, 11.2, 0.6]],
      [1, [2.05 * side, 11.5, 0.5]],
    ])
    const look = kf(P, [
      [0, [0, 0.12, 0]],
      [0.1, [0, 0.12, 0]],
      [0.22, [-1.7 * side, 0.2, 0]],
      [0.3, [-1.5 * side, 0.3, 0]],
      [0.42, [1.7 * side, 0.3, 0]],
      [0.5, [1.7 * side, 0.3, 0]],
      [0.6, [0.9 * side, 0.95, 0]],
      [0.72, [0.9 * side, 0.95, 0]],
      [0.86, [2.05 * side, 0, 0.1]],
    ])
    const introK = 1 - smooth(st.intro)
    // afasta a câmera do alvo em telas estreitas (mantém o enquadramento)
    camera.position.set(
      look[0] + (pos[0] - look[0]) * far + st.mx * 0.35 * (1 - P),
      look[1] + (pos[1] - look[1]) * far + introK * 1.2 - st.my * 0.2 * (1 - P),
      look[2] + (pos[2] - look[2]) * far + introK * 2.4,
    )
    target.set(look[0], look[1] + introK * 0.2, look[2])
    camera.lookAt(target)
    if (root.current) root.current.position.y = mobile ? 0.25 : 0
  })

  return (
    <group ref={root}>
      {/* base */}
      <mesh geometry={g.baseWalls} material={M.paper()} castShadow receiveShadow />
      <mesh geometry={g.baseFloor} material={M.paper()} receiveShadow />
      <mesh geometry={g.lining} material={M.velvet()} position={[0, 0.02, 0]} receiveShadow />
      <mesh geometry={g.liningFloor} material={M.velvet()} position={[0, T, 0]} receiveShadow />
      <mesh ref={insert} geometry={g.insert} material={M.velvet()} position={[0, INSERT_BOTTOM, 0]} receiveShadow castShadow />

      {/* doces */}
      {LAYOUT.map(([kind, seed], i) => (
        <group key={i} ref={(el) => (sweets.current[i] = el)} position={[CELLS[i][0], INSERT_BOTTOM, CELLS[i][1]]}>
          <Sweet kind={kind} seed={seed} />
        </group>
      ))}

      {/* tampa */}
      <group ref={lid}>
        <mesh geometry={g.lidWalls} material={M.paper()} castShadow receiveShadow />
        <mesh geometry={g.lidTop} material={M.paper()} position={[0, LH - 0.05, 0]} castShadow receiveShadow />
        <mesh geometry={g.lidLining} material={M.velvet()} position={[0, LH - 0.052, 0]} rotation-x={Math.PI / 2} />
        {/* hot stamping: logo + nome + numeração */}
        <group position={[0, LH + 0.008, -0.12]} rotation-x={-Math.PI / 2}>
          <mesh geometry={g.emblem} material={M.foil()} scale={0.27} position={[0, 0.2, 0]} />
          <Text font={serifFont} fontSize={0.105} letterSpacing={0.52} position={[0.03, -0.46, 0.001]} anchorX="center" anchorY="middle">
            ANA GAYER
            <primitive object={M.foil()} attach="material" />
          </Text>
          <Text font={serifFont} fontSize={0.05} letterSpacing={0.4} position={[0.01, -1.24, 0.001]} anchorX="center" anchorY="middle">
            Nº 001 / 100
            <primitive object={M.foil()} attach="material" />
          </Text>
        </group>
      </group>
    </group>
  )
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.5} color="#fff6ec" />
      <directionalLight
        castShadow
        position={[-3.5, 8, 4]}
        intensity={2.2}
        color="#fff4e6"
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-radius={6}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-camera-near={1}
        shadow-camera-far={20}
      />
      <directionalLight position={[5, 3, -2]} intensity={0.6} color="#ffd9bd" />
      <Environment resolution={256} frames={1} environmentIntensity={0.7}>
        <color attach="background" args={['#efe8de']} />
        <Lightformer form="rect" intensity={2.2} color="#ffffff" position={[0, 6, 2]} rotation-x={Math.PI / 2} scale={[10, 6, 1]} />
        <Lightformer form="rect" intensity={1.4} color="#fff2e4" position={[-6, 2, 3]} scale={[4, 6, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={1} color="#ffe2c8" position={[6, 2, 1]} scale={[4, 6, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={0.8} color="#ffffff" position={[0, 2, 8]} scale={[8, 3, 1]} target={[0, 0, 0]} />
      </Environment>
    </>
  )
}

export default function BoxScene({ progress, intro, active, mobile }) {
  return (
    <Canvas
      shadows="soft"
      dpr={mobile ? [1, 1.5] : [1, 2]}
      camera={{ position: [0, 4.1, 7.2], fov: 30, near: 0.1, far: 80 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', toneMapping: THREE.NeutralToneMapping, preserveDrawingBuffer: import.meta.env.DEV }}
      frameloop={active ? 'always' : 'never'}
    >
      <Lights />
      <Box progress={progress} intro={intro} mobile={mobile} />
      <ContactShadows position={[0, -0.001, 0]} opacity={0.42} scale={14} blur={2.6} far={4} resolution={1024} color="#5a4030" frames={Infinity} />
    </Canvas>
  )
}
