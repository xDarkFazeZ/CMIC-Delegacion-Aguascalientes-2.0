import React, { useEffect, useState } from "react";
import { client } from '../sanity/sanityClient';
import { urlFor } from '../utils/imageUtils';
import "../css/servicios.css";

const ServiciosPage = () => {
  const [servicios, setServicios] = useState([]);

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const query = `*[_type == "servicios"]{
          _id,
          titulo,
          descripcion,
          imagen
        }`;
        const data = await client.fetch(query);
        setServicios(data);
      } catch (error) {
        console.error("Error al cargar servicios:", error);
      }
    };
    fetchServicios();
  }, []);

  return (
    <section id="servicios" className="servicios-page">
      <div className="contenedor">
        <h2 className="seccion-titulo">Todos Nuestros Servicios</h2>
        <div className="servicios-grid">
          {servicios.map((s) => (
            <div className="servicio-card" key={s._id}>
              <div className="servicio-img">
                <img src={urlFor(s.imagen).url()} alt={s.titulo} />
              </div>
              <div className="servicio-contenido">
                <h3 className="servicio-titulo">{s.titulo}</h3>
                <p className="servicio-texto">{s.descripcion}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiciosPage;