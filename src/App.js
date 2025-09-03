import React from "react";
import Header from "./components/header";
import Hero from "./components/hero";
import Servicios from "./components/servicios";
import Afiliados from "./components/afiliados";
import IcicHighlight from "./components/icic-highlight"; 
import Footer from "./components/footer";
import ServiciosPage from "./pages/serviciosPage"; // ← Importar el nuevo componente
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

        {/* Página completa del ICIC */}
        <Route path="/icic" element={<icic />} />
        <Route path="/servicios" element={<ServiciosPage />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
