import React, { useState } from 'react';
import { toast } from 'react-toastify';
import CreateProductForm from './CreateProductForm';
import CreateAdminForm from './CreateAdminForm';
import CategoryManager from './CategoryManager';
import { AnimatePresence } from "framer-motion";
import PageTransition from '../../PageTransition';
import ActionButtonsList from './ActionButtonsList';
import { FaWrench } from 'react-icons/fa';

export default function AdminActions({ products, setProducts, API_URL }) {
    const [openForm, setOpenForm] = useState('product');
    const [showForm, setShowForm] = useState(false);

    function handleOpenForm(form) {
        if (openForm === form) return; 
        setOpenForm(form);
        requestAnimationFrame(() => setShowForm(true));
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
        } catch (err) {
            toast.error(err.message || 'Error al crear admin');
        }
    }

    async function saveCreate(formData) {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/products/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });
            
            if (!res.ok) {
                let errorMessage = 'Error al crear producto';
                try {
                    const errorData = await res.json();
                    errorMessage = errorData.error || errorMessage;
                } catch (e) {
                    errorMessage = `Error ${res.status}: ${res.statusText}`;
                }
                throw new Error(errorMessage);
            }
            
            const created = await res.json();
            toast.success('Producto creado correctamente');
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.message || 'No se pudo crear el producto');
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6">
                
                {/* Botones (cards) */}
                <ActionButtonsList 
                    openForm={openForm}
                    onFormOpen={handleOpenForm}
                />

                {/* Formularios */}
                <AnimatePresence mode="wait">
                    {openForm === 'product' && (
                        <PageTransition key="product-form">
                            <div className="border-t border-gray-200 pt-5 mt-3">
                                <CreateProductForm
                                    onSave={saveCreate}
                                />
                            </div>
                        </PageTransition>
                    )}

                    {openForm === 'admin' && (
                        <PageTransition key="admin-form">
                            <div className="border-t border-gray-200 pt-5 mt-3">
                                <CreateAdminForm
                                    onSave={handleCreateAdmin}
                                />
                            </div>
                        </PageTransition>
                    )}

                    {openForm === 'category' && (
                        <PageTransition key="category-form">
                            <div className="border-t border-gray-200 pt-5 mt-3">
                                <CategoryManager />
                            </div>
                        </PageTransition>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}