import React from "react";
import "../App.css";
import "../css/hero.css";

const Hero = () => {
  return (
    <section 
      className="hero" 
      style={{ backgroundImage: `url('/img/fondo.jpg')` }} // 👈 fondo dinámico
    >
      <div className="hero-contenido">
        <h1 className="hero-titulo">
          Cámara Mexicana de la Industria de la Construcción
        </h1>
        <h2 className="hero-subtitulo">
          Delegación Aguascalientes - Representando al sector constructor desde 1995
        </h2>
        <a href="#contacto" className="boton">
          Contáctanos
        </a>
      </div>
    </section>
  );
};

export default Hero;
