import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '../lib/scroll'
import { pieces } from '../content'

// Galeria horizontal: a rolagem vertical folheia as peças como um catálogo.
export default function Pieces() {
  const ref = useRef()
  const sticky = useRef()
  const track = useRef()
  const bar = useRef()

  useGSAP(
    () => {
      const distance = () => Math.max(0, track.current.scrollWidth - window.innerWidth)
      const setHeight = () => {
        ref.current.style.height = `${distance() + window.innerHeight * 1.15}px`
      }
      setHeight()
      ScrollTrigger.addEventListener('refreshInit', setHeight)

      const tints = [getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#f3eee6', ...pieces.items.map((p) => p.tint)]
      tints.push(tints[tints.length - 1])
      const tint = gsap.utils.interpolate(tints)

      const move = gsap.to(track.current, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.9,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`
            if (sticky.current) sticky.current.style.backgroundColor = tint(self.progress)
          },
        },
      })

      gsap.utils.toArray('.spread').forEach((sp) => {
        const frame = sp.querySelector('.spread__img')
        const img = frame.querySelector('img')
        const text = sp.querySelectorAll('.spread__text > *')
        gsap
          .timeline({
            scrollTrigger: { trigger: sp, containerAnimation: move, start: 'left 92%', end: 'left 25%', scrub: true },
          })
          .to(frame, { clipPath: 'inset(0 0 0% 0)', ease: 'power2.out', duration: 0.6 }, 0)
          .to(img, { scale: 1, ease: 'power2.out', duration: 1 }, 0)
          .from(text, { opacity: 0, y: 30, stagger: 0.08, duration: 0.4, ease: 'power2.out' }, 0.3)
        // leve paralaxe da imagem dentro da moldura
        gsap.fromTo(
          img,
          { xPercent: -4 },
          {
            xPercent: 4,
            ease: 'none',
            scrollTrigger: { trigger: sp, containerAnimation: move, start: 'left right', end: 'right left', scrub: true },
          },
        )
      })

      gsap.from('.pieces__intro > *', {
        opacity: 0,
        y: 30,
        stagger: 0.12,
        duration: 1.4,
        ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 70%' },
      })

      return () => ScrollTrigger.removeEventListener('refreshInit', setHeight)
    },
    { scope: ref },
  )

  return (
    <section ref={ref} id="pecas" className="section pieces" aria-label="As Peças">
      <div className="sticky" ref={sticky}>
        <div className="pieces__track" ref={track}>
          <div className="pieces__intro">
            <span className="kicker label">
              <b>{pieces.index}</b>&nbsp;{pieces.label}
            </span>
            <h2 className="display">
              {pieces.intro[0]}
              <br />
              <em>{pieces.intro[1]}</em>
            </h2>
            <p>Cada caixa reúne nove doces, preparados à mão no dia da entrega. Três deles, em detalhe.</p>
          </div>

          {pieces.items.map((it) => (
            <article className="spread" key={it.ref}>
              <div className="spread__img" style={{ aspectRatio: `${it.w} / ${it.h}` }}>
                <picture>
                  <source
                    type="image/webp"
                    srcSet={it.sizes.map((s) => `/media/${it.img}-${s}.webp ${s}w`).join(', ')}
                    sizes="(max-width: 860px) 80vw, 60vh"
                  />
                  <img
                    src={`/media/${it.img}-${it.sizes[it.sizes.length - 1]}.jpg`}
                    alt={`${it.name} — ${it.line}`}
                    width={it.w}
                    height={it.h}
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
              </div>
              <div className="spread__text">
                <div className="spread__ref label">
                  <span>{it.ref}</span>
                  <span>Ana Gayer</span>
                </div>
                <h3 className="display spread__name">{it.name}</h3>
                <p className="spread__line">{it.line}</p>
                <dl className="spread__specs">
                  {it.specs.map(([k, v]) => (
                    <div key={k}>
                      <dt className="label">{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </article>
          ))}
          <div className="pieces__end" />
        </div>

        <div className="pieces__counter label" aria-hidden="true">
          <span>As Peças</span>
          <span className="bar">
            <i ref={bar} />
          </span>
          <span>Nº 01 — 03</span>
        </div>
      </div>
    </section>
  )
}
