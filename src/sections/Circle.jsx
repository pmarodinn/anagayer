import { useMemo, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '../lib/scroll'
import { circle } from '../content'
import { LOGO_PATHS } from '../lib/logoPaths'

const rad = (d) => (d * Math.PI) / 180
const at = (r, a) => [Math.cos(rad(a)) * r, Math.sin(rad(a)) * r]

// 1 → 3 → 9 → 27: cada proprietário concede três convites.
function useTree() {
  return useMemo(() => {
    const R = [0, 150, 265, 355]
    const spread = [0, 120, 34, 10.5]
    const levels = [[{ a: -90, p: null }]]
    for (let l = 1; l <= 3; l++) {
      const next = []
      levels[l - 1].forEach((parent, pi) => {
        for (let k = -1; k <= 1; k++) {
          const a = l === 1 ? -90 + (k + 1) * 120 : parent.a + k * spread[l]
          next.push({ a, p: pi })
        }
      })
      levels.push(next)
    }
    const nodes = levels.map((lv, l) => lv.map((n) => ({ ...n, xy: at(R[l], n.a) })))
    const edges = nodes.slice(1).map((lv, i) => lv.map((n) => [nodes[i][n.p].xy, n.xy]))
    return { nodes, edges, R }
  }, [])
}

export default function Circle() {
  const ref = useRef()
  const num = useRef()
  const gen = useRef()
  const { nodes, edges, R } = useTree()

  useGSAP(
    () => {
      const steps = gsap.utils.toArray('.circle__steps li')
      const setCount = (n, g) => {
        if (num.current) num.current.textContent = n
        if (gen.current) gen.current.textContent = g
      }
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: ref.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          onUpdate: (self) => {
            const p = self.progress
            steps.forEach((li, i) => li.classList.toggle('is-on', p > [0.04, 0.36, 0.62][i]))
            if (p < 0.3) setCount('1', 'Você')
            else if (p < 0.56) setCount('3', 'Primeira geração')
            else if (p < 0.82) setCount('9', 'Segunda geração')
            else setCount('27', 'Terceira geração')
          },
        },
      })
      tl.fromTo('.circle__text > *', { opacity: 0, y: 24 }, { opacity: 1, y: 0, stagger: 0.03, duration: 0.08, ease: 'power2.out' }, 0)
        .fromTo('.c-ring', { attr: { 'stroke-dashoffset': 1 } }, { attr: { 'stroke-dashoffset': 0 }, duration: 0.6, stagger: 0.1 }, 0.05)
        .fromTo('.c-root', { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.08, transformOrigin: '50% 50%' }, 0.06)
      ;[1, 2, 3].forEach((l, i) => {
        const t = 0.2 + i * 0.26
        tl.fromTo(`.c-edge-${l}`, { attr: { 'stroke-dashoffset': 1 } }, { attr: { 'stroke-dashoffset': 0 }, duration: 0.14, stagger: 0.12 / (l * 3) }, t)
          .fromTo(`.c-node-${l}`, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.06, stagger: 0.12 / (l * 3), transformOrigin: 'center', transformBox: 'fill-box' }, t + 0.08)
      })
      tl.to('.circle__svg', { rotate: 12, duration: 1, transformOrigin: '50% 50%' }, 0)
    },
    { scope: ref },
  )

  return (
    <section ref={ref} id="circulo" className="section circle" aria-label="O Círculo">
      <div className="sticky">
        <div className="circle__text">
          <span className="kicker label">
            <b>{circle.index}</b>&nbsp;{circle.label}
          </span>
          <h2 className="display circle__title">
            <span className="mask">
              <span>{circle.title[0]}</span>
            </span>
            <span className="mask">
              <span>{circle.title[1]}</span>
            </span>
          </h2>
          <p className="circle__sub">{circle.sub}</p>
          <ol className="circle__steps">
            {circle.steps.map((s) => (
              <li key={s.n}>
                <span className="n">{s.n}</span>
                <div>
                  <b>{s.t}</b>
                  <span>{s.d}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="circle__viz" aria-hidden="true">
          <svg className="circle__svg" viewBox="-400 -400 800 800">
            {R.slice(1).map((r) => (
              <circle key={r} className="c-ring" r={r} fill="none" stroke="rgba(43,33,26,.12)" strokeWidth="1" vectorEffect="non-scaling-stroke" pathLength="1" strokeDasharray="1" strokeDashoffset="1" />
            ))}
            {edges.map((lv, i) =>
              lv.map(([a, b], j) => (
                <line
                  key={`${i}-${j}`}
                  className={`c-edge-${i + 1}`}
                  x1={a[0]}
                  y1={a[1]}
                  x2={b[0]}
                  y2={b[1]}
                  stroke={i === 0 ? '#ea741c' : 'rgba(43,33,26,.42)'}
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                  pathLength="1"
                  strokeDasharray="1"
                  strokeDashoffset="1"
                />
              )),
            )}
            {nodes.slice(1).map((lv, i) =>
              lv.map((n, j) => (
                <circle
                  key={`${i}-${j}`}
                  className={`c-node-${i + 1}`}
                  cx={n.xy[0]}
                  cy={n.xy[1]}
                  r={[7, 4.5, 2.6][i]}
                  fill={i === 0 ? '#ea741c' : i === 1 ? '#2b211a' : 'rgba(43,33,26,.55)'}
                />
              )),
            )}
            <g className="c-root">
              <circle r="34" fill="#fbf8f3" stroke="rgba(43,33,26,.16)" vectorEffect="non-scaling-stroke" />
              <path transform="translate(-20 -17.8) scale(0.0363)" d={LOGO_PATHS.join(' ')} fill="#ea741c" fillRule="evenodd" />
            </g>
          </svg>
          <div className="circle__count">
            <div className="num" ref={num}>
              1
            </div>
            <div className="label" ref={gen}>
              Você
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
