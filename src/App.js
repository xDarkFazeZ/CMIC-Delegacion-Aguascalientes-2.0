import React from "react";
import Header from "./components/header";
import Hero from "./components/hero";
import Afiliados from "./components/afiliados";
import ItcHighlight from "./components/itc-highlight";
import IcicHighlight from "./components/icic-highlight"; 
import Footer from "./components/footer";
import Itc from "./pages/itc";
import Nosotros from "./pages/nosotros";
import MaestriaDetalle from "./pages/maestriaDetalle";
import { Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <>
      <Header />
      <main role="main"> {/* Añadido para accesibilidad */}
        <Routes>
          {/* Página principal */}
          <Route
            path="/"
            element={
              <>
                <Hero />
                <Afiliados />
                <ItcHighlight />
                <IcicHighlight />
              </>
            }
          />

          {/* Otras páginas */}
          <Route path="/icic" element={<IcicHighlight />} />
          <Route path="/itc" element={<Itc />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/maestria/:nombre" element={<MaestriaDetalle />} />
          
          {/* Ruta para manejar páginas no encontradas */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

// Componente simple para página 404
const NotFound = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center', minHeight: '50vh' }}>
      <h2>Página no encontrada</h2>
      <p>La página que buscas no existe.</p>
    </div>
  );
};

export default App;