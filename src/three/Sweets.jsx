import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { M } from './materials'
import { mulberry } from './emblem'

// Doces modelados proceduralmente, inspirados nas fotos do ateliê.

const geo = {}
const once = (k, f) => geo[k] || (geo[k] = f())

// forminha de papel plissada
export const cupGeometry = () =>
  once('cup', () => {
    const pts = [new THREE.Vector2(0, 0), new THREE.Vector2(0.2, 0), new THREE.Vector2(0.21, 0.02), new THREE.Vector2(0.275, 0.16)]
    const g = new THREE.LatheGeometry(pts, 96)
    const p = g.attributes.position
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i)
      const y = p.getY(i)
      const z = p.getZ(i)
      const r = Math.hypot(x, z)
      if (r < 0.19) continue
      const a = Math.atan2(z, x)
      const k = 1 + 0.045 * Math.cos(a * 28) * Math.min(1, y / 0.16 + 0.25)
      p.setX(i, x * k)
      p.setZ(i, z * k)
    }
    g.computeVertexNormals()
    return g
  })

const sphere = (r, d = 48) => once(`s${r}${d}`, () => new THREE.SphereGeometry(r, d, d / 2))

// pontos distribuídos na esfera (fibonacci)
function fib(n, i) {
  const y = 1 - (i / (n - 1)) * 2
  const r = Math.sqrt(1 - y * y)
  const t = Math.PI * (3 - Math.sqrt(5)) * i
  return new THREE.Vector3(Math.cos(t) * r, y, Math.sin(t) * r)
}

function Scatter({ count, radius, geometry, material, seed = 1, minY = -0.35, align = true, scaleJitter = 0.3, castShadow = false }) {
  const ref = useRef()
  useLayoutEffect(() => {
    const rnd = mulberry(seed)
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const s = new THREE.Vector3()
    const up = new THREE.Vector3(0, 1, 0)
    let k = 0
    for (let i = 0; i < count * 2 && k < count; i++) {
      const n = fib(count * 2, (i * 7919) % (count * 2))
      if (n.y < minY) continue
      const pos = n.clone().multiplyScalar(radius)
      if (align) {
        // granulado deitado sobre a superfície, em direção aleatória
        const tangent = new THREE.Vector3().crossVectors(n, up).normalize()
        if (tangent.lengthSq() < 0.01) tangent.set(1, 0, 0)
        tangent.applyAxisAngle(n, rnd() * Math.PI * 2)
        q.setFromUnitVectors(up, tangent)
      } else {
        q.setFromEuler(new THREE.Euler(rnd() * 6, rnd() * 6, rnd() * 6))
      }
      const sc = 1 - scaleJitter / 2 + rnd() * scaleJitter
      s.set(sc, sc, sc)
      m.compose(pos, q, s)
      ref.current.setMatrixAt(k++, m)
    }
    ref.current.count = k
    ref.current.instanceMatrix.needsUpdate = true
  }, [count, radius, seed, minY, align, scaleJitter])
  return <instancedMesh ref={ref} args={[geometry, material, count]} castShadow={castShadow} />
}

export function Cup() {
  return <mesh geometry={cupGeometry()} material={M.cup()} castShadow receiveShadow />
}

// Brigadeiro tradicional com granulado
export function Brigadeiro({ seed = 1 }) {
  const sprinkle = useMemo(() => once('sprinkle', () => new THREE.CapsuleGeometry(0.0085, 0.032, 2, 6)), [])
  return (
    <group>
      <Cup />
      <group position={[0, 0.2, 0]} scale={[1, 0.93, 1]}>
        <mesh geometry={sphere(0.19)} material={M.chocDark()} castShadow />
        <Scatter count={420} radius={0.196} geometry={sprinkle} material={M.sprinkle()} seed={seed} />
      </group>
    </group>
  )
}

