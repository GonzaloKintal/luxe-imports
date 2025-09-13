
import { useState, useEffect } from 'react';
import { FaHistory, FaWhatsapp } from 'react-icons/fa';

export default function HistoryAdmin({ history, loading, onClose }) {

    const [expanded, setExpanded] = useState({});
    const [details, setDetails] = useState({});
    const API_URL = import.meta.env.VITE_API_URL;

    // Limpiar detalles al cargar
    useEffect(() => {
        setDetails({});
        setExpanded({});
    }, [history]);

    // Estado para pedidos confirmados
    const [confirmedHistory, setConfirmedHistory] = useState([]);
    const [loadingConfirmed, setLoadingConfirmed] = useState(true);
    const [errorConfirmed, setErrorConfirmed] = useState(null);

    useEffect(() => {
        async function fetchConfirmed() {
            setLoadingConfirmed(true);
            setErrorConfirmed(null);
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_URL}/api/carts/confirmados`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error('Error al obtener compras confirmadas');
                const data = await res.json();
                setConfirmedHistory(Array.isArray(data) ? data : []);
            } catch (err) {
                setErrorConfirmed(err.message);
            } finally {
                setLoadingConfirmed(false);
            }
        }
        fetchConfirmed();
    }, [API_URL]);

    async function fetchDetails(cartId, products) {
        if (details[cartId]) return; // Ya cargado
        const productosConDetalles = await Promise.all(
            products.map(async (p) => {
                const prodId = p.productId?._id || p.productId || p._id;
                try {
                    const res = await fetch(`${API_URL}/api/products/${prodId}`);
                    if (!res.ok) return { ...p, title: 'Producto eliminado', price: 0 };
                    const prod = await res.json();
                    return { ...prod, quantity: p.quantity };
                } catch {
                    return { ...p, title: 'Error', price: 0 };
                }
            })
        );
        setDetails(prev => ({ ...prev, [cartId]: productosConDetalles }));
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
                <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <FaHistory className="text-blue-600" />
                        Historial de Compras
                    </h3>
                    <p className="text-gray-600 mt-1">
                        Consulta todas las compras realizadas en el sistema
                    </p>
                </div>

                <div className="space-y-4">
                    {loadingConfirmed ? (
                        <div className="text-center py-12">
                            <div className="inline-flex items-center gap-3 text-gray-600">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                <span className="text-lg">Cargando historial...</span>
                            </div>
                        </div>
                    ) : errorConfirmed ? (
                        <div className="text-center py-12 text-red-500">{errorConfirmed}</div>
                    ) : confirmedHistory.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <FaHistory className="text-6xl mx-auto" />
                            </div>
                            <h4 className="text-xl font-medium text-gray-600 mb-2">
                                No hay compras confirmadas
                            </h4>
                            <p className="text-gray-500">
                                Las compras confirmadas aparecerán aquí
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-sm text-gray-600">
                                    Se encontraron <span className="font-semibold text-gray-900">{confirmedHistory.length}</span> compras confirmadas
                                </p>
                            </div>
                            {confirmedHistory.map((h) => {
                                const cartId = h._id;
                                return (
                                    <div key={cartId} className="border border-gray-200 rounded-lg bg-gray-50">
                                        <div className="p-4">
                                            <div className="flex justify-between items-center">
                                                <div className="flex-1">
                                                    <div className="font-semibold text-gray-900">
                                                        Pedido {cartId || 'N/A'}
                                                    </div>
                                                    <div className="text-sm text-gray-600 mt-1 space-y-1">
                                                        <div>Usuario: <span className="font-medium">
                                                            {h.userId?.email || h.userId?.firstName || h.userId?.lastName || h.userId?._id || 'N/A'}
                                                            {h.userId?.firstName && (
                                                                <span className="ml-1">{h.userId.firstName}</span>
                                                            )}
                                                            {h.userId?.lastName && (
                                                                <span className="ml-1">{h.userId.lastName}</span>
                                                            )}
                                                            {h.userId?.telefono && (
                                                                <a
                                                                    href={`https://wa.me/${h.userId.telefono.replace(/[^\d]/g, '')}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="ml-2 text-green-700 hover:text-green-900"
                                                                >
                                                                    <FaWhatsapp className="inline-block text-lg" />
                                                                </a>
                                                            )}
                                                        </span></div>
                                                        <div>Estado: <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800`}>
                                                            {h.status || 'N/A'}
                                                        </span></div>
                                                    </div>
                                                </div>
                                                <button
                                                    className="px-4 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium transition-colors duration-200"
                                                    onClick={async () => {
                                                        setExpanded(e => ({ ...e, [cartId]: !e[cartId] }));
                                                        if (!expanded[cartId] && Array.isArray(h.products)) {
                                                            await fetchDetails(cartId, h.products);
                                                        }
                                                    }}
                                                >
                                                    {expanded[cartId] ? 'Ocultar productos' : 'Ver productos'}
                                                </button>
                                            </div>
                                            {expanded[cartId] && Array.isArray(details[cartId]) && (
                                                <div className="mt-4 border-t border-gray-200 pt-4">
                                                    <div className="space-y-3">
                                                        {details[cartId].map((p, idx) => (
                                                            <div key={p._id || p.id || idx} className="flex justify-between items-center py-3 px-4 bg-white rounded-lg border border-gray-100">
                                                                <div className="flex-1">
                                                                    <span className="font-medium text-gray-900">{p.title}</span>
                                                                </div>
                                                                <div className="flex items-center gap-4 text-sm">
                                                                    <span className="text-gray-600">Cantidad: <span className="font-semibold">x{p.quantity}</span></span>
                                                                    <span className="font-semibold text-gray-900">
                                                                        ${typeof p.price === 'number' ? p.price.toFixed(2) : 'N/A'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="mt-4 pt-4 border-t border-gray-200 text-right">
                                                        <span className="text-lg font-bold text-gray-900">
                                                            Total: ${details[cartId].reduce((acc, p) => acc + (p.price || 0) * (p.quantity || 0), 0).toFixed(2)}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

}