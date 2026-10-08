import { useCallback, useEffect, useState } from 'react'
import { initSmoothScroll, gsap, ScrollTrigger, prefersReducedMotion } from './lib/scroll'
import { films, filmGesto, filmNoite } from './content'
import Preloader from './components/Preloader'
import Header from './components/Header'
import Opening from './sections/Opening'
import Pieces from './sections/Pieces'
import Film from './sections/Film'
import Circle from './sections/Circle'
import Invitation from './sections/Invitation'
import Atelier from './sections/Atelier'
import Footer from './sections/Footer'

export default function App() {
  const [ready, setReady] = useState(false)
  const [name, setName] = useState('')

  useEffect(() => {
    initSmoothScroll()
  }, [])

  // revelações suaves: elementos com [data-reveal] sobem e aparecem ao entrar na tela
  useEffect(() => {
    if (!ready) return
    if (prefersReducedMotion) return
    const triggers = ScrollTrigger.batch('[data-reveal]', {
      start: 'top 90%',
      once: true,
      onEnter: (els) => {
        gsap.to(els, { opacity: 1, y: 0, duration: 1.6, ease: 'power3.out', stagger: 0.12 })
        els.forEach((el) => {
          const lines = el.querySelectorAll('.mask > *')
          if (lines.length) gsap.fromTo(lines, { yPercent: 105 }, { yPercent: 0, duration: 1.5, ease: 'power3.out', stagger: 0.1 })
        })
      },
    })
    const t = setTimeout(() => ScrollTrigger.refresh(), 300)
    return () => {
      clearTimeout(t)
      triggers.forEach((st) => st.kill())
    }
  }, [ready])

  const done = useCallback(() => setReady(true), [])

  return (
    <>
      <Preloader onDone={done} />
      <div className="paper" aria-hidden="true" />
      <Header ready={ready} />
      <main>
        <Opening ready={ready} />
        <Pieces />
        <Film id="gesto" data={filmGesto} film={films.gesto} variant="gesto" />
        <Circle />
        <Film id="noite" data={filmNoite} film={films.noite} variant="noite" align="right" />
        <Invitation name={name} setName={setName} />
        <Atelier />
      </main>
      <Footer />
    </>
  )
}
