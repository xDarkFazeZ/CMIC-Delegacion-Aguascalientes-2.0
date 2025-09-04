import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { client, urlFor } from '../lib/sanity';
import "../css/icic-highlight.css";

// Importar la imagen directamente
import icicLogo from "../lib/icic-logo.png";

// Componente para manejar errores de imagen
const ImageWithFallback = ({ src, alt, className, onError, ...props }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = useCallback(() => {
    if (!hasError) {
      setHasError(true);
      setImgSrc('/placeholder-image.jpg'); // Imagen de respaldo
      if (onError) onError();
    }
  }, [hasError, onError]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
      decoding="async"
      {...props}
    />
  );
};

const IcicHighlight = () => {
  const [icicImages, setIcicImages] = useState([]);
  const [calendarImage, setCalendarImage] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Refs para animaciones
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const logoRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const infoRef = useRef(null);
  const galleryRef = useRef(null);
  const statsRefs = useRef([]);
  const featureRefs = useRef([]);
  const buttonRef = useRef(null);
  const calendarRef = useRef(null);

  // Función para sanitizar datos (prevención XSS básica)
  const sanitizeData = useCallback((data) => {
    return data.map(item => ({
      ...item,
      titulo: item.titulo?.replace(/javascript:/gi, '') || '',
      descripcion: item.descripcion?.replace(/javascript:/gi, '') || ''
    }));
  }, []);

  // Obtener datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const galleryQuery = `*[_type == "icicGallery"]{
          _id,
          titulo,
          imagen,
          "descripcion": descripcion[0].children[0].text
        }`;
        
        const calendarQuery = `*[_type == "calendarioCursos"][0]{
          _id,
          titulo,
          imagen,
          "descripcion": descripcion[0].children[0].text
        }`;
        
        const [galleryData, calendarData] = await Promise.all([
          client.fetch(galleryQuery),
          client.fetch(calendarQuery)
        ]);
        
        const sanitizedGalleryData = sanitizeData(galleryData || []);
        const sanitizedCalendarData = calendarData ? sanitizeData([calendarData])[0] : null;
        
        setIcicImages(sanitizedGalleryData);
        setCalendarImage(sanitizedCalendarData);
        setError(null);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setError("No se pudieron cargar los datos. Intente nuevamente.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [sanitizeData]);

  // Animaciones con IntersectionObserver
  useEffect(() => {
    if (loading || error) return;
    
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
          entry.target.classList.remove("animate-out");
        } else {
          entry.target.classList.add("animate-out");
          entry.target.classList.remove("animate-in");
        }
      });
    }, observerOptions);
    
    // Observar todos los elementos que queremos animar
    const elementsToObserve = [
      sectionRef.current,
      headerRef.current,
      logoRef.current,
      titleRef.current,
      subtitleRef.current,
      infoRef.current,
      galleryRef.current,
      buttonRef.current,
      calendarRef.current
    ].filter(Boolean);
    
    elementsToObserve.forEach(element => observer.observe(element));
    
    statsRefs.current.forEach(stat => {
      if (stat) observer.observe(stat);
    });
    
    featureRefs.current.forEach(feature => {
      if (feature) observer.observe(feature);
    });
    
    return () => observer.disconnect();
  }, [loading, error, icicImages, calendarImage]);

  // Carrusel automático con pausa al hacer hover
  useEffect(() => {
    if (icicImages.length <= 1) return;
    
    let interval;
    const carouselContainer = document.querySelector('.carousel-container');
    
    const startCarousel = () => {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % icicImages.length);
      }, 4000);
    };
    
    const stopCarousel = () => {
      if (interval) {
        clearInterval(interval);
      }
    };
    
    startCarousel();
    
    // Pausar carrusel al hacer hover
    if (carouselContainer) {
      carouselContainer.addEventListener('mouseenter', stopCarousel);
      carouselContainer.addEventListener('mouseleave', startCarousel);
    }
    
    return () => {
      stopCarousel();
      if (carouselContainer) {
        carouselContainer.removeEventListener('mouseenter', stopCarousel);
        carouselContainer.removeEventListener('mouseleave', startCarousel);
      }
    };
  }, [icicImages.length]);

  const handleNavigate = useCallback(() => {
    navigate("/icic");
  }, [navigate]);

  const handleRetry = useCallback(() => {
    window.location.reload();
  }, []);

  // Componente de carga
  if (loading) {
    return (
      <section className="icic-highlight" aria-labelledby="loading-heading">
        <h2 id="loading-heading" className="visually-hidden">Cargando</h2>
        <div className="loading-container">
          <div className="loading-spinner" aria-label="Cargando contenido"></div>
          <p>Cargando contenido...</p>
        </div>
      </section>
    );
  }

  // Componente de error
  if (error) {
    return (
      <section className="icic-highlight" aria-labelledby="error-heading">
        <h2 id="error-heading" className="visually-hidden">Error</h2>
        <div className="error-container">
          <p role="alert">{error}</p>
          <button 
            className="retry-btn"
            onClick={handleRetry}
            aria-label="Reintentar cargar contenido"
          >
            Reintentar
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="icic" className="icic-highlight" ref={sectionRef} aria-labelledby="icic-heading">
      <div className="contenedor">
        <div className="icic-header" ref={headerRef}>
          <div className="logo-container" ref={logoRef}>
            <ImageWithFallback
              src={icicLogo} // Usar la imagen importada directamente
              alt="Logo ICIC" 
              className="icic-logo"
              onError={() => console.log('Error cargando logo ICIC')}
            />
          </div>
          <h2 id="icic-heading" className="section-title" ref={titleRef}>ICIC - Instituto de Capacitación</h2>
          <p className="section-subtitle" ref={subtitleRef}>Formamos a los profesionales del futuro en la industria de la construcción</p>
        </div>
        
        <div className="icic-grid">
          <div className="icic-info" ref={infoRef}>
            <div className="icic-description">
              <p>El Instituto de Capacitación de la Industria de la Construcción (ICIC) ofrece programas de formación especializada con certificaciones reconocidas a nivel nacional e internacional.</p>
              
              <div className="stats-grid" role="region" aria-label="Estadísticas del instituto">
                <div className="stat" ref={el => statsRefs.current[0] = el}>
                  <span className="stat-number">50+</span>
                  <span className="stat-label">Cursos disponibles</span>
                </div>
                <div className="stat" ref={el => statsRefs.current[1] = el}>
                  <span className="stat-number">2,000+</span>
                  <span className="stat-label">Estudiantes capacitados</span>
                </div>
                <div className="stat" ref={el => statsRefs.current[2] = el}>
                  <span className="stat-number">98%</span>
                  <span className="stat-label">Tasa de satisfacción</span>
                </div>
              </div>
            </div>
            
            <div className="features-grid" role="region" aria-label="Características del instituto">
              <div className="feature-card" ref={el => featureRefs.current[0] = el}>
                <div className="feature-icon" aria-hidden="true">📚</div>
                <div className="feature-content">
                  <h4>Cursos Técnicos</h4>
                  <p>Programas especializados en todas las áreas de construcción</p>
                </div>
              </div>
              <div className="feature-card" ref={el => featureRefs.current[1] = el}>
                <div className="feature-icon" aria-hidden="true">🏆</div>
                <div className="feature-content">
                  <h4>Certificaciones</h4>
                  <p>Diplomas con validez oficial y reconocimiento sectorial</p>
                </div>
              </div>
              <div className="feature-card" ref={el => featureRefs.current[2] = el}>
                <div className="feature-icon" aria-hidden="true">👥</div>
                <div className="feature-content">
                  <h4>Profesores Expertos</h4>
                  <p>Instructores con amplia experiencia en la industria</p>
                </div>
              </div>
            </div>
            
            <div className="button-container" ref={buttonRef}>
              <button 
                className="cta-button"
                onClick={handleNavigate}
                aria-label="Conoce nuestros cursos del ICIC"
              >
                <span>Conoce nuestros cursos</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div className="icic-gallery" ref={galleryRef}>
            <h3>Nuestros estudiantes en acción</h3>
            
            {icicImages.length > 0 ? (
              <div className="gallery-carousel">
                <div className="carousel-container" aria-label="Galería de estudiantes">
                  {icicImages.map((image, index) => (
                    <div 
                      key={image._id} 
                      className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                      aria-hidden={index !== currentSlide}
                    >
                      <ImageWithFallback
                        src={urlFor(image.imagen).url()} 
                        alt={image.titulo || "Estudiantes ICIC"} 
                        className="carousel-image"
                        onError={() => console.log(`Error cargando imagen: ${image.titulo}`)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="gallery-placeholder" aria-label="Galería en carga">
                <div className="placeholder-image"></div>
                <div className="placeholder-image"></div>
                <div className="placeholder-image"></div>
              </div>
            )}

            {calendarImage && (
              <div className="calendar-section" ref={calendarRef}>
                <h4>Calendario de Cursos 2024</h4>
                <div className="calendar-preview">
                  <ImageWithFallback
                    src={urlFor(calendarImage.imagen).url()} 
                    alt={calendarImage.titulo || "Calendario de Cursos"} 
                    className="calendar-image"
                    onError={() => console.log('Error cargando calendario')}
                  />
                </div>
                {calendarImage.descripcion && (
                  <p className="calendar-description">
                    {calendarImage.descripcion}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default IcicHighlight;