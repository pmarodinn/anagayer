import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '../lib/scroll'
import { pieces } from '../content'

// Ritmo editorial: altura (vh), deslocamento vertical (vh) e profundidade de cada foto
const RHYTHM = [
  { h: 66, y: -3, depth: 1 },
  { h: 56, y: 7, depth: 1.5 },
  { h: 62, y: -6, depth: 0.7 },
  { h: 70, y: 2, depth: 1.2 },
  { h: 54, y: -2, depth: 1.7 },
  { h: 64, y: 5, depth: 0.9 },
]

const pad = (n) => String(n).padStart(2, '0')

// Galeria horizontal: a rolagem vertical folheia as fotos como um catálogo, sem legendas.
export default function Pieces() {
  const ref = useRef()
  const sticky = useRef()
  const track = useRef()
  const bar = useRef()
  const count = pieces.items.length

  useGSAP(
    () => {
      const distance = () => Math.max(0, track.current.scrollWidth - window.innerWidth)
      const setHeight = () => {
        ref.current.style.height = `${distance() + window.innerHeight * 1.15}px`
      }
      setHeight()
      ScrollTrigger.addEventListener('refreshInit', setHeight)

      const base = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#f3eee6'
      const tint = gsap.utils.interpolate([base, ...pieces.items.map((p) => p.tint), base])

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

      gsap.utils.toArray('.plate').forEach((el, i) => {
        const frame = el.querySelector('.plate__img')
        const img = frame.querySelector('img')
        const depth = RHYTHM[i % RHYTHM.length].depth
        // revelação em cortina + leve zoom de saída
        gsap
          .timeline({ scrollTrigger: { trigger: el, containerAnimation: move, start: 'left 98%', end: 'left 58%', scrub: true } })
          .to(frame, { clipPath: 'inset(0% 0 0% 0)', ease: 'power2.out', duration: 0.7 }, 0)
          .to(img, { scale: 1, ease: 'power2.out', duration: 1 }, 0)
          .from(el.querySelector('.plate__n'), { opacity: 0, y: 12, duration: 0.3 }, 0.5)
        // profundidade: cada foto atravessa a tela num ritmo vertical próprio
        gsap.fromTo(
          el,
          { yPercent: 4 * depth },
          { yPercent: -4 * depth, ease: 'none', scrollTrigger: { trigger: el, containerAnimation: move, start: 'left right', end: 'right left', scrub: true } },
        )
        // paralaxe da imagem dentro da moldura
        gsap.fromTo(
          img,
          { xPercent: -3 },
          { xPercent: 3, ease: 'none', scrollTrigger: { trigger: el, containerAnimation: move, start: 'left right', end: 'right left', scrub: true } },
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
    <section ref={ref} id="pecas" className="section pieces" aria-label={pieces.label}>
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
            <p>{pieces.text}</p>
          </div>

          {pieces.items.map((it, i) => {
            const r = RHYTHM[i % RHYTHM.length]
            return (
              <figure className="plate" key={it.img} style={{ '--h': `${r.h}vh`, '--y': `${r.y}vh` }}>
                <div className="plate__img" style={{ aspectRatio: `${it.w} / ${it.h}` }}>
                  <picture>
                    <source
                      type="image/webp"
                      srcSet={it.sizes.map((s) => `/media/${it.img}-${s}.webp ${s}w`).join(', ')}
                      sizes={`(max-width: 860px) 70vw, ${Math.round((r.h * it.w) / it.h)}vh`}
                    />
                    <img
                      src={`/media/${it.img}-${it.sizes[it.sizes.length - 1]}.jpg`}
                      alt={it.alt}
                      width={it.w}
                      height={it.h}
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                </div>
                <figcaption className="plate__n label" aria-hidden="true">
                  {pad(i + 1)}
                  <span>/ {pad(count)}</span>
                </figcaption>
              </figure>
            )
          })}
          <div className="pieces__end" />
        </div>

        <div className="pieces__counter label" aria-hidden="true">
          <span>{pieces.label}</span>
          <span className="bar">
            <i ref={bar} />
          </span>
          <span>
            01 — {pad(count)}
          </span>
        </div>
      </div>
    </section>
  )
}
