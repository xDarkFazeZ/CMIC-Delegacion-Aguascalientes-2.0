import React from "react";
import Header from "./components/header";
import Hero from "./components/hero";
import ItcHighlight from "./components/itc-highlight";
import Afiliados from "./components/afiliados";
import IcicHighlight from "./components/icic-highlight"; 
import Footer from "./components/footer";
import Itc from "./pages/itc"; //
import Nosotros from "./pages/nosotros"; //
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
              <ItcHighlight/>
              <IcicHighlight />
            </>
          }
        />

        {/* Otras páginas */}
        <Route path="/icic" element={<icic />} />
        <Route path="/itc" element={<Itc />} />
        <Route path="/nosotros" element={<Nosotros />} /> {/* 👈 Aquí agregamos la ruta */}
      </Routes>
      <Footer />
    </>
  );
};

export default App;
