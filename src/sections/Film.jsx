import { Suspense, lazy, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '../lib/scroll'
import { useInView, useIsMobile, hasWebGL } from '../lib/hooks'

const ChocolateScene = lazy(() => import('../three/ChocolateScene'))

const setHeader = (light) => window.dispatchEvent(new CustomEvent('ag:header', { detail: light }))

// Filme: janela pequena que se expande até tela cheia com a rolagem.
// Se `film.src` existir, toca o vídeo; senão, mostra a versão provisória.
export default function Film({ id, data, film, variant, align = 'left' }) {
  const ref = useRef()
  const time = useRef()
  const inView = useInView(ref, '10% 0px')
  const mobile = useIsMobile()
  const [webgl] = useState(hasWebGL)
  const hasVideo = !!film?.src

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: ref.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
          onUpdate: (self) => {
            setHeader(self.progress > 0.32 && self.progress < 0.97)
            if (time.current) {
              const s = Math.floor(self.progress * 59)
              time.current.textContent = `00:00:${String(s).padStart(2, '0')}`
            }
          },
          onLeave: () => setHeader(false),
          onLeaveBack: () => setHeader(false),
        },
      })
      tl.to('.film__frame', { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 0.42, ease: 'power2.inOut' }, 0)
        .to('.film__media', { scale: 1, duration: 0.6, ease: 'power1.out' }, 0)
        .to('.film__caption', { opacity: 0, duration: 0.1 }, 0.05)
        .to('.film__shade', { opacity: 1, duration: 0.2 }, 0.3)
        .to(['.film__top', '.film__bottom'], { opacity: 1, duration: 0.1 }, 0.4)
        .fromTo('.film__lines i', { yPercent: 105 }, { yPercent: 0, duration: 0.14, stagger: 0.06, ease: 'power3.out' }, 0.44)
        .to({}, { duration: 0.2 }, 0.8)
    },
    { scope: ref },
  )

  return (
    <section ref={ref} id={id} className={`section film film--${align}`} aria-label={data.label}>
      <div className="sticky">
        <div className="film__caption label" aria-hidden="true">
          <span>{data.index}</span>
          <span>{data.label}</span>
        </div>
        <div className="film__frame">
          <div className="film__media">
            {hasVideo ? (
              <video src={film.src} poster={film.poster || undefined} autoPlay muted loop playsInline preload="metadata" />
            ) : variant === 'gesto' && webgl ? (
              <Suspense fallback={null}>
                <ChocolateScene active={inView} mobile={mobile} />
              </Suspense>
            ) : (
              <div className="film__fallback">
                <img src="/media/folha-1600.webp" alt="" />
                <div className="film__light" />
              </div>
            )}
          </div>
          <div className="film__shade" />
        </div>
        <div className="film__overlay">
          <div className="film__top label">
            <span>{data.index}</span>
            <span>{data.label}</span>
          </div>
          <h2 className="display film__lines">
            {data.lines.map((l, i) => (
              <span className="mask" key={i}>
                <i>{l}</i>
              </span>
            ))}
          </h2>
          <div className="film__bottom label">
            <span>Ana Gayer</span>
            <span ref={time}>00:00:00</span>
          </div>
        </div>
      </div>
    </section>
  )
}
