import { FaTags, FaShoppingCart } from 'react-icons/fa';
import { useEffect, useState } from 'react';

export default function ProductCard({ title, price, thumbnails, category, stock, onClick }) {
  const DOLAR_API_URL = import.meta.env.VITE_DOLAR_API_URL;
  const [cotizacion, setCotizacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDolar() {
      try {
        setLoading(true);
        const res = await fetch(DOLAR_API_URL);
        const data = await res.json();
        setCotizacion(data.venta);
      } catch (err) {
        setError('No se pudo obtener la cotización');
      } finally {
        setLoading(false);
      }
    }
    fetchDolar();
  }, []);

  const precioPesos = cotizacion ? price * cotizacion : null;

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 hover:border-gray-200 w-full max-w-sm mx-auto flex flex-col hover:shadow-lg transition-all duration-300">
      
      {/* Contenedor de imagen con categoría superpuesta */}
      <div className="relative">
        <img 
          src={thumbnails[0] || "https://placehold.co/250x250"} 
          alt={title} 
          className="w-full aspect-square object-cover rounded-t-2xl" 
        />

        {/* Badge de categoría en esquina superior derecha */}
        {category && (
          <div className="absolute flex justify-center items-center flex-row top-2 right-2 bg-black/80 text-white text-xs font-medium px-2 py-1 rounded-md backdrop-blur-sm">
            <FaTags className="text-white text-sm mr-1 flex-shrink-0" />
            {typeof category === 'object' ? category.name : category}
          </div>
        )}

        {/* Badge de "Sin stock" */}
        {stock === 0 && (
          <div className="absolute top-10 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow">
            Sin stock
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        {/* Título y tag */}
        <div className="flex items-start gap-2 mb-3">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2 leading-tight">{title}</h3>
        </div>

        {/* Espacio flexible para empujar precio y botón hacia abajo */}
        <div className="flex flex-col mt-auto">
          {/* Precio en pesos */}
          <div className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
            {loading ? 'Cargando cotización...' : error ? error : precioPesos ? `AR$ ${precioPesos.toLocaleString('es-AR', { minimumFractionDigits: 2 })}` : 'Sin cotización'}
          </div>
          {/* Precio en dólares */}
          <div className="text-base sm:text-lg text-gray-700 mb-3 sm:mb-4">
            USD ${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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