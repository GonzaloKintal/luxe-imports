import { useState } from 'react';
import LoadHistoryButton from './LoadHistoryButton';
import HistoryHeader from './HistoryHeader';
import PendingOrders from './PendingOrders';
import ConfirmedOrders from './ConfirmedOrders';
import { useAuthFetch } from '../../../hooks/useAuthFetch'; // AGREGADO

export default function CartHistory({ token, API_URL }) {
    const { authFetch } = useAuthFetch(); // AGREGADO

    const [historialCarritos, setHistorialCarritos] = useState({
        confirmados: [],
        pendientes: []
    });
    const [historialVisible, setHistorialVisible] = useState(false);
    const [expandedHistorial, setExpandedHistorial] = useState({});
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [hasMoreConfirmed, setHasMoreConfirmed] = useState(false);
    const [hasMorePending, setHasMorePending] = useState(false);
    const [currentPageConfirmed, setCurrentPageConfirmed] = useState(1);
    const [currentPagePending, setCurrentPagePending] = useState(1);
    const [currentFilters, setCurrentFilters] = useState({ from: null, to: null });
    const [totalPending, setTotalPending] = useState(0);
    const [totalConfirmed, setTotalConfirmed] = useState(0);

    const ITEMS_PER_PAGE = 5;

    // CAMBIO: fetchProductDetails mantiene fetch normal (endpoint público)
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
                    const res = await fetch(`${API_URL}/api/products/${prodId}`); // Público - no cambiar
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
            setLoading(true);
            setError(null);
            
            if (!isLoadMore) {
                setCurrentPageConfirmed(1);
                setCurrentPagePending(1);
                setHistorialCarritos({ confirmados: [], pendientes: [] });
                setCurrentFilters({ from: null, to: null });
            }
            
            // Cargar ambos tipos en paralelo
            await Promise.all([
                cargarConfirmados(1, { from: null, to: null }),
                cargarPendientes(1, { from: null, to: null })
            ]);
            
            setHistorialVisible(true);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    // CAMBIO: usar authFetch para endpoint protegido
    async function cargarConfirmados(page = 1, filters = currentFilters) {
        try {
            let url = `${API_URL}/api/carts/history/confirmed?limit=${ITEMS_PER_PAGE}&page=${page}`;
            if (filters.from) url += `&from=${filters.from}`;
            if (filters.to) url += `&to=${filters.to}`;
            
            const res = await authFetch(url);
            if (res) {
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Error al obtener confirmados');
                
                const carritos = data.results || [];
                const confirmadosConDetalles = await Promise.all(
                    carritos.map(async (carrito) => {
                        const productos = await fetchProductDetails(carrito.products || []);
                        return { ...carrito, productos };
                    })
                );

                if (page === 1) {
                    setHistorialCarritos(prev => ({ ...prev, confirmados: confirmadosConDetalles }));
                } else {
                    setHistorialCarritos(prev => ({ 
                        ...prev, 
                        confirmados: [...prev.confirmados, ...confirmadosConDetalles] 
                    }));
                }

                setCurrentPageConfirmed(page);
                setHasMoreConfirmed((page * ITEMS_PER_PAGE) < (data.total || 0));
                setTotalConfirmed(data.total || 0);
            }

        } catch (err) {
            throw err;
        }
    }

    // CAMBIO: usar authFetch para endpoint protegido
    async function cargarPendientes(page = 1, filters = currentFilters) {
        try {
            let url = `${API_URL}/api/carts/history/pending?limit=${ITEMS_PER_PAGE}&page=${page}`;
            if (filters.from) url += `&from=${filters.from}`;
            if (filters.to) url += `&to=${filters.to}`;
            
            const res = await authFetch(url);
            if (res) {
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Error al obtener pendientes');
                
                const carritos = data.results || [];
                const pendientesConDetalles = await Promise.all(
                    carritos.map(async (carrito) => {
                        const productos = await fetchProductDetails(carrito.products || []);
                        return { ...carrito, productos };
                    })
                );

                if (page === 1) {
                    setHistorialCarritos(prev => ({ ...prev, pendientes: pendientesConDetalles }));
                } else {
                    setHistorialCarritos(prev => ({ 
                        ...prev, 
                        pendientes: [...prev.pendientes, ...pendientesConDetalles] 
                    }));
                }

                setCurrentPagePending(page);
                setHasMorePending((page * ITEMS_PER_PAGE) < (data.total || 0));
                setTotalPending(data.total || 0);
            }

        } catch (err) {
            throw err;
        }
    }

    async function filtrarConfirmados(from, to) {
        try {
            setLoading(true);
            setError(null);
            const newFilters = { from, to };
            setCurrentFilters(newFilters);
            
            setCurrentPageConfirmed(1);
            setHistorialCarritos(prev => ({ ...prev, confirmados: [] }));
            
            await cargarConfirmados(1, newFilters);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function filtrarPendientes(from, to) {
        try {
            setLoading(true);
            setError(null);
            const newFilters = { from, to };
            setCurrentFilters(newFilters);
            
            setCurrentPagePending(1);
            setHistorialCarritos(prev => ({ ...prev, pendientes: [] }));
            
            await cargarPendientes(1, newFilters);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function cargarMasConfirmados() {
        if (!loadingMore) {
            setLoadingMore(true);
            cargarConfirmados(currentPageConfirmed + 1, currentFilters)
                .finally(() => setLoadingMore(false));
        }
    }

    function cargarMasPendientes() {
        if (!loadingMore) {
            setLoadingMore(true);
            cargarPendientes(currentPagePending + 1, currentFilters)
                .finally(() => setLoadingMore(false));
        }
    }

    function toggleExpanded(id) {
        setExpandedHistorial(prev => ({ ...prev, [id]: !prev[id] }));
    }

    function handleCloseHistory() {
        setHistorialVisible(false);
        setHistorialCarritos({ confirmados: [], pendientes: [] });
        setCurrentPageConfirmed(1);
        setCurrentPagePending(1);
        setHasMoreConfirmed(false);
        setHasMorePending(false);
        setCurrentFilters({ from: null, to: null });
        setTotalPending(0);
        setTotalConfirmed(0);
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
        <div className="mt-15 max-w-4xl mx-auto sm:px-4">
            <HistoryHeader onClose={handleCloseHistory} />

            <PendingOrders
                orders={historialCarritos.pendientes}
                totalPending={totalPending}
                expandedHistorial={expandedHistorial}
                onToggleExpanded={toggleExpanded}
                onFilterPending={filtrarPendientes}
                onLoadMore={cargarMasPendientes}
                hasMore={hasMorePending}
                loading={loading}
                loadingMore={loadingMore}
            />

            <ConfirmedOrders
                orders={historialCarritos.confirmados}
                totalConfirmed={totalConfirmed}
                expandedHistorial={expandedHistorial}
                onToggleExpanded={toggleExpanded}
                onFilterConfirmed={filtrarConfirmados}
                onLoadMore={cargarMasConfirmados}
                hasMore={hasMoreConfirmed}
                loading={loading}
                loadingMore={loadingMore}
            />

            {/* Mensaje cuando no hay historial */}
            {!loading && !error && totalCarritos === 0 && (
                <div className="text-center mt-8 mb-4">
                    {currentFilters.from || currentFilters.to ? (
                        <p className="text-gray-600 text-sm sm:text-base font-medium">
                            No se encontraron pedidos en el rango de fechas seleccionado
                        </p>
                    ) : (
                        <p className="text-gray-600 text-sm sm:text-base font-medium">
                            No tienes historial de pedidos
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}