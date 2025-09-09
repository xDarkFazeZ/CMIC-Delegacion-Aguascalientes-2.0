import React, { useState, useEffect, useRef, useCallback } from "react";
import { client } from "../lib/sanity";
import { useNavigate } from "react-router-dom";
import "../css/itc-highlight.css";

// Importar la imagen directamente
import itcLogo from "../lib/itc-logo.jpg";

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

const Servicios = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // Refs para animaciones
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const logoRef = useRef(null);
  const cardRefs = useRef([]);
  const buttonRef = useRef(null);

  // Función para sanitizar datos (prevención XSS básica)
  const sanitizeData = useCallback((data) => {
    return data.map(course => ({
      ...course,
      nombre_maestria: course.nombre_maestria?.replace(/javascript:/gi, '') || '',
      descripcion_corta: course.descripcion_corta?.replace(/javascript:/gi, '') || '',
      requisitos: course.requisitos?.map(req => req.replace(/javascript:/gi, '')) || []
    }));
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const query = `*[_type == "maestrias"] | order(_createdAt desc)[0...3]{
          _id,
          nombre_maestria,
          requisitos,
          descripcion_corta,
          duracion,
          "imagenUrl": imagen.asset->url,
          slug
        }`;
        
        const data = await client.fetch(query);
        const sanitizedData = sanitizeData(data);
        setCourses(sanitizedData);
        setError(null);
      } catch (err) {
        console.error("Error al cargar servicios:", err);
        setError("No se pudieron cargar los cursos. Intente nuevamente.");
        
        // Enviar error a un servicio de monitoreo (opcional)
        if (process.env.NODE_ENV === 'production') {
          console.log('Error reportado a servicio de monitoreo');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [sanitizeData]);

  // Configurar Intersection Observer para animaciones reversibles
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
      titleRef.current,
      subtitleRef.current,
      logoRef.current,
      buttonRef.current
    ].filter(Boolean);
    
    elementsToObserve.forEach(element => observer.observe(element));
    
    cardRefs.current.forEach(card => {
      if (card) observer.observe(card);
    });
    
    return () => {
      observer.disconnect();
    };
  }, [loading, error, courses]);

  const handleCourseClick = useCallback((course) => {
    if (course.slug?.current) {
      navigate(`/servicios/${course.slug.current}`);
    } else {
      navigate("/serviciosPage");
    }
  }, [navigate]);

  const handleRetry = useCallback(() => {
    window.location.reload();
  }, []);

  // Componente de carga
  if (loading) {
    return (
      <section className="courses-section" aria-labelledby="courses-heading">
        <div className="loading-container">
          <div className="loading-spinner" aria-label="Cargando cursos"></div>
          <p>Cargando cursos...</p>
        </div>
      </section>
    );
  }

  // Componente de error
  if (error) {
    return (
      <section className="courses-section" aria-labelledby="error-heading">
        <h2 id="error-heading" className="visually-hidden">Error</h2>
        <div className="error-container">
          <p role="alert">{error}</p>
          <button 
            className="retry-btn"
            onClick={handleRetry}
            aria-label="Reintentar cargar cursos"
          >
            Reintentar
          </button>
        </div>
      </section>
    );
  }

  return (
    <section 
      className="courses-section" 
      ref={sectionRef} 
      aria-labelledby="courses-heading"
    >
      <div className="logo-container" ref={logoRef}>
        <ImageWithFallback
          src={itcLogo}
          alt="Logo ITC"
          className="itcLogo"
          onError={() => console.log('Error cargando logo')}
        />
      </div>
      
      <h2 id="courses-heading" className="section-title" ref={titleRef}>
        Nuestros Programas
      </h2>
      
      <p className="section-subtitle" ref={subtitleRef}>
        Descubre nuestras maestrías y especializaciones de alto nivel
      </p>
      
      <div 
        className="courses-grid-three" 
        role="list" 
        aria-label="Lista de programas académicos"
      >
        {courses.map((course, index) => (
          <article 
            className="course-card" 
            key={course._id}
            ref={el => cardRefs.current[index] = el}
            style={{ animationDelay: `${index * 0.1}s` }}
            role="listitem"
            aria-labelledby={`course-title-${course._id}`}
          >
            <div className="course-image">
              <ImageWithFallback
                src={course.imagenUrl} 
                alt={`Imagen representativa de ${course.nombre_maestria}`}
                onError={() => console.log(`Error cargando imagen para ${course.nombre_maestria}`)}
              />
              {course.duracion && (
                <span className="course-duration">{course.duracion}</span>
              )}
            </div>
            
            <div className="course-info">
              <h3 id={`course-title-${course._id}`}>{course.nombre_maestria}</h3>
              
              {course.descripcion_corta && (
                <p className="course-description">{course.descripcion_corta}</p>
              )}
              
              <div className="requirements-container">
                <h4 className="requirements-title">Requisitos</h4>
                <ul aria-label={`Requisitos para ${course.nombre_maestria}`}>
                  {course.requisitos?.slice(0, 3).map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                  {course.requisitos?.length > 3 && (
                    <li className="more-items">
                      +{course.requisitos.length - 3} más
                    </li>
                  )}
                </ul>
              </div>
              
              <button
                className="info-btn"
                onClick={() => handleCourseClick(course)}
                aria-label={`Más información sobre ${course.nombre_maestria}`}
              >
                Más información
              </button>
            </div>
          </article>
        ))}
      </div>
      
      <div className="see-more" ref={buttonRef}>
        <button
          className="more-courses-btn"
          onClick={() => navigate("/serviciosPage")}
          aria-label="Ver todos los programas disponibles"
        >
          Ver todos los programas
        </button>
      </div>
    </section>
  );
};

export default Servicios;