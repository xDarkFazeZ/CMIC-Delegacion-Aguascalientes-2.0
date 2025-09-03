import React, { useEffect, useState } from "react";
import { client, urlFor } from '../lib/sanity'
import { useNavigate } from "react-router-dom";
import "../css/afiliados.css";

const Afiliados = () => {
    const [afiliados, setAfiliados] = useState([]);
    const navigate = useNavigate();

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

    return (
        <section className="afiliados">
            <h2>Afiliados y Representación</h2>
            <p>
                Somos parte de diferentes cámaras y organizaciones que respaldan
                nuestros servicios.
            </p>

            <div className="logos">
                {afiliados.map((afiliado) => (
                    <img
                        key={afiliado._id}
                        src={urlFor(afiliado.logo).url()}
                        alt={afiliado.nombre}
                    />
                ))}
            </div>

            <button className="btn-nosotros" onClick={() => navigate("/nosotros")}>
                Conocer más
            </button>
        </section>
    );
};

export default Afiliados;
