import React from 'react';
import { FaHistory } from 'react-icons/fa';
import HistoryOrderCard from './HistoryOrderCard';
import HistoryOrderCardSkeleton from './HistoryOrderCardSkeleton';

export default function HistoryOrdersList({ 
    orders, 
    total,
    loading, 
    error, 
    expanded, 
    details, 
    onToggleExpand, 
    onFetchDetails 
}) {
    
    if (loading) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="h-5 bg-gray-200 rounded w-48 animate-pulse"></div>
                </div>
                
                {/* Renderizar 3 skeletons mientras carga */}
                {Array.from({ length: 3 }).map((_, index) => (
                    <HistoryOrderCardSkeleton key={index} />
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
                    <FaHistory className="text-6xl mx-auto" />
                </div>
                <h4 className="text-xl font-medium text-gray-600 mb-2">
                    No hay compras confirmadas
                </h4>
                <p className="text-gray-500">
                    Las compras confirmadas aparecerán aquí
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600">
                    Hay <span className="font-semibold text-gray-900">{total || 0}</span> pedidos confirmados en total
                </p>
            </div>

            {orders.map((order) => (
                <HistoryOrderCard
                    key={order._id}
                    order={order}
                    expanded={expanded[order._id] || false}
                    details={details[order._id]}
                    onToggleExpand={onToggleExpand}
                    onFetchDetails={onFetchDetails}
                />
            ))}
        </div>
    );

}