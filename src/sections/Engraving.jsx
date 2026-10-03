import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react'
import { engraving, brand } from '../content'
import { LOGO_PATHS, LOGO_W, LOGO_H } from '../lib/logoPaths'

// Prévia ao vivo: o nome digitado aparece em hot stamping na tampa.
export default function Engraving({ name, setName }) {
  const plate = useRef()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const cfg = { stiffness: 60, damping: 18, mass: 0.8 }
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), cfg)
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), cfg)
  const foilX = useTransform(mx, [-0.5, 0.5], ['20%', '80%'])
  const shine = useTransform([mx, my], ([x, y]) => `radial-gradient(60% 50% at ${50 + x * 80}% ${50 + y * 80}%, rgba(255,255,255,.55), rgba(255,255,255,0) 70%)`)

  const onMove = (e) => {
    const r = plate.current.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const onLeave = () => {
    mx.set(0)
    my.set(0)
  }
  const number = String(((name.trim().length * 7 + 11) % brand.editionSize) + 1).padStart(3, '0')

  return (
    <section id="tampa" className="section engrave" aria-label={engraving.label}>
      <div className="engrave__text">
        <span className="kicker label" data-reveal>
          <b>{engraving.index}</b>&nbsp;{engraving.label}
        </span>
        <h2 className="display engrave__title" data-reveal>
          <span className="mask">
            <span>{engraving.title[0]}</span>
          </span>
          <span className="mask">
            <span>{engraving.title[1]}</span>
          </span>
        </h2>
        <p className="engrave__sub" data-reveal>
          {engraving.sub}
        </p>
        <label className="field" data-reveal>
          <small className="label">Prévia</small>
          <input value={name} maxLength={28} onChange={(e) => setName(e.target.value)} placeholder={engraving.placeholder} autoComplete="name" />
        </label>
        <p className="engrave__after" data-reveal>
          {engraving.after}
        </p>
      </div>

      <div className="lid" onMouseMove={onMove} onMouseLeave={onLeave} data-reveal>
        <motion.div className="lid__plate" ref={plate} style={{ rotateX: rx, rotateY: ry, '--foil-x': foilX }}>
          <div className="lid__edge" />
          <div className="lid__content">
            <svg viewBox={`0 0 ${LOGO_W} ${LOGO_H}`} aria-hidden="true">
              <defs>
                <linearGradient id="foil" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#c2601c" />
                  <stop offset=".45" stopColor="#f08a3c" />
                  <stop offset=".55" stopColor="#ffb987" />
                  <stop offset="1" stopColor="#c45b17" />
                </linearGradient>
              </defs>
              <path d={LOGO_PATHS.join(' ')} fill="url(#foil)" fillRule="evenodd" />
            </svg>
            <span className="lid__word foil">Ana Gayer</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={name || 'empty'}
                className="lid__name foil"
                initial={{ opacity: 0, filter: 'blur(6px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(4px)' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                {name.trim() || ' '}
              </motion.span>
            </AnimatePresence>
            <span className="lid__num label foil">
              Nº {number} / {brand.editionSize}
            </span>
          </div>
          <motion.div className="lid__shine" style={{ background: shine }} />
        </motion.div>
      </div>
    </section>
  )
}
