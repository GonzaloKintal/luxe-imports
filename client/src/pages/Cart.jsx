import { useEffect, useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { UserContext } from '../context/UserContext.jsx';
import { FaWhatsapp } from 'react-icons/fa';
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';

export default function Cart() {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const [cartId, setCartId] = useState(null);
    const [products, setProducts] = useState([]);
    const [historialCarritos, setHistorialCarritos] = useState([]);
    const [historialVisible, setHistorialVisible] = useState(false);
    const [expandedHistorial, setExpandedHistorial] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [adminPhone, setAdminPhone] = useState('');
    const [adminName, setAdminName] = useState('');
    const token = localStorage.getItem('token');
    const API_URL = import.meta.env.VITE_API_URL;
    const cartCreatedRef = useRef(false); // Ref para controlar creación de carrito
	
	const [userInfo, setUserInfo] = useState(null);

	useEffect(() => {
	    async function fetchUserInfo() {
		try {
		    const res = await fetch(`${API_URL}/api/users/me`, {
		        headers: { Authorization: `Bearer ${token}` },
		    });
		    const data = await res.json();
		    if (!res.ok) throw new Error(data.error || 'Error al obtener info del usuario');
		    setUserInfo(data);
		} catch (err) {
		    console.error("Error al obtener /me:", err);
		}
	    }

	    if (token) fetchUserInfo();
	}, [token, API_URL]);


    useEffect(() => {
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

                // Obtener historial para buscar carrito in_progress
                const historyRes = await fetch(`${API_URL}/api/carts/history`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const history = await historyRes.json();
                if (!historyRes.ok) throw new Error(history.error || 'Error al obtener historial');

                let carritoAbierto = history.find((c) => c.status === 'abierto');
                let carritoId;

                if (carritoAbierto) {
                    carritoId = carritoAbierto._id;
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
                } else {
                    setProducts([]);
                    setError('No tienes un carrito abierto.');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        initCart();
    }, [token, user, navigate]);

    useEffect(() => {
        async function fetchAdminInfo() {
            try {
                const res = await fetch(`${API_URL}/api/admin/admin-info`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (res.ok && data.telefono) {
                    setAdminPhone(data.telefono);
                    setAdminName(data.nombre || 'Luxe Imports');
                }
            } catch (err) {
                console.error('Error al obtener admin-info:', err);
            }
        }
        if (products.length && token) fetchAdminInfo();
    }, [products.length, token, API_URL]);

    const total = products.reduce((acc, p) => acc + (p.price || 0) * p.quantity, 0);

    async function handleAddToCart(product) {
        if (!token || !cartId) return;
        try {
            const res = await fetch(`${API_URL}/api/carts/${cartId}/product/${product._id}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al agregar producto');
            setProducts(prev => prev.map(p => p._id === product._id ? { ...p, quantity: p.quantity + 1 } : p));
            toast.success('Producto agregado al carrito');
        } catch (err) {
            toast.error(err.message);
        }
    }

    async function handleRemoveFromCart(product) {
        if (!token || !cartId || product.quantity === 0) return;
        try {
            if (product.quantity > 1) {
                // PUT para actualizar cantidad
                const res = await fetch(`${API_URL}/api/carts/${cartId}/product/${product._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ quantity: product.quantity - 1 })
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Error al descontar producto');
                setProducts(prev => prev.map(p => p._id === product._id ? { ...p, quantity: p.quantity - 1 } : p));
                toast.success('Cantidad actualizada');
            } else {
                // DELETE para eliminar producto
                const res = await fetch(`${API_URL}/api/carts/${cartId}/product/${product._id}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Error al quitar producto');
                // Actualizar productos en frontend
                setProducts(prev => {
                    const updated = prev.filter(p => p._id !== product._id);
                    // Si no quedan productos, eliminar el carrito
                    if (updated.length === 0) {
                        fetch(`${API_URL}/api/carts/${cartId}`, {
                            method: 'DELETE',
                            headers: { Authorization: `Bearer ${token}` },
                        })
                            .then(() => {
                                setCartId(null);
                                toast.info('El carrito fue eliminado porque quedó vacío.');
                            });
                    }
                    return updated;
                });
                toast.success('Producto quitado del carrito');
            }
        } catch (err) {
            toast.error(err.message);
        }
    }

    // Nueva función para productos inactivos o sin stock
    async function handleRemoveInactiveOrNoStock(product) {
        if (!token || !cartId || product.quantity === 0) return;
        try {
            // DELETE para eliminar producto
            const res = await fetch(`${API_URL}/api/carts/${cartId}/product/${product._id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al quitar producto');
            setProducts(prev => prev.filter(p => p._id !== product._id));
            toast.success('Producto quitado del carrito');
        } catch (err) {
            toast.error(err.message);
        }
    }

    async function cargarHistorial() {
        try {
            setError(null);
            const res = await fetch(`${API_URL}/api/carts/history`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al obtener historial');
            const confirmados = data.filter(c => c.status === 'confirmado');
            const pendientes = data.filter(c => c.status === 'pendiente de confirmacion');

            // Detalles para confirmados
            const confirmadosConDetalles = await Promise.all(
                confirmados.map(async (carrito) => {
                    const productos = await Promise.all(
                        (carrito.products || []).map(async ({ productId, quantity }) => {
                            let prodId = productId;
                            if (typeof prodId === 'object' && prodId !== null) {
                                prodId = prodId._id || prodId.id || prodId.toString();
                            }
                            const res = await fetch(`${API_URL}/api/products/${prodId}`);
                            if (!res.ok) return { title: 'Producto eliminado', price: 0, quantity };
                            const prod = await res.json();
                            return { ...prod, quantity };
                        })
                    );
                    return { ...carrito, productos };
                })
            );

            // Detalles para pendientes
            const pendientesConDetalles = await Promise.all(
                pendientes.map(async (carrito) => {
                    const productos = await Promise.all(
                        (carrito.products || []).map(async ({ productId, quantity }) => {
                            let prodId = productId;
                            if (typeof prodId === 'object' && prodId !== null) {
                                prodId = prodId._id || prodId.id || prodId.toString();
                            }
                            const res = await fetch(`${API_URL}/api/products/${prodId}`);
                            if (!res.ok) return { title: 'Producto eliminado', price: 0, quantity };
                            const prod = await res.json();
                            return { ...prod, quantity };
                        })
                    );
                    return { ...carrito, productos };
                })
            );

            setHistorialCarritos({ confirmados: confirmadosConDetalles, pendientes: pendientesConDetalles });
            setHistorialVisible(true);
        } catch (err) {
            setError(err.message);
        }
    }

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-white">
                <p className="text-gray-600">Cargando carrito...</p>
            </main>
        );
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

                {products.length ? (
                    <>
                        <div className="mb-4 flex items-center justify-start gap-2 max-w-3xl mx-auto animate-fadeInDown">
                            {(() => {
                                let phone = adminPhone ? adminPhone.replace(/\D/g, '') : '';
                                if (phone && !phone.startsWith('549')) {
                                    if (phone.startsWith('54')) {
                                        phone = '549' + phone.slice(2);
                                    } else {
                                        phone = '549' + phone;
                                    }
                                }
                                const whatsappLink = `https://api.whatsapp.com/send?phone=${phone}`;
                                return (
                                    <a
                                        href={whatsappLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 transition-all duration-200 hover:scale-105 hover:text-green-700"
                                        title="Contactar por WhatsApp"
                                    >
                                        <span className="font-bold text-black text-lg transition-all duration-200">Luxe Imports</span>
                                        <FaWhatsapp className="text-green-500 text-xl transition-all duration-200 group-hover:text-green-700" />
                                    </a>
                                );
                            })()}
                        </div>
                        <div className="max-w-3xl mx-auto bg-white border border-gray-300 rounded shadow p-4">
                            <div className="flex flex-col gap-6">
                                {products.map((p) => (
                                    <div
                                        key={p._id}
                                        className="animate-fadeInDown flex flex-col sm:flex-row items-center gap-4 justify-between border-b border-gray-200 pb-4 last:border-b-0"
                                    >
                                        <img
                                            src={p.thumbnails?.[0] || 'https://placehold.co/120x120'}
                                            alt={p.title}
                                            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-md shadow-md flex-shrink-0 bg-gray-200 mx-auto sm:mx-0"
                                        />
                                        <div className="flex-1 min-w-0 w-full">
                                            <h2 className="font-semibold text-lg text-black truncate">{p.title}</h2>
                                            <p className="text-gray-800 text-sm">
                                                Precio: ${typeof p.price === 'number' ? p.price.toFixed(2) : 'N/A'}
                                            </p>
                                            {(p.stock === 0 || p.status === false) && (
                                                <div className="mt-2 flex gap-2 items-center">
                                                    {p.stock === 0 && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-300 text-black text-xs font-bold shadow">
                                                            Sin stock
                                                        </span>
                                                    )}
                                                    {p.status === false && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-400 text-white text-xs font-bold shadow">
                                                            Producto inactivo
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-row items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
                                            {(p.stock === 0 || p.status === false) ? (
                                                <button
                                                    onClick={() => handleRemoveInactiveOrNoStock(p)}
                                                    className="bg-gray-300 hover:bg-gray-500 text-black hover:text-white px-3 py-2 rounded-full shadow-md"
                                                    title="Eliminar producto"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                </button>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => handleRemoveFromCart(p)}
                                                        className="rounded-full bg-black hover:bg-gray-800 text-white h-9 w-9 flex items-center justify-center shadow-md transition-all duration-200"
                                                        title={p.quantity > 1 ? "Quitar uno" : "Eliminar producto"}
                                                    >
                                                        {p.quantity > 1 ? '–' : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>}
                                                    </button>
                                                    <span className="font-bold text-black bg-gray-200 border border-gray-400 rounded-full px-3 py-2 text-base shadow-sm text-center min-w-[40px]">
                                                        {p.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleAddToCart(p)}
                                                        className="rounded-full bg-black hover:bg-gray-800 text-white h-9 w-9 flex items-center justify-center shadow-md transition-all duration-200"
                                                        title="Agregar uno"
                                                    >
                                                        +
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                        <span className="px-2 font-semibold text-black text-base">
                                            ${(p.price * p.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="animate-fadeInDown mt-8 flex justify-between items-center max-w-3xl mx-auto">
                            <p className="text-xl font-bold text-black">Total: ${total.toFixed(2)}</p>
                            <button
                                onClick={async () => {
                                    try {
                                        // Confirmar el pago con el backend
                                        const res = await fetch(`${API_URL}/api/carts/${cartId}/confirm-request`, {
                                            method: 'POST',
                                            headers: { Authorization: `Bearer ${token}` },
                                        });
                                        const data = await res.json();
                                        if (!res.ok) throw new Error(data.error || 'Error al solicitar confirmación de compra. Por favor, refresca la página e intenta nuevamente.');

                                        // SweetAlert antes de derivar a WhatsApp
                                        await Swal.fire({
                                            title: '¡Compra realizada con éxito!',
                                            text: 'Tu compra ha sido procesada correctamente y ya está disponible en tu historial de compras. Ahora serás derivado al WhatsApp del vendedor para coordinar la entrega o pago.',
                                            icon: 'success',
                                            confirmButtonText: 'Continuar',
                                            confirmButtonColor: '#25D366',
                                        });

                                        toast.success('Compra realizada con éxito');

                                        // Preparar mensaje de WhatsApp
                                        const productos = products
                                            .map(p => `- ${p.title} x${p.quantity} ($${(p.price * p.quantity).toFixed(2)})`)
                                            .join('%0A'); // salto de línea en URL



					let nombreUsuario = userInfo?.nombre || userInfo?.email || 'Cliente';


                                        const mensaje = `Hola, mi nombre es ${nombreUsuario}, acabo de realizar una compra:%0A${productos}%0A%0AMuchas gracias`;

                                        // Usar el número dinámico del admin
                                        let phone = adminPhone ? adminPhone.replace(/\D/g, '') : '';
                                        if (phone && !phone.startsWith('549')) {
                                            if (phone.startsWith('54')) {
                                                phone = '549' + phone.slice(2);
                                            } else {
                                                phone = '549' + phone;
                                            }
                                        }
                                        const url = `https://wa.me/${phone}?text=${mensaje}`;

                                        // Limpiar carrito en frontend
                                        setProducts([]);
                                        setCartId(null);

                                        // Abrir WhatsApp en nueva pestaña
                                        window.open(url, '_blank');
                                    } catch (err) {
                                        toast.error(err.message);
                                    }
                                }}
                                className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded font-semibold"
                            >
                                Procesar Compra
                            </button>

                        </div>
                    </>
                ) : (
                    <p className="animate-fadeInDown text-center text-gray-600">Tu carrito actual está vacío.</p>
                )}

                <div className="animate-fadeInDown mt-10 text-center max-w-3xl mx-auto">
                    {!historialVisible ? (
                        <button
                            onClick={cargarHistorial}
                            className="text-black underline font-medium"
                        >
                            Ver historial de compras
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={() => setHistorialVisible(false)}
                                className="animate-fadeInDown text-black underline font-medium mb-4"
                            >
                                Ocultar historial
                            </button>
                            <h2 className="animate-fadeInDown text-xl font-semibold mt-4 mb-4 text-black">Compras Confirmadas</h2>
                            {historialCarritos.confirmados && historialCarritos.confirmados.length ? (
                                <ul className="animate-fadeInDown space-y-4">
                                    {historialCarritos.confirmados.map((carrito) => {
                                        const id = carrito._id || carrito.id;
                                        const expanded = expandedHistorial[id];
                                        return (
                                            <li
                                                key={id}
                                                className="bg-white border border-gray-300 p-4 rounded shadow"
                                            >
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="text-black font-semibold">ID Pedido: {id}</p>
                                                        <p className="text-sm text-gray-600">Productos: {carrito.products?.length || carrito.productos?.length || 0}</p>
                                                        <p className="text-sm text-gray-600">Estado: {carrito.status}</p>
                                                        {carrito.paidAt && (
                                                            <p className="text-sm text-gray-600">Confirmado: {new Date(carrito.paidAt).toLocaleString()}</p>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => setExpandedHistorial(e => ({ ...e, [id]: !expanded }))}
                                                        className="ml-4 px-3 py-1 rounded bg-gray-200 text-black text-sm font-medium"
                                                    >
                                                        {expanded ? 'Cerrar' : 'Ver productos'}
                                                    </button>
                                                </div>
                                                {expanded && (
                                                    <ul className="mt-4 space-y-2">
                                                        {(carrito.productos || []).map((p, idx) => (
                                                            <li key={p._id || idx} className="flex items-center gap-3 border-b border-gray-300 pb-2">
                                                                <img
                                                                    src={p.thumbnails?.[0] || 'https://placehold.co/80x80'}
                                                                    alt={p.title}
                                                                    className="w-12 h-12 object-cover rounded-md shadow bg-gray-200 flex-shrink-0"
                                                                />
                                                                <span className="font-semibold text-black truncate">{p.title}</span>
                                                                <span className="ml-2 text-gray-700">x{p.quantity}</span>
                                                                <span className="ml-2 text-gray-700">${typeof p.price === 'number' ? p.price.toFixed(2) : 'N/A'}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : (
                                <p className="text-gray-600">No hay compras confirmadas.</p>
                            )}
                            <h2 className="animate-fadeInDown text-xl font-semibold mt-8 mb-4 text-black">Compras Pendientes de Confirmación</h2>
                            {historialCarritos.pendientes && historialCarritos.pendientes.length ? (
                                <ul className="animate-fadeInDown space-y-4">
                                    {historialCarritos.pendientes.map((carrito) => {
                                        const id = carrito._id || carrito.id;
                                        const expanded = expandedHistorial[id];
                                        return (
                                            <li
                                                key={id}
                                                className="bg-white border border-gray-300 p-4 rounded shadow"
                                            >
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="text-black font-semibold">ID Pedido: {id}</p>
                                                        <p className="text-sm text-gray-600">Productos: {carrito.products?.length || carrito.productos?.length || 0}</p>
                                                        <p className="text-sm text-gray-600">Estado: {carrito.status}</p>
                                                        {carrito.paidAt && (
                                                            <p className="text-sm text-gray-600">Confirmado: {new Date(carrito.paidAt).toLocaleString()}</p>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => setExpandedHistorial(e => ({ ...e, [id]: !expanded }))}
                                                        className="ml-4 px-3 py-1 rounded bg-gray-200 text-black text-sm font-medium"
                                                    >
                                                        {expanded ? 'Cerrar' : 'Ver productos'}
                                                    </button>
                                                </div>
                                                {expanded && (
                                                    <ul className="mt-4 space-y-2">
                                                        {(carrito.productos || []).map((p, idx) => (
                                                            <li key={p._id || idx} className="flex items-center gap-3 border-b border-gray-300 pb-2">
                                                                <img
                                                                    src={p.thumbnails?.[0] || 'https://placehold.co/80x80'}
                                                                    alt={p.title}
                                                                    className="w-12 h-12 object-cover rounded-md shadow bg-gray-200 flex-shrink-0"
                                                                />
                                                                <span className="font-semibold text-black truncate">{p.title}</span>
                                                                <span className="ml-2 text-gray-700">x{p.quantity}</span>
                                                                <span className="ml-2 text-gray-700">${typeof p.price === 'number' ? p.price.toFixed(2) : 'N/A'}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : (
                                <p className="text-gray-600">No hay compras pendientes de confirmación.</p>
                            )}
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}