// Brigadeiro branco com folha (foto Nº 02)
const leafGeometry = () =>
  once('leaf', () => {
    const s = new THREE.Shape()
    s.moveTo(0, -0.1)
    s.bezierCurveTo(0.07, -0.06, 0.075, 0.04, 0, 0.11)
    s.bezierCurveTo(-0.075, 0.04, -0.07, -0.06, 0, -0.1)
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.006, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.006, bevelSegments: 3, curveSegments: 24 })
    // nervuras levemente curvas
    const p = g.attributes.position
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i)
      p.setZ(i, p.getZ(i) - x * x * 3.2)
    }
    g.computeVertexNormals()
    return g
  })

export function Branco({ seed = 2 }) {
  const crystal = useMemo(() => once('crystal', () => new THREE.BoxGeometry(0.011, 0.011, 0.011)), [])
  return (
    <group>
      <Cup />
      <group position={[0, 0.2, 0]} scale={[1, 0.95, 1]}>
        <mesh geometry={sphere(0.19)} material={M.white()} castShadow />
        <Scatter count={160} radius={0.191} geometry={crystal} material={M.sugar()} seed={seed} align={false} minY={-0.1} />
        <group position={[0.015, 0.182, 0.01]} rotation={[-Math.PI / 2 + 0.12, 0, 0.7]} scale={1.25}>
          <mesh geometry={leafGeometry()} material={M.leaf()} castShadow />
        </group>
      </group>
    </group>
  )
}

// Trufa polvilhada de cacau
const truffleGeometry = () =>
  once('truffle', () => {
    const g = new THREE.IcosahedronGeometry(0.185, 6)
    const p = g.attributes.position
    const rnd = mulberry(3)
    const v = new THREE.Vector3()
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i)
      const n = 1 + Math.sin(v.x * 40) * Math.sin(v.y * 37) * Math.sin(v.z * 43) * 0.03 + (rnd() - 0.5) * 0.012
      v.multiplyScalar(n)
      p.setXYZ(i, v.x, v.y, v.z)
    }
    g.computeVertexNormals()
    return g
  })

export function Trufa() {
  return (
    <group>
      <Cup />
      <mesh geometry={truffleGeometry()} material={M.cocoa()} position={[0, 0.2, 0]} scale={[1, 0.92, 1]} castShadow />
    </group>
  )
}

// Copa de chocolate branco com frutas vermelhas (foto Nº 01)
const copaGeometry = () =>
  once('copa', () => {
    const pts = [
      [0, 0],
      [0.165, 0],
      [0.18, 0.012],
      [0.212, 0.22],
      [0.215, 0.243],
      [0.2, 0.25],
      [0.186, 0.232],
      [0.152, 0.04],
      [0, 0.04],
    ].map(([x, y]) => new THREE.Vector2(x, y))
    return new THREE.LatheGeometry(pts, 80)
  })

function Raspberry({ seed = 4, ...props }) {
  const drupe = sphere(0.021, 16)
  return (
    <group {...props}>
      <mesh geometry={sphere(0.06, 24)} material={M.raspberry()} />
      <Scatter count={46} radius={0.064} geometry={drupe} material={M.raspberry()} seed={seed} align={false} minY={-0.6} scaleJitter={0.25} castShadow />
    </group>
  )
}

function Blueberry(props) {
  return (
    <group {...props}>
      <mesh geometry={sphere(0.062, 32)} material={M.blueberry()} scale={[1, 0.86, 1]} castShadow />
      <mesh geometry={once('crown', () => new THREE.TorusGeometry(0.014, 0.006, 8, 10))} material={M.chocDark()} position={[0, 0.052, 0]} rotation-x={Math.PI / 2} />
    </group>
  )
}

export function Copa({ seed = 5 }) {
  return (
    <group>
      <mesh geometry={copaGeometry()} material={M.whiteChoc()} castShadow receiveShadow />
      <mesh geometry={once('jam', () => new THREE.CircleGeometry(0.188, 40))} material={M.compote()} position={[0, 0.215, 0]} rotation-x={-Math.PI / 2} />
      <Raspberry seed={seed} position={[-0.05, 0.285, -0.05]} rotation={[0.9, 0.3, 0.2]} scale={1.15} />
      <Blueberry position={[0.085, 0.262, 0.03]} rotation={[0.3, 0.4, 0.2]} />
      <Blueberry position={[-0.03, 0.258, 0.1]} rotation={[-0.3, 1.2, 0.1]} />
    </group>
  )
}

