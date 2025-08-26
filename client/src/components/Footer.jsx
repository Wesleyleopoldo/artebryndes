import { SITE } from "../data/siteConfig";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" data-testid="footer">
      <div className="footer-content">
        <div className="footer-links">
          <a 
            href={SITE.instagram} 
            target="_blank" 
            rel="noopener noreferrer"
            data-testid="footer-instagram"
          >
            Instagram
          </a>
          <a 
            href={`https://wa.me/${SITE.contactWhatsapp}`} 
            target="_blank" 
            rel="noopener noreferrer"
            data-testid="footer-whatsapp"
          >
            WhatsApp
          </a>
        </div>
        <p data-testid="footer-copyright">
          &copy; {currentYear} {SITE.name}. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
