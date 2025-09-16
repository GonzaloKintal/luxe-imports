

import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from '../context/UserContext';
import ProductImageGallery from '../components/product-detail/images/ProductImageGallery';
import ProductInfo from '../components/product-detail/info/ProductInfo';

export default function ProductDetail() {
  const API_URL = import.meta.env.VITE_API_URL;
  const DOLAR_API_URL = import.meta.env.VITE_DOLAR_API_URL;
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartInfo, setCartInfo] = useState({ cartId: null, items: {} });
  const [cotizacion, setCotizacion] = useState(null);
  const [loadingCotizacion, setLoadingCotizacion] = useState(true);
  const [errorCotizacion, setErrorCotizacion] = useState(null);
  const [loadingAddToCart, setLoadingAddToCart] = useState(false);
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
    setLoadingAddToCart(true);
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
    } finally {
      setLoadingAddToCart(false);
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
    <div className="min-h-screen bg-gray-50 flex flex-col py-8 pt-20">
      <ToastContainer 
        position="top-right" 
        autoClose={2500} 
        hideProgressBar={false} 
        newestOnTop 
        closeOnClick 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
        theme="colored" 
      />
      
      {/* Botón de volver */}
      <div className="w-full px-4 sm:px-6 lg:px-8 mt-6 mb-4">
        <button
          onClick={() => navigate('/products')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <FaArrowLeft /> Volver
        </button>
      </div>

      {/* Contenedor principal */}
      <div className="flex-grow flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-0 w-full">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="lg:grid lg:grid-cols-2 lg:gap-0">
              
              {/* Galería de imágenes */}
              <ProductImageGallery 
                thumbnails={product.thumbnails}
                title={product.title}
              />
              
              {/* Información del producto */}
              <ProductInfo
                product={product}
                cartInfo={cartInfo}
                cotizacion={cotizacion}
                loadingCotizacion={loadingCotizacion}
                errorCotizacion={errorCotizacion}
                loadingAddToCart={loadingAddToCart}
                onAddToCart={handleAddToCart}
              />
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}