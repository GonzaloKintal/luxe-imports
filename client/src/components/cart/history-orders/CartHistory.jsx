

import { useState } from 'react';
import LoadHistoryButton from './LoadHistoryButton';
import HistoryHeader from './HistoryHeader';
import PendingOrders from './PendingOrders';
import ConfirmedOrders from './ConfirmedOrders';

export default function CartHistory({ token, API_URL }) {
    const [historialCarritos, setHistorialCarritos] = useState([]);
    const [historialVisible, setHistorialVisible] = useState(false);
    const [expandedHistorial, setExpandedHistorial] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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

    async function cargarHistorial() {
        try {
            setLoading(true);
            setError(null);
            
            const res = await fetch(`${API_URL}/api/carts/history`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al obtener historial');
            
            const confirmados = data.filter(c => c.status === 'confirmado');
            const pendientes = data.filter(c => c.status === 'pendiente de confirmacion');

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

            setHistorialCarritos({ 
                confirmados: confirmadosConDetalles, 
                pendientes: pendientesConDetalles 
            });
            setHistorialVisible(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function toggleExpanded(id) {
        setExpandedHistorial(prev => ({ ...prev, [id]: !prev[id] }));
    }

    function handleCloseHistory() {
        setHistorialVisible(false);
    }

    if (!historialVisible) {
        return (
            <LoadHistoryButton
                onLoadHistory={cargarHistorial}
                loading={loading}
                error={error}
            />
        );
    }

    return (
        <div className="mt-10 max-w-4xl mx-auto px-4">
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
        </div>
    );
}