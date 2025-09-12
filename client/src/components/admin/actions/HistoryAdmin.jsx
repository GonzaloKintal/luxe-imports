import React, { useState, useEffect } from 'react';
import { FaHistory, FaTimes } from 'react-icons/fa';

export default function HistoryAdmin({ history, loading, onClose }) {
    
    const [expanded, setExpanded] = useState({});
    const [details, setDetails] = useState({});
    const API_URL = import.meta.env.VITE_API_URL;

    // Limpiar detalles al cerrar
    useEffect(() => {
        setDetails({});
        setExpanded({});
    }, []);

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
        <div className="mt-4 bg-white rounded-xl shadow-lg border border-gray-300 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FaHistory className="text-gray-600" />
                    Historial de compras
                </h3>
                <button
                    onClick={onClose}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors duration-200"
                    title="Cerrar historial"
                >
                    <FaTimes className="text-lg" />
                </button>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-8">
                        <div className="inline-flex items-center gap-2 text-gray-600">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
                            Cargando historial...
                        </div>
                    </div>
                ) : history.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No hay compras registradas.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {history.map((h, i) => {
                            const cartId = h._id || h.id || i;
                            return (
                                <div key={cartId} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                    <div className="flex justify-between items-center">
                                        <div className="flex-1">
                                            <div className="font-semibold text-gray-900 text-sm">
                                                Carrito: {cartId} - Estado: {h.status || 'N/A'}
                                            </div>
                                            <div className="text-xs text-gray-600 mt-1">
                                                Usuario: {h.userId || 'N/A'}
                                            </div>
                                        </div>
                                        <button
                                            className="px-3 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-semibold transition-colors duration-200"
                                            onClick={async () => {
                                                setExpanded(e => ({ ...e, [cartId]: !e[cartId] }));
                                                if (!expanded[cartId] && Array.isArray(h.products)) {
                                                    await fetchDetails(cartId, h.products);
                                                }
                                            }}
                                        >
                                            {expanded[cartId] ? 'Cerrar' : 'Ver productos'}
                                        </button>
                                    </div>
                                    
                                    {expanded[cartId] && Array.isArray(details[cartId]) && (
                                        <div className="mt-4 border-t border-gray-200 pt-4">
                                            <div className="space-y-2">
                                                {details[cartId].map((p, idx) => (
                                                    <div key={p._id || p.id || idx} className="flex justify-between items-center py-2 px-3 bg-white rounded-lg border border-gray-100">
                                                        <div className="flex-1">
                                                            <span className="font-medium text-gray-900 text-sm">{p.title}</span>
                                                        </div>
                                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                                            <span>x{p.quantity}</span>
                                                            <span className="font-semibold">
                                                                ${typeof p.price === 'number' ? p.price.toFixed(2) : 'N/A'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-3 pt-3 border-t border-gray-200 text-right">
                                                <span className="font-bold text-lg text-gray-900">
                                                    Total: ${details[cartId].reduce((acc, p) => acc + (p.price || 0) * (p.quantity || 0), 0).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-200 mt-6">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold border border-gray-300 transition-colors duration-200 text-sm"
                >
                    Cerrar
                </button>
            </div>
        </div>
    );

}