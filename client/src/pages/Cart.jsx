import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext.jsx';
import ActualCart from '../components/cart/actual-cart/ActualCart.jsx';
import CartHistory from '../components/cart/history-orders/CartHistory.jsx';
import CartSkeleton from '../components/cart/CartSkeleton.jsx';
import 'react-toastify/dist/ReactToastify.css';
import { CartContext } from '../context/CartContext.jsx';
import { useNotify } from "../components/common/ToastProvider.jsx";
import { useAuthFetch } from "../hooks/useAuthFetch";

export default function Cart() {
    const navigate = useNavigate();
    const { user, isLoading } = useContext(UserContext);
    const [cartId, setCartId] = useState(null);
    const { cart, setCart } = useContext(CartContext);
    const [products, setProducts] = useState(cart || []);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem('token');
    const API_URL = import.meta.env.VITE_API_URL;
    const notify = useNotify();
    const { authFetch } = useAuthFetch();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (isLoading) return;

        if (!user || user.role === 'admin') {
            notify.warning("Redirigiendo a la página principal");
            navigate('/');
            return;
        }

        if (!token) {
            setError('Debes iniciar sesión para ver el carrito');
            setLoading(false);
            notify.error("Debes iniciar sesión para ver el carrito");
            return;
        }

        async function fetchProductDetails(productsInCart) {
            const detalles = await Promise.all(
                productsInCart.map(async ({ productId, quantity }) => {
                    let prodId;
                    if (typeof productId === 'object' && productId !== null) {
                        prodId = productId._id || productId.id || productId.toString();
                    } else {
                        prodId = productId;
                    }
                    const res = await authFetch(`${API_URL}/api/products/${prodId}`);
                    if (!res || !res.ok) throw new Error('Error al cargar producto ' + prodId);
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

                const activeCartRes = await authFetch(`${API_URL}/api/carts/current`);
                if (!activeCartRes) {
                    // token expirado → el modal ya lo maneja useAuthFetch
                    setLoading(false);
                    return;
                }

                if (activeCartRes.status === 404) {
                    setError('No tenés un carrito activo');
                    setProducts([]);
                    setLoading(false);
                    return;
                }

                if (!activeCartRes.ok) {
                    const body = await activeCartRes.json();
                    throw new Error(body.error || 'Error al obtener carrito activo');
                }

                const activeCart = await activeCartRes.json();
                const carritoId = activeCart._id;
                setCartId(carritoId);

                const productosRes = await authFetch(`${API_URL}/api/carts/${carritoId}`);
                if (!productosRes) {
                    setLoading(false);
                    return;
                }

                if (!productosRes.ok) {
                    const errorBody = await productosRes.json();
                    throw new Error(errorBody.error || 'Error al cargar carrito');
                }

                const productosInCart = await productosRes.json();
                const productosConDetalles = await fetchProductDetails(productosInCart);

                setProducts(productosConDetalles);
                setCart(productosConDetalles);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        initCart();
    }, [token, user, navigate, API_URL, isLoading]);

    useEffect(() => {
        if (products.length > 0 || cart.length === 0) {
            setCart(products);
        }
    }, [products, setCart]);

    if (isLoading || loading) {
        return <CartSkeleton />;
    }

    return (
        <main className="bg-white px-0 pt-12 relative overflow-hidden min-h-screen text-black">
            <div className="relative z-10 px-6 py-10 sm:py-20 max-w-7xl mx-auto">
                <h1 className="text-4xl font-extrabold text-black mb-10 text-center animate-fadeInDown drop-shadow-lg">
                    Tu Carrito
                </h1>

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
