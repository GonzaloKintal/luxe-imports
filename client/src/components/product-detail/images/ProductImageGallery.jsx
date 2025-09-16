import { useState } from 'react';

export default function ProductImageGallery({ thumbnails, title }) {
    
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = thumbnails || [];
  const hasMultipleImages = images.length > 1;

  return (
    <div className="p-6 lg:p-8">
      {/* Imagen principal */}
      <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4 max-w-lg mx-auto">
        <img
          src={images[currentImageIndex] || '/placeholder-product.jpg'}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = '/placeholder-product.jpg';
          }}
        />
      </div>
      
      {/* Miniaturas - Solo se muestran si hay más de una imagen */}
      {hasMultipleImages && (
        <div className="flex gap-2 overflow-x-auto">
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
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.src = '/placeholder-product.jpg';
        }}
      />
    </button>
  );

}