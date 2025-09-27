import { useState, useEffect } from 'react';
import { FaHistory, FaSync } from 'react-icons/fa';
import { toast } from 'react-toastify';
import HistoryOrdersList from './HistoryOrdersList';
import useHistoryOrdersStore from '../../../store/historyOrdersStore';
import DateRangeFilter from '../../utils/DateRangeFilter';
import { useAuthFetch } from '../../../hooks/useAuthFetch';

export default function HistoryOrders({ history }) {
    const { authFetch } = useAuthFetch();

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

    const [isRefreshing, setIsRefreshing] = useState(false);
    
    // Función para recargar los pedidos
    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            const defaultFilters = { from: '', to: '' };
            await fetchOrders(defaultFilters, authFetch);
        } catch (err) {
            throw err;
        } finally {
            setIsRefreshing(false);
        }
    };

    // Fetch inicial de pedidos SOLO si no están cargados
    useEffect(() => {
        if (!isInitialized) {
            const defaultFilters = { from: '', to: '' };
            fetchOrders(defaultFilters, authFetch).catch(err => console.error(err));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isInitialized]); // authFetch no debe estar en deps para evitar loop

    // Limpiar detalles expandidos al cambiar de historia
    useEffect(() => {
        clearExpandedData();
    }, [history, clearExpandedData]);

    const handleToggleExpand = async (cartId) => {
        try {
            await toggleExpand(cartId, authFetch);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDateFilter = async (fromDate, toDate) => {
        try {
            await applyDateFilters(fromDate, toDate, authFetch);
        } catch (err) {
            console.error(err);
        }
    };

    const handleClearFilters = async () => {
        try {
            await clearFilters(authFetch);
        } catch (err) {
            console.error(err);
        }
    };

    const handleLoadMore = async () => {
        if (!loadingMore && hasMoreOrders) {
            try {
                await cargarMasPedidos(authFetch);
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">

                <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
                    <div className="mb-4 sm:mb-0">
                        <h3 className="text-lg sm:text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <FaHistory className="text-blue-600" />
                            Historial de Compras
                        </h3>
                        <p className="text-gray-600 mt-1">
                            Consulta todas las compras realizadas en el sistema
                        </p>
                    </div>
                    <button
                        onClick={handleRefresh}
                        disabled={isRefreshing || loading}
                        className={`
                            flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg 
                            hover:bg-blue-700 transition-colors duration-200
                            ${(isRefreshing || loading) ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                    >
                        <FaSync className={`${isRefreshing ? 'animate-spin' : ''}`} />
                        {isRefreshing ? 'Refrescando...' : 'Refrescar'}
                    </button>
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
                                px-6 py-3 text-gray-900 font-medium rounded-lg border-2 border-gray-300 hover:border-gray-900 transition-colors duration-300
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
