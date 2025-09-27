import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotify } from '../components/ToastProvider';
import { FaBolt, FaList, FaHistory, FaClock } from 'react-icons/fa';
import AdminActions from '../components/admin/actions/AdminActions';
import AdminProducts from '../components/admin/products/AdminProducts';
import HistoryOrders from '../components/admin/history/HistoryOrders';
import PendingOrders from '../components/admin/pending-orders/PendingOrders';
import TokenExpiryModal from '../components/TokenExpiryModal';
import { useTokenExpiry } from '../context/TokenExpiryContext';
import { useAuthFetch } from '../hooks/useAuthFetch';

export default function AdminPanel() {
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState(
        localStorage.getItem("activeTab") || "products"
    );
    const [history, setHistory] = useState([]);

    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;
    const notify = useNotify();
    const { showModal, closeModal, handleTokenExpiry } = useTokenExpiry();
    const { authFetch } = useAuthFetch();

    const tabs = [
        { id: 'products', label: 'Productos', icon: FaList },
        { id: 'actions', label: 'Acciones', icon: FaBolt },
        { id: 'pending', label: 'Pendientes', icon: FaClock },
        { id: 'history', label: 'Historial', icon: FaHistory },
    ];

    function handleTabChange(tabId) {
        setActiveTab(tabId);
        localStorage.setItem("activeTab", tabId);
    }

    // 🔐 Validar token al entrar al panel
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            handleTokenExpiry();
            return;
        }

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));

            // Verificar expiración del token
            if (payload.exp && Date.now() >= payload.exp * 1000) {
                handleTokenExpiry();
                return;
            }

            setUser(payload);
            if (payload.role !== 'admin') {
                navigate('/');
            }
        } catch {
            handleTokenExpiry();
        }
    }, [navigate, handleTokenExpiry]);

    useEffect(() => {
        async function fetchProducts() {
            try {
                setLoading(true);
                const res = await authFetch(`${API_URL}/api/products/`);
                if (!res) return; // si el token expiró, el hook maneja el modal
                const data = await res.json();
                setProducts(data);
            } catch (err) {
                setError('Error al cargar productos');
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, [API_URL, authFetch]);

    return (
        <main className="bg-gray-100 px-6 md:px-12 pt-12 relative overflow-hidden min-h-screen w-full">
            {/* 🔔 Modal de token expirado */}
            {showModal && (
                <TokenExpiryModal
                    onClose={closeModal}
                    message="Tu sesión ha expirado. Por favor inicia sesión nuevamente."
                />
            )}

            {/* Renderizar panel solo si no hay modal */}
            {!showModal && (
                <div className="flex flex-col relative z-10 md:px-6 py-10 sm:py-20">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 text-center relative after:block after:h-1 after:w-24 after:bg-blue-500 after:mx-auto after:mt-4">
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
                    <div className="relative overflow-hidden">
                        {activeTab === 'products' && (
                            <AdminProducts
                                products={products}
                                setProducts={setProducts}
                                API_URL={API_URL}
                                loading={loading}
                                error={error}
                            />
                        )}
                        {activeTab === 'actions' && (
                            <AdminActions
                                products={products}
                                setProducts={setProducts}
                                API_URL={API_URL}
                                loading={loading}
                                error={error}
                            />
                        )}
                        {activeTab === 'pending' && (
                            <PendingOrders API_URL={API_URL} authFetch={authFetch} />
                        )}
                        {activeTab === 'history' && (
                            <HistoryOrders history={history} authFetch={authFetch} />
                        )}
                    </div>
                </div>
            )}
        </main>
    );
}