// Coração trançado com folha de ouro (foto Nº 03)
const heartGeometry = () =>
  once('heart', () => {
    const s = new THREE.Shape()
    s.moveTo(5, 5)
    s.bezierCurveTo(5, 5, 4, 0, 0, 0)
    s.bezierCurveTo(-6, 0, -6, 7, -6, 7)
    s.bezierCurveTo(-6, 11, -3, 15.4, 5, 19)
    s.bezierCurveTo(12, 15.4, 16, 11, 16, 7)
    s.bezierCurveTo(16, 7, 16, 0, 10, 0)
    s.bezierCurveTo(7, 0, 5, 5, 5, 5)
    const g = new THREE.ExtrudeGeometry(s, { depth: 3.2, bevelEnabled: true, bevelThickness: 2, bevelSize: 1.4, bevelSegments: 6, curveSegments: 32 })
    g.center()
    g.scale(0.024, 0.024, 0.024)
    return g
  })

const strandsGeometry = () =>
  once('strands', () => {
    const rnd = mulberry(21)
    const geos = []
    for (let i = 0; i < 16; i++) {
      const a = rnd() * Math.PI
      const len = 0.3 + rnd() * 0.12
      const cx = (rnd() - 0.5) * 0.12
      const cy = (rnd() - 0.5) * 0.14
      const pts = []
      for (let k = 0; k <= 8; k++) {
        const t = k / 8 - 0.5
        const x = cx + Math.cos(a) * t * len + Math.sin(t * 9 + i) * 0.012
        const y = cy + Math.sin(a) * t * len
        const z = 0.105 + Math.cos(t * Math.PI) * 0.03 + (i % 3) * 0.008
        pts.push(new THREE.Vector3(x, y, z))
      }
      geos.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, 0.016, 8, false))
    }
    // junta tudo em uma geometria
    const merged = new THREE.BufferGeometry()
    let total = 0
    geos.forEach((g) => (total += g.index.count))
    const pos = []
    const nor = []
    geos.forEach((g) => {
      const ng = g.toNonIndexed()
      pos.push(...ng.attributes.position.array)
      nor.push(...ng.attributes.normal.array)
    })
    merged.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    merged.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3))
    return merged
  })

const goldLeafGeometry = () =>
  once('goldleaf', () => {
    const g = new THREE.PlaneGeometry(0.13, 0.1, 10, 8)
    const p = g.attributes.position
    const rnd = mulberry(8)
    for (let i = 0; i < p.count; i++) {
      p.setZ(i, (rnd() - 0.5) * 0.018 + Math.sin(p.getX(i) * 60) * 0.004)
      p.setX(i, p.getX(i) * (0.8 + rnd() * 0.3))
    }
    g.computeVertexNormals()
    return g
  })

export function Coracao() {
  return (
    <group>
      <group position={[0, 0.1, 0.02]} rotation={[-Math.PI / 2, 0, Math.PI]} scale={0.92}>
        <mesh geometry={heartGeometry()} material={M.chocMilk()} castShadow receiveShadow />
        <mesh geometry={strandsGeometry()} material={M.chocMilk()} castShadow />
        <mesh geometry={goldLeafGeometry()} material={M.gold()} position={[0.03, 0.06, 0.16]} rotation={[0.25, -0.2, 0.5]} />
      </group>
    </group>
  )
}

// disposição 3×3 dentro da caixa
export const LAYOUT = [
  ['brigadeiro', 1],
  ['copa', 2],
  ['branco', 3],
  ['trufa', 4],
  ['coracao', 5],
  ['trufa', 6],
  ['branco', 7],
  ['copa', 8],
  ['brigadeiro', 9],
]

export function Sweet({ kind, seed }) {
  switch (kind) {
    case 'brigadeiro':
      return <Brigadeiro seed={seed} />
    case 'branco':
      return <Branco seed={seed} />
    case 'trufa':
      return <Trufa />
    case 'copa':
      return <Copa seed={seed} />
    case 'coracao':
      return <Coracao />
    default:
      return null
  }
}
