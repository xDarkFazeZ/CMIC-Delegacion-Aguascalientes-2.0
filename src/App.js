import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/header";
import Hero from "./components/hero";
import Servicios from "./components/servicios";
import Afiliados from "./components/afiliados";
import Noticias from "./components/noticias";
import IcicHighlight from "./components/icic-highlight"; // Nueva sección
import Contacto from "./components/contacto";
import Footer from "./components/footer";
import IcicPage from "./pages/icic"; // Página completa del ICIC

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
                            <Afiliados />
              <Servicios />
              <IcicHighlight /> {/* Sección destacada del ICIC */}

              <Footer />
            </>
          }
        />
        <Route path="/icic" element={<IcicPage />} />
      </Routes>
    </>
  );
};

export default App;