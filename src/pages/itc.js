import React, { useEffect, useState, useCallback, useRef } from "react";
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
          <button 
            onClick={() => window.location.reload()} 
            className="reload-button"
            aria-label="Recargar página"
          >
            Recargar página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook personalizado para detección de mobile real
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isPhone = /android|iphone|ipod|windows phone/.test(userAgent);
      const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth <= 1024;

      setIsMobile(isPhone || (hasTouch && isSmallScreen));
    };

    checkIsMobile();

    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(checkIsMobile, 100);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return isMobile;
};

// Componente de carga optimizado
const LoadingSpinner = React.memo(() => (
  <div className="loading-container" aria-live="polite" aria-busy="true">
    <div className="loading-spinner" aria-hidden="true"></div>
    <p className="loading">Cargando maestrías...</p>
  </div>
));

// Componente de error optimizado
const ErrorMessage = React.memo(({ error, onRetry }) => (
  <div className="error-container" role="alert" aria-live="assertive">
    <h2>Error</h2>
    <p>{error}</p>
    <button 
      onClick={onRetry} 
      className="reload-button"
      aria-label="Reintentar carga de maestrías"
    >
      Reintentar
    </button>
  </div>
));

// Componente de placeholder para imágenes
const ImagePlaceholder = React.memo(({ altText }) => (
  <div className="image-placeholder" aria-hidden="true">
    <span>Imagen no disponible</span>
  </div>
));

// Función para sanitizar datos de entrada
const sanitizeInput = (text) => {
  if (typeof text !== 'string') return '';
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

const ServiciosITC = () => {
  const [maestrias, setMaestrias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCardId, setActiveCardId] = useState(null);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const abortControllerRef = useRef(null);

  // Función para sanitizar y validar datos
  const sanitizeData = useCallback((data) => {
    if (!Array.isArray(data)) return [];
    
    return data.map(maestria => ({
      _id: maestria._id || `temp-${Math.random().toString(36).substr(2, 9)}`,
      nombre_maestria: sanitizeInput(maestria.nombre_maestria) || "Nombre no disponible",
      imagen: maestria.imagen,
      requisitos: Array.isArray(maestria.requisitos) 
        ? maestria.requisitos.map(req => sanitizeInput(req))
        : [],
      detalles_maestria: {
        duracion: sanitizeInput(maestria.detalles_maestria?.duracion) || "No especificado",
        horario: sanitizeInput(maestria.detalles_maestria?.horario) || "No especificado",
        modalidad_asignaturas: sanitizeInput(maestria.detalles_maestria?.modalidad_asignaturas) || "No especificado",
        plataforma_tecnologica: sanitizeInput(maestria.detalles_maestria?.plataforma_tecnologica) || "No especificado",
        titulacion: sanitizeInput(maestria.detalles_maestria?.titulacion) || "No especificado"
      }
    }));
  }, []);

  // Función para obtener maestrías
  const fetchMaestrias = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    try {
      setLoading(true);
      setError(null);
      
      const query = `*[_type == "maestrias"]{
        _id,
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
      
      const data = await client.fetch(query, {}, {
        signal: abortControllerRef.current.signal
      });
      
      if (!data || !Array.isArray(data)) {
        throw new Error("Datos recibidos no válidos");
      }
      
      const sanitizedData = sanitizeData(data);
      setMaestrias(sanitizedData);
    } catch (err) {
      if (err.name === 'AbortError') return;
      
      console.error("Error fetching maestrías:", err);
      setError("No se pudieron cargar las maestrías. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }, [sanitizeData]);

  useEffect(() => {
    fetchMaestrias();
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchMaestrias]);

  // Función para voltear tarjeta (solo desktop)
  const toggleFlip = useCallback((id, event) => {
    if (!isMobile) {
      event.stopPropagation();
      setActiveCardId(prev => prev === id ? null : id);
    }
  }, [isMobile]);

  // Navegar en desktop
  const handleMaestriaClick = useCallback((nombreMaestria, event) => {
    if (!isMobile) {
      const encodedName = encodeURIComponent(nombreMaestria);
      navigate(`/maestria/${encodedName}`);
    }
  }, [navigate, isMobile]);

  // Manejar teclado
  const handleKeyPress = useCallback((event, nombreMaestria, id) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!isMobile) {
        setActiveCardId(prev => prev === id ? null : id);
      } else {
        const encodedName = encodeURIComponent(nombreMaestria);
        navigate(`/maestria/${encodedName}`);
      }
    }
  }, [navigate, isMobile]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={fetchMaestrias} />;
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
            width="200"
            height="200"
          />
        </div>
      </header>

      <section 
        className="servicios-container" 
        aria-label="Lista de maestrías disponibles"
      >
        {maestrias.map((maestria, index) => (
          <MaestriaCard
            key={maestria._id}
            maestria={maestria}
            index={index}
            isFlipped={activeCardId === maestria._id}
            isMobile={isMobile}
            onToggleFlip={toggleFlip}
            onKeyPress={handleKeyPress}
            onClick={handleMaestriaClick}
          />
        ))}
      </section>
    </div>
  );
};

// Componente de tarjeta memoizado
const MaestriaCard = React.memo(({ 
  maestria, 
  index, 
  isFlipped, 
  isMobile, 
  onToggleFlip, 
  onKeyPress, 
  onClick 
}) => {
  const handleImageError = useCallback((e) => {
    e.target.style.display = 'none';
    const placeholder = document.createElement('div');
    placeholder.className = 'image-placeholder';
    placeholder.setAttribute('aria-hidden', 'true');
    placeholder.innerHTML = '<span>Imagen no disponible</span>';
    e.target.parentNode.appendChild(placeholder);
  }, []);

  return (
    <article 
      className={`flip-card ${isFlipped ? 'flipped' : ''}`}
      aria-label={`Maestría en ${maestria.nombre_maestria}`}
      tabIndex={0}
      onClick={(e) => !isMobile && onToggleFlip(maestria._id, e)}
      onKeyDown={(e) => onKeyPress(e, maestria.nombre_maestria, maestria._id)}
    >
      <div className="flip-card-inner">
        {/* Frente */}
        <div className="flip-card-front">
          <div className="imagen-contenedor">
            {maestria.imagen ? (
              <img
                src={urlFor(maestria.imagen).url()}
                alt={`Imagen de la maestría ${maestria.nombre_maestria}`}
                loading="lazy"
                decoding="async"
                onError={handleImageError}
                width="300"
                height="200"
              />
            ) : (
              <ImagePlaceholder altText={`Imagen de ${maestria.nombre_maestria}`} />
            )}
          </div>
          <h2>{maestria.nombre_maestria}</h2>
          
          {isMobile ? (
            <div className="mobile-info-button">
              <Link 
                to={`/maestria/${encodeURIComponent(maestria.nombre_maestria)}`}
                aria-label={`Ver más información sobre ${maestria.nombre_maestria}`}
                onClick={(e) => e.stopPropagation()}
                preventScrollReset={true}
              >
                <button>Más información</button>
              </Link>
            </div>
          ) : (
            <div className="flip-indicator">
              <span aria-hidden="true">↻</span> Pasa el cursor para ver detalles
            </div>
          )}
        </div>

        {/* Reverso (solo visible en desktop) */}
        <div className="flip-card-back">
          <div className="contenido-scroll">
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

            <section aria-labelledby={`detalles-${index}`}>
              <h3 id={`detalles-${index}`}>Detalles</h3>
              <p><strong>Duración:</strong> {maestria.detalles_maestria.duracion}</p>
              <p><strong>Horario:</strong> {maestria.detalles_maestria.horario}</p>
              <p><strong>Modalidad:</strong> {maestria.detalles_maestria.modalidad_asignaturas}</p>
              <p><strong>Plataforma:</strong> {maestria.detalles_maestria.plataforma_tecnologica}</p>
              <p><strong>Titulación:</strong> {maestria.detalles_maestria.titulacion}</p>
            </section>
          </div>

          <div className="boton-detalles">
            <Link 
              to={`/maestria/${encodeURIComponent(maestria.nombre_maestria)}`}
              aria-label={`Ver más detalles sobre ${maestria.nombre_maestria}`}
              onClick={(e) => e.stopPropagation()}
              preventScrollReset={true}
            >
              <button>Más detalles <span aria-hidden="true">→</span></button>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
});

// Componente wrapper con Error Boundary
export default function ServiciosITCWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <ServiciosITC />
    </ErrorBoundary>
  );
}