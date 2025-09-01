// src/components/Servicios.js
import React, { useEffect, useState } from "react";
import { client } from '../sanity/sanityClient';
import { urlFor } from '../utils/imageUtils';
import { useNavigate } from "react-router-dom";
import "../css/servicios.css";

const Servicios = () => {
  const [servicios, setServicios] = useState([]);
  const [totalServicios, setTotalServicios] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        // Query para los primeros 3 servicios
        const queryServicios = `*[_type == "servicio"][0...3]{
          _id,
          titulo,
          descripcion,
          imagen
        }`;
        
        // Query para contar el total de servicios
        const queryTotal = `count(*[_type == "servicio"])`;
        
        const [data, total] = await Promise.all([
          client.fetch(queryServicios),
          client.fetch(queryTotal)
        ]);
        
        setServicios(data);
        setTotalServicios(total);
      } catch (error) {
        console.error("Error al cargar servicios:", error);
      }
    };
    fetchServicios();
  }, []);

  return (
    <section id="servicios" className="servicios">
      <div className="contenedor">
        <h2 className="seccion-titulo">Nuestros Servicios</h2>
        <div className="servicios-grid">
          {servicios.map((s) => (
            <div className="servicio-card" key={s._id}>
              <div className="servicio-img">
                <img src={urlFor(s.imagen).url()} alt={s.titulo} />
              </div>
              <div className="servicio-contenido">
                <h3 className="servicio-titulo">{s.titulo}</h3>
                <p className="servicio-texto">{s.descripcion}</p>
                <button
                  className="boton"
                  onClick={() => navigate("/servicios")}
                >
                  Más información
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Botón "Conocer más servicios" - SIEMPRE visible */}
        <div className="ver-mas-container">
          <button 
            className="boton boton-secundario"
            onClick={() => navigate("/servicios")}
          >
            {totalServicios > 3 
              ? `Conocer más servicios (${totalServicios - 3} más disponibles)`
              : "Ver todos nuestros servicios"
            }
          </button>
        </div>
      </div>
    </section>
  );
};

export default Servicios;