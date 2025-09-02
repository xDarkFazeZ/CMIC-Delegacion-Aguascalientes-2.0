import React from "react";
import "../css/footer.css";
import { FaFacebookF, FaInstagram } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="footer">
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
            <li>
              <button className="footer-enlace" onClick={() => navigate("/")}>
                Inicio
              </button>
            </li>
            <li>
              <button className="footer-enlace" onClick={() => navigate("/nosotros")}>
                Nosotros
              </button>
            </li>
            <li>
              <button className="footer-enlace" onClick={() => navigate("/servicios")}>
                Servicios
              </button>
            </li>
            <li>
              <button className="footer-enlace" onClick={() => navigate("/noticias")}>
                Noticias
              </button>
            </li>
            <li>
              <button className="footer-enlace" onClick={() => navigate("/afiliados")}>
                Afiliados
              </button>
            </li>
            <li>
              <button className="footer-enlace" onClick={() => navigate("/contacto")}>
                Contacto
              </button>
            </li>
          </ul>
        </div>

        {/* Contacto */}
        <div className="footer-seccion">
          <h3 className="footer-titulo">Contacto</h3>
          <div className="footer-contacto">
            <a
              className="footer-enlace"
              href="https://www.google.com/maps/place/Cmic+ags/@21.8818961,-102.2694192,17z/data=!3m1!4b1!4m6!3m5!1s0x8429ee0f8f798e1d:0xabd27585855b1c7f!8m2!3d21.8818961!4d-102.2668443!16s%2Fg%2F11b6d50fsl?entry=ttu"
              target="_blank"
              rel="noopener noreferrer"
            >
              Dirección: Av Tecnológico 110, Ojocaliente, 20190 Aguascalientes, Ags.
            </a>
            <p>Teléfono: (449) 145 4288 al 93</p>
            <p>Email: contacto@cmicags.org.mx</p>
          </div>
        </div>

        {/* Redes + Logo ICIC */}
        <div className="footer-seccion">
          <h3 className="footer-titulo">Síguenos</h3>
          <div className="footer-social-container">
            <div className="footer-redes">
              <a
                href="https://www.facebook.com/cmicaguascalientes"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://www.instagram.com/cmicags/"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </a>
            </div>

            {/* Logo ICIC al lado de Instagram en desktop, debajo en móvil */}
            <div className="footer-icic">
              <img
                src="/img/icic-logo.png"
                alt="ICIC Logo"
                onClick={() => navigate("/icic")}
                className="icic-logo"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="footer-derechos">
        <p>&copy; 2023 CMIC Delegación Aguascalientes. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;