import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { invitation, contact } from '../content'

const ease = [0.22, 1, 0.36, 1]
const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
    <path d="M3 12h17M14 6l6 6-6 6" />
  </svg>
)

function formatCode(v) {
  const raw = v.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10)
  const body = raw.startsWith('AG') ? raw.slice(2) : raw
  return body ? `AG-${body.slice(0, 4)}${body.length > 4 ? '-' + body.slice(4, 8) : ''}` : ''
}

// Sem servidor: a solicitação é enviada por WhatsApp (ou e-mail) já redigida.
function send(lines) {
  const text = lines.filter(Boolean).join('\n')
  const url = contact.whatsapp
    ? `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(text)}`
    : `mailto:${contact.email}?subject=${encodeURIComponent('Ana Gayer — Solicitação de convite')}&body=${encodeURIComponent(text)}`
  window.open(url, '_blank', 'noopener')
}

export default function Invitation({ name, setName }) {
  const [tab, setTab] = useState(0)
  const [done, setDone] = useState(false)
  const [f, setF] = useState({ code: '', phone: '', instagram: '', by: '', note: '' })
  const up = (k) => (e) => setF({ ...f, [k]: k === 'code' ? formatCode(e.target.value) : e.target.value })

  const submit = (e) => {
    e.preventDefault()
    send(
      tab === 0
        ? ['Olá, Ana Gayer.', 'Recebi um convite para A Caixa.', `Código: ${f.code}`, `Nome: ${name}`, `WhatsApp: ${f.phone}`]
        : [
            'Olá, Ana Gayer.',
            'Gostaria de entrar na lista de espera d’A Caixa.',
            `Nome: ${name}`,
            `WhatsApp: ${f.phone}`,
            f.instagram && `Instagram: ${f.instagram}`,
            f.by && `Indicado(a) por: ${f.by}`,
            f.note && `Mensagem: ${f.note}`,
          ],
    )
    setDone(true)
  }

  return (
    <section id="convite" className="section invite" aria-label="Solicitar convite">
      <div className="invite__head">
        <span className="kicker label" data-reveal>
          <b>{invitation.index}</b>&nbsp;{invitation.label}
        </span>
        <h2 className="display invite__title" data-reveal>
          <span className="mask">
            <span>{invitation.title[0]}</span>
          </span>
          <span className="mask">
            <span>{invitation.title[1]}</span>
          </span>
        </h2>
      </div>

      <div data-reveal>
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div key="done" className="invite__done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease }}>
              <h3 className="display">{invitation.done[0]}</h3>
              <p>{invitation.done[1]}</p>
              <button className="btn btn--ghost label" onClick={() => setDone(false)}>
                <span>Voltar</span>
                <Arrow />
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              className="invite__form"
              onSubmit={submit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6, ease }}
            >
              <div className="tabs label" role="tablist">
                {invitation.tabs.map((t, i) => (
                  <button key={t} type="button" role="tab" aria-selected={tab === i} onClick={() => setTab(i)}>
                    {tab === i && <motion.span layoutId="tab-ind" className="tabs__ind" transition={{ type: 'spring', stiffness: 260, damping: 30 }} />}
                    {t}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="popLayout" initial={false}>
                {tab === 0 && (
                  <motion.label key="code" className="field" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.6, ease }}>
                    <small className="label">Código do convite</small>
                    <input value={f.code} onChange={up('code')} placeholder="AG-0000-0000" required autoComplete="off" spellCheck={false} />
                  </motion.label>
                )}
              </AnimatePresence>

              <label className="field">
                <small className="label">Nome</small>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Como devemos chamá-la(o)" required autoComplete="name" />
              </label>
              <label className="field">
                <small className="label">WhatsApp</small>
                <input value={f.phone} onChange={up('phone')} placeholder="(00) 00000-0000" required inputMode="tel" autoComplete="tel" />
              </label>

              <AnimatePresence initial={false}>
                {tab === 1 && (
                  <motion.div
                    key="extra"
                    style={{ display: 'grid', gap: 28, overflow: 'hidden' }}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.7, ease }}
                  >
                    <label className="field">
                      <small className="label">Instagram</small>
                      <input value={f.instagram} onChange={up('instagram')} placeholder="@" autoComplete="off" />
                    </label>
                    <label className="field">
                      <small className="label">Quem lhe indicou (opcional)</small>
                      <input value={f.by} onChange={up('by')} placeholder="Nome de quem pertence ao círculo" />
                    </label>
                    <label className="field">
                      <small className="label">Uma palavra sobre você (opcional)</small>
                      <textarea value={f.note} onChange={up('note')} rows={3} />
                    </label>
                  </motion.div>
                )}
              </AnimatePresence>

              <button type="submit" className="btn label">
                <span>{tab === 0 ? 'Validar convite' : 'Entrar na lista'}</span>
                <Arrow />
              </button>
              <p className="invite__note label">{invitation.note}</p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
