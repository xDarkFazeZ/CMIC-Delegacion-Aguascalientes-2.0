import React from "react";
import "../css/contacto.css";

const Contacto = () => {
  return (
    <section id="contacto" className="contacto">
      <div className="contenedor">
        <h2 className="seccion-titulo">Contacto</h2>
        <form className="formulario-contacto">
          <div className="form-grupo">
            <label htmlFor="nombre" className="form-label">Nombre completo</label>
            <input type="text" id="nombre" className="form-input" required />
          </div>
          <div className="form-grupo">
            <label htmlFor="email" className="form-label">Correo electrónico</label>
            <input type="email" id="email" className="form-input" required />
          </div>
          <div className="form-grupo">
            <label htmlFor="telefono" className="form-label">Teléfono</label>
            <input type="tel" id="telefono" className="form-input" />
          </div>
          <div className="form-grupo">
            <label htmlFor="mensaje" className="form-label">Mensaje</label>
            <textarea id="mensaje" className="form-textarea" required></textarea>
          </div>
          <button type="submit" className="boton" style={{ width: "100%" }}>
            Enviar mensaje
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contacto;
