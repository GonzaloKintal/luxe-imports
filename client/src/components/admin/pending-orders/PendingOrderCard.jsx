import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

export default function PendingOrderCard({ order, onConfirm, onDelete }) {

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col gap-3">
            
            <div>
                    <span className="font-semibold text-gray-900">Pedido:</span> {order._id}
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                {/* Nombre */}
                <span className="text-sm font-medium text-gray-600">
                    Usuario:
                </span>
                <span className="text-sm font-medium text-gray-900">
                    {order.userId?.firstName} {order.userId?.lastName}
                </span>

                {/* Email y WhatsApp → en desktop va al lado, en mobile va abajo */}
                <div className="flex items-center gap-2 text-sm text-gray-500 md:ml-2">
                    {order.userId?.email && (
                    <span>({order.userId.email})</span>
                    )}
                    {order.userId?.telefono && (
                    <a
                        href={`https://wa.me/${order.userId.telefono.replace(/[^\d]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-green-600 hover:text-green-800"
                    >
                        <FaWhatsapp className="inline-block text-lg" />
                    </a>
                    )}
                </div>
                </div>
            
            <div className="text-sm text-gray-600">
                <span className="font-medium">Fecha:</span>{" "}
                {new Date(order.createdAt).toLocaleDateString("es-AR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                })}{" "}
                {new Date(order.createdAt).toLocaleTimeString("es-AR", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                })}hs
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

            <div className="flex justify-start md:justify-end">
                <div className="flex gap-2">
                    <button
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        onClick={() => onConfirm(order._id)}
                    >
                        Confirmar
                    </button>
                    <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        onClick={() => onDelete(order._id)}
                    >
                        Eliminar
                    </button>
                </div>
            </div>

        </div>
    );

}