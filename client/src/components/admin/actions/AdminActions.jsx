import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaUserShield, FaHistory, FaChevronDown, FaShieldAlt } from 'react-icons/fa';
import CreateProductForm from './CreateProductForm';
import CreateAdminForm from './CreateAdminForm';
import HistoryAdmin from './HistoryAdmin';

export default function AdminActions({ products, setProducts, API_URL }) {
    const adminDetailsRef = React.useRef(null);
    const [adminOpen, setAdminOpen] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [showCreateAdmin, setShowCreateAdmin] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [history, setHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [renderHistoryForm, setRenderHistoryForm] = useState(false);
    const [openForm, setOpenForm] = useState(null); // 'product' | 'admin' | 'history' | null
    const [showForm, setShowForm] = useState(false);


    function handleOpenForm(form) {
        if (openForm === form) return; // si clickeo el mismo, no hace nada
        setOpenForm(form);
        requestAnimationFrame(() => setShowForm(true));
    }

    function handleCloseForm() {
        setShowForm(false);
        setTimeout(() => setOpenForm(null), 300); // 300ms = duración de la transición
    }

    function closeCreateProduct() {
        setShowCreate(false);
    }

    // Helpers para animación - Historial
    function openHistory() {
        setRenderHistoryForm(true);
        requestAnimationFrame(() => setShowHistory(true));
    }

    function handleOpenHistory() {
        handleOpenForm('history');
        handleShowHistory();
    }

    async function handleShowHistory() {
        openHistory()
        setLoadingHistory(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/carts/paid`, {
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

    async function handleCreateAdmin(form) {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/admin/create-admin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ ...form, role: 'admin' }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al crear admin');
            toast.success('Admin creado correctamente');
            setShowCreateAdmin(false);
        } catch (err) {
            toast.error(err.message || 'Error al crear admin');
        }
    }

    async function saveCreate(form) {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/products/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error('Error al crear producto');
            const created = await res.json();
            setProducts([...products, created]);
            closeCreateProduct();
            toast.success('Producto creado correctamente');
        } catch {
            toast.error('No se pudo crear el producto');
        }
    }

    return (
        <div className="w-full">
            <details className="w-full" ref={adminDetailsRef} onToggle={e => setAdminOpen(adminDetailsRef.current?.open)}>
                <summary className="cursor-pointer px-6 py-4 bg-gray-100 border border-gray-300 text-gray-900 rounded-xl font-bold text-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-between gap-3 select-none">
                    <span className="flex items-center gap-3">
                        <FaShieldAlt className="text-xl text-gray-600" /> Acciones de administrador
                    </span>
                    <FaChevronDown className={`text-xl opacity-70 ml-2 transition-transform duration-300 ${adminOpen ? 'rotate-180' : ''}`} />
                </summary>
                <div className="flex flex-col gap-3 mt-4 p-4 bg-white rounded-xl shadow-lg border border-gray-300">
                    
                    <button
                        onClick={() => handleOpenForm('product')} 
                        className="flex items-center gap-2 px-5 py-3 rounded-lg font-semibold bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300 shadow-sm transition-all duration-300"
                    >
                        <FaPlus className="text-xl" /> Crear producto
                    </button>

                    {openForm === 'product' && (
                        <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                showForm ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                            }`}
                        >
                            <CreateProductForm
                                onSave={saveCreate}
                                onCancel={handleCloseForm}
                            />
                        </div>
                    )}

                    <button
                        onClick={() => handleOpenForm('admin')} 
                        className="flex items-center gap-2 px-5 py-3 rounded-lg font-semibold bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300 shadow-sm transition-all duration-300"
                    >
                        <FaUserShield className="text-xl" /> Crear admin
                    </button>

                    {openForm === 'admin' && (
                        <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                showForm ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                            }`}
                        >
                            <CreateAdminForm
                                onSave={handleCreateAdmin}
                                onCancel={handleCloseForm}
                            />
                        </div>
                    )}

                    <button
                        onClick={() => handleOpenHistory('history')} 
                        className="flex items-center gap-2 px-5 py-3 rounded-lg font-semibold bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300 shadow-sm transition-all duration-300"
                    >
                        <FaHistory className="text-xl" /> Ver historial de compras
                    </button>

                    {openForm === 'history' && (
                        <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                showForm ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                            }`}
                        >
                            <HistoryAdmin
                                history={history}
                                loading={loadingHistory}
                                onClose={handleCloseForm}
                            />
                        </div>
                    )}

                </div>
            </details>

        </div>
    );
}