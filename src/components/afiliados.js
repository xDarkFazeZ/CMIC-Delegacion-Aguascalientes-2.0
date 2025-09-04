import React, { useEffect, useState, useRef, useCallback } from "react";
import { client, urlFor } from '../lib/sanity';
import { useNavigate } from "react-router-dom";
import "../css/afiliados.css";

const Afiliados = () => {
    const [afiliados, setAfiliados] = useState([]);
    const [isPaused, setIsPaused] = useState(false);
    const navigate = useNavigate();
    
    const carouselRef = useRef(null);
    const requestRef = useRef();
    const animationRef = useRef({ position: 0, speed: 0.5 });

    useEffect(() => {
        const fetchAfiliados = async () => {
            try {
                const query = `*[_type == "afiliado"]{
                    _id,
                    nombre,
                    logo
                }`;
                const data = await client.fetch(query);
                setAfiliados(data);
            } catch (error) {
                console.error("Error al cargar afiliados:", error);
            }
        };
        fetchAfiliados();
    }, []);

    // Función de animación del carrusel
    const animate = useCallback(() => {
        if (!isPaused && carouselRef.current && afiliados.length > 0) {
            animationRef.current.position -= animationRef.current.speed;
            
            // Reiniciar posición cuando se desplaza demasiado
            if (Math.abs(animationRef.current.position) >= carouselRef.current.scrollWidth / 2) {
                animationRef.current.position = 0;
            }
            
            carouselRef.current.style.transform = `translateX(${animationRef.current.position}px)`;
        }
        
        requestRef.current = requestAnimationFrame(animate);
    }, [isPaused, afiliados.length]);

    useEffect(() => {
        if (afiliados.length > 0) {
            requestRef.current = requestAnimationFrame(animate);
        }
        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, [animate, afiliados.length]);

    // Pausar/reanudar carrusel al interactuar
    const handleMouseEnter = () => setIsPaused(true);
    const handleMouseLeave = () => setIsPaused(false);

    // Duplicar afiliados para efecto infinito
    const duplicatedAfiliados = [...afiliados, ...afiliados];

    if (afiliados.length === 0) {
        return <div>Cargando afiliados...</div>;
    }

    return (
        <section className="afiliados" aria-labelledby="afiliados-title">
            <h2 id="afiliados-title">
                Afiliados y Representación
            </h2>
            <p>
                Somos parte de diferentes cámaras y organizaciones que respaldan
                nuestros servicios.
            </p>

            <div 
                className="logos-container"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                aria-label="Carrusel de logotipos de afiliados"
            >
                <div className="logos-carousel" ref={carouselRef}>
                    {duplicatedAfiliados.map((afiliado, index) => (
                        <div 
                            key={`${afiliado._id}-${index}`}
                            className="logo-item"
                            onMouseEnter={() => setIsPaused(true)}
                            onMouseLeave={() => setIsPaused(false)}
                        >
                            <img
                                src={urlFor(afiliado.logo).url()}
                                alt={`Logo de ${afiliado.nombre}`}
                                loading="lazy"
                                decoding="async"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <button 
                className="btn-nosotros" 
                onClick={() => navigate("/nosotros")}
                aria-label="Conocer más sobre nosotros"
            >
                Conocer más
            </button>
        </section>
    );
};

export default Afiliados;