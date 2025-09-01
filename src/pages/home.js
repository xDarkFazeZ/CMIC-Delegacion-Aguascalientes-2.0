import React from "react";
import Hero from "../components/hero";
import Carrusel from "../components/carrusel";
import Afiliados from "../components/afililados";
import Servicios from "../components/servicios";
import Noticias from "../components/noticias";
import Contacto from "../components/contacto";
import Footer from "../components/footer";

const Home = () => {
  return (
    <>
      <Hero />
      <Carrusel />
      <Afiliados />
      <Servicios />
      <Noticias />
      <Contacto />
      <Footer />
    </>
  );
};

export default Home;