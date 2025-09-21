
import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { UserContext } from '../context/UserContext.jsx';
import ActualCart from '../components/cart/actual-cart/ActualCart.jsx';
import CartHistory from '../components/cart/history-orders/CartHistory.jsx';
import CartSkeleton from '../components/cart/CartSkeleton.jsx';
import 'react-toastify/dist/ReactToastify.css';
import { CartContext } from '../context/CartContext.jsx';

export default function Cart() {
    const navigate = useNavigate();
    const { user, isLoading } = useContext(UserContext);
    const [cartId, setCartId] = useState(null);
    const { cart, setCart } = useContext(CartContext);
    // Inicializar products con el contexto del carrito para evitar parpadeo
    const [products, setProducts] = useState(cart || []);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem('token');
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        window.scrollTo(0, 0);
    });

    useEffect(() => {
        // No hacer nada mientras el UserContext está cargando
        if (isLoading) return;
        
        // Redirigir si no hay usuario o si es admin
        if (!user || user.role === 'admin') {
            navigate('/');
            return;
        }

        if (!token) {
            setError('Debes iniciar sesión para ver el carrito');
            setLoading(false);
            return;
        }

        async function fetchProductDetails(productsInCart) {
            // Obtener detalles de cada producto con su productId
            const detalles = await Promise.all(
                productsInCart.map(async ({ productId, quantity }) => {
                    // Si productId es un objeto, extrae el _id
                    let prodId;
                    if (typeof productId === 'object' && productId !== null) {
                        prodId = productId._id || productId.id || productId.toString();
                    } else {
                        prodId = productId;
                    }
                    const res = await fetch(`${API_URL}/api/products/${prodId}`);
                    if (!res.ok) throw new Error('Error al cargar producto ' + prodId);
                    const product = await res.json();
                    return { ...product, quantity };
                })
            );
            return detalles;
        }

        async function initCart() {
            try {
                setLoading(true);
                setError(null);

                // Obtener carrito activo (esto también creará uno si no existe)
                const activeCartRes = await fetch(`${API_URL}/api/carts/active`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` },
                });
                const activeCart = await activeCartRes.json();

                if (!activeCartRes.ok) throw new Error(activeCart.error || 'Error al obtener carrito activo');

                const carritoId = activeCart._id;
                setCartId(carritoId);

                // Obtener productos (ids y cantidades) del carrito
                const productosRes = await fetch(`${API_URL}/api/carts/${carritoId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const productosInCart = await productosRes.json();
                if (!productosRes.ok) throw new Error(productosInCart.error || 'Error al cargar carrito');

                // Obtener detalles completos de productos y añadir cantidades
                const productosConDetalles = await fetchProductDetails(productosInCart);

                setProducts(productosConDetalles);
                setCart(productosConDetalles); // Usar la función updateCart del contexto
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        initCart();
    }, [token, user, navigate, API_URL, isLoading]);

    // Sincronizar cambios locales en products con el CartContext para actualizar indicador en tiempo real
    useEffect(() => {
        // Solo actualizar si products ha cambiado realmente y no está vacío por carga inicial
        if (products.length > 0 || cart.length === 0) {
            setCart(products);
        }
    }, [products, setCart]);

    // NO resetear el contexto del carrito al montar el componente
    // El contexto debe preservarse durante la navegación

    // Mostrar skeleton mientras UserContext está cargando O mientras se cargan los datos del carrito
    if (isLoading || loading) {
        return <CartSkeleton />;
    }

    return (
        <main className="bg-white px-0 pt-12 relative overflow-hidden min-h-screen text-black">
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

            <div className="relative z-10 px-6 py-20 max-w-7xl mx-auto">
                <h1 className="text-4xl font-extrabold text-black mb-10 text-center animate-fadeInDown drop-shadow-lg">
                    Tu Carrito
                </h1>

                {error && (
                    <p className="text-red-600 text-center mb-4">{error}</p>
                )}

                <ActualCart
                    products={products}
                    setProducts={setProducts}
                    cartId={cartId}
                    setCartId={setCartId}
                    token={token}
                    userInfo={user}
                    API_URL={API_URL}
                />

                <CartHistory
                    token={token}
                    API_URL={API_URL}
                />
            </div>
        </main>
    );
}