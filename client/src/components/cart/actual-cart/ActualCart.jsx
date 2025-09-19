import { useState, useEffect, useRef } from 'react';
import { io as socketIOClient } from 'socket.io-client';
import { toast } from 'react-toastify';
import { FaWhatsapp } from 'react-icons/fa';
import Swal from 'sweetalert2';
import CartItems from './CartItems';

export default function ActualCart({
    products, 
    setProducts, 
    cartId, 
    setCartId, 
    token, 
    userInfo,
    API_URL 
}) {
    // Estado de loading por producto (id: {add: bool, remove: bool, removeInactive: bool})
    const [loadingById, setLoadingById] = useState({});
    // Estado de loading para confirmar compra
    const [loadingConfirm, setLoadingConfirm] = useState(false);
    // WebSocket client setup
    const socketRef = useRef(null);
    
    const [adminPhone, setAdminPhone] = useState('');
    
    useEffect(() => {
        async function fetchAdminInfo() {
            try {
                const res = await fetch(`${API_URL}/api/admin/admin-info`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (res.ok && data.telefono) {
                    setAdminPhone(data.telefono);
                }
            } catch (err) {
                console.error('Error al obtener admin-info:', err);
            }
        }
        if (products.length && token) fetchAdminInfo();
    }, [products.length, token, API_URL]);

    // WebSocket connection and price update listener
    useEffect(() => {
        // Connect only once
        if (!socketRef.current) {
            socketRef.current = socketIOClient(API_URL);
        }
        const socket = socketRef.current;
        // Listen for priceUpdate events
        socket.on('priceUpdate', ({ productId, newPrice }) => {
            setProducts(prevProducts => prevProducts.map(p =>
                p._id === productId ? { ...p, price: newPrice } : p
            ));
        });
        // Listen for stockUpdate events
        socket.on('stockUpdate', ({ productId, newStock }) => {
            setProducts(prevProducts => prevProducts.map(p =>
                p._id === productId ? { ...p, stock: newStock } : p
            ));
        });
        // Listen for statusUpdate events
        socket.on('statusUpdate', ({ productId, newStatus }) => {
            setProducts(prevProducts => prevProducts.map(p =>
                p._id === productId ? { ...p, status: newStatus } : p
            ));
        });
        return () => {
            socket.off('priceUpdate');
            socket.off('stockUpdate');
            socket.off('statusUpdate');
        };
    }, [API_URL, setProducts]);

    const total = products.reduce((acc, p) => acc + (p.price || 0) * p.quantity, 0);

    async function handleAddToCart(product) {
        if (!token || !cartId) return;
        setLoadingById(prev => ({ ...prev, [product._id]: { ...(prev[product._id] || {}), add: true } }));
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
        } finally {
            setLoadingById(prev => ({ ...prev, [product._id]: { ...(prev[product._id] || {}), add: false } }));
        }
    }

    async function handleRemoveFromCart(product) {
        if (!token || !cartId || product.quantity === 0) return;
        setLoadingById(prev => ({ ...prev, [product._id]: { ...(prev[product._id] || {}), remove: true } }));
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
                            });
                    }
                    return updated;
                });
                toast.success('Producto quitado del carrito');
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoadingById(prev => ({ ...prev, [product._id]: { ...(prev[product._id] || {}), remove: false } }));
        }
    }

    async function handleRemoveInactiveOrNoStock(product) {
        if (!token || !cartId || product.quantity === 0) return;
        setLoadingById(prev => ({ ...prev, [product._id]: { ...(prev[product._id] || {}), removeInactive: true } }));
        try {
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
        } finally {
            setLoadingById(prev => ({ ...prev, [product._id]: { ...(prev[product._id] || {}), removeInactive: false } }));
        }
    }

    async function handleProcessPurchase() {
        setLoadingConfirm(true);
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

            let nombreUsuario = (userInfo?.firstName || '') + (userInfo?.lastName ? ' ' + userInfo.lastName : '') || userInfo?.email || 'Cliente';
            const mensaje = `Hola, mi nombre es ${nombreUsuario.trim()}, acabo de realizar una compra:%0A${productos}%0A%0AMuchas gracias`;

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
        } finally {
            setLoadingConfirm(false);
        }
    }

    if (!products.length) {
        return (
            <div className="text-center py-10">
                <div className="max-w-md mx-auto">
                    <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    <p className="text-gray-500 text-lg mb-2">Tu carrito está vacío</p>
                    <p className="text-gray-400 text-sm">Agrega algunos productos para comenzar a comprar</p>
                </div>
            </div>
        );
    }

    // Generar WhatsApp link para mostrar info del vendedor
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
        <>
            <div className="mb-6 flex items-center justify-start gap-2 max-w-3xl mx-auto">
                <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 transition-all duration-200 hover:opacity-80 group"
                    title="Contactar por WhatsApp"
                >
                    <span className="font-medium text-gray-800 text-lg">
                        Luxe Imports
                    </span>

                    <div className="bg-green-100 p-1.5 rounded-full group-hover:bg-green-200 transition-colors">
                        <FaWhatsapp className="text-green-600 text-xl" />
                    </div>
                </a>
            </div>

            <CartItems
                products={products}
                onAdd={handleAddToCart}
                onRemove={handleRemoveFromCart}
                onRemoveInactive={handleRemoveInactiveOrNoStock}
                loadingById={loadingById}
            />

            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center max-w-3xl mx-auto p-4 bg-gray-50 rounded-lg border border-gray-200">
                
                <div className='flex flex-col gap-2 sm:gap-0'>
                    <p className="text-sm text-center sm:text-left text-gray-500">Total a pagar</p>
                    <p className="text-2xl font-bold text-gray-800">${total.toFixed(2)}</p>
                </div>

                <div className="mt-2 sm:mt-0">
                    <button
                        onClick={handleProcessPurchase}
                        className="bg-gray-900 hover:bg-black text-white cursor-pointer px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                        disabled={loadingConfirm}
                        style={loadingConfirm ? { opacity: 0.6, pointerEvents: 'none' } : {}}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        {loadingConfirm ? 'Procesando...' : 'Finalizar Compra'}
                    </button>
                </div>

            </div>
        </>
    );

}