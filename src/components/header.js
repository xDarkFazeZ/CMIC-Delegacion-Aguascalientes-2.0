import React, { useState, useEffect } from "react";
import "../css/header.css";
import "../App.css";
const logo = "/img/imagen2.png";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 840);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Cerrar el menú al hacer clic en un enlace
  const handleLinkClick = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  };

  // Detectar cambios en el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 840;
      setIsMobile(mobile);
      
      // Si cambiamos a desktop, cerramos el menú
      if (!mobile && isOpen) {
        setIsOpen(false);
      }
    };

    // Detectar scroll para cambiar estilo del header
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isOpen]);

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''} ${isOpen && isMobile ? 'menu-open' : ''}`}>
      {/* Logo - Se oculta cuando el menú está abierto en móvil */}
      <div className={`logo-container ${isOpen ? 'hidden' : ''}`}>
        <img src={logo} alt="Logo" className="logo" />
      </div>

      {/* Botón hamburguesa con animación */}
      <div 
        className={`hamburger ${isOpen ? "active" : ""}`} 
        onClick={toggleMenu}
        aria-label="Menú de navegación"
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>

      {/* Menú de navegación */}
      <nav className={`nav-menu ${isOpen ? "active" : ""}`}>
        {/* Logo en el menú móvil */}
        <div className="mobile-logo">
          <img src={logo} alt="Logo" />
        </div>
        
        <ul>
          <li><a href="#inicio" onClick={handleLinkClick}>Inicio</a></li>
          <li><a href="#servicios" onClick={handleLinkClick}>Servicios</a></li>
          <li><a href="#nosotros" onClick={handleLinkClick}>Nosotros</a></li>
          <li><a href="#contacto" onClick={handleLinkClick}>Contacto</a></li>
        </ul>
      </nav>

      {/* Overlay para cerrar el menú al hacer clic fuera */}
      {isOpen && isMobile && (
        <div className="menu-overlay" onClick={toggleMenu}></div>
      )}
    </header>
  );
}