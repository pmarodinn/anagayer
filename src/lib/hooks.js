import { useEffect, useRef, useState } from 'react'
import { ScrollTrigger } from './scroll'

// Visibilidade com margem — usado para pausar cenas WebGL fora da tela
export function useInView(ref, rootMargin = '20% 0px') {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, rootMargin])
  return inView
}

// Progresso 0→1 de uma seção "sticky" (topo da seção → fim da seção)
export function useSectionProgress(ref, onUpdate) {
  const progress = useRef({ value: 0 })
  const cb = useRef(onUpdate)
  cb.current = onUpdate
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        progress.current.value = self.progress
        cb.current && cb.current(self.progress)
      },
    })
    return () => st.kill()
  }, [ref])
  return progress
}

export function useIsMobile() {
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.innerWidth < 860)
  useEffect(() => {
    const on = () => setM(window.innerWidth < 860)
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  return m
}

export function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGL2RenderingContext && c.getContext('webgl2'))
  } catch {
    return false
  }
}
