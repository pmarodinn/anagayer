import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion, lockScroll } from '../lib/scroll'
import LogoMark from './LogoMark'

// A marca se desenha em traço fino, preenche-se em laranja e dá lugar à caixa.
export default function Preloader({ onDone }) {
  const root = useRef()
  const lines = useRef()
  const fill = useRef()
  const word = useRef()

  useEffect(() => {
    lockScroll(true)
    document.body.classList.add('is-loading')
    let heroReady = false
    const onReady = () => (heroReady = true)
    window.addEventListener('ag:hero-ready', onReady)

    const paths = lines.current.querySelectorAll('path')
    paths.forEach((p) => {
      const len = p.getTotalLength()
      p.style.strokeDasharray = `${len}`
      p.style.strokeDashoffset = `${len}`
    })

    const finish = () => {
      gsap
        .timeline({
          onComplete: () => {
            document.body.classList.remove('is-loading')
            lockScroll(false)
            onDone && onDone()
          },
        })
        .to([fill.current, word.current], { opacity: 0, y: -8, duration: 0.9, ease: 'power2.inOut', stagger: 0.08 }, 0)
        .to(root.current, { opacity: 0, duration: 1.1, ease: 'power2.inOut' }, 0.45)
        .set(root.current, { display: 'none' })
    }

    if (prefersReducedMotion) {
      gsap.set(lines.current, { opacity: 0 })
      gsap.set([fill.current, word.current], { opacity: 1 })
      const t = setTimeout(finish, 500)
      return () => clearTimeout(t)
    }

    const tl = gsap.timeline()
    tl.to(paths, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', stagger: { each: 0.03, from: 'center' } }, 0.2)
      .fromTo(fill.current, { opacity: 0 }, { opacity: 1, duration: 1, ease: 'power2.out' }, 1.6)
      .to(lines.current, { opacity: 0, duration: 0.8 }, 1.9)
      .fromTo(word.current, { opacity: 0, letterSpacing: '0.9em' }, { opacity: 1, letterSpacing: '0.5em', duration: 1.6, ease: 'power3.out' }, 1.8)

    let waited = 0
    let timer
    const check = () => {
      if (heroReady || window.__agHeroReady || waited > 5000) finish()
      else {
        waited += 150
        timer = setTimeout(check, 150)
      }
    }
    timer = setTimeout(check, 3300)

    return () => {
      tl.kill()
      clearTimeout(timer)
      window.removeEventListener('ag:hero-ready', onReady)
    }
  }, [onDone])

  return (
    <div className="preloader" ref={root} role="status" aria-label="Carregando">
      <div className="preloader__stage">
        <LogoMark
          ref={lines}
          className="preloader__logo"
          style={{ fill: 'none', stroke: '#ea741c', strokeWidth: 1, vectorEffect: 'non-scaling-stroke', strokeLinejoin: 'round' }}
        />
        <LogoMark ref={fill} filled className="preloader__logo" style={{ opacity: 0 }} />
      </div>
      <span className="preloader__word" ref={word}>
        Ana Gayer
      </span>
    </div>
  )
}
