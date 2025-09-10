import React, { useEffect, useState, useCallback } from "react";
import { client, urlFor } from "../lib/sanity";
import "../css/itc.css";
import itcLogo from "../lib/itc-logo.jpg";
import { Link, useNavigate } from "react-router-dom";

// Error Boundary para manejo de errores
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error en ServiciosITC:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container" role="alert" aria-live="polite">
          <h2>Algo salió mal</h2>
          <p>No se pudieron cargar las maestrías. Por favor, intenta recargar la página.</p>
          <button onClick={() => window.location.reload()} className="reload-button">
            Recargar página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const ServiciosITC = () => {
  const [maestrias, setMaestrias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Función para sanitizar y validar datos
  const sanitizeData = useCallback((data) => {
    return data.map(maestria => ({
      ...maestria,
      nombre_maestria: maestria.nombre_maestria || "Nombre no disponible",
      requisitos: Array.isArray(maestria.requisitos) ? maestria.requisitos : [],
      detalles_maestria: maestria.detalles_maestria || {
        duracion: "No especificado",
        horario: "No especificado",
        modalidad_asignaturas: "No especificado",
        plataforma_tecnologica: "No especificado",
        titulacion: "No especificado"
      }
    }));
  }, []);

  // Función para obtener maestrías
  const fetchMaestrias = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const query = `*[_type == "maestrias"]{
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
      }`;
      
      const data = await client.fetch(query);
      
      if (!data || !Array.isArray(data)) {
        throw new Error("Datos recibidos no válidos");
      }
      
      const sanitizedData = sanitizeData(data);
      setMaestrias(sanitizedData);
    } catch (err) {
      console.error("Error fetching maestrías:", err);
      setError("No se pudieron cargar las maestrías. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }, [sanitizeData]);

  useEffect(() => {
    fetchMaestrias();
  }, [fetchMaestrias]);

  // Función para navegar a detalles de maestría
  const handleMaestriaClick = useCallback((nombreMaestria) => {
    const encodedName = encodeURIComponent(nombreMaestria);
    navigate(`/maestria/${encodedName}`);
  }, [navigate]);

  // Función para manejar key press en tarjetas
  const handleKeyPress = useCallback((event, nombreMaestria) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleMaestriaClick(nombreMaestria);
    }
  }, [handleMaestriaClick]);

  if (loading) {
    return (
      <div className="loading-container" aria-live="polite">
        <div className="loading-spinner"></div>
        <p className="loading">Cargando maestrías...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container" role="alert" aria-live="polite">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={fetchMaestrias} className="reload-button">
          Reintentar
        </button>
      </div>
    );
  }

  if (!maestrias.length) {
    return (
      <div className="no-data-container" aria-live="polite">
        <h2>No hay maestrías disponibles</h2>
        <p>No se encontraron maestrías en este momento.</p>
      </div>
    );
  }

  return (
    <div className="servicios-page">
      <header className="servicios-header">
        <h1>Maestrías ITC</h1>
        <p>El Tecnológico de la Construcción es la única Institución especializada en construcción en América Latina y es por ello que contamos con catedráticos profesionales.</p>
        <div className="imagen-container">
          <img 
            src={itcLogo} 
            alt="Logo del Instituto Tecnológico de la Construcción" 
            className="itc-logo"
            loading="lazy"
            decoding="async"
          />
        </div>
      </header>

      <section className="servicios-container" aria-label="Lista de maestrías disponibles">
        {maestrias.map((maestria, index) => (
          <article 
            key={maestria._id || index} 
            className="flip-card"
            aria-label={`Maestría en ${maestria.nombre_maestria}`}
            tabIndex={0}
            onKeyPress={(e) => handleKeyPress(e, maestria.nombre_maestria)}
          >
            <div className="flip-card-inner">
              {/* Frente */}
              <div className="flip-card-front">
                {maestria.imagen ? (
                  <img
                    src={urlFor(maestria.imagen).url()}
                    alt={`Imagen de la maestría ${maestria.nombre_maestria}`}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="image-placeholder" aria-hidden="true">
                    <span>Imagen no disponible</span>
                  </div>
                )}
                <h2>{maestria.nombre_maestria}</h2>
              </div>

              {/* Reverso */}
              <div className="flip-card-back">
                <div className="contenido-scroll">
                  {/* Requisitos */}
                  <section aria-labelledby={`requisitos-${index}`}>
                    <h3 id={`requisitos-${index}`}>Requisitos</h3>
                    {maestria.requisitos.length > 0 ? (
                      <ul>
                        {maestria.requisitos.map((req, i) => (
                          <li key={i}>{req}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>No se especificaron requisitos</p>
                    )}
                  </section>

                  {/* Detalles */}
                  <section aria-labelledby={`detalles-${index}`}>
                    <h3 id={`detalles-${index}`}>Detalles</h3>
                    <p><strong>Duración:</strong> {maestria.detalles_maestria.duracion}</p>
                    <p><strong>Horario:</strong> {maestria.detalles_maestria.horario}</p>
                    <p><strong>Modalidad:</strong> {maestria.detalles_maestria.modalidad_asignaturas}</p>
                    <p><strong>Plataforma:</strong> {maestria.detalles_maestria.plataforma_tecnologica}</p>
                    <p><strong>Titulación:</strong> {maestria.detalles_maestria.titulacion}</p>
                  </section>
                </div>

                {/* Botón Más Detalles */}
                <div className="boton-detalles">
                  <Link 
                    to={`/maestria/${encodeURIComponent(maestria.nombre_maestria)}`}
                    aria-label={`Ver más detalles sobre ${maestria.nombre_maestria}`}
                  >
                    <button>Más detalles</button>
                  </Link>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

// Componente wrapper con Error Boundary
export default function ServiciosITCWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <ServiciosITC />
    </ErrorBoundary>
  );
}