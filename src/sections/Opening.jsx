import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '../lib/scroll'
import { hero } from '../content'
import { useInView, useSectionProgress, useIsMobile, hasWebGL } from '../lib/hooks'

const BoxScene = lazy(() => import('../three/BoxScene'))

// Abertura: a caixa 3D. A rolagem levanta a tampa, revela os doces e
// mostra a caixa "desmontada" antes de voltar ao lugar.
export default function Opening({ ready }) {
  const ref = useRef()
  const canvas = useRef()
  const intro = useRef(false)
  const bar = useRef()
  const inView = useInView(ref, '0px')
  const mobile = useIsMobile()
  const [webgl] = useState(hasWebGL)

  const progress = useSectionProgress(ref, (p) => {
    if (bar.current) bar.current.style.transform = `scaleX(${p})`
  })

  useEffect(() => {
    if (!ready) return
    intro.current = true
    gsap.to(canvas.current, { opacity: 1, duration: 2.4, ease: 'power2.out' })
    gsap.fromTo('.opening__intro .reveal', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1.6, stagger: 0.14, ease: 'power3.out', delay: 0.5 })
  }, [ready])

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom bottom', scrub: 0.8 },
      })
      const IN = { opacity: 1, duration: 0.05, ease: 'power1.out' }
      const OUT = { opacity: 0, duration: 0.05, ease: 'power1.in' }
      tl.to('.opening__intro', { opacity: 0, y: -10, duration: 0.06 }, 0.03)
        .to('.opening__progress', IN, 0.06)
        // fase A
        .fromTo('.opening__phase--a', { opacity: 0 }, IN, 0.12)
        .fromTo('.opening__phase--a .mask > *', { yPercent: 100 }, { yPercent: 0, duration: 0.07, ease: 'power3.out' }, 0.12)
        .to('.opening__phase--a', OUT, 0.27)
        // fase B
        .fromTo('.opening__phase--b', { opacity: 0 }, IN, 0.31)
        .fromTo('.opening__phase--b .mask > *', { yPercent: 100 }, { yPercent: 0, duration: 0.07, ease: 'power3.out' }, 0.31)
        .fromTo('.opening__phase--b small', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.05 }, 0.35)
        .to('.opening__phase--b', OUT, 0.45)
        // ficha técnica (vista explodida)
        .fromTo('.opening__title', { opacity: 0 }, IN, 0.52)
        .fromTo('.opening__title .mask > *', { yPercent: 100 }, { yPercent: 0, duration: 0.07, ease: 'power3.out' }, 0.52)
        .to('.opening__specs li', { opacity: 1, duration: 0.04, stagger: 0.035 }, 0.54)
        .to(['.opening__title', '.opening__specs li'], { opacity: 0, duration: 0.05 }, 0.74)
        .to('.opening__progress', OUT, 0.93)
        .to({}, { duration: 0.02 }, 0.98)

      if (window.innerWidth < 860) {
        // no celular, as especificações aparecem uma de cada vez
        const items = gsap.utils.toArray('.opening__specs li')
        items.forEach((li, i) => {
          tl.to(li, { opacity: 1, duration: 0.02 }, 0.54 + i * 0.05).to(li, { opacity: 0, duration: 0.02 }, 0.585 + i * 0.05)
        })
      }
    },
    { scope: ref },
  )

  return (
    <section ref={ref} id="caixa" className="section opening" aria-label="A Caixa">
      <div className="sticky">
        <div className="canvas-wrap" ref={canvas} style={{ opacity: 0 }} aria-hidden="true">
          {webgl ? (
            <Suspense fallback={null}>
              <BoxScene progress={progress} intro={intro} active={inView} mobile={mobile} />
            </Suspense>
          ) : (
            <div className="opening__fallback">
              <img src="/media/folha-900.webp" alt="" />
            </div>
          )}
        </div>

        <div className="opening__overlay">
          <div className="opening__intro">
            <span className="label reveal">{hero.eyebrow}</span>
            <h1 className="display reveal">
              Doces finos. <em>Por convite.</em>
            </h1>
            <span className="opening__scroll label reveal">
              {hero.scroll}
              <i />
            </span>
          </div>

          <div className="opening__phase opening__phase--a">
            <p className="display">
              <span className="mask">
                <span>{hero.phases[0].big[0]}</span>
              </span>
            </p>
          </div>

          <div className="opening__phase opening__phase--b">
            <p className="display">
              <span className="mask">
                <span>{hero.phases[1].big[0]}</span>
              </span>
            </p>
            <small className="label">{hero.phases[1].small}</small>
          </div>

          <div className="opening__title">
            <div className="label">A Caixa</div>
            <h2 className="display">
              <span className="mask">
                <span>Edição</span>
              </span>
              <span className="mask">
                <span className="it">Nº 01</span>
              </span>
            </h2>
          </div>

          <ul className="opening__specs">
            {hero.specs.map((s) => (
              <li key={s.k}>
                <b className="label">{s.k}</b>
                <span>{s.v}</span>
              </li>
            ))}
          </ul>

          <div className="opening__progress label">
            <span>Abertura</span>
            <span className="bar">
              <i ref={bar} />
            </span>
            <span>Nº 01</span>
          </div>
        </div>
      </div>
    </section>
  )
}
