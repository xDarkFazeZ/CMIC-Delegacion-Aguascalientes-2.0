// src/components/IcicHighlight.js
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { client, urlFor } from '../lib/sanity'
import "../css/icic-highlight.css";

const IcicHighlight = () => {
  const [icicImages, setIcicImages] = useState([]);
  const [calendarImage, setCalendarImage] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
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

  // Efecto para bloquear el scroll cuando los modales están abiertos
  useEffect(() => {
    if (selectedImage || showCalendarModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage, showCalendarModal]);

  useEffect(() => {
    const fetchData = async () => {
      try {
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
        
        setIcicImages(galleryData);
        setCalendarImage(calendarData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };
    fetchData();
  }, []);

  // Configurar Intersection Observer para animaciones
  useEffect(() => {
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
    if (sectionRef.current) observer.observe(sectionRef.current);
    if (headerRef.current) observer.observe(headerRef.current);
    if (logoRef.current) observer.observe(logoRef.current);
    if (titleRef.current) observer.observe(titleRef.current);
    if (subtitleRef.current) observer.observe(subtitleRef.current);
    if (infoRef.current) observer.observe(infoRef.current);
    if (galleryRef.current) observer.observe(galleryRef.current);
    if (buttonRef.current) observer.observe(buttonRef.current);
    if (calendarRef.current) observer.observe(calendarRef.current);
    
    statsRefs.current.forEach(stat => {
      if (stat) observer.observe(stat);
    });
    
    featureRefs.current.forEach(feature => {
      if (feature) observer.observe(feature);
    });
    
    return () => {
      observer.disconnect();
    };
  }, [icicImages, calendarImage]);

  useEffect(() => {
    if (icicImages.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % icicImages.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [icicImages.length]);

  const openImageModal = (image) => {
    setSelectedImage(image);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const openCalendarModal = () => {
    setShowCalendarModal(true);
  };

  const closeCalendarModal = () => {
    setShowCalendarModal(false);
  };

  return (
    <section id="icic" className="icic-highlight" ref={sectionRef}>
      <div className="contenedor">
        <div className="icic-header" ref={headerRef}>
          <div className="logo-container" ref={logoRef}>
            <img 
              src="/img/icic-logo.png" 
              alt="Logo ICIC" 
              className="icic-logo"
            />
          </div>
          <h2 className="section-title" ref={titleRef}>ICIC - Instituto de Capacitación</h2>
          <p className="section-subtitle" ref={subtitleRef}>Formamos a los profesionales del futuro en la industria de la construcción</p>
        </div>
        
        <div className="icic-grid">
          <div className="icic-info" ref={infoRef}>
            <div className="icic-description">
              <p>El Instituto de Capacitación de la Industria de la Construcción (ICIC) ofrece programas de formación especializada con certificaciones reconocidas a nivel nacional e internacional.</p>
              
              <div className="stats-grid">
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
            
            <div className="features-grid">
              <div className="feature-card" ref={el => featureRefs.current[0] = el}>
                <div className="feature-icon">📚</div>
                <div className="feature-content">
                  <h4>Cursos Técnicos</h4>
                  <p>Programas especializados en todas las áreas de construcción</p>
                </div>
              </div>
              <div className="feature-card" ref={el => featureRefs.current[1] = el}>
                <div className="feature-icon">🏆</div>
                <div className="feature-content">
                  <h4>Certificaciones</h4>
                  <p>Diplomas con validez oficial y reconocimiento sectorial</p>
                </div>
              </div>
              <div className="feature-card" ref={el => featureRefs.current[2] = el}>
                <div className="feature-icon">👥</div>
                <div className="feature-content">
                  <h4>Profesores Expertos</h4>
                  <p>Instructores con amplia experiencia en la industria</p>
                </div>
              </div>
            </div>
            
            <div className="button-container" ref={buttonRef}>
              <button 
                className="cta-button"
                onClick={() => navigate("/icic")}
              >
                <span>Conoce nuestros cursos</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div className="icic-gallery" ref={galleryRef}>
            <h3>Nuestros estudiantes en acción</h3>
            
            {icicImages.length > 0 ? (
              <div className="gallery-carousel">
                <div className="carousel-container">
                  {icicImages.map((image, index) => (
                    <div 
                      key={image._id} 
                      className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                      onClick={() => openImageModal(image)}
                    >
                      <img 
                        src={urlFor(image.imagen).url()} 
                        alt={image.titulo || "Estudiantes ICIC"} 
                        className="carousel-image"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="gallery-placeholder">
                <div className="placeholder-image"></div>
                <div className="placeholder-image"></div>
                <div className="placeholder-image"></div>
              </div>
            )}

            {/* Sección del Calendario Mejorada */}
            {calendarImage && (
              <div className="calendar-section" ref={calendarRef}>
                <h4>Calendario de Cursos 2024</h4>
                <div 
                  className="calendar-preview"
                  onClick={openCalendarModal}
                >
                  <img 
                    src={urlFor(calendarImage.imagen).url()} 
                    alt={calendarImage.titulo || "Calendario de Cursos"} 
                    className="calendar-image"
                  />
                </div>
                <p className="calendar-description">
                  Consulta nuestras fechas de cursos y programas de capacitación
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal para imágenes */}
      {selectedImage && (
        <div className="modal-overlay" onClick={closeImageModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeImageModal}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <img 
              src={urlFor(selectedImage.imagen).url()} 
              alt={selectedImage.titulo} 
              className="modal-image"
            />
            <div className="modal-info">
              <h3>{selectedImage.titulo}</h3>
              {selectedImage.descripcion && <p>{selectedImage.descripcion}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Modal para calendario */}
      {showCalendarModal && calendarImage && (
        <div className="modal-overlay" onClick={closeCalendarModal}>
          <div className="modal-content calendar-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeCalendarModal}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <h3 className="modal-title">{calendarImage.titulo || "Calendario de Cursos 2024"}</h3>
            <img 
              src={urlFor(calendarImage.imagen).url()} 
              alt={calendarImage.titulo || "Calendario de Cursos"} 
              className="modal-calendar-image"
            />
            {calendarImage.descripcion && (
              <div className="modal-info">
                <p>{calendarImage.descripcion}</p>
              </div>
            )}
            <div className="modal-actions">
              <button className="cta-button" onClick={closeCalendarModal}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default IcicHighlight;