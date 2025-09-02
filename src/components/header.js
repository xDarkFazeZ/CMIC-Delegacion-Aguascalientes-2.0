import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // 🔹 Importamos Link
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

  const handleLinkClick = () => {
    if (isOpen) setIsOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 840;
      setIsMobile(mobile);
      if (!mobile && isOpen) setIsOpen(false);
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen]);

  return (
    <header
      className={`header ${isScrolled ? "scrolled" : ""} ${
        isOpen && isMobile ? "menu-open" : ""
      }`}
    >
      {/* Logo */}
      <div className={`logo-container ${isOpen ? "hidden" : ""}`}>
        <Link to="/" onClick={handleLinkClick}>
          <img src={logo} alt="Logo" className="logo" />
        </Link>
      </div>

      {/* Botón hamburguesa */}
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
        <div className="mobile-logo">
          <Link to="/home" onClick={handleLinkClick}>
            <img src={logo} alt="Logo" />
          </Link>
        </div>

        <ul>
          <li>
            <Link to="/" onClick={handleLinkClick}>
              Inicio
            </Link>
          </li>
          <li>
            <Link to="/serviciosPage" onClick={handleLinkClick}>
              Servicios
            </Link>
          </li>
          <li>
            <Link to="/nosotros" onClick={handleLinkClick}>
              Nosotros
            </Link>
          </li>
          <li>
            <Link to="/contacto" onClick={handleLinkClick}>
              Contacto
            </Link>
          </li>
        </ul>
      </nav>

      {/* Overlay */}
      {isOpen && isMobile && (
        <div className="menu-overlay" onClick={toggleMenu}></div>
      )}
    </header>
  );
}
