import React, { useState } from 'react';
import { FaWhatsapp, FaCheck, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function PendingOrderCard({ order, onConfirm, onDelete }) {
    const [expanded, setExpanded] = useState(false);

    const handleToggleExpand = () => {
        setExpanded(prev => !prev);
    };

    return (
        <div className="border border-gray-200 rounded-lg bg-gray-50">
            <div className="p-4">
                <div className="flex justify-between items-center">
                    <div className="flex-1">
                        <div className="font-semibold text-gray-900">
                            Pedido {order._id || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-600 mt-1 space-y-1">
                            <div>
                                <span className="font-medium">Usuario:</span>{' '}
                                {order.userId?.firstName} {order.userId?.lastName}
                                {order.userId?.email && (
                                    <span className="text-gray-500 ml-1">
                                        ({order.userId.email})
                                    </span>
                                )}
                                {order.userId?.telefono && (
                                    <a
                                        href={`https://wa.me/${order.userId.telefono.replace(/[^\d]/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ml-2 text-green-600 hover:text-green-800"
                                    >
                                        <FaWhatsapp className="inline-block text-lg" />
                                    </a>
                                )}
                            </div>
                            
                            <div className="flex flex-col gap-1 text-sm text-gray-600">
                                {order.pendingAt && (
                                    <span>
                                    <span className="font-medium">Pedido el</span>{' '}
                                    <span className="font-semibold text-orange-600">
                                        {new Date(order.pendingAt).toLocaleDateString('es-AR', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        })}
                                    </span>{' '}
                                    <span className="font-medium">a las</span>{' '}
                                    <span className="font-semibold text-orange-600">
                                        {new Date(order.pendingAt).toLocaleTimeString('es-AR', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false,
                                        })}hs
                                    </span>
                                    </span>
                                )}
                                <div>
                                    <span className="font-medium">Estado:</span>{' '}
                                    <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-600">
                                    Pendiente
                                    </span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="flex mt-4 justify-start md:justify-end md:mt-0">
                    <div className="flex gap-2">

                        {/* Botón "Ver productos" */}
                        <button
                            className="px-3 py-2 md:px-4 md:py-2 text-lg md:text-base rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors duration-200 shadow-md flex items-center justify-center gap-2"
                            onClick={handleToggleExpand}
                        >
                            {expanded ? <FaEyeSlash className="inline" /> : <FaEye className="inline" />}
                            
                            <span className="hidden md:inline">
                                {expanded ? 'Ocultar productos' : 'Ver productos'}
                            </span>
                        </button>

                        {/* Botón "Confirmar" */}
                        <button
                            className="px-3 py-2 md:px-4 md:py-2 text-sm md:text-base rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors duration-200 shadow-md flex items-center justify-center"
                            onClick={() => onConfirm(order._id)}
                        >
                            <FaCheck className="inline sm:inline md:hidden" /> {/* ícono en sm o menor */}
                            <span className="hidden md:inline">Confirmar</span> {/* texto en md o mayor */}
                        </button>

                        {/* Botón "Eliminar" */}
                        <button
                            className="px-3 py-2 md:px-4 md:py-2 text-sm md:text-base rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors duration-200 shadow-md flex items-center justify-center"
                            onClick={() => onDelete(order._id)}
                        >
                            <FaTrash className="inline sm:inline md:hidden" /> {/* ícono en sm o menor */}
                            <span className="hidden md:inline">Eliminar</span> {/* texto en md o mayor */}
                        </button>

                    </div>
                </div>

                {expanded && Array.isArray(order.products) && (
                    <div className="mt-4 space-y-4">
                        {order.products.map((p, idx) => {
                            const title = p.title || (p.productId && (p.productId.title || p.productId.name)) || 'Producto';
                            const priceUSD = typeof p.priceUSD === 'number' ? p.priceUSD : (typeof p.price === 'number' ? p.price : 0);
                            const priceARS = typeof p.priceARS === 'number' ? p.priceARS : 0;
                            const quantity = typeof p.quantity === 'number' ? p.quantity : 0;
                            const subtotalUSD = priceUSD * quantity;
                            const subtotalARS = priceARS * quantity;

                            return (
                                <div key={p._id || p.id || idx} className="flex flex-col lg:flex-row justify-between items-start lg:items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                                    {/* Nombre + Cantidad */}
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-900">{title}</div>
                                        <div className="text-sm text-gray-500 mt-1">Cantidad: <span className="font-semibold">X{quantity}</span></div>
                                    </div>

                                    {/* Precios y subtotales */}
                                    <div className="mt-2 lg:mt-0 flex flex-col lg:flex-row gap-1 lg:gap-4 text-sm">
                                        <div className="text-gray-600">
                                            <span>USD: </span>
                                            <span className="font-semibold text-blue-700">${priceUSD.toFixed(2)}</span>
                                        </div>
                                        <div className="text-gray-600">
                                            <span>AR$: </span>
                                            <span className="font-semibold text-green-700">{priceARS.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                        <div className="text-gray-600 font-semibold">
                                            Subtotal USD: <span className="text-blue-700">${subtotalUSD.toFixed(2)}</span>
                                        </div>
                                        <div className="text-gray-600 font-semibold">
                                            Subtotal AR$: <span className="text-green-700">{subtotalARS.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Totales generales */}
                        <div className="flex flex-col pt-4 border-t border-gray-200 text-right space-y-1">
                            <span className="text-lg font-bold text-gray-900">
                                Total USD: ${order.products.reduce((acc, p) => {
                                    const priceUSD = typeof p.priceUSD === 'number' ? p.priceUSD : (typeof p.price === 'number' ? p.price : 0);
                                    const quantity = typeof p.quantity === 'number' ? p.quantity : 0;
                                    return acc + priceUSD * quantity;
                                }, 0).toFixed(2)}
                            </span>
                            <span className="text-lg font-bold text-green-700">
                                Total AR$: {order.products.reduce((acc, p) => {
                                    const priceARS = typeof p.priceARS === 'number' ? p.priceARS : 0;
                                    const quantity = typeof p.quantity === 'number' ? p.quantity : 0;
                                    return acc + priceARS * quantity;
                                }, 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

}