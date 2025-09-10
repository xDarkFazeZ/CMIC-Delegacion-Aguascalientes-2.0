import React, { useEffect, useRef, useCallback, useState } from "react";
import "../css/nosotros.css";
import ejemploImg from "../lib/imagen2.png";

const Nosotros = () => {
  const nosotrosRef = useRef(null);
  const mvRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Función de observación memoizada
  const handleIntersection = useCallback((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      // Animación de entrada para Nosotros
      if (entry.target === nosotrosRef.current) {
        entry.target.classList.add("fade-in-slide");
      }

      // Animación de entrada para Misión/Visión/Objetivos
      if (entry.target === mvRef.current) {
        entry.target.classList.add("fade-in-slide");
      }
    });
  }, []);

  useEffect(() => {
    // Verificar soporte para Intersection Observer
    if (!('IntersectionObserver' in window)) {
      // Fallback para navegadores que no soportan Intersection Observer
      if (nosotrosRef.current) {
        nosotrosRef.current.classList.add("fade-in-slide");
      }
      if (mvRef.current) {
        mvRef.current.classList.add("fade-in-slide");
      }
      return;
    }

    let observer;
    try {
      observer = new IntersectionObserver(handleIntersection, {
        threshold: 0.2,
        rootMargin: "0px 0px -10% 0px"
      });

      const currentNosotrosRef = nosotrosRef.current;
      const currentMvRef = mvRef.current;

      if (currentNosotrosRef) {
        observer.observe(currentNosotrosRef);
      }
      if (currentMvRef) {
        observer.observe(currentMvRef);
      }
    } catch (error) {
      console.error("Error initializing IntersectionObserver:", error);
      // Fallback si hay error en el observer
      if (nosotrosRef.current) nosotrosRef.current.classList.add("fade-in-slide");
      if (mvRef.current) mvRef.current.classList.add("fade-in-slide");
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [handleIntersection]);

  // Manejo de carga de imagen
  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  return (
    <main className="nosotros-container" role="main" aria-label="Información sobre nosotros">
      <section className="nosotros-section">
        {/* Panel 1: Nosotros + Nuestro Trabajo */}
        <article 
          ref={nosotrosRef} 
          className="panel panel-nosotros"
          aria-labelledby="nosotros-heading"
        >
          <div className="nosotros-grid">
            <div className="nosotros-texto">
              <h1 id="nosotros-heading">Nosotros</h1>
              <p>
                La <span className="resaltado">Cámara Mexicana de la Industria de la Construcción (CMIC)</span>
                es un organismo empresarial de interés público, autónomo y con representación en todo el país.
                En la Delegación Aguascalientes representamos a las empresas constructoras locales,
                defendiendo sus intereses y fomentando el desarrollo sostenible de la industria.
              </p>
            </div>

            <div className="nosotros-imagen">
              <img 
                src={ejemploImg} 
                alt="Representación visual de la Cámara Mexicana de la Industria de la Construcción"
                loading="lazy"
                decoding="async"
                width="600"
                height="400"
                onLoad={handleImageLoad}
                onError={handleImageError}
                style={{ 
                  opacity: imageLoaded ? 1 : 0,
                  transition: 'opacity 0.3s ease-in-out'
                }}
              />
              {!imageLoaded && !imageError && (
                <div 
                  className="image-placeholder" 
                  aria-label="Cargando imagen..."
                  style={{
                    width: '100%',
                    height: '100%',
                    background: 'var(--colorFondo)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '10px'
                  }}
                >
                  <span>Cargando imagen...</span>
                </div>
              )}
              {imageError && (
                <div 
                  className="image-fallback" 
                  aria-label="Imagen no disponible"
                  style={{
                    width: '100%',
                    height: '100%',
                    background: 'var(--colorFondo)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '10px',
                    border: '2px dashed var(--colorPrincipal)'
                  }}
                >
                  <span>Imagen no disponible</span>
                </div>
              )}
            </div>
          </div>

          <div className="nuestro-trabajo">
            <h2 id="trabajo-heading">Nuestro Trabajo</h2>
            <ul className="nosotros-lista" aria-labelledby="trabajo-heading">
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
        </article>

        {/* Panel 2: Misión, Visión y Objetivos */}
        <article 
          ref={mvRef} 
          className="panel panel-mv"
          aria-labelledby="principios-heading"
        >
          <h2 id="principios-heading" className="panel-title">Nuestros Principios</h2>
          <div className="valores-container">
            <section className="valor-card" aria-labelledby="mision-heading">
              <h3 id="mision-heading">Misión</h3>
              <p>Agrupar y organizar a los empresarios de la construcción, representando sus intereses, fomentando su productividad, apoyando su crecimiento y contribuyendo con responsabilidad al desarrollo y competitividad del país</p>
            </section>

            <section className="valor-card valor-card-vision" aria-labelledby="vision-heading">
              <h3 id="vision-heading">Visión</h3>
              <div className="vision-section">
                <p className="vision-parrafo">
                  <strong>Hacia el exterior:</strong> Desarrollar oportunidades y fomentar la inversión, proponiendo cambios regulatorios; proporcionar conocimiento del mercado con servicios especializados; definir la estructura del sector; facilitar la integración de cadenas productivas de financiamiento.
                </p>
                <p className="vision-parrafo">
                  <strong>H hacia el interior:</strong> Redimensionar la estructura administrativa, con mejora de servicios; institucionalizar con buena imagen y comunicación; y reforzar la presencia del sector ante clientes y oportunidades.
                </p>
              </div>
            </section>

            <section className="valor-card" aria-labelledby="objetivos-heading">
              <h3 id="objetivos-heading">Objetivos</h3>
              <ul>
                <li>Fortalecer la competitividad</li>
                <li>Promover capacitación</li>
                <li>Impulsar innovación</li>
                <li>Representar intereses del sector</li>
                <li>Fomentar ética empresarial</li>
              </ul>
            </section>
          </div>
        </article>
      </section>
    </main>
  );
};

// Componente de error boundary para mejor manejo de errores
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error en componente Nosotros:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Algo salió mal al cargar la información.</h2>
          <button onClick={() => window.location.reload()}>
            Recargar página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Exportar con error boundary
export default function NosotrosWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <Nosotros />
    </ErrorBoundary>
  );
}