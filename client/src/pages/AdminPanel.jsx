
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaBolt, FaList, FaHistory, FaClock } from 'react-icons/fa';
import AdminActions from '../components/admin/actions/AdminActions';
import AdminProducts from '../components/admin/products/AdminProducts';
import HistoryOrders from '../components/admin/history/HistoryOrders';
import PendingOrders from '../components/admin/pending-orders/PendingOrders';

export default function AdminPanel() {
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState(
        localStorage.getItem("activeTab") || "products"
    );

    const [history, setHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    // Configuración de las tabs
    const tabs = [
        {
            id: 'products',
            label: 'Productos',
            icon: FaList,
        },
        {
            id: 'actions',
            label: 'Acciones',
            icon: FaBolt,
        },
        {
            id: 'pending',
            label: 'Pendientes',
            icon: FaClock,
        },
        {
            id: 'history',
            label: 'Historial',
            icon: FaHistory,
        },
    ];

    function handleTabChange(tabId) {
        setActiveTab(tabId);
        localStorage.setItem("activeTab", tabId);
    }

    useEffect(() => {
        // Obtener usuario desde el token
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/auth');
            return;
        }
        // Decodificar el token para obtener el rol
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUser(payload);
            if (payload.role !== 'admin') {
                navigate('/');
            }
        } catch {
            navigate('/auth');
        }
    }, [navigate]);

    useEffect(() => {
        async function fetchProducts() {
            try {
                setLoading(true);
                const res = await fetch(`${API_URL}/api/products/`);
                const data = await res.json();
                setProducts(data);
            } catch (err) {
                setError('Error al cargar productos');
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, [API_URL]);

    useEffect(() => {
        async function fetchHistory() {
            setLoadingHistory(true);
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_URL}/api/carts/confirmados`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Error al obtener historial');
                setHistory(Array.isArray(data) ? data : []);
            } catch (err) {
                toast.error(err.message || 'Error al obtener historial');
            } finally {
                setLoadingHistory(false);
            }
        }

        if (activeTab === 'history') {
            fetchHistory();
        }
    }, [activeTab, API_URL]);

    if (loading) return <div className="p-6 text-center">Cargando...</div>;
    if (error) return <div className="p-6 text-center text-red-600">{error}</div>;

    return (
        <main className="bg-gray-100 px-6 md:px-12 pt-12 relative overflow-hidden min-h-screen w-full">
            <ToastContainer
                position="top-right"
                autoClose={2500}
                theme="light"
            />

            <div className="flex flex-col relative z-10 md:px-6 py-20">                 
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-black mb-2 text-center animate-fadeInDown drop-shadow-lg">
                        Panel de Administración
                    </h1>
                    <p className="text-gray-600 text-center">
                        Gestiona productos, usuarios y configuraciones del sistema
                    </p>
                </div>

                {/* Tabs Navigation */}
                <div className="mb-8">
                    <nav className="flex overflow-x-auto border-b border-gray-200 no-scrollbar">
                        {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors duration-200
                                    ${
                                    activeTab === tab.id
                                        ? "border-b-2 border-blue-600 text-blue-600"
                                        : "text-gray-600 hover:text-gray-900 hover:border-gray-300"
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{tab.label}</span>
                            </button>
                        );
                        })}
                    </nav>
                </div>


                {/* Tab Content */}
                <div className="transition-opacity duration-200">
                    {activeTab === 'products' && (
                        <AdminProducts
                            products={products}
                            setProducts={setProducts}
                            API_URL={API_URL}
                        />
                    )}
                    
                    {activeTab === 'actions' && (
                        <AdminActions
                            products={products}
                            setProducts={setProducts}
                            API_URL={API_URL}
                        />
                    )}

                    {activeTab === 'pending' && (
                        <PendingOrders
                            API_URL={API_URL}
                        />
                    )}


                    {activeTab === 'history' && (
                        <HistoryOrders
                            history={history}
                            loading={loadingHistory}
                            onClose={() => {}}
                        />
                    )}

                    {/* Futuras tabs acá */}
                    
                </div>
            </div>
        </main>
    );
}