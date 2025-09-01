import React, { useState, useEffect, useRef, useCallback } from 'react';
import { client } from '../sanity/sanityClient';
import { urlFor } from '../utils/imageUtils';
import '../css/carrusel.css';

const Carrusel = () => {
  const [items, setItems] = useState([]);
  const [offset, setOffset] = useState(0);
  const carruselRef = useRef(null);
  const carruselInnerRef = useRef(null);
  const animationFrameId = useRef(null);

  // Fetch de Sanity - Obtener TODOS los documentos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await client.fetch(
          `*[_type == "carrusel"]{
            images[]{
              asset->{
                _id,
                url,
                metadata{dimensions}
              }
            }
          }`
        );
        
        // Combinar todas las imágenes de todos los documentos
        const allImages = data.flatMap(doc => doc.images || []);
        setItems(allImages);
      } catch (error) {
        console.error('Error fetching carousel data:', error);
      }
    };
    fetchData();
  }, []);

  // Auto-scroll infinito optimizado y continuo
  useEffect(() => {
    if (items.length === 0 || !carruselInnerRef.current) return;

    const SCROLL_SPEED = 1.5; // Aumenté la velocidad un poco
    let lastTime = 0;

    const scroll = (timestamp) => {
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;

      setOffset(prev => {
        const newOffset = prev + (SCROLL_SPEED * deltaTime / 16);
        const contentWidth = carruselInnerRef.current?.scrollWidth / 2 || 0;
        
        // Scroll infinito suave - reinicia cuando llega al final del contenido duplicado
        return newOffset >= contentWidth ? newOffset - contentWidth : newOffset;
      });

      animationFrameId.current = requestAnimationFrame(scroll);
    };

    animationFrameId.current = requestAnimationFrame(scroll);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [items]);

  // Función para detectar orientación y generar URL óptima
  const getImageUrl = useCallback((item) => {
    if (!item?.asset) return '';
    try {
      const dimensions = item.asset.metadata?.dimensions;
      
      if (dimensions) {
        const { width, height } = dimensions;
        const isVertical = height > width;
        
        if (isVertical) {
          // Imagen vertical - mantener proporción original
          return urlFor(item.asset)
            .height(500) // Altura fija para verticales
            .fit('max') // Mantener proporciones sin recortar
            .url() || '';
        } else {
          // Imagen horizontal - mantener proporción 16:9
          return urlFor(item.asset)
            .width(800) // Ancho fijo para horizontales
            .height(450) // 16:9 ratio
            .fit('max') // Mantener proporciones
            .url() || '';
        }
      }
      
      // Fallback para imágenes sin metadata
      return urlFor(item.asset)
        .width(800)
        .height(450)
        .fit('max')
        .url() || item.asset.url || '';
        
    } catch (error) {
      console.error('Error generating image URL:', error);
      return item.asset.url || '';
    }
  }, []);

  // Determinar clase CSS basada en la orientación
  const getImageClass = useCallback((item) => {
    const dimensions = item.asset?.metadata?.dimensions;
    if (!dimensions) return 'carrusel-img';
    
    const { width, height } = dimensions;
    return height > width ? 'carrusel-img vertical' : 'carrusel-img horizontal';
  }, []);

  // Duplicamos las imágenes para efecto continuo infinito
  const displayItems = items.length > 0 ? [...items, ...items, ...items] : [];

  if (items.length === 0) {
    return (
      <section className="contenedor">
        <div className="carrusel-loading">Cargando carrusel...</div>
      </section>
    );
  }

  return (
    <section className="contenedor">
      <div className="carrusel" ref={carruselRef}>
        <div
          className="carrusel-inner"
          ref={carruselInnerRef}
          style={{ transform: `translateX(-${offset}px)` }}
        >
          {displayItems.map((item, index) => {
            const imageUrl = getImageUrl(item);
            const imageClass = getImageClass(item);
            
            if (!imageUrl) return null;

            return (
              <div 
                className="carrusel-item" 
                key={`${item.asset?._id}-${index}`}
                data-orientation={imageClass.includes('vertical') ? 'vertical' : 'horizontal'}
              >
                <img
                  src={imageUrl}
                  alt={`Imagen ${index + 1}`}
                  className={imageClass}
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default React.memo(Carrusel);