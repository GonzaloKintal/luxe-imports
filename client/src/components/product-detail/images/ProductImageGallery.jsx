
import { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function ProductImageGallery({ thumbnails, title }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const images = thumbnails && thumbnails.length > 0 ? thumbnails : ["https://placehold.co/250x250"];
  const hasMultipleImages = images.length > 1 && thumbnails && thumbnails.length > 0;

  // Función para cambiar de imagen con transición
  const changeImage = (newIndex) => {
    if (isTransitioning || newIndex === currentImageIndex) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex(newIndex);
      setIsTransitioning(false);
    }, 150); // Duración de la transición
  };

  // Función para avanzar a la siguiente imagen
  const nextImage = () => {
    const newIndex = currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1;
    changeImage(newIndex);
  };

  // Función para retroceder a la imagen anterior
  const prevImage = () => {
    const newIndex = currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1;
    changeImage(newIndex);
  };

  return (
    <div className="p-6 lg:p-8 relative">

      {/* Contenedor de imagen principal con flechas */}
      <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4 max-w-lg mx-auto relative">
        <div className="relative w-full h-full">
          <img
            src={images[currentImageIndex]}
            alt={title}
            className={`w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-150 ${
              isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}
            onError={(e) => {
              e.target.src = 'https://placehold.co/250x250';
            }}
          />
        </div>
        
        {/* Flechas de navegación (solo si hay múltiples imágenes) */}
        {hasMultipleImages && (
          <>
            {/* Flecha izquierda */}
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200"
              aria-label="Imagen anterior"
            >
              <FaChevronLeft className="text-lg" />
            </button>
            
            {/* Flecha derecha */}
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200"
              aria-label="Siguiente imagen"
            >
              <FaChevronRight className="text-lg" />
            </button>
          </>
        )}
        
        {/* Indicador de posición (solo si hay múltiples imágenes) */}
        {hasMultipleImages && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}
      </div>
      
      {/* Miniaturas - Solo se muestran si hay más de una imagen */}
      {hasMultipleImages && (
        <div className="flex gap-2 overflow-x-auto justify-center">
          {images.map((thumbnail, index) => (
            <ThumbnailButton
              key={index}
              src={thumbnail}
              alt={`${title} ${index + 1}`}
              isActive={currentImageIndex === index}
              onClick={() => changeImage(index)}
            />
          ))}
        </div>
      )}

    </div>
  );
}

function ThumbnailButton({ src, alt, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
        isActive 
          ? 'border-gray-900' 
          : 'border-gray-200 hover:border-gray-400'
      }`}
      aria-label={`Ver ${alt}`}
      aria-pressed={isActive}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.src = 'https://placehold.co/250x250';
        }}
      />
    </button>
  );
}