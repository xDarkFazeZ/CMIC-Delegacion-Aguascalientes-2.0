import React, { useState, useEffect, useRef } from "react";
import { client } from "../lib/sanity";
import { useNavigate } from "react-router-dom";
import "../css/servicios.css";

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

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await client.fetch(
          `*[_type == "servicios"] | order(_createdAt desc)[0...3]{
            _id,
            nombre_maestria,
            requisitos,
            descripcion_corta,
            duracion,
            "imagenUrl": imagen.asset->url,
            slug
          }`
        );
        setCourses(data);
        setError(null);
      } catch (err) {
        console.error("Error al cargar servicios:", err);
        setError("No se pudieron cargar los cursos. Intente nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

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
          // Cuando el elemento entra en el viewport
          entry.target.classList.add("animate-in");
          entry.target.classList.remove("animate-out");
        } else {
          // Cuando el elemento sale del viewport
          entry.target.classList.add("animate-out");
          entry.target.classList.remove("animate-in");
        }
      });
    }, observerOptions);
    
    // Observar todos los elementos que queremos animar
    if (sectionRef.current) observer.observe(sectionRef.current);
    if (titleRef.current) observer.observe(titleRef.current);
    if (subtitleRef.current) observer.observe(subtitleRef.current);
    if (logoRef.current) observer.observe(logoRef.current);
    if (buttonRef.current) observer.observe(buttonRef.current);
    
    cardRefs.current.forEach(card => {
      if (card) observer.observe(card);
    });
    
    return () => {
      observer.disconnect();
    };
  }, [loading, error, courses]);

  const handleCourseClick = (course) => {
    if (course.slug?.current) {
      navigate(`/servicios/${course.slug.current}`);
    } else {
      navigate("/serviciosPage");
    }
  };

  if (loading) {
    return (
      <section className="courses-section">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando cursos...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="courses-section">
        <div className="error-container">
          <p>{error}</p>
          <button 
            className="retry-btn"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="courses-section" ref={sectionRef} aria-labelledby="courses-heading">
      <div className="logo-container" ref={logoRef}>
        <img 
          src="/img/itc-logo.jpg"
          alt="Logo ITC"
          className="itc-logo"
        />
      </div>
      
      <h2 id="courses-heading" className="section-title" ref={titleRef}>Nuestros Programas</h2>
      <p className="section-subtitle" ref={subtitleRef}>Descubre nuestras maestrías y especializaciones de alto nivel</p>
      
      <div className="courses-grid-three">
        {courses.map((course, index) => (
          <div 
            className="course-card" 
            key={course._id}
            ref={el => cardRefs.current[index] = el}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="course-image">
              <img 
                src={course.imagenUrl} 
                alt={course.nombre_maestria}
                loading="lazy"
              />
              {course.duracion && (
                <span className="course-duration">{course.duracion}</span>
              )}
            </div>
            
            <div className="course-info">
              <h3>{course.nombre_maestria}</h3>
              
              {course.descripcion_corta && (
                <p className="course-description">{course.descripcion_corta}</p>
              )}
              
              <div className="requirements-container">
                <h4 className="requirements-title">Requisitos</h4>
                <ul>
                  {course.requisitos?.slice(0, 3).map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                  {course.requisitos?.length > 3 && (
                    <li className="more-items">+{course.requisitos.length - 3} más</li>
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
          </div>
        ))}
      </div>
      
      <div className="see-more" ref={buttonRef}>
        <button
          className="more-courses-btn"
          onClick={() => navigate("/serviciosPage")}
        >
          Ver todos los programas
        </button>
      </div>
    </section>
  );
};

export default Servicios;