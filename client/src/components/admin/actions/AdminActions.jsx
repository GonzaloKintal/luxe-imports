

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import CreateProductForm from './CreateProductForm';
import CreateAdminForm from './CreateAdminForm';
import CategoryManager from './CategoryManager';
import { AnimatePresence } from "framer-motion";
import PageTransition from '../../common/PageTransition';
import ActionButtonsList from './ActionButtonsList';
import { useAuthFetch } from '../../../hooks/useAuthFetch';
import useAdminProductsStore from '../../../store/adminProductsStore';

export default function AdminActions({ API_URL }) {
    const [openForm, setOpenForm] = useState('product');
    const { authFetch } = useAuthFetch();
    
    // Consumimos productos y método de actualización del store
    const { products, updateProduct, fetchProductos } = useAdminProductsStore();

    function handleOpenForm(form) {
        if (openForm === form) return;
        setOpenForm(form);
        requestAnimationFrame(() => {});
    }

    async function handleCreateAdmin(form) {
        try {
            const res = await authFetch(`${API_URL}/api/admin/create-admin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, role: 'admin' }),
            });
            if (!res) return;
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al crear admin');
            toast.success('Admin creado correctamente');
        } catch (err) {
            toast.error(err.message || 'Error al crear admin');
        }
    }

    async function saveCreate(formData) {
        try {
            const res = await authFetch(`${API_URL}/api/products/`, {
                method: 'POST',
                body: formData,
            });
            if (!res) return false;
            if (!res.ok) {
                let errorMessage = 'Error al crear producto';
                try {
                    const errorData = await res.json();
                    errorMessage = errorData.error || errorMessage;
                } catch {
                    errorMessage = `Error ${res.status}: ${res.statusText}`;
                }
                throw new Error(errorMessage);
            }
            const created = await res.json();
            toast.success('Producto creado correctamente');
            
            // Actualizamos store
            updateProduct(created._id, created);
            
            // Forzar recarga de página después de mostrar el toast
            setTimeout(() => {
                window.location.reload();
            }, 1500);
            
            return true;

        } catch (error) {
            console.error('Error:', error);
            toast.error(error.message || 'No se pudo crear el producto');
            return false;
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-3 sm:p-6">
                <ActionButtonsList 
                    openForm={openForm}
                    onFormOpen={handleOpenForm}
                />

                <AnimatePresence mode="wait">
                    {openForm === 'product' && (
                        <PageTransition key="product-form">
                            <div className="border-t border-gray-200 pt-5 mt-3">
                                <CreateProductForm onSave={saveCreate} />
                            </div>
                        </PageTransition>
                    )}

                    {openForm === 'admin' && (
                        <PageTransition key="admin-form">
                            <div className="border-t border-gray-200 pt-5 mt-3">
                                <CreateAdminForm onSave={handleCreateAdmin} />
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
