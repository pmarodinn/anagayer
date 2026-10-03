import * as THREE from 'three'
import { mulberry } from './emblem'

// Texturas procedurais (sem arquivos externos)

function noiseCanvas(size, draw) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')
  draw(ctx, size)
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.anisotropy = 8
  return t
}

let paperBump
export function getPaperBump() {
  if (paperBump) return paperBump
  const rnd = mulberry(11)
  paperBump = noiseCanvas(512, (ctx, s) => {
    const img = ctx.createImageData(s, s)
    for (let i = 0; i < s * s; i++) {
      const v = 128 + (rnd() - 0.5) * 34
      img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v
      img.data[i * 4 + 3] = 255
    }
    ctx.putImageData(img, 0, 0)
    // fibras do papel algodão
    ctx.globalAlpha = 0.08
    for (let i = 0; i < 900; i++) {
      ctx.strokeStyle = rnd() > 0.5 ? '#fff' : '#000'
      ctx.lineWidth = 0.6
      const x = rnd() * s
      const y = rnd() * s
      const a = rnd() * Math.PI
      const l = 4 + rnd() * 14
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l)
      ctx.stroke()
    }
  })
  paperBump.colorSpace = THREE.NoColorSpace
  paperBump.repeat.set(2, 2)
  return paperBump
}

let velvetBump
export function getVelvetBump() {
  if (velvetBump) return velvetBump
  const rnd = mulberry(5)
  velvetBump = noiseCanvas(256, (ctx, s) => {
    const img = ctx.createImageData(s, s)
    for (let i = 0; i < s * s; i++) {
      const v = 128 + (rnd() - 0.5) * 60
      img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v
      img.data[i * 4 + 3] = 255
    }
    ctx.putImageData(img, 0, 0)
  })
  velvetBump.colorSpace = THREE.NoColorSpace
  velvetBump.repeat.set(6, 6)
  return velvetBump
}

const cache = {}
const once = (k, f) => cache[k] || (cache[k] = f())

export const M = {
  paper: () =>
    once('paper', () =>
      new THREE.MeshStandardMaterial({
        color: '#eeeae3',
        roughness: 0.9,
        metalness: 0,
        bumpMap: getPaperBump(),
        bumpScale: 0.35,
      }),
    ),
  velvet: () =>
    once('velvet', () =>
      new THREE.MeshPhysicalMaterial({
        color: '#8a3c16',
        roughness: 1,
        sheen: 1,
        sheenRoughness: 0.38,
        sheenColor: new THREE.Color('#e08a55'),
        bumpMap: getVelvetBump(),
        bumpScale: 0.25,
      }),
    ),
  foil: () =>
    once('foil', () =>
      new THREE.MeshPhysicalMaterial({
        color: '#ea741c',
        metalness: 0.75,
        roughness: 0.3,
        clearcoat: 0.6,
        clearcoatRoughness: 0.2,
      }),
    ),
  cup: () =>
    once('cup', () =>
      new THREE.MeshStandardMaterial({
        color: '#f2eee8',
        roughness: 0.8,
        side: THREE.DoubleSide,
        bumpMap: getPaperBump(),
        bumpScale: 0.2,
      }),
    ),
  chocDark: () =>
    once('chocDark', () => new THREE.MeshPhysicalMaterial({ color: '#3a2015', roughness: 0.55, clearcoat: 0.25, clearcoatRoughness: 0.5 })),
  sprinkle: () => once('sprinkle', () => new THREE.MeshStandardMaterial({ color: '#25130b', roughness: 0.42 })),
  chocMilk: () =>
    once('chocMilk', () => new THREE.MeshPhysicalMaterial({ color: '#5a2f1c', roughness: 0.28, clearcoat: 0.7, clearcoatRoughness: 0.18 })),
  cocoa: () => once('cocoa', () => new THREE.MeshStandardMaterial({ color: '#4b2c1d', roughness: 1 })),
  white: () =>
    once('white', () =>
      new THREE.MeshPhysicalMaterial({ color: '#f4ecdc', roughness: 0.72, sheen: 0.4, sheenColor: new THREE.Color('#ffffff') }),
    ),
  whiteChoc: () => once('whiteChoc', () => new THREE.MeshPhysicalMaterial({ color: '#efe1bb', roughness: 0.5, clearcoat: 0.3 })),
  sugar: () => once('sugar', () => new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.12, metalness: 0.1 })),
  leaf: () => once('leaf', () => new THREE.MeshStandardMaterial({ color: '#7e9a4c', roughness: 0.6, side: THREE.DoubleSide })),
  compote: () => once('compote', () => new THREE.MeshPhysicalMaterial({ color: '#5c0d1a', roughness: 0.18, clearcoat: 1 })),
  raspberry: () =>
    once('raspberry', () =>
      new THREE.MeshPhysicalMaterial({ color: '#b3122c', roughness: 0.42, sheen: 0.6, sheenColor: new THREE.Color('#ff7a8a') }),
    ),
  blueberry: () =>
    once('blueberry', () =>
      new THREE.MeshPhysicalMaterial({ color: '#2b3450', roughness: 0.6, sheen: 1, sheenRoughness: 0.6, sheenColor: new THREE.Color('#a9b6d6') }),
    ),
  gold: () => once('gold', () => new THREE.MeshStandardMaterial({ color: '#e9c46f', metalness: 1, roughness: 0.28, side: THREE.DoubleSide })),
}
