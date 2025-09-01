import React from "react";
import "../css/noticias.css";

const noticias = [
  {
    img: "https://placehold.co/600x400/720000/white?text=Nueva+Normatividad",
    fecha: "15 de Octubre, 2023",
    titulo: "Nueva normatividad en construcción sustentable",
    resumen: "Se actualizan los lineamientos para edificación sostenible en el estado de Aguascalientes.",
  },
  {
    img: "https://placehold.co/600x400/5a0000/white?text=Convenio+de+Colaboración",
    fecha: "8 de Octubre, 2023",
    titulo: "Firman convenio con universidades locales",
    resumen: "CMIC Aguascalientes establece alianzas estratégicas con instituciones educativas.",
  },
  {
    img: "https://placehold.co/600x400/400000/white?text=Evento+Anual",
    fecha: "1 de Octubre, 2023",
    titulo: "Anuncian congreso anual de construcción 2023",
    resumen: "El evento reunirá a los principales actores del sector constructor de la región.",
  },
];

const Noticias = () => {
  return (
    <section id="noticias" className="noticias">
      <div className="contenedor">
        <h2 className="seccion-titulo">Últimas Noticias</h2>
        <div className="noticias-grid">
          {noticias.map((n, i) => (
            <div className="noticia-card" key={i}>
              <div className="noticia-img">
                <img src={n.img} alt={n.titulo} />
              </div>
              <div className="noticia-contenido">
                <p className="noticia-fecha">{n.fecha}</p>
                <h3 className="noticia-titulo">{n.titulo}</h3>
                <p className="noticia-resumen">{n.resumen}</p>
                <a href="#" className="boton">
                  Leer más
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Noticias;
