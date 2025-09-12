import React, { useCallback } from "react";
import "../css/footer.css";
import { FaFacebookF, FaInstagram } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

// Importación segura de la imagen
import icicLogo from "../lib/icic-logo.png";

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  // Manejo de navegación con scroll al top
  const handleNavigation = useCallback((path) => {
    navigate(path);
    // Scroll al top después de navegar
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [navigate]);

  // Manejo de teclado para navegación
  const handleKeyPress = useCallback((event, path) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      navigate(path);
      // Scroll al top después de navegar
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    }
  }, [navigate]);

  return (
    <footer className="footer" role="contentinfo" aria-label="Pie de página">
      <div className="footer-contenido">
        <div className="footer-seccion">
          <h3 className="footer-titulo">CMIC Aguascalientes</h3>
          <p>
            La Cámara Mexicana de la Industria de la Construcción es el organismo
            cúpula que representa a las empresas constructoras del país.
          </p>
        </div>

        {/* Enlaces rápidos */}
        <div className="footer-seccion">
          <h3 className="footer-titulo">Enlaces rápidos</h3>
          <ul className="footer-enlaces">
            {[
              { path: "/", label: "Inicio" },
              { path: "/nosotros", label: "Nosotros" },
              { path: "/servicios", label: "Servicios" },
              { path: "/nosotros", label: "Nosotros" },
              { path: "/icic", label: "ICIC" },
              { path: "/itc", label: "ITC" }
            ].map((item) => (
              <li key={item.path}>
                <button 
                  className="footer-enlace" 
                  onClick={() => handleNavigation(item.path)}
                  onKeyDown={(e) => handleKeyPress(e, item.path)}
                  aria-label={`Ir a ${item.label}`}
                  tabIndex={0}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Contacto */}
        <div className="footer-seccion">
          <h3 className="footer-titulo">Contacto</h3>
          <address className="footer-contacto">
            <a
              className="footer-enlace contacto-link"
              href="https://www.google.com/maps/place/Cmic+ags/@21.8818961,-102.2694192,17z/data=!3m1!4b1!4m6!3m5!1s0x8429ee0f8f798e1d:0xabd27585855b1c7f!8m2!3d21.8818961!4d-102.2668443!16s%2Fg%2F11b6d50fsl?entry=ttu"
              target="_blank"
              rel="noopener noreferrer nofollow"
              aria-label="Ver ubicación en Google Maps"
            >
              Dirección: Av Tecnológico 110, Ojocaliente, 20190 Aguascalientes, Ags.
            </a>
            <p>
              <a href="tel:+524491454288" className="contacto-link" aria-label="Llamar al teléfono (449) 145 4288 al 93">
                Teléfono: (449) 145 4288 al 93
              </a>
            </p>
            <p>
              <a href="mailto:contacto@cmicags.org.mx" className="contacto-link" aria-label="Enviar correo a contacto@cmicags.org.mx">
                Email: contacto@cmicags.org.mx
              </a>
            </p>
          </address>
        </div>

        {/* Redes + Logo ICIC */}
        <div className="footer-seccion">
          <h3 className="footer-titulo">Síguenos</h3>
          <div className="footer-social-container">
            <div className="footer-redes">
              <a
                href="https://www.facebook.com/cmicaguascalientes"
                aria-label="Síguenos en Facebook (se abre en ventana nueva)"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="social-link facebook-link"
              >
                <FaFacebookF />
                <span className="sr-only">Facebook</span>
              </a>
              <a
                href="https://www.instagram.com/cmicags/"
                aria-label="Síguenos en Instagram (se abre en ventana nueva)"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="social-link instagram-link"
              >
                <FaInstagram />
                <span className="sr-only">Instagram</span>
              </a>
            </div>

            {/* Logo ICIC */}
            <div className="footer-icic">
              <button 
                onClick={() => handleNavigation("/icic")}
                onKeyDown={(e) => handleKeyPress(e, "/icic")}
                aria-label="Ir a la sección ICIC"
                tabIndex={0}
                className="icic-button"
              >
                <img
                  src={icicLogo}
                  alt="Logo del Instituto de la Construcción de Aguascalientes"
                  width="120"
                  height="40"
                  loading="lazy"
                  className="icic-logo"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-derechos">
        <p>&copy; {currentYear} CMIC Delegación Aguascalientes. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default React.memo(Footer);