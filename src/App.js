import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

import Header from "./components/header";
import Hero from "./components/hero";
import Afiliados from "./components/afiliados";
import ItcHighlight from "./components/itc-highlight";
import IcicHighlight from "./components/icic-highlight";
import Footer from "./components/footer";
import Itc from "./pages/itc";
import Nosotros from "./pages/nosotros";
import MaestriaDetalle from "./pages/maestriaDetalle";

// Tu ID de Google Analytics 4
const TRACKING_ID = "G-P8G72QZBJ2"; // <-- Reemplaza con tu ID
ReactGA.initialize(TRACKING_ID);

const App = () => {
  const location = useLocation();

  useEffect(() => {
    // Esto se ejecuta en cada cambio de URL
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location]);

  return (
    <>
      <Header />
      <main role="main">
        <Routes>
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
          <Route path="/icic" element={<IcicHighlight />} />
          <Route path="/itc" element={<Itc />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/maestria/:nombre" element={<MaestriaDetalle />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

const NotFound = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center', minHeight: '50vh' }}>
      <h2>Página no encontrada</h2>
      <p>La página que buscas no existe.</p>
    </div>
  );
};

export default App;