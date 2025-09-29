
import { useState, useEffect, useCallback } from 'react';
import { FaHistory, FaSync } from 'react-icons/fa';
import HistoryOrdersList from './HistoryOrdersList';
import DateRangeFilter from '../../utils/DateRangeFilter';
import UsernameFilter from '../../utils/UsernameFilter';
import { useAuthFetch } from '../../../hooks/useAuthFetch';
import useHistoryOrdersStore from '../../../store/historyOrdersStore';
import { toast } from 'react-toastify';

export default function HistoryOrders() {
    const { authFetch } = useAuthFetch();
    const API_URL = import.meta.env.VITE_API_URL;

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

    // Filtros locales persistentes
    const filtrosGuardados = JSON.parse(sessionStorage.getItem('historyOrdersFiltros') || '{}');
    const [username, setUsername] = useState(filtrosGuardados.username || '');

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [filtersApplied, setFiltersApplied] = useState(false);

    // Persistir filtros
    useEffect(() => {
        sessionStorage.setItem('historyOrdersFiltros', JSON.stringify({
            username
        }));
    }, [username]);

    // Fetch inicial si no está inicializado
    useEffect(() => {
        if (!isInitialized && !filtersApplied) {
            const defaultFilters = { 
                from: '', 
                to: '', 
                username: '' 
            };
            fetchOrders(defaultFilters, authFetch).catch(err => console.error(err));
            setFiltersApplied(true);
        }
    }, [isInitialized, filtersApplied, fetchOrders, authFetch]);

    // Limpiar detalles expandidos al cambiar de historia
    useEffect(() => {
        clearExpandedData();
    }, [clearExpandedData]);

    // Función para aplicar filtros
    const applyFilters = useCallback((filters) => {
        setFiltersApplied(true);
        fetchOrders(filters, authFetch);
    }, [authFetch, fetchOrders]);

    // Handler para cambios de username con debounce
    const handleUsernameChange = useCallback((value) => {
        setUsername(value);
        
        // Aplicar filtros después de un pequeño delay
        const timer = setTimeout(() => {
            applyFilters({
                from: '',
                to: '',
                username: value
            });
        }, 300); // debounce
        
        return () => clearTimeout(timer);
    }, [applyFilters]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            const filters = { 
                from: '', 
                to: '', 
                username: username 
            };
            await fetchOrders(filters, authFetch);
        } catch (err) {
            toast.error('Error al refrescar historial de pedidos');
        } finally {
            setIsRefreshing(false);
        }
    };

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
            setUsername('');
            setFiltersApplied(true);
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
                        className={`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 ${(isRefreshing || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <FaSync className={`${isRefreshing ? 'animate-spin' : ''}`} />
                        {isRefreshing ? 'Refrescando...' : 'Refrescar'}
                    </button>
                </div>

                {/* Filtros */}
                <div className="w-full flex flex-col gap-3 mx-auto mb-6">
                    <UsernameFilter
                        username={username}
                        setUsername={handleUsernameChange}
                        loading={loading}
                    />

                    <DateRangeFilter
                        onFilter={handleDateFilter}
                        onClear={handleClearFilters}
                        loading={loading}
                        title="Filtrar por fecha"
                        showTitle={false}
                    />
                </div>

                {/* Lista de pedidos */}
                <HistoryOrdersList
                    orders={orders}
                    total={total}
                    loading={loading}
                    error={error}
                    expanded={expanded}
                    details={details}
                    onToggleExpand={handleToggleExpand}
                />

                {/* Botón cargar más */}
                {!loading && !error && hasMoreOrders && (
                    <div className="flex justify-center mt-8">
                        <button
                            onClick={handleLoadMore}
                            disabled={loadingMore}
                            className={`px-6 py-3 text-gray-900 font-medium rounded-lg border-2 border-gray-300 hover:border-gray-900 transition-colors duration-300 ${loadingMore ? 'bg-gray-400 cursor-not-allowed' : 'bg-transparent'}`}
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