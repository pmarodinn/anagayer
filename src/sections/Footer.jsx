import { contact, brand } from '../content'
import { scrollToId } from '../lib/scroll'
import LogoMark from '../components/LogoMark'

export default function Footer() {
  return (
    <footer className="footer">
      <LogoMark filled className="footer__mark" data-reveal />
      <p className="footer__word" data-reveal>
        Ana Gayer
      </p>
      <p className="footer__tag" data-reveal>
        {brand.tagline}
      </p>
      <div className="footer__row label">
        <span>© {new Date().getFullYear()} Ana Gayer · anagayer.com.br</span>
        <nav aria-label="Contato">
          <a className="link-line" href={`https://instagram.com/${contact.instagram}`} target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a className="link-line" href={`mailto:${contact.email}`}>
            E-mail
          </a>
          {contact.whatsapp && (
            <a className="link-line" href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          )}
          <a
            className="link-line"
            href="#caixa"
            onClick={(e) => {
              e.preventDefault()
              scrollToId('caixa')
            }}
          >
            Voltar ao topo ↑
          </a>
        </nav>
      </div>
    </footer>
  )
}
