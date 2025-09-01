import React from "react";
import "../css/footer.css";
import { FaFacebookF, FaInstagram } from 'react-icons/fa6';
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-contenido">
        <div className="footer-seccion">
          <h3 className="footer-titulo">CMIC Aguascalientes</h3>
          <p>
            La Cámara Mexicana de la Industria de la Construcción es el organismo cúpula que representa a las empresas constructoras del país.
          </p>
        </div>
        <div className="footer-seccion">
          <h3 className="footer-titulo">Enlaces rápidos</h3>
          <ul className="footer-enlaces">
            <li><a href="#nosotros" className="footer-enlace">Nosotros</a></li>
            <li><a href="#servicios" className="footer-enlace">Servicios</a></li>
            <li><a href="#noticias" className="footer-enlace">Noticias</a></li>
            <li><a href="#" className="footer-enlace">Eventos</a></li>
            <li><a href="#" className="footer-enlace">Afiliados</a></li>
          </ul>
        </div>
        <div className="footer-seccion">
          <h3 className="footer-titulo">Contacto</h3>
          <div className="footer-contacto">
            <a className="footer-enlace" href="https://goo.gl/maps/xyz">Dirección: Av Tecnológico 110, Ojocaliente, 20190 Aguascalientes, Ags.</a>
            <p>Teléfono: (449) 145 4288 al 93</p>
            <p>Email: contacto@cmicags.org.mx</p>
          </div>
        </div>
        <div className="footer-seccion">
          <h3 className="footer-titulo">Síguenos</h3>
          <div className="footer-redes">
            <a href="https://www.facebook.com/cmicaguascalientes" aria-label="Facebook"><FaFacebookF /></a>
            <a href="https://www.instagram.com/cmicags/" aria-label="Instagram"><FaInstagram /></a>
          </div>
        </div>
      </div>
      <div className="footer-derechos">
        <p className="footer--derechos">&copy; 2023 CMIC Delegación Aguascalientes. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
