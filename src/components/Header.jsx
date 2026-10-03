import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { nav, contact } from '../content'
import { scrollToId, lockScroll } from '../lib/scroll'
import LogoMark from './LogoMark'

const ease = [0.22, 1, 0.36, 1]

export default function Header({ ready }) {
  const [open, setOpen] = useState(false)
  const [light, setLight] = useState(false)
  useEffect(() => {
    const on = (e) => setLight(!!e.detail)
    window.addEventListener('ag:header', on)
    return () => window.removeEventListener('ag:header', on)
  }, [])
  const toggle = (v) => {
    setOpen(v)
    lockScroll(v)
  }
  const go = (id) => (e) => {
    e.preventDefault()
    toggle(false)
    setTimeout(() => scrollToId(id), open ? 350 : 0)
  }

  return (
    <>
      <motion.header
        className={`header${light && !open ? ' is-light' : ''}`}
        initial={{ opacity: 0, y: -12 }}
        animate={ready ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.2, ease, delay: 0.3 }}
      >
        <a href="#caixa" className="header__mark" onClick={go('caixa')} aria-label="Ana Gayer — início">
          <LogoMark filled color="currentColor" style={{ color: 'var(--orange)' }} />
        </a>
        <span className="header__word" aria-hidden="true">
          Ana Gayer
        </span>
        <div className="header__actions">
          <a href="#convite" className="header__link label" onClick={go('convite')}>
            Solicitar convite
          </a>
          <button className="header__menu-btn label" aria-expanded={open} aria-controls="menu" onClick={() => toggle(!open)}>
            <span>{open ? 'Fechar' : 'Menu'}</span>
            <i />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="menu"
            className="menu"
            aria-label="Navegação principal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4, delay: 0.15 } }}
            transition={{ duration: 0.5, ease }}
          >
            <motion.div
              className="menu__img"
              initial={{ clipPath: 'inset(100% 0 0 0)' }}
              animate={{ clipPath: 'inset(0% 0 0 0)', transition: { duration: 1.4, ease, delay: 0.1 } }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              style={{ order: 2 }}
            >
              <img src="/media/folha-900.webp" alt="" />
            </motion.div>
            <ol>
              {[...nav, { id: 'convite', label: 'Convite' }].map((n, i) => (
                <motion.li
                  key={n.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.08 + i * 0.06, duration: 0.9, ease } }}
                  exit={{ opacity: 0, y: -20, transition: { delay: i * 0.03, duration: 0.3 } }}
                >
                  <a href={`#${n.id}`} onClick={go(n.id)}>
                    <small>{String(i + 1).padStart(2, '0')}</small>
                    {n.label}
                  </a>
                </motion.li>
              ))}
            </ol>
            <motion.div className="menu__foot label" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.5 } }}>
              <span>Doces finos · Por convite</span>
              <a href={`https://instagram.com/${contact.instagram}`} target="_blank" rel="noreferrer">
                Instagram ↗
              </a>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}
