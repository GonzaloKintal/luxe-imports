import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotify } from '../components/common/ToastProvider';
import { FaBolt, FaList, FaHistory, FaClock } from 'react-icons/fa';
import AdminActions from '../components/admin/actions/AdminActions';
import AdminProducts from '../components/admin/products/AdminProducts';
import HistoryOrders from '../components/admin/history/HistoryOrders';
import PendingOrders from '../components/admin/pending-orders/PendingOrders';

export default function AdminPanel() {
    const [activeTab, setActiveTab] = useState(localStorage.getItem("activeTab") || "products");

    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;
    const notify = useNotify();

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

    return (
        <main className="bg-gray-100 px-6 md:px-12 pt-12 relative overflow-hidden min-h-screen w-full">
            <div className="flex flex-col relative z-10 md:px-6 py-10 sm:py-20">
                
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 sm:mb-10 text-center relative
                        after:block after:h-1 after:w-16 sm:after:w-24 after:bg-gray-800 after:mx-auto after:mt-2 sm:after:mt-4">
                        Panel de Administración
                    </h1>
                    <p className="text-gray-600 text-center text-sm sm:text-base">
                        Gestioná productos, pedidos pendientes e historial de pedidos
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
                    {activeTab === 'products' && <AdminProducts API_URL={API_URL} />}
                    {activeTab === 'actions' && <AdminActions API_URL={API_URL} />}
                    {activeTab === 'pending' && <PendingOrders API_URL={API_URL} />}
                    {activeTab === 'history' && <HistoryOrders />}
                </div>
            </div>
        </main>
    );
}
