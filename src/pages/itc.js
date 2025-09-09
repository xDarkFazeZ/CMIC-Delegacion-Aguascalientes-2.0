import React, { useEffect, useState } from "react";
import { client, urlFor } from "../lib/sanity";
import "../css/itc.css";
import itcLogo from "../lib/itc-logo.jpg";

const ServiciosITC = () => {
  const [maestrias, setMaestrias] = useState([]);

  useEffect(() => {
    client
      .fetch(`*[_type == "maestrias"]{
        nombre_maestria,
        imagen,
        requisitos,
        detalles_maestria{
          duracion,
          horario,
          modalidad_asignaturas,
          plataforma_tecnologica,
          titulacion
        }
      }`)
      .then((data) => setMaestrias(data))
      .catch(console.error);
  }, []);

  if (!maestrias.length) {
    return <p className="loading">Cargando maestrías...</p>;
  }

  return (
    <div className="servicios-page">
      <div className="servicios-header">
        <h1>Maestrías ITC</h1>
        <p>El Tecnológico de la Construcción es la única Institución especializada en construcción en América Latina y es por ello que contamos con catedráticos profesionales.</p>
        <div className="imagen-container">
          <img src={itcLogo} alt="Logo ITC" className="itc-logo" />
        </div>
      </div>

      <div className="servicios-container">
        {maestrias.map((maestria, index) => (
          <div key={index} className="flip-card">
            <div className="flip-card-inner">
              {/* Frente */}
              <div className="flip-card-front">
                {maestria.imagen && (
                  <img
                    src={urlFor(maestria.imagen).url()}
                    alt={maestria.nombre_maestria}
                  />
                )}
                <h2>{maestria.nombre_maestria}</h2>
              </div>

              {/* Reverso */}
              <div className="flip-card-back">
                <div className="contenido-scroll">
                  {/* Requisitos */}
                  <div className="columna">
                    <h3>Requisitos</h3>
                    {maestria.requisitos?.length > 0 ? (
                      <ul>
                        {maestria.requisitos.map((req, i) => (
                          <li key={i}>{req}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>No se especificaron requisitos</p>
                    )}
                  </div>

                  {/* Detalles */}
                  <div className="columna">
                    <h3>Detalles</h3>
                    {maestria.detalles_maestria ? (
                      <>
                        <p>
                          <strong>Duración:</strong>{" "}
                          {maestria.detalles_maestria.duracion}
                        </p>
                        <p>
                          <strong>Horario:</strong>{" "}
                          {maestria.detalles_maestria.horario}
                        </p>
                        <p>
                          <strong>Modalidad:</strong>{" "}
                          {maestria.detalles_maestria.modalidad_asignaturas}
                        </p>
                        <p>
                          <strong>Plataforma:</strong>{" "}
                          {maestria.detalles_maestria.plataforma_tecnologica}
                        </p>
                        <p>
                          <strong>Titulación:</strong>{" "}
                          {maestria.detalles_maestria.titulacion}
                        </p>
                      </>
                    ) : (
                      <p>No hay detalles disponibles</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiciosITC;
