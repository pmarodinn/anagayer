import { atelier, contact } from '../content'

export default function Atelier() {
  const href = contact.whatsapp
    ? `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent('Olá, Ana Gayer. Gostaria de fazer uma encomenda.')}`
    : `mailto:${contact.email}?subject=${encodeURIComponent('Encomenda')}`
  return (
    <section id="encomendas" className="section atelier" aria-label={atelier.label}>
      <div>
        <span className="kicker label" data-reveal>
          <b>{atelier.index}</b>&nbsp;{atelier.label}
        </span>
        <h2 className="display atelier__title" data-reveal style={{ marginTop: 28 }}>
          {atelier.title}
        </h2>
      </div>
      <div className="atelier__text">
        <p data-reveal>{atelier.text}</p>
        <ul className="atelier__items label" data-reveal>
          {atelier.items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
        <a className="btn btn--ghost label" href={href} target="_blank" rel="noreferrer" data-reveal>
          <span>{atelier.cta}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
            <path d="M3 12h17M14 6l6 6-6 6" />
          </svg>
        </a>
      </div>
    </section>
  )
}
