import React, { useEffect, useState } from "react";
import { client, urlFor } from '../lib/sanity';
import "../css/servicios-page.css";

const ServiciosPage = () => {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const query = `*[_type == "servicios"]{
          _id,
          nombre_maestria,
          objetivo_itc,
          requisitos,
          mapa_curricular,
          detalles_maestria,
          imagen
        }`;
        const data = await client.fetch(query);
        setServicios(data);
      } catch (error) {
        console.error("Error al cargar servicios:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServicios();
  }, []);

  if (loading) return <div className="loading">Cargando maestrías...</div>;

  return (
    <div className="servicios-page">
      <div className="servicios-header">
        <h1>Maestrías ITC</h1>
        <p>Programas de posgrado en partnership con el Instituto Tecnológico de la Construcción</p>
      </div>

      <div className="servicios-container">
        {servicios.map((servicio) => (
          <div key={servicio._id} className="servicio-detalle-card">
            {servicio.imagen && (
              <img 
                src={urlFor(servicio.imagen).width(600).url()} 
                alt={servicio.nombre_maestria}
                className="servicio-detalle-imagen"
              />
            )}
            
            <div className="servicio-detalle-contenido">
              <h2>{servicio.nombre_maestria}</h2>
              
              {/* Resto del contenido igual */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiciosPage;