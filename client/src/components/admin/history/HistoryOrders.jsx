import { useState, useEffect } from 'react';
import { FaHistory } from 'react-icons/fa';
import HistoryOrdersList from './HistoryOrdersList';
import useHistoryOrdersStore from '../../../store/historyOrdersStore';
import DateRangeFilter from '../../utils/DateRangeFilter';
import { useAuthFetch } from '../../../hooks/useAuthFetch'; // AGREGADO

export default function HistoryOrders({ history }) {
    const { authFetch } = useAuthFetch(); // AGREGADO
    
    const {
        orders,
        total,
        loading,
        loadingMore,
        error,
        hasMoreOrders,
        fetchOrders,
        cargarMasPedidos,
        expanded,
        details,
        toggleExpand,
        clearExpandedData,
        isInitialized,
        applyDateFilters,
        clearFilters
    } = useHistoryOrdersStore();

    // Fetch inicial de pedidos SOLO si no están cargados
    useEffect(() => {
        if (!isInitialized) {
            const defaultFilters = {
                from: '',
                to: ''
            };
            // CAMBIO: Pasar authFetch al store
            fetchOrders(defaultFilters, authFetch);
        }
    }, [isInitialized, fetchOrders, authFetch]);

    // Limpiar detalles expandidos al cargar
    useEffect(() => {
        clearExpandedData();
    }, [history, clearExpandedData]);

    const handleToggleExpand = async (cartId) => {
        // CAMBIO: Pasar authFetch al store
        toggleExpand(cartId, authFetch);
    };

    const handleDateFilter = async (fromDate, toDate) => {
        // CAMBIO: Pasar authFetch al store
        await applyDateFilters(fromDate, toDate, authFetch);
    };

    const handleClearFilters = async () => {
        // CAMBIO: Pasar authFetch al store
        await clearFilters(authFetch);
    };

    const handleLoadMore = () => {
        if (!loadingMore && hasMoreOrders) {
            // CAMBIO: Pasar authFetch al store
            cargarMasPedidos(authFetch);
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

                {/* Filtros de fecha */}
                <div className="w-full mx-auto mb-6">
                    <DateRangeFilter
                        onFilter={handleDateFilter}
                        loading={loading}
                        title="Filtrar por fecha"
                        showTitle={false}
                    />
                </div>

                <HistoryOrdersList
                    orders={orders}
                    total={total}
                    loading={loading}
                    error={error}
                    expanded={expanded}
                    details={details}
                    onToggleExpand={handleToggleExpand}
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
            </div>
        </div>
    );
}