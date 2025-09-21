import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";
import { useNotify } from "../components/ToastProvider";
import { UserContext } from '../context/UserContext';
import { CartContext } from '../context/CartContext';
import ProductImageGallery from '../components/product-detail/images/ProductImageGallery';
import ProductInfo from '../components/product-detail/info/ProductInfo';
import ProductDetailSkeleton from '../components/product-detail/ProductDetailSkeleton';

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
  
  const { setCart } = useContext(CartContext);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const isAdmin = user?.role === 'admin'; 
  const notify = useNotify();

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

  useEffect(() => {
    if (product && product.status === false) {
      setTimeout(() => {
        navigate('/products');
      }, 5000);
    }
  }, [product, navigate]);

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
      const pendingRes = await fetch(`${API_URL}/api/carts/history/pending?limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const pending = await pendingRes.json();
      if (!pendingRes.ok) throw new Error(pending.error || 'Error al obtener historial pendiente');
      
      const carritoAbierto = pending.results?.find(c => c.status === 'abierto' || c.status === 'pendiente');

      if (carritoAbierto) {
        const cartRes = await fetch(`${API_URL}/api/carts/${carritoAbierto._id}`, {
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
        setCartInfo({ cartId: carritoAbierto._id, items });
      }
    } catch (err) {}
  };

  async function updateCartContext(cartId) {
    try {
      const token = localStorage.getItem('token');
      if (!cartId || !token) return;

      const cartRes = await fetch(`${API_URL}/api/carts/${cartId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const cartProducts = await cartRes.json();
      if (!cartRes.ok) return;

      const productosConDetalles = await Promise.all(
        cartProducts.map(async ({ productId, quantity }) => {
          let prodId;
          if (typeof productId === 'object' && productId !== null) {
            prodId = productId._id || productId.id || productId.toString();
          } else {
            prodId = productId;
          }
          try {
            const res = await fetch(`${API_URL}/api/products/${prodId}`);
            if (!res.ok) return null;
            const product = await res.json();
            return { ...product, quantity };
          } catch {
            return null;
          }
        })
      );

      const productosValidos = productosConDetalles.filter(p => p !== null);
      setCart(productosValidos);
    } catch (err) {
      console.error('Error al actualizar contexto del carrito:', err);
    }
  }

  async function handleAddToCart() {
    if (isAdmin) {
      notify.error('Los administradores no pueden agregar productos al carrito');
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      notify.error('Debes iniciar sesión para agregar productos al carrito');
      return;
    }
    setLoadingAddToCart(true);
    try {
      const activeCartRes = await fetch(`${API_URL}/api/carts/active`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const activeCart = await activeCartRes.json();
      if (!activeCartRes.ok) throw new Error(activeCart.error || 'Error al obtener carrito activo');
      
      const cartId = activeCart._id;
      
      const addRes = await fetch(`${API_URL}/api/carts/${cartId}/product/${product._id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const addData = await addRes.json();
      if (!addRes.ok) throw new Error(addData.error || 'Error al agregar producto al carrito');

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
      
      await updateCartContext(cartId);
      
      notify.success('Producto agregado al carrito');
    } catch (err) {
      notify.error(err.message);
    } finally {
      setLoadingAddToCart(false);
    }
  }

  if (loading) return <ProductDetailSkeleton />;

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

  if (product && product.status === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Producto inactivo</h2>
          <p className="text-gray-700 mb-2">Este producto no está disponible para la venta.</p>
          <p className="text-gray-500">Serás redirigido automáticamente al listado de productos.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col py-8 pt-20">
      
      <div className="w-full px-4 sm:px-6 lg:px-8 mt-6 mb-4">
        <button
          onClick={() => navigate('/products')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <FaArrowLeft /> Volver
        </button>
      </div>

      <div className="flex-grow flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-0 w-full">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="lg:grid lg:grid-cols-2 lg:gap-0">
              
              <ProductImageGallery 
                thumbnails={product.thumbnails}
                title={product.title}
              />
              
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