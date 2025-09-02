import React from "react";
import { Link } from "react-router-dom"; // 👈 Importa Link
import "../App.css";
import "../css/hero.css";

const Hero = () => {
  return (
    <section 
      className="hero" 
      style={{ backgroundImage: `url('/img/fondo.jpg')` }}
    >
      <div className="hero-contenido">
        <h1 className="hero-titulo">
          Cámara Mexicana de la Industria de la Construcción
        </h1>
        <h2 className="hero-subtitulo">
          Delegación Aguascalientes - Representando al sector constructor desde 1995
        </h2>
        <Link to="/contacto" className="boton">
          Contáctanos
        </Link>
      </div>
    </section>
  );
};

export default Hero;