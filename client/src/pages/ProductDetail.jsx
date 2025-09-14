

import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from '../context/UserContext';
import { FaShoppingCart } from 'react-icons/fa';

export default function ProductDetail() {
  const API_URL = import.meta.env.VITE_API_URL;
  const DOLAR_API_URL = import.meta.env.VITE_DOLAR_API_URL;
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [cartInfo, setCartInfo] = useState({ cartId: null, items: {} });
  const [cotizacion, setCotizacion] = useState(null);
  const [loadingCotizacion, setLoadingCotizacion] = useState(true);
  const [errorCotizacion, setErrorCotizacion] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    window.scrollTo(0, 0);
    async function fetchDolar() {
      try {
        setLoadingCotizacion(true);
        const res = await fetch(DOLAR_API_URL);
        const data = await res.json();
        setCotizacion(data.venta);
      } catch (err) {
        setErrorCotizacion('No se pudo obtener la cotización');
      } finally {
        setLoadingCotizacion(false);
      }
    }
    fetchDolar();
  }, []);

  useEffect(() => {
    fetchProduct();
    fetchCart();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/products/${id}`);
      
      if (!response.ok) {
        throw new Error('Producto no encontrado');
      }
      
      const data = await response.json();
      setProduct(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
      // Obtener historial
      const historyRes = await fetch(`${API_URL}/api/carts/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const history = await historyRes.json();
      if (!historyRes.ok) throw new Error(history.error || 'Error al obtener historial de carritos');

      // Buscar carrito abierto
      const carritoAbierto = history.find(c => c.status === 'abierto');

      // Obtener productos del carrito abierto
      if (carritoAbierto) {
        const cartRes = await fetch(`${API_URL}/api/carts/${carritoAbierto._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const cartProducts = await cartRes.json();
        if (!cartRes.ok) throw new Error(cartProducts.error || 'Error al obtener productos del carrito');

        // Mapear cantidades
        const items = {};
        for (const p of cartProducts) {
          let prodId = p.productId;
          if (typeof prodId === 'object' && prodId !== null) {
            prodId = prodId._id || prodId.id || prodId.toString();
          }
          if (!prodId) prodId = p._id;
          items[prodId] = p.quantity;
        }
        setCartInfo({ cartId: carritoAbierto._id, items });
      }
    } catch (err) {
      // No mostrar error si no hay carrito
    }
  };

  async function handleAddToCart() {
    if (isAdmin) {
      toast.error('Los administradores no pueden agregar productos al carrito');
      return;
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Debes iniciar sesión para agregar productos al carrito');
      return;
    }
    
    try {
      let cartId = cartInfo.cartId;
      
      // Si no hay carrito, crear uno
      if (!cartId) {
        const createRes = await fetch(`${API_URL}/api/carts`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
        const nuevoCarrito = await createRes.json();
        if (!createRes.ok) throw new Error(nuevoCarrito.error || 'Error al crear carrito');
        cartId = nuevoCarrito._id;
      }
      
      // Agregar producto
      const addRes = await fetch(`${API_URL}/api/carts/${cartId}/product/${product._id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const addData = await addRes.json();
      if (!addRes.ok) throw new Error(addData.error || 'Error al agregar producto al carrito');
      
      // Sincronizar cantidades con backend
      const cartRes = await fetch(`${API_URL}/api/carts/${cartId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const cartProducts = await cartRes.json();
      if (!cartRes.ok) throw new Error(cartProducts.error || 'Error al obtener productos del carrito');
      
      const items = {};
      for (const p of cartProducts) {
        let prodId = p.productId;
        if (typeof prodId === 'object' && prodId !== null) {
          prodId = prodId._id || prodId.id || prodId.toString();
        }
        if (!prodId) prodId = p._id;
        items[prodId] = p.quantity;
      }
      
      setCartInfo({ cartId, items });
      toast.success('Producto agregado al carrito');
    } catch (err) {
      toast.error(err.message);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando producto...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Producto no encontrado</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 pt-20">
      <ToastContainer position="top-right" autoClose={2500} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover theme="colored" />
      {/* Botón de volver */}
      <div className="absolute top-25 left-15">
        <button
          onClick={() => navigate('/products')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <FaArrowLeft /> Volver
        </button>
      </div>

      {/* Contenedor principal */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-0 w-full">
        {/* Layout responsive: mobile vertical, desktop horizontal */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="lg:grid lg:grid-cols-2 lg:gap-0">
            {/* IZQUIERDA: Galería de imágenes */}
            <div className="p-6 lg:p-8">
              <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4 max-w-lg mx-auto">
                <img
                  src={product.thumbnails[currentImageIndex] || '/placeholder-product.jpg'}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Miniaturas si hay más de una imagen */}
              {product.thumbnails && product.thumbnails.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.thumbnails.map((thumbnail, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                        currentImageIndex === index ? 'border-gray-900' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={thumbnail}
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* DERECHA: Información del producto */}
            <div className="p-6 lg:p-8 lg:border-l lg:border-gray-200">
              <div className="space-y-6">
                {/* Título y categoría */}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {product.title}
                  </h1>
                  {product.category && (
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                      {typeof product.category === 'object' && product.category.name
                        ? product.category.name
                        : product.category}
                    </span>
                  )}
                </div>

                {/* Precio en dólares y en pesos */}
                <div className="flex flex-col gap-1 mb-2">
                  <div className="text-4xl font-bold text-gray-900">
                    {loadingCotizacion
                      ? 'Cargando cotización...'
                      : errorCotizacion
                        ? errorCotizacion
                        : cotizacion
                          ? `AR$ ${(product.price * cotizacion).toLocaleString('es-AR', { minimumFractionDigits: 2 })}`
                          : 'Sin cotización'}
                  </div>
                  <div className="text-xl text-gray-700">
                    USD ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1">
                    * Los precios en pesos argentinos se calculan automáticamente según la cotización oficial y pueden variar al momento de la compra.
                  </div>
                </div>

                {/* Descripción */}
                {product.description && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Descripción
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Código y stock */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Código:</span>
                    <p className="font-semibold text-gray-900">{product.code}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Stock:</span>
                    <p className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'}
                    </p>
                  </div>
                </div>

                {/* Cantidad en carrito y controles */}
                {cartInfo.items[product._id] > 0 && (
                  <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
                    <span className="text-sm text-gray-700">En tu carrito:</span>
                    <span className="font-semibold text-gray-900">{cartInfo.items[product._id]} unidades</span>
                  </div>
                )}

                {/* Botón de compra */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`flex items-center justify-center cursor-pointer w-full py-3 px-6 rounded-lg font-semibold text-lg transition ${
                    product.stock > 0
                      ? 'bg-gray-900 text-white hover:bg-gray-800'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                    {product.stock > 0 ? (
                        <span className="flex items-center gap-1">
                          <FaShoppingCart className="text-xl mr-3"/> Agregar al carrito
                        </span>
                        ) : (
                        'Sin stock'
                    )}

                </button>

                {/* Estado del producto */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Estado:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {product.status ? 'Activo' : 'Inactivo'}
                  </span>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}