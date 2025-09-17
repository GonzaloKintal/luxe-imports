// import { useState } from 'react';

// export default function ProductImageGallery({ thumbnails, title }) {
    
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   const images = thumbnails || [];
//   const hasMultipleImages = images.length > 1;

//   return (
//     <div className="p-6 lg:p-8">
//       {/* Imagen principal */}
//       <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4 max-w-lg mx-auto">
//         <img
//           src={images[currentImageIndex] || '/placeholder-product.jpg'}
//           alt={title}
//           className="w-full h-full object-cover"
//           onError={(e) => {
//             e.target.src = '/placeholder-product.jpg';
//           }}
//         />
//       </div>
      
//       {/* Miniaturas - Solo se muestran si hay más de una imagen */}
//       {hasMultipleImages && (
//         <div className="flex gap-2 overflow-x-auto">
//           {images.map((thumbnail, index) => (
//             <ThumbnailButton
//               key={index}
//               src={thumbnail}
//               alt={`${title} ${index + 1}`}
//               isActive={currentImageIndex === index}
//               onClick={() => setCurrentImageIndex(index)}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// function ThumbnailButton({ src, alt, isActive, onClick }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
//         isActive 
//           ? 'border-gray-900' 
//           : 'border-gray-200 hover:border-gray-400'
//       }`}
//     >
//       <img
//         src={src}
//         alt={alt}
//         className="w-full h-full object-cover"
//         onError={(e) => {
//           e.target.src = '/placeholder-product.jpg';
//         }}
//       />
//     </button>
//   );

// }


import { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function ProductImageGallery({ thumbnails, title }) {
    
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = thumbnails && thumbnails.length > 0 ? thumbnails : ["https://placehold.co/250x250"];
  const hasMultipleImages = images.length > 1 && thumbnails && thumbnails.length > 0;

  // Función para avanzar a la siguiente imagen
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Función para retroceder a la imagen anterior
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="p-6 lg:p-8 relative">
      {/* Contenedor de imagen principal con flechas */}
      <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4 max-w-lg mx-auto relative">
        <img
          src={images[currentImageIndex]}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://placehold.co/250x250';
          }}
        />
        
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
              onClick={() => setCurrentImageIndex(index)}
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