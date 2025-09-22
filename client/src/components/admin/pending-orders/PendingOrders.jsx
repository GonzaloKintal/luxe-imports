import React from 'react';
import { FaClock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import PendingOrdersList from './PendingOrdersList';
import ConfirmOrderAction from './ConfirmOrderAction';
import DateRangeFilter from '../../utils/DateRangeFilter';
import usePendingOrdersStore from '../../../store/pendingOrdersStore';

export default function PendingOrders() {

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

    const [confirmDialog, setConfirmDialog] = React.useState({
        open: false,
        type: null, // 'confirm' or 'delete'
        orderId: null,
        orderInfo: null
    });

    const API_URL = import.meta.env.VITE_API_URL;

    // Fetch inicial de pedidos SOLO si no están cargados
    React.useEffect(() => {
        if (!isInitialized) {
            const defaultFilters = {
                from: '',
                to: ''
            };
            fetchOrders(defaultFilters);
        }
    }, [isInitialized, fetchOrders]);



    function handleConfirmClick(cartId) {
        const order = orders.find(o => o._id === cartId);
        setConfirmDialog({
            open: true,
            type: 'confirm',
            orderId: cartId,
            orderInfo: {
                id: cartId,
                userName: order?.userId ? `${order.userId.firstName} ${order.userId.lastName}` : '',
                date: order?.createdAt ? `${new Date(order.createdAt).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" })} ${new Date(order.createdAt).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false })}hs` : '',
                pendingAt: order?.pendingAt ? `${new Date(order.pendingAt).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" })} ${new Date(order.pendingAt).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false })}hs` : '',
                confirmedAt: order?.confirmedAt ? `${new Date(order.confirmedAt).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" })} ${new Date(order.confirmedAt).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false })}hs` : ''
            }
        });
    }

    function handleDeleteClick(cartId) {
        const order = orders.find(o => o._id === cartId);
        setConfirmDialog({
            open: true,
            type: 'delete',
            orderId: cartId,
            orderInfo: {
                id: cartId,
                userName: order?.userId ? `${order.userId.firstName} ${order.userId.lastName}` : '',
                date: order?.createdAt ? `${new Date(order.createdAt).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" })} ${new Date(order.createdAt).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false })}hs` : '',
                pendingAt: order?.pendingAt ? `${new Date(order.pendingAt).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" })} ${new Date(order.pendingAt).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false })}hs` : '',
                confirmedAt: order?.confirmedAt ? `${new Date(order.confirmedAt).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" })} ${new Date(order.confirmedAt).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false })}hs` : ''
            }
        });
    }

    async function handleConfirmAction() {
        const { type, orderId } = confirmDialog;

        try {
            const token = localStorage.getItem('token');
            let res;

            if (type === 'confirm') {
                res = await fetch(`${API_URL}/api/carts/${orderId}/confirmar`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error('Error al confirmar el pedido');
                toast.success('Pedido confirmado exitosamente');

            } else if (type === 'delete') {
                res = await fetch(`${API_URL}/api/carts/${orderId}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error('Error al eliminar el pedido');
                toast.success('Pedido eliminado exitosamente');
            }

            // Actualizar la lista de pedidos
            removeOrder(orderId);

            // Cerrar el dialog
            setConfirmDialog({ open: false, type: null, orderId: null, orderInfo: null });

        } catch (err) {
            toast.error(err.message || 'Error al procesar la solicitud');
            setConfirmDialog({ open: false, type: null, orderId: null, orderInfo: null });
        }
    }

    function handleCancelAction() {
        setConfirmDialog({ open: false, type: null, orderId: null, orderInfo: null });
    }

    const handleDateFilter = async (fromDate, toDate) => {
        await applyDateFilters(fromDate, toDate);
    };

    const handleClearFilters = async () => {
        await clearFilters();
    };

    const handleLoadMore = () => {
        if (!loadingMore && hasMoreOrders) {
            cargarMasPedidos();
        }
    };

    return (
        <>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                    <div className="mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                            <FaClock className="text-blue-500" />
                            Pedidos Pendientes
                        </h3>
                        <p className="text-gray-600 mt-1">
                            Revisa los pedidos que aún no han sido completados
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

                    <PendingOrdersList
                        orders={orders}
                        total={total}
                        loading={loading}
                        error={error}
                        onConfirm={handleConfirmClick}
                        onDelete={handleDeleteClick}
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
                                Has visto todos los pedidos pendientes
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmOrderAction
                open={confirmDialog.open}
                title={confirmDialog.type === 'confirm' ? '¿Confirmar Pedido?' : '¿Eliminar Pedido?'}
                message={
                    confirmDialog.type === 'confirm'
                        ? 'Esta acción marcará el pedido como completado y lo removerá de la lista de pendientes.'
                        : 'Esta acción eliminará permanentemente el pedido. Esta acción no se puede deshacer.'
                }
                onConfirm={handleConfirmAction}
                onCancel={handleCancelAction}
                orderInfo={confirmDialog.orderInfo}
                actionType={confirmDialog.type}
            />
        </>
    );

}