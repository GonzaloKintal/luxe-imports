import { FaTags, FaShoppingCart } from 'react-icons/fa';

export default function ProductCard({ title, price, thumbnails, onClick }) {

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 hover:border-gray-200 w-full max-w-sm mx-auto flex flex-col hover:shadow-lg transition-all duration-300">
      <img 
        src={thumbnails[0]} 
        alt={title} 
        className="w-full aspect-square object-cover rounded-t-2xl" 
      />

      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        {/* Título y tag */}
        <div className="flex items-start gap-2 mb-3">
          <FaTags className="text-gray-400 text-sm mt-1 flex-shrink-0" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2 leading-tight">{title}</h3>
        </div>

        {/* Espacio flexible para empujar precio y botón hacia abajo */}
        <div className="flex flex-col mt-auto">
          {/* Precio */}
          <div className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
            ${price.toLocaleString('es-AR')}
          </div>

          {/* Botón */}
          <button
            onClick={onClick}
            className="w-full cursor-pointer bg-gray-900 text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors text-sm sm:text-base font-medium"
          >
            <FaShoppingCart className="text-sm" /> Ver detalle
          </button>
        </div>
      </div>
    </div>
  );
}