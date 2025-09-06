import { Link } from "react-router-dom";
import { SITE } from "../data/siteConfig";
import logo from "../assets/logo-artebryndes-fundoremovido.png"

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo no-focus-outline" data-testid="logo-link">
          <img src={logo} alt="logo" />
        </Link>
        <nav className="nav-links">
          <Link to="/" data-testid="nav-home" className="inicio-nav-btn no-focus-outline">Início</Link>
          <a 
            href={SITE.instagram} 
            target="_blank" 
            rel="noopener noreferrer"
            data-testid="nav-instagram"
            className="instagram-nav-btn no-focus-outline"
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
