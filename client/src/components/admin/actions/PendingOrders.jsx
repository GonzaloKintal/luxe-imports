import React from 'react';
import { FaClock, FaWhatsapp} from 'react-icons/fa';

export default function PendingOrders({ loading, onClose }) {

    const [orders, setOrders] = React.useState([]);
    const [loadingOrders, setLoadingOrders] = React.useState(true);
    const [error, setError] = React.useState(null);
    const API_URL = import.meta.env.VITE_API_URL;

    React.useEffect(() => {
        async function fetchOrders() {
            setLoadingOrders(true);
            setError(null);
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_URL}/api/carts/pendientes`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error('Error al obtener pedidos pendientes');
                const data = await res.json();
                setOrders(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoadingOrders(false);
            }
        }
        fetchOrders();
    }, []);

    async function handleConfirm(cartId) {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/carts/${cartId}/confirmar`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Error al confirmar el pedido');
            setOrders(orders.filter(o => o._id !== cartId));
        } catch (err) {
            alert(err.message);
        }
    }

    async function handleDelete(cartId) {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/carts/${cartId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Error al eliminar el pedido');
            setOrders(orders.filter(o => o._id !== cartId));
        } catch (err) {
            alert(err.message);
        }
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
                <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <FaClock className="text-orange-500" />
                        Pedidos Pendientes
                    </h3>
                    <p className="text-gray-600 mt-1">
                        Revisa los pedidos que aún no han sido completados
                    </p>
                </div>

                <div className="space-y-4">
                    {loadingOrders ? (
                        <div className="text-center py-12">
                            <div className="inline-flex items-center gap-3 text-gray-600">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                                <span className="text-lg">Cargando pedidos...</span>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12 text-red-500">{error}</div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <FaClock className="text-6xl mx-auto" />
                            </div>
                            <h4 className="text-xl font-medium text-gray-600 mb-2">
                                No hay pedidos pendientes
                            </h4>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map(order => (
                                <div key={order._id} className="border rounded-lg p-4 flex flex-col gap-2">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <span className="font-semibold text-gray-900">Pedido:</span> {order._id}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                                onClick={() => handleConfirm(order._id)}
                                            >Confirmar</button>
                                            <button
                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                                onClick={() => handleDelete(order._id)}
                                            >Eliminar</button>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-600">Usuario:</span> {order.userId?.firstName + ' ' + order.userId?.lastName}
                                        {order.userId?.email && (
                                            <span className="ml-2 text-sm text-gray-500">({order.userId.email})</span>
                                        )}
                                        {order.userId?.telefono && (
                                            <a
                                                href={`https://wa.me/${order.userId.telefono.replace(/[^\d]/g, '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="ml-2 inline-flex items-center gap-1 text-green-600 hover:text-green-800"
                                            >
                                                <FaWhatsapp className="inline-block text-lg" />                                            </a>
                                        )}
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-600">Productos:</span>
                                        <ul className="ml-4 list-disc text-sm">
                                            {order.products.map(p => (
                                                <li key={p.productId._id || p.productId}>
                                                    {p.productId.title || p.productId} x {p.quantity}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

}
