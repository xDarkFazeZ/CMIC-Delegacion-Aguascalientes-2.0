import React from "react";
import Header from "./components/header";
import Hero from "./components/hero";
import Servicios from "./components/servicios";
import Afiliados from "./components/afiliados";
import IcicHighlight from "./components/icic-highlight"; 
import Footer from "./components/footer";
import ServiciosPage from "./pages/serviciosPage"; 
import Nosotros from "./pages/nosotros"; // 👈 Importar tu página Nosotros
import { Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        {/* Página principal */}
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Afiliados />
              <Servicios />
              <IcicHighlight />
            </>
          }
        />

        {/* Otras páginas */}
        <Route path="/icic" element={<icic />} />
        <Route path="/serviciosPage" element={<ServiciosPage />} /> 
        <Route path="/nosotros" element={<Nosotros />} /> {/* 👈 Aquí agregamos la ruta */}
      </Routes>
      <Footer />
    </>
  );
};

export default App;
