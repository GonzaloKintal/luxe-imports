import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
  
  // Contexto del carrito para actualizar el indicador en tiempo real
  const { setCart } = useContext(CartContext);
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

  useEffect(() => {
    if (product && product.status === false) {
      // Redirigir automáticamente a /products después de un breve delay
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
      // Obtener historial
      const historyRes = await fetch(`${API_URL}/api/carts/history?limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const history = await historyRes.json();
      if (!historyRes.ok) throw new Error(history.error || 'Error al obtener historial de carritos');

      // Obtener los carritos del array results
      const carritos = history.results || [];
      // Buscar carrito abierto
      const carritoAbierto = carritos.find(c => c.status === 'abierto');

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

  // Función para actualizar el contexto del carrito con productos completos
  async function updateCartContext(cartId) {
    try {
      const token = localStorage.getItem('token');
      if (!cartId || !token) return;

      // Obtener productos del carrito
      const cartRes = await fetch(`${API_URL}/api/carts/${cartId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const cartProducts = await cartRes.json();
      if (!cartRes.ok) return;

      // Obtener detalles completos de cada producto
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

      // Filtrar productos válidos y actualizar contexto
      const productosValidos = productosConDetalles.filter(p => p !== null);
      setCart(productosValidos);
    } catch (err) {
      console.error('Error al actualizar contexto del carrito:', err);
    }
  }

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
      // Si no hay carrito, crear uno o obtener el existente
      if (!cartId) {
        const createRes = await fetch(`${API_URL}/api/carts`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
        const nuevoCarrito = await createRes.json();
        
        if (!createRes.ok) {
          // Si el error es 409 (ya existe carrito), obtener el carrito existente del historial
          if (createRes.status === 409) {
            const historyRes = await fetch(`${API_URL}/api/carts/history?limit=100`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const history = await historyRes.json();
            if (!historyRes.ok) throw new Error(history.error || 'Error al obtener historial de carritos');
            
            // Obtener los carritos del array results
            const carritos = history.results || [];
            const carritoAbierto = carritos.find(c => c.status === 'abierto');
            if (!carritoAbierto) {
              throw new Error('No se encontró carrito abierto');
            }
            cartId = carritoAbierto._id;
          } else {
            throw new Error(nuevoCarrito.error || 'Error al crear carrito');
          }
        } else {
          cartId = nuevoCarrito._id;
        }
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
      
      // Actualizar el contexto del carrito para el indicador en tiempo real
      await updateCartContext(cartId);
      
      toast.success('Producto agregado al carrito');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingAddToCart(false);
    }
  }

  if (loading) {
    return <ProductDetailSkeleton />;
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

  // Si el producto está inactivo, mostrar mensaje y bloquear botón
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