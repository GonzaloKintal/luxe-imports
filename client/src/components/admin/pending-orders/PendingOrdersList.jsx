import React from 'react';
import { FaClock } from 'react-icons/fa';
import PendingOrderCard from './PendingOrderCard';
import PendingOrderCardSkeleton from './PendingOrderCardSkeleton';

export default function PendingOrdersList({ orders, loading, error, onConfirm, onDelete }) {

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="h-5 bg-gray-200 rounded w-48 animate-pulse"></div>
                </div>
                
                {/* Renderizar 3 skeletons mientras carga */}
                {Array.from({ length: 3 }).map((_, index) => (
                    <PendingOrderCardSkeleton key={index} />
                ))}
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
                    Hay <span className="font-semibold text-gray-900">{orders.length}</span> pedidos pendientes en este momento
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