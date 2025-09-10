import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { client, urlFor } from "../lib/sanity";
import "../css/maestriaDetalle.css";

const MaestriaDetalle = () => {
  const { nombre } = useParams();
  const [maestria, setMaestria] = useState(null);

  useEffect(() => {
    client
      .fetch(
        `*[_type == "maestrias" && nombre_maestria == $nombre][0]{
          nombre_maestria,
          imagen,
          objetivo_itc,
          requisitos,
          mapa_curricular[]{
            titulo_semestre,
            materias
          },
          detalles_maestria{
            duracion,
            horario,
            modalidad_asignaturas,
            plataforma_tecnologica,
            titulacion
          }
        }`,
        { nombre }
      )
      .then((data) => setMaestria(data))
      .catch(console.error);
  }, [nombre]);

  if (!maestria) {
    return <p className="loading">Cargando detalles...</p>;
  }

  return (
    <div className="maestria-detalle-grid">
      {/* HERO SECTION con detalles incluidos */}
      <section className="grid-hero">
        <div className="hero-content">
          <div className="hero-columna-izquierda">
            <div className="hero-texto">
              <h1>{maestria.nombre_maestria}</h1>
              <p className="objetivo-text">{maestria.objetivo_itc}</p>
            </div>
            
            {/* DETALLES dentro del hero */}
            <div className="detalles-hero">
              <h2>🔎 Detalles del Programa</h2>
              <div className="detalles-lista">
                <div className="detalle-item">
                  <span className="detalle-icono">⏱</span>
                  <div className="detalle-contenido">
                    <h3>Duración</h3>
                    <p>{maestria.detalles_maestria?.duracion}</p>
                  </div>
                </div>
                <div className="detalle-item">
                  <span className="detalle-icono">🕒</span>
                  <div className="detalle-contenido">
                    <h3>Horario</h3>
                    <p>{maestria.detalles_maestria?.horario}</p>
                  </div>
                </div>
                <div className="detalle-item">
                  <span className="detalle-icono">💻</span>
                  <div className="detalle-contenido">
                    <h3>Modalidad</h3>
                    <p>{maestria.detalles_maestria?.modalidad_asignaturas}</p>
                  </div>
                </div>
                <div className="detalle-item">
                  <span className="detalle-icono">🌐</span>
                  <div className="detalle-contenido">
                    <h3>Plataforma</h3>
                    <p>{maestria.detalles_maestria?.plataforma_tecnologica}</p>
                  </div>
                </div>
                <div className="detalle-item">
                  <span className="detalle-icono">🎓</span>
                  <div className="detalle-contenido">
                    <h3>Titulación</h3>
                    <p>{maestria.detalles_maestria?.titulacion}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {maestria.imagen && (
            <div className="hero-imagen">
              <img
                src={urlFor(maestria.imagen).url()}
                alt={maestria.nombre_maestria}
              />
            </div>
          )}
        </div>
      </section>

      {/* REQUISITOS EXTENDIDOS */}
      <section className="requisitos-extendidos">
        <div className="requisitos-contenedor">
          <h2>📋 Requisitos de Admisión</h2>
          <div className="requisitos-lista">
            {maestria.requisitos?.map((req, i) => (
              <div key={i} className="requisito-item">
                <div className="requisito-marcador"></div>
                <p>{req}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAPA CURRICULAR SECTION */}
      <section className="grid-mapa">
        <h2>📚 Mapa Curricular</h2>
        <div className="semestres-grid">
          {maestria.mapa_curricular?.map((semestre, i) => (
            <div key={i} className="semestre-card">
              <h3>{semestre.titulo_semestre}</h3>
              <ul>
                {semestre.materias.map((materia, j) => (
                  <li key={j}>{materia}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="grid-cta">
        <h2>¿Interesado en esta maestría?</h2>
        <p>Solicita más información y comienza tu proceso de admisión</p>
        <button>Solicitar Información</button>
      </section>
    </div>
  );
};

export default MaestriaDetalle;