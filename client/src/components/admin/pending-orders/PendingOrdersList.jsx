import React from 'react';
import { FaClock } from 'react-icons/fa';
import PendingOrderCard from './PendingOrderCard';

export default function PendingOrdersList({ orders, loading, error, onConfirm, onDelete }) {

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="inline-flex items-center gap-3 text-gray-600">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    <span className="text-lg">Cargando pedidos...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12 text-red-500">{error}</div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                    <FaClock className="text-6xl mx-auto" />
                </div>
                <h4 className="text-xl font-medium text-gray-600 mb-2">
                    No hay pedidos pendientes
                </h4>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600">
                    Se encontraron <span className="font-semibold text-gray-900">{orders.length}</span> pedidos pendientes
                </p>
            </div>

            {orders.map(order => (
                <PendingOrderCard
                    key={order._id}
                    order={order}
                    onConfirm={onConfirm}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );

}