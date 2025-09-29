
import React, { useState, useEffect, useCallback } from 'react';
import { FaClock, FaSync } from 'react-icons/fa';
import { toast } from 'react-toastify';
import PendingOrdersList from './PendingOrdersList';
import ConfirmOrderAction from './ConfirmOrderAction';
import DateRangeFilter from '../../utils/DateRangeFilter';
import UsernameFilter from '../../utils/UsernameFilter';
import usePendingOrdersStore from '../../../store/pendingOrdersStore';
import useHistoryOrdersStore from '../../../store/historyOrdersStore';
import { useAuthFetch } from '../../../hooks/useAuthFetch';

export default function PendingOrders() {
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
        removeOrder,
        isInitialized,
        applyDateFilters,
        clearFilters
    } = usePendingOrdersStore();

    const { refreshOrders: refreshHistoryOrders } = useHistoryOrdersStore();

    // Filtros locales persistentes
    const filtrosGuardados = JSON.parse(sessionStorage.getItem('pendingOrdersFiltros') || '{}');
    const [username, setUsername] = useState(filtrosGuardados.username || '');

    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        type: null,
        orderId: null,
        orderInfo: null
    });

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [filtersApplied, setFiltersApplied] = useState(false);

    // Persistir filtros
    useEffect(() => {
        sessionStorage.setItem('pendingOrdersFiltros', JSON.stringify({
            username
        }));
    }, [username]);

    // Fetch inicial SOLO al montar el componente
    useEffect(() => {
        if (!isInitialized && !filtersApplied) {
            const filters = {
                from: '',
                to: '',
                username: ''
            };
            fetchOrders(filters, authFetch).catch(err => console.error(err));
            setFiltersApplied(true);
        }
    }, [isInitialized, filtersApplied, fetchOrders, authFetch]);

    // Función para aplicar filtros con debounce
    const applyFilters = useCallback((filters) => {
        setFiltersApplied(true);
        fetchOrders(filters, authFetch);
    }, [authFetch, fetchOrders]);

    // Handler para cambios de username con debounce manual
    const handleUsernameChange = useCallback((value) => {
        setUsername(value);
        
        // Aplicar filtros después de un pequeño delay (como en Products)
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
            toast.error('Error al refrescar pedidos');
        } finally {
            setIsRefreshing(false);
        }
    };

    const formatDateTime = (date) => {
        if (!date) return '';
        const d = new Date(date);
        return `${d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })} ${d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })}hs`;
    };

    const formatOrderInfo = (order) => ({
        id: order?._id,
        userName: order?.userId ? `${order.userId.firstName} ${order.userId.lastName}` : '',
        date: formatDateTime(order?.createdAt),
        pendingAt: formatDateTime(order?.pendingAt),
        confirmedAt: formatDateTime(order?.confirmedAt)
    });

    const handleConfirmClick = (orderId) => {
        const order = orders.find(o => o._id === orderId);
        setConfirmDialog({
            open: true,
            type: 'confirm',
            orderId,
            orderInfo: formatOrderInfo(order)
        });
    };

    const handleDeleteClick = (orderId) => {
        const order = orders.find(o => o._id === orderId);
        setConfirmDialog({
            open: true,
            type: 'delete',
            orderId,
            orderInfo: formatOrderInfo(order)
        });
    };

    const handleConfirmAction = async () => {
        const { type, orderId } = confirmDialog;
        try {
            if (type === 'confirm') {
                await authFetch(`${API_URL}/api/carts/${orderId}/confirmar`, { method: 'POST' });
                toast.success('Pedido confirmado exitosamente');
                await refreshHistoryOrders(authFetch);
            } else if (type === 'delete') {
                await authFetch(`${API_URL}/api/carts/${orderId}`, { method: 'DELETE' });
                toast.success('Pedido eliminado exitosamente');
            }
            removeOrder(orderId);
        } catch (err) {
            toast.error(err.message || 'Error al procesar la solicitud');
        } finally {
            setConfirmDialog({ open: false, type: null, orderId: null, orderInfo: null });
        }
    };

    const handleCancelAction = () => {
        setConfirmDialog({ open: false, type: null, orderId: null, orderInfo: null });
    };

    const handleDateFilter = async (fromDate, toDate) => {
        await applyDateFilters(fromDate, toDate, authFetch);
    };

    const handleClearFilters = async () => {
        setUsername('');
        setFiltersApplied(true);
        await clearFilters(authFetch);
    };

    const handleLoadMore = async () => {
        if (!loadingMore && hasMoreOrders) {
            await cargarMasPedidos(authFetch);
        }
    };

    return (
        <>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
                        <div className="mb-4 sm:mb-0">
                            <h3 className="text-lg sm:text-2xl font-bold text-gray-900 flex items-center gap-3">
                                <FaClock className="text-blue-500" />
                                Pedidos Pendientes
                            </h3>
                            <p className="text-gray-600 mt-1">
                                Revisa los pedidos que aún no han sido completados
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
                    <div className="w-full flex flex-col gap-3 mx-auto">
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

                    {/* Lista */}
                    <PendingOrdersList
                        orders={orders}
                        total={total}
                        loading={loading}
                        error={error}
                        onConfirm={handleConfirmClick}
                        onDelete={handleDeleteClick}
                    />

                    {/* Cargar más */}
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

                    {!loading && !error && !hasMoreOrders && orders.length > 0 && (
                        <div className="text-center mt-8">
                            <p className="text-gray-600 text-sm sm:text-base font-medium">
                                Has visto todos los pedidos pendientes
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmOrderAction
                open={confirmDialog.open}
                title={confirmDialog.type === 'confirm' ? '¿Confirmar Pedido?' : '¿Eliminar Pedido?'}
                message={confirmDialog.type === 'confirm'
                    ? 'Esta acción marcará el pedido como completado y lo removerá de la lista de pendientes.'
                    : 'Esta acción eliminará permanentemente el pedido. Esta acción no se puede deshacer.'}
                onConfirm={handleConfirmAction}
                onCancel={handleCancelAction}
                orderInfo={confirmDialog.orderInfo}
                actionType={confirmDialog.type}
            />
        </>
    );
}