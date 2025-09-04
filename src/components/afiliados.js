import React, { useEffect, useState, useRef } from "react";
import { client, urlFor } from '../lib/sanity';
import { useNavigate } from "react-router-dom";
import "../css/afiliados.css";

const Afiliados = () => {
    const [afiliados, setAfiliados] = useState([]);
    const navigate = useNavigate();

    const sectionRef = useRef(null);
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const logosRef = useRef(null);
    const buttonRef = useRef(null);
    const logoRefs = useRef([]);

    useEffect(() => {
        const fetchAfiliados = async () => {
            try {
                const query = `*[_type == "afiliado"][0...3]{
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
        
        if (sectionRef.current) observer.observe(sectionRef.current);
        if (titleRef.current) observer.observe(titleRef.current);
        if (subtitleRef.current) observer.observe(subtitleRef.current);
        if (logosRef.current) observer.observe(logosRef.current);
        if (buttonRef.current) observer.observe(buttonRef.current);
        
        logoRefs.current.forEach(logo => {
            if (logo) observer.observe(logo);
        });
        
        return () => observer.disconnect();
    }, [afiliados]);

    return (
        <section 
            className="afiliados" 
            ref={sectionRef} 
            aria-labelledby="afiliados-title"
        >
            <h2 id="afiliados-title" ref={titleRef}>
                Afiliados y Representación
            </h2>
            <p ref={subtitleRef}>
                Somos parte de diferentes cámaras y organizaciones que respaldan
                nuestros servicios.
            </p>

            <div 
                className="logos" 
                ref={logosRef} 
                role="list" 
                aria-label="Logotipos de afiliados"
            >
                {afiliados.map((afiliado, index) => (
                    <div 
                        key={afiliado._id}
                        className="logo-item"
                        ref={el => logoRefs.current[index] = el}
                        style={{ animationDelay: `${index * 0.1}s` }}
                        role="listitem"
                    >
                        <img
                            src={urlFor(afiliado.logo).url()}
                            alt={`Logo de ${afiliado.nombre}`}
                            loading="lazy"
                            decoding="async"
                            referrerPolicy="no-referrer"
                        />
                    </div>
                ))}
            </div>

            <button 
                className="btn-nosotros" 
                onClick={() => navigate("/nosotros")}
                ref={buttonRef}
                aria-label="Conocer más sobre nosotros"
            >
                Conocer más
            </button>
        </section>
    );
};

export default Afiliados;