import React, { useEffect, useRef } from "react";
import "../css/nosotros.css";
import ejemploImg from "../lib/imagen2.png";

const Nosotros = () => {
  const nosotrosRef = useRef(null);
  const mvRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Animación de entrada para Nosotros
          if (entry.target === nosotrosRef.current && entry.isIntersecting) {
            entry.target.classList.add("fade-in-slide");
          }

          // Animación de entrada y salida para Misión/Visión/Objetivos
          if (entry.target === mvRef.current) {
            if (entry.isIntersecting) {
              entry.target.classList.add("fade-in-slide");
            } else {
              entry.target.classList.remove("fade-in-slide");
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    if (nosotrosRef.current) observer.observe(nosotrosRef.current);
    if (mvRef.current) observer.observe(mvRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <main className="nosotros-container">
      <section className="nosotros-section">
        {/* Panel 1: Nosotros + Nuestro Trabajo */}
        <div ref={nosotrosRef} className="panel panel-nosotros">
          <div className="nosotros-grid">
            <div className="nosotros-texto">
              <h1>Nosotros</h1>
              <p>
                La <span className="resaltado">Cámara Mexicana de la Industria de la Construcción (CMIC)</span>
                es un organismo empresarial de interés público, autónomo y con representación en todo el país.
                En la Delegación Aguascalientes representamos a las empresas constructoras locales,
                defendiendo sus intereses y fomentando el desarrollo sostenible de la industria.
              </p>
            </div>

            <div className="nosotros-imagen">
              <img src={ejemploImg} alt="Nosotros" />
            </div>
          </div>

          <div className="nuestro-trabajo">
            <h2>Nuestro Trabajo</h2>
            <ul className="nosotros-lista">
              <li><strong>Capacitación y certificación:</strong> a través del ICIC.</li>
              <li><strong>Vinculación empresarial:</strong> generamos oportunidades de negocio.</li>
              <li><strong>Asesoría técnica, legal y administrativa:</strong> respaldo integral.</li>
              <li><strong>Gestión y representación:</strong> ante autoridades y organismos.</li>
            </ul>

            <p className="mensaje-final">
              Creemos en una <span className="resaltado">construcción responsable, innovadora</span>
              y comprometida con el desarrollo económico, social y ambiental de nuestro estado.
            </p>
          </div>
        </div>

        {/* Panel 2: Misión, Visión y Objetivos */}
        <div ref={mvRef} className="panel panel-mv">
          <h2 className="panel-title">Nuestros Principios</h2>
          <div className="valores-container">
            <div className="valor-card">
              <h3>Misión</h3>
              <p>Agrupar y organizar a los empresarios de la construcción, representando sus intereses, fomentando su productividad, apoyando su crecimiento y contribuyendo con responsabilidad al desarrollo y competitividad del país</p>
            </div>

            <div className="valor-card valor-card-vision">
              <h3>Visión</h3>
              <div className="vision-section">
                <p className="vision-parrafo">
                  <strong>Hacia el exterior:</strong> Desarrollar oportunidades y fomentar la inversión, proponiendo cambios regulatorios; proporcionar conocimiento del mercado con servicios especializados; definir la estructura del sector; facilitar la integración de cadenas productivas de financiamiento.
                </p>
                <p className="vision-parrafo">
                  <strong>Hacia el interior:</strong> Redimensionar la estructura administrativa, con mejora de servicios; institucionalizar con buena imagen y comunicación; y reforzar la presencia del sector ante clientes y oportunidades.
                </p>
              </div>
            </div>


            <div className="valor-card">
              <h3>Objetivos</h3>
              <ul>
                <li>Fortalecer la competitividad</li>
                <li>Promover capacitación</li>
                <li>Impulsar innovación</li>
                <li>Representar intereses del sector</li>
                <li>Fomentar ética empresarial</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Nosotros;
