import { useState, useEffect } from 'react';
import { FaHistory } from 'react-icons/fa';
import HistoryOrdersList from './HistoryOrdersList';

export default function HistoryOrders({ history }) {
    
    const [expanded, setExpanded] = useState({});
    const [details, setDetails] = useState({});
    const [confirmedHistory, setConfirmedHistory] = useState([]);
    const [loadingConfirmed, setLoadingConfirmed] = useState(true);
    const [errorConfirmed, setErrorConfirmed] = useState(null);
    
    const API_URL = import.meta.env.VITE_API_URL;

    // Limpiar detalles al cargar
    useEffect(() => {
        setDetails({});
        setExpanded({});
    }, [history]);

    useEffect(() => {
        async function fetchConfirmed() {
            setLoadingConfirmed(true);
            setErrorConfirmed(null);
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_URL}/api/carts/confirmados?limit=100`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error('Error al obtener compras confirmadas');
                const data = await res.json();
                // Usar results del objeto paginado
                setConfirmedHistory(data.results || []);
            } catch (err) {
                setErrorConfirmed(err.message);
            } finally {
                setLoadingConfirmed(false);
            }
        }
        fetchConfirmed();
    }, [API_URL]);

    async function fetchDetails(cartId, products) {
        if (details[cartId]) return; // Ya cargado
        
        const productosConDetalles = await Promise.all(
            products.map(async (p) => {
                const prodId = p.productId?._id || p.productId || p._id;
                try {
                    const res = await fetch(`${API_URL}/api/products/${prodId}`);
                    if (!res.ok) return { ...p, title: 'Producto eliminado', price: 0 };
                    const prod = await res.json();
                    return { ...prod, quantity: p.quantity };
                } catch {
                    return { ...p, title: 'Error', price: 0 };
                }
            })
        );
        
        setDetails(prev => ({ ...prev, [cartId]: productosConDetalles }));
    }

    function handleToggleExpand(cartId) {
        setExpanded(prev => ({ ...prev, [cartId]: !prev[cartId] }));
    }

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
                    orders={confirmedHistory}
                    loading={loadingConfirmed}
                    error={errorConfirmed}
                    expanded={expanded}
                    details={details}
                    onToggleExpand={handleToggleExpand}
                    onFetchDetails={fetchDetails}
                />
            </div>
        </div>
    );

}