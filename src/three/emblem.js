import * as THREE from 'three'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'
import { LOGO_PATHS, LOGO_W, LOGO_H } from '../lib/logoPaths'

// Converte a logo vetorial em geometria 3D (relevo fino, como hot stamping na tampa)

const SCALE = 1 / 300

let cache = null

export function getEmblem() {
  if (cache) return cache
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${LOGO_W} ${LOGO_H}"><path fill="#000" fill-rule="evenodd" d="${LOGO_PATHS.join(' ')}"/></svg>`
  const data = new SVGLoader().parse(svg)
  const path = data.paths[0]
  const cx = LOGO_W / 2
  const cy = LOGO_H / 2
  const tf = (v) => new THREE.Vector2((v.x - cx) * SCALE, -(v.y - cy) * SCALE)

  const shapes = path.toShapes(false).map((sh) => {
    const s = new THREE.Shape(sh.getPoints(10).map(tf))
    s.holes = sh.holes.map((h) => new THREE.Path(h.getPoints(10).map(tf)))
    return s
  })

  const depth = 0.012
  const frame = new THREE.ExtrudeGeometry(shapes, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.006,
    bevelSize: 0.006,
    bevelSegments: 2,
    curveSegments: 10,
  })
  frame.translate(0, 0, -depth / 2)
  frame.computeVertexNormals()

  const size = { w: LOGO_W * SCALE, h: LOGO_H * SCALE }
  cache = { frame, size }
  return cache
}

export function mulberry(seed) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
