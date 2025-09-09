import { FaTags, FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ title, price, img, tag }) {
    
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 hover:border-gray-200 mx-4 w-80 flex-shrink-0">
      <img src={img} alt={title} className="w-full h-48 object-cover rounded-t-2xl" />
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <FaTags className="text-gray-400 text-sm" />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="text-xl font-bold text-gray-900 mb-4">
          ${price.toLocaleString('es-AR')}
        </div>
        <button
          onClick={() => navigate('/products')}
          className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition"
        >
          <FaShoppingCart className="text-sm" /> Ver detalles
        </button>
      </div>
    </div>
  );

}
