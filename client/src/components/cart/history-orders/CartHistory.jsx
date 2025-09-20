

import { useState } from 'react';
import LoadHistoryButton from './LoadHistoryButton';
import HistoryHeader from './HistoryHeader';
import PendingOrders from './PendingOrders';
import ConfirmedOrders from './ConfirmedOrders';

export default function CartHistory({ token, API_URL }) {

    const [historialCarritos, setHistorialCarritos] = useState({
        confirmados: [],
        pendientes: []
    });
    const [historialVisible, setHistorialVisible] = useState(false);
    const [expandedHistorial, setExpandedHistorial] = useState({});
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [hasMoreHistory, setHasMoreHistory] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalHistory, setTotalHistory] = useState(0);

    const ITEMS_PER_PAGE = 5;

    async function fetchProductDetails(products) {
        return await Promise.all(
            products.map(async ({ productId, quantity }) => {
                let prodId;
                if (typeof productId === 'object' && productId !== null) {
                    prodId = productId._id || productId.id || productId.toString();
                } else {
                    prodId = productId;
                }
                
                try {
                    const res = await fetch(`${API_URL}/api/products/${prodId}`);
                    if (!res.ok) return { title: 'Producto eliminado', price: 0, quantity };
                    const prod = await res.json();
                    return { ...prod, quantity };
                } catch (err) {
                    return { title: 'Producto eliminado', price: 0, quantity };
                }
            })
        );
    }

    async function cargarHistorial(isLoadMore = false) {
        try {
            if (isLoadMore) {
                setLoadingMore(true);
            } else {
                setLoading(true);
                setCurrentPage(1);
                setHistorialCarritos({ confirmados: [], pendientes: [] });
            }
            setError(null);
            
            const pageToLoad = isLoadMore ? currentPage + 1 : 1;
            
            const res = await fetch(`${API_URL}/api/carts/history?limit=${ITEMS_PER_PAGE}&page=${pageToLoad}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al obtener historial');
            
            // Obtener los carritos del array results
            const carritos = data.results || [];
            const confirmados = carritos.filter(c => c.status === 'confirmado');
            const pendientes = carritos.filter(c => c.status === 'pendiente de confirmacion');

            // Detalles para confirmados
            const confirmadosConDetalles = await Promise.all(
                confirmados.map(async (carrito) => {
                    const productos = await fetchProductDetails(carrito.products || []);
                    return { ...carrito, productos };
                })
            );

            // Detalles para pendientes
            const pendientesConDetalles = await Promise.all(
                pendientes.map(async (carrito) => {
                    const productos = await fetchProductDetails(carrito.products || []);
                    return { ...carrito, productos };
                })
            );

            if (isLoadMore) {
                // Agregar a los existentes
                setHistorialCarritos(prev => ({
                    confirmados: [...prev.confirmados, ...confirmadosConDetalles],
                    pendientes: [...prev.pendientes, ...pendientesConDetalles]
                }));
                setCurrentPage(pageToLoad);
            } else {
                // Primera carga
                setHistorialCarritos({ 
                    confirmados: confirmadosConDetalles, 
                    pendientes: pendientesConDetalles 
                });
                setCurrentPage(1);
                setHistorialVisible(true);
            }

            // Actualizar información de paginación
            setTotalHistory(data.total || 0);
            const totalLoaded = (pageToLoad * ITEMS_PER_PAGE);
            setHasMoreHistory(totalLoaded < (data.total || 0));

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }

    function cargarMasHistorial() {
        cargarHistorial(true);
    }

    function toggleExpanded(id) {
        setExpandedHistorial(prev => ({ ...prev, [id]: !prev[id] }));
    }

    function handleCloseHistory() {
        setHistorialVisible(false);
        setHistorialCarritos({ confirmados: [], pendientes: [] });
        setCurrentPage(1);
        setHasMoreHistory(false);
        setTotalHistory(0);
    }

    if (!historialVisible) {
        return (
            <LoadHistoryButton
                onLoadHistory={() => cargarHistorial(false)}
                loading={loading}
                error={error}
            />
        );
    }

    const totalCarritos = historialCarritos.confirmados.length + historialCarritos.pendientes.length;

    return (
        <div className="mt-15 max-w-4xl mx-auto px-4">
            <HistoryHeader onClose={handleCloseHistory} />

            <PendingOrders
                orders={historialCarritos.pendientes}
                expandedHistorial={expandedHistorial}
                onToggleExpanded={toggleExpanded}
            />

            <ConfirmedOrders
                orders={historialCarritos.confirmados}
                expandedHistorial={expandedHistorial}
                onToggleExpanded={toggleExpanded}
            />

            {/* Botón Cargar más */}
            {!loading && !error && hasMoreHistory && (
                <div className="flex justify-center mt-12 mb-4">
                    <button
                        onClick={cargarMasHistorial}
                        disabled={loadingMore}
                        className={`
                            px-6 py-3 bg-transparent cursor-pointer text-gray-900 font-medium rounded-lg border-2 border-gray-300 hover:border-gray-900 transition-colors duration-300
                            ${loadingMore ? 'bg-gray-400 cursor-not-allowed' : 'bg-transparent'}
                        `}
                    >
                        {loadingMore ? 'Cargando...' : 'Cargar más historial'}
                    </button>
                </div>
            )}

            {/* Mensaje cuando no hay más historial */}
            {!loading && !error && !hasMoreHistory && totalCarritos > 0 && (
                <div className="text-center mt-8 mb-4">
                    <p className="text-gray-600 font-medium">
                        Has visto todo el historial disponible
                    </p>
                </div>
            )}

            {/* Mensaje cuando no hay historial */}
            {!loading && !error && totalCarritos === 0 && (
                <div className="text-center mt-8 mb-4">
                    <p className="text-gray-600 font-medium">
                        No tienes historial de pedidos
                    </p>
                </div>
            )}
        </div>
    );

}
