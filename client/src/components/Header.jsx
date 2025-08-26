import { Link } from "react-router-dom";
import { SITE } from "../data/siteConfig";

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo" data-testid="logo-link">
          {SITE.logoText}
        </Link>
        <nav className="nav-links">
          <Link to="/" data-testid="nav-home">Início</Link>
          <a 
            href={SITE.instagram} 
            target="_blank" 
            rel="noopener noreferrer"
            data-testid="nav-instagram"
          >
            Instagram
          </a>
          <a 
            href={`https://wa.me/${SITE.contactWhatsapp}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="whatsapp-btn"
            aria-label="Fale conosco pelo WhatsApp"
            data-testid="nav-whatsapp"
          >
            Fale conosco
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Header;
