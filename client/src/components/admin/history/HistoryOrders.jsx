
import { useState, useEffect } from 'react';
import { FaHistory } from 'react-icons/fa';
import HistoryOrdersList from './HistoryOrdersList';
import useHistoryOrdersStore from '../../../store/historyOrdersStore';

export default function HistoryOrders({ history }) {
    
    const {
        orders,
        loading,
        loadingMore,
        error,
        hasMoreOrders,
        fetchOrders,
        cargarMasPedidos,
        expanded,
        details,
        toggleExpand,
        fetchDetails,
        clearExpandedData,
        isInitialized
    } = useHistoryOrdersStore();

    // Fetch inicial de pedidos SOLO si no están cargados
    useEffect(() => {
        if (!isInitialized) {
            const defaultFilters = {
                from: '',
                to: ''
            };
            fetchOrders(defaultFilters);
        }
    }, [isInitialized, fetchOrders]);

    // Limpiar detalles expandidos al cargar
    useEffect(() => {
        clearExpandedData();
    }, [history, clearExpandedData]);

    const handleToggleExpand = async (cartId) => {
        toggleExpand(cartId);
        
        // Si se está expandiendo y no tenemos detalles, cargarlos
        if (!expanded[cartId]) {
            const order = orders.find(o => o._id === cartId);
            if (order && Array.isArray(order.products)) {
                await fetchDetails(cartId, order.products);
            }
        }
    };

    const handleLoadMore = () => {
        if (!loadingMore && hasMoreOrders) {
            cargarMasPedidos();
        }
    };

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

                <HistoryOrdersList
                    orders={orders}
                    loading={loading}
                    error={error}
                    expanded={expanded}
                    details={details}
                    onToggleExpand={handleToggleExpand}
                    onFetchDetails={fetchDetails}
                />

                {/* Botón Cargar más */}
                {!loading && !error && hasMoreOrders && (
                    <div className="flex justify-center mt-8">
                        <button
                            onClick={handleLoadMore}
                            disabled={loadingMore}
                            className={`
                                px-6 py-3 bg-transparent cursor-pointer text-gray-900 font-medium rounded-lg border-2 border-gray-300 hover:border-gray-900 transition-colors duration-300
                                ${loadingMore ? 'bg-gray-400 cursor-not-allowed' : 'bg-transparent'}
                            `}
                        >
                            {loadingMore ? 'Cargando...' : 'Cargar más pedidos'}
                        </button>
                    </div>
                )}

                {/* Mensaje cuando se han visto todos */}
                {!loading && !error && !hasMoreOrders && orders.length > 0 && (
                    <div className="text-center mt-8">
                        <p className="text-gray-600 font-medium">
                            Has visto todo el historial de pedidos
                        </p>
                    </div>
                )}

                {/* Mensaje cuando no hay pedidos */}
                {!loading && !error && orders.length === 0 && (
                    <div className="text-center mt-8">
                        <p className="text-gray-600 font-medium">
                            No se encontraron pedidos confirmados
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}