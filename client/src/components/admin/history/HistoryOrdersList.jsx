import React from 'react';
import { FaHistory } from 'react-icons/fa';
import HistoryOrderCard from './HistoryOrderCard';

export default function HistoryOrdersList({ 
    orders, 
    loading, 
    error, 
    expanded, 
    details, 
    onToggleExpand, 
    onFetchDetails 
}) {
    
    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="inline-flex items-center gap-3 text-gray-600">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="text-lg">Cargando historial...</span>
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
                    Se encontraron <span className="font-semibold text-gray-900">{orders.length}</span> compras confirmadas
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