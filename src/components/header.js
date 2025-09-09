import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/header.css";
import "../App.css";

// Importar la imagen directamente
import logoImage from "../lib/imagen2.png";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLinkClick = () => {
    if (isOpen) setIsOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className={`header ${isScrolled ? "scrolled" : ""} ${isOpen ? "menu-open" : ""}`}>
      {/* Logo */}
      <div className={`logo-container ${isOpen ? "hidden" : ""}`}>
        <Link to="/" onClick={handleLinkClick}>
          <img src={logoImage} alt="Logo" className="logo" />
        </Link>
      </div>

      {/* Botón hamburguesa accesible */}
      <button
        className={`hamburger ${isOpen ? "active" : ""}`}
        onClick={toggleMenu}
        aria-label="Abrir menú de navegación"
        aria-expanded={isOpen}
        aria-controls="nav-menu"
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>

      {/* Menú de navegación */}
      <nav
        id="nav-menu"
        className={`nav-menu ${isOpen ? "active" : ""}`}
        role="navigation"
        aria-hidden={isOpen ? "false" : undefined} 
      >
        <div className="mobile-logo">
          <Link to="/" onClick={handleLinkClick}>
            <img src={logoImage} alt="Logo" />
          </Link>
        </div>

        <ul>
          <li>
            <Link to="/" onClick={handleLinkClick}>Inicio</Link>
          </li>
          <li>
            <Link to="/serviciosPage" onClick={handleLinkClick}>Servicios</Link>
          </li>
          <li>
            <Link to="/nosotros" onClick={handleLinkClick}>Nosotros</Link>
          </li>
          <li>
            <Link to="/icic" onClick={handleLinkClick}>ICIC</Link>
          </li>
          <li>
            <Link to="/itc" onClick={handleLinkClick}>ITC</Link>
          </li>
        </ul>
      </nav>

      {/* Overlay */}
      {isOpen && <div className="menu-overlay" onClick={toggleMenu}></div>}
    </header>
  );
}
