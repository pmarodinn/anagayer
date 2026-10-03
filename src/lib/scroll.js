import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const prefersReducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

let lenis = null

export function initSmoothScroll() {
  if (lenis || prefersReducedMotion) return lenis
  lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, smoothWheel: true })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((t) => lenis && lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
  return lenis
}

export function getLenis() {
  return lenis
}

export function scrollToId(id) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) lenis.scrollTo(el, { duration: 1.8, easing: (t) => 1 - Math.pow(1 - t, 4) })
  else el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' })
}

export function lockScroll(lock) {
  if (lenis) lock ? lenis.stop() : lenis.start()
  document.body.style.overflow = lock ? 'hidden' : ''
}

export { gsap, ScrollTrigger }
