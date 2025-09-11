import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { client, urlFor } from "../lib/sanity";
import "../css/maestriaDetalle.css";

// Componente de carga optimizado
const LoadingSpinner = React.memo(() => (
  <div className="loading-container" aria-live="polite" aria-busy="true">
    <div className="loading-spinner" aria-hidden="true"></div>
    <p className="loading">Cargando detalles de la maestría...</p>
  </div>
));

// Componente de error
const ErrorMessage = React.memo(({ error, onRetry }) => (
  <div className="error-container" role="alert" aria-live="assertive">
    <h2>Error al cargar los detalles</h2>
    <p>{error}</p>
    <button
      onClick={onRetry}
      className="reload-button"
      aria-label="Reintentar carga de detalles"
    >
      Reintentar
    </button>
  </div>
));

// Sanitización de entrada para prevenir XSS
const sanitizeInput = (text) => {
  if (typeof text !== 'string') return '';
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

// Validación de datos de la maestría
const validateMaestriaData = (data) => {
  if (!data) return null;

  return {
    nombre_maestria: sanitizeInput(data.nombre_maestria) || "Nombre no disponible",
    imagen: data.imagen,
    objetivo_itc: sanitizeInput(data.objetivo_itc) || "Objetivo no disponible",
    requisitos: Array.isArray(data.requisitos)
      ? data.requisitos.map(req => sanitizeInput(req))
      : [],
    mapa_curricular: Array.isArray(data.mapa_curricular)
      ? data.mapa_curricular.map(semestre => ({
        titulo_semestre: sanitizeInput(semestre.titulo_semestre) || "Semestre",
        materias: Array.isArray(semestre.materias)
          ? semestre.materias.map(materia => sanitizeInput(materia))
          : []
      }))
      : [],
    detalles_maestria: {
      duracion: sanitizeInput(data.detalles_maestria?.duracion) || "No especificado",
      horario: sanitizeInput(data.detalles_maestria?.horario) || "No especificado",
      modalidad_asignaturas: sanitizeInput(data.detalles_maestria?.modalidad_asignaturas) || "No especificado",
      plataforma_tecnologica: sanitizeInput(data.detalles_maestria?.plataforma_tecnologica) || "No especificado",
      titulacion: sanitizeInput(data.detalles_maestria?.titulacion) || "No especificado"
    }
  };
};

const MaestriaDetalle = () => {
  const { nombre } = useParams();
  const navigate = useNavigate();
  const [maestria, setMaestria] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  // Función para obtener datos de la maestría
  const fetchMaestria = useCallback(async () => {
    // Cancelar petición anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);

      const decodedNombre = decodeURIComponent(nombre || '');
      if (!decodedNombre.trim()) {
        throw new Error("Nombre de maestría no válido");
      }

      const data = await client.fetch(
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
        { nombre: decodedNombre },
        { signal: abortControllerRef.current.signal }
      );

      if (!data) {
        throw new Error("No se encontró la maestría solicitada");
      }

      const validatedData = validateMaestriaData(data);
      setMaestria(validatedData);
    } catch (err) {
      // Ignorar errores de aborto
      if (err.name === 'AbortError') return;

      console.error("Error fetching maestría details:", err);
      setError(err.message || "No se pudieron cargar los detalles de la maestría");
    } finally {
      setLoading(false);
    }
  }, [nombre]);

  useEffect(() => {
    fetchMaestria();

    return () => {
      // Cancelar petición al desmontar el componente
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchMaestria]);


  // Función para manejar errores de imagen
  const handleImageError = useCallback((e) => {
    e.target.style.display = 'none';
    const placeholder = document.createElement('div');
    placeholder.className = 'image-placeholder';
    placeholder.setAttribute('aria-hidden', 'true');
    placeholder.innerHTML = '<span>Imagen no disponible</span>';
    e.target.parentNode.appendChild(placeholder);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={fetchMaestria} />;
  }

  if (!maestria) {
    return (
      <div className="no-data-container" aria-live="polite">
        <h2>Maestría no encontrada</h2>
        <p>No se encontraron detalles para la maestría solicitada.</p>
        <button
          onClick={() => navigate(-1)}
          className="back-button"
          aria-label="Volver a la página anterior"
        >
          Volver atrás
        </button>
      </div>
    );
  }

  return (
    <div className="maestria-detalle-grid">
      {/* HERO SECTION con detalles incluidos */}
      <section className="grid-hero" aria-labelledby="hero-heading">
        <div className="hero-content">
          <div className="hero-columna-izquierda">
            <div className="hero-texto">
              <h1 id="hero-heading">{maestria.nombre_maestria}</h1>
              <p className="objetivo-text">{maestria.objetivo_itc}</p>
            </div>

            {/* DETALLES dentro del hero */}
            <div className="detalles-hero">
              <h2>
                <span aria-hidden="true">🔎</span>
                Detalles del Programa
              </h2>
              <div className="detalles-lista">
                <div className="detalle-item">
                  <span className="detalle-icono" aria-hidden="true">⏱</span>
                  <div className="detalle-contenido">
                    <h3>Duración</h3>
                    <p>{maestria.detalles_maestria.duracion}</p>
                  </div>
                </div>
                <div className="detalle-item">
                  <span className="detalle-icono" aria-hidden="true">🕒</span>
                  <div className="detalle-contenido">
                    <h3>Horario</h3>
                    <p>{maestria.detalles_maestria.horario}</p>
                  </div>
                </div>
                <div className="detalle-item">
                  <span className="detalle-icono" aria-hidden="true">💻</span>
                  <div className="detalle-contenido">
                    <h3>Modalidad</h3>
                    <p>{maestria.detalles_maestria.modalidad_asignaturas}</p>
                  </div>
                </div>
                <div className="detalle-item">
                  <span className="detalle-icono" aria-hidden="true">🌐</span>
                  <div className="detalle-contenido">
                    <h3>Plataforma</h3>
                    <p>{maestria.detalles_maestria.plataforma_tecnologica}</p>
                  </div>
                </div>
                <div className="detalle-item">
                  <span className="detalle-icono" aria-hidden="true">🎓</span>
                  <div className="detalle-contenido">
                    <h3>Titulación</h3>
                    <p>{maestria.detalles_maestria.titulacion}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {maestria.imagen && (
            <div className="hero-imagen">
              <img
                src={urlFor(maestria.imagen).url()}
                alt={`Imagen representativa de ${maestria.nombre_maestria}`}
                loading="lazy"
                decoding="async"
                onError={handleImageError}
              />
            </div>
          )}
        </div>
      </section>

      {/* REQUISITOS EXTENDIDOS */}
      <section className="requisitos-extendidos" aria-labelledby="requisitos-heading">
        <div className="requisitos-contenedor">
          <h2 id="requisitos-heading">
            <span aria-hidden="true">📋</span>
            Requisitos de Admisión
          </h2>
          <div className="requisitos-lista">
            {maestria.requisitos.length > 0 ? (
              maestria.requisitos.map((req, i) => (
                <div key={i} className="requisito-item">
                  <div className="requisito-marcador" aria-hidden="true"></div>
                  <p>{req}</p>
                </div>
              ))
            ) : (
              <p className="no-requisitos">No se especificaron requisitos de admisión</p>
            )}
          </div>
        </div>
      </section>

      {/* MAPA CURRICULAR SECTION */}
      <section className="grid-mapa" aria-labelledby="mapa-heading">
        <h2 id="mapa-heading">
          <span aria-hidden="true">📚</span>
          Mapa Curricular
        </h2>
        <div className="semestres-grid">
          {maestria.mapa_curricular.length > 0 ? (
            maestria.mapa_curricular.map((semestre, i) => (
              <div key={i} className="semestre-card">
                <h3>{semestre.titulo_semestre}</h3>
                {semestre.materias.length > 0 ? (
                  <ul>
                    {semestre.materias.map((materia, j) => (
                      <li key={j}>{materia}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-materias">No hay materias asignadas para este semestre</p>
                )}
              </div>
            ))
          ) : (
            <p className="no-mapa">No se ha definido el mapa curricular para esta maestría</p>
          )}
        </div>
      </section>

    </div>
  );
};

export default React.memo(MaestriaDetalle);