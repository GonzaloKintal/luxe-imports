import { useEffect, useState, useRef, useContext } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import ProductModal from './../components/ProductModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from '../context/UserContext';
import SearchAndFilter from '../components/products/SearchAndFilters';
import ProductList from '../components/products/ProductList';

export default function Products() {
    const [productos, setProductos] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [filtroCategoria, setFiltroCategoria] = useState('');
    const [filtroStock, setFiltroStock] = useState('all');
    const [ordenPrecio, setOrdenPrecio] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [cartInfo, setCartInfo] = useState({ cartId: null, items: {} }); // { cartId, items: { [productId]: quantity } }
    const API_URL = import.meta.env.VITE_API_URL;
    const modalRef = useRef();
    const cartCreatedRef = useRef(false); // Ref para controlar creación de carrito
    const { user } = useContext(UserContext);
    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        async function fetchProductos() {
            try {
                setLoading(true);
                const res = await fetch(`${API_URL}/api/products/`);
                if (!res.ok) throw new Error('Error al cargar productos');
                const data = await res.json();
                setProductos(data);
            } catch (err) {
                setError(err.message || 'Error desconocido');
            } finally {
                setLoading(false);
            }
        }
        fetchProductos();
    }, []);

    useEffect(() => {
        async function fetchCart() {
            const token = localStorage.getItem('token');
            if (!token) return;
            try {
                // Obtener historial
                const historyRes = await fetch(`${API_URL}/api/carts/history`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const history = await historyRes.json();
                if (!historyRes.ok) throw new Error(history.error || 'Error al obtener historial de carritos');

                // Buscar carrito en progreso o crear uno
                let carritoEnProgreso = history.find(c => c.status !== 'paid');
                if (!carritoEnProgreso && !cartCreatedRef.current) {
                    const createRes = await fetch(`${API_URL}/api/carts`, {
                        method: 'POST',
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    const nuevoCarrito = await createRes.json();
                    if (!createRes.ok) throw new Error(nuevoCarrito.error || 'Error al crear carrito');
                    carritoEnProgreso = nuevoCarrito;
                    cartCreatedRef.current = true; // Marcar que ya se creó el carrito
                }

                // Obtener productos del carrito
                if (carritoEnProgreso) {
                    const cartRes = await fetch(`${API_URL}/api/carts/${carritoEnProgreso._id}`, {
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
                    setCartInfo({ cartId: carritoEnProgreso._id, items });
                }
            } catch (err) {
                // No mostrar error si no hay carrito
            }
        }
        fetchCart();
    }, [productos]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setProductoSeleccionado(null);
            }
        }

        if (productoSeleccionado) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [productoSeleccionado]);

    function handleAddToCart(producto) {
        // Por ahora sin acción
        alert(`Agregar al carrito: ${producto.title}`);
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen text-gray-700 dark:text-gray-300">
                Cargando productos...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen text-red-600 dark:text-red-400">
                {error}
            </div>
        );
    }

    async function handleAddToCart(producto) {
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
        const addRes = await fetch(`${API_URL}/api/carts/${cartId}/product/${producto._id}`, {
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

    async function handleRemoveFromCart(producto) {
        if (isAdmin) {
            toast.error('Los administradores no pueden quitar productos del carrito');
            return;
        }
        const token = localStorage.getItem('token');
        const cantidadActual = cartInfo.items[producto._id] || 0;
        if (!token || !cartInfo.cartId || cantidadActual < 1) return;
    try {
        if (cantidadActual === 1) {
            // Eliminar producto del carrito
            const res = await fetch(`${API_URL}/api/carts/${cartInfo.cartId}/product/${producto._id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al quitar producto');
        } else {
            const nuevaCantidad = cantidadActual - 1;
            const res = await fetch(`${API_URL}/api/carts/${cartInfo.cartId}/product/${producto._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quantity: nuevaCantidad }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al actualizar cantidad');
        }
        // Sincronizar cantidades con backend
        const cartRes = await fetch(`${API_URL}/api/carts/${cartInfo.cartId}`, {
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
        setCartInfo({ cartId: cartInfo.cartId, items });
        toast.success('Cantidad actualizada');
    } catch (err) {
        toast.error(err.message);
    }
    }

    // Filtro y búsqueda
    let productosFiltrados = productos
        .filter(producto => producto.status)
        .filter(producto =>
            producto.title.toLowerCase().includes(busqueda.toLowerCase())
        )
        .filter(producto =>
            filtroCategoria ? producto.category === filtroCategoria : true
        )
        .filter(producto =>
            filtroStock === 'all' ? true : filtroStock === 'in' ? Number(producto.stock) > 0 : Number(producto.stock) <= 0
        );

    if (ordenPrecio === 'asc') {
        productosFiltrados = productosFiltrados.slice().sort((a, b) => a.price - b.price);
    } else if (ordenPrecio === 'desc') {
        productosFiltrados = productosFiltrados.slice().sort((a, b) => b.price - a.price);
    }

    return (
        <main className="bg-gray-100 px-0 pt-12 relative overflow-hidden">
            
            <ToastContainer position="top-right" autoClose={2500} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover theme="colored" />
            <div className="relative z-10 px-6 py-20">
                <h1 className="text-5xl font-extrabold text-black mb-10 text-center animate-fadeInDown drop-shadow-lg">
                    Nuestros Productos
                </h1>

                {/* Barra de búsqueda y filtros */}
                <SearchAndFilter 
                    productos={productos}
                    busqueda={busqueda}
                    setBusqueda={setBusqueda}
                    filtroCategoria={filtroCategoria}
                    setFiltroCategoria={setFiltroCategoria}
                    filtroStock={filtroStock}
                    setFiltroStock={setFiltroStock}
                    ordenPrecio={ordenPrecio}
                    setOrdenPrecio={setOrdenPrecio}
                    productosFiltrados={productosFiltrados}
                />

                {/* Lista de productos */}
                <ProductList
                    productos={productosFiltrados}
                    cartInfo={cartInfo}
                    isAdmin={isAdmin}
                    onAddToCart={handleAddToCart}
                    onRemoveFromCart={handleRemoveFromCart}
                    onSelectProduct={setProductoSeleccionado}
                />

                {/* Modal */}
                {productoSeleccionado && (
                    <ProductModal
                        producto={productoSeleccionado}
                        onClose={() => setProductoSeleccionado(null)}
                        onAddToCart={handleAddToCart}
                        ref={modalRef}
                    />
                )}
            </div>
        </main>
    );
}
