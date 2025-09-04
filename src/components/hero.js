import React from "react";
import "../App.css";
import "../css/hero.css";

// Importamos la imagen directamente (mejor control que string path)
import fondoImage from "../lib/fondo.jpg";

const Hero = () => {
  return (
    <section
      className="hero"
      style={{ backgroundImage: `url(${fondoImage})` }}
      aria-label="Sección principal Cámara Mexicana de la Industria de la Construcción"
    >
      <div className="hero-contenido">
        <h1 className="hero-titulo">
          Cámara Mexicana de la Industria de la Construcción
        </h1>
        <h2 className="hero-subtitulo">
          Delegación Aguascalientes — Representando al sector constructor desde 1995
        </h2>
      </div>
    </section>
  );
};

export default Hero;
