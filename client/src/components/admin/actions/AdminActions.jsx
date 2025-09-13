import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaUserShield, FaTag } from 'react-icons/fa';
import CreateProductForm from './CreateProductForm';
import CreateAdminForm from './CreateAdminForm';
import CreateCategoryForm from './CreateCategoryForm';

export default function AdminActions({ products, setProducts, API_URL }) {
    const [openForm, setOpenForm] = useState(null); // 'product' | 'admin' | null
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
            handleCloseForm();
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
            handleCloseForm();
            toast.success('Producto creado correctamente');
        } catch {
            toast.error('No se pudo crear el producto');
        }
    }

    function handleCreateCategory(form) {
        // Placeholder para la funcionalidad futura
        toast.info('Funcionalidad de creación de categorías próximamente');
        handleCloseForm();
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <button
                        onClick={() => handleOpenForm('product')} 
                        className="flex items-center gap-3 px-6 py-4 rounded-lg font-medium bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-all duration-200"
                    >
                        <FaPlus className="text-lg" />
                        <span>Crear Producto</span>
                    </button>

                    <button
                        onClick={() => handleOpenForm('admin')} 
                        className="flex items-center gap-3 px-6 py-4 rounded-lg font-medium bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 transition-all duration-200"
                    >
                        <FaUserShield className="text-lg" />
                        <span>Crear Admin</span>
                    </button>

                    <button
                        onClick={() => handleOpenForm('category')} 
                        className="flex items-center gap-3 px-6 py-4 rounded-lg font-medium bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 transition-all duration-200"
                    >
                        <FaTag className="text-lg" />
                        <span>Crear Categoría</span>
                    </button>
                </div>

                {/* Formulario de Crear Producto */}
                {openForm === 'product' && (
                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            showForm ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                        }`}
                    >
                        <div className="border-t border-gray-200 pt-4">
                            <CreateProductForm
                                onSave={saveCreate}
                                onCancel={handleCloseForm}
                            />
                        </div>
                    </div>
                )}

                {/* Formulario de Crear Admin */}
                {openForm === 'admin' && (
                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            showForm ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                        }`}
                    >
                        <div className="border-t border-gray-200 pt-4">
                            <CreateAdminForm
                                onSave={handleCreateAdmin}
                                onCancel={handleCloseForm}
                            />
                        </div>
                    </div>
                )}

                {/* Formulario de Crear Categoría */}
                {openForm === 'category' && (
                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            showForm ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                        }`}
                    >
                        <div className="border-t border-gray-200 pt-4">
                            <CreateCategoryForm
                                onSave={handleCreateCategory}
                                onCancel={handleCloseForm}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}