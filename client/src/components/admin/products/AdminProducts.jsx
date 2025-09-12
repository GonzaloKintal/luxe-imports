import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaChevronDown, FaList } from 'react-icons/fa';
import ConfirmDeleteProduct from './ConfirmDeleteProduct';
import FilteredProductsList from './FilteredProductsList';
import ProductFilters from './ProductFilters';

export default function AdminProducts({ products, setProducts, API_URL }) {

    const DOLAR_API_URL = import.meta.env.VITE_DOLAR_API_URL || 'https://dolarapi.com/v1/dolares/oficial';
    const [cotizacion, setCotizacion] = useState(null);
    const [loadingCotizacion, setLoadingCotizacion] = useState(true);
    const [errorCotizacion, setErrorCotizacion] = useState(null);
    const productsDetailsRef = React.useRef(null);
    const [productsOpen, setProductsOpen] = useState(false);
    const [showActivos, setShowActivos] = useState(true);
    const [search, setSearch] = useState("");
    const [showList, setShowList] = useState(true);
    const [stockFilter, setStockFilter] = useState('todos');
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [editingProductId, setEditingProductId] = useState(null);
    const [deleteProductName, setDeleteProductName] = useState('');

    useEffect(() => {
        async function fetchDolar() {
            try {
                setLoadingCotizacion(true);
                const res = await fetch(DOLAR_API_URL);
                const data = await res.json();
                setCotizacion(data.venta);
            } catch (err) {
                setErrorCotizacion('No se pudo obtener la cotización');
            } finally {
                setLoadingCotizacion(false);
            }
        }
        fetchDolar();
    }, [DOLAR_API_URL]);

    async function toggleFeatured(product) {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/products/${product._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ featured: !product.featured }),
            });
            if (!res.ok) throw new Error('Error al actualizar destacado');
            const updated = await res.json();
            setProducts(products.map(p => p._id === updated._id ? updated : p));
            toast.success(updated.featured ? 'Marcado como destacado' : 'Quitado de destacados');
        } catch {
            toast.error('No se pudo actualizar el estado de destacado');
        }
    }

    function handleDelete(id, name) {
        setDeleteId(id);
        setDeleteProductName(name);
        setShowConfirm(true);
    }

    async function confirmDelete() {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/products/${deleteId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: false, stock: 0 }),
            });
            if (!res.ok) throw new Error('Error al eliminar');
            setProducts(products.map(p => (p._id === deleteId || p.id === deleteId) ? { ...p, status: false, stock: 0 } : p));
            toast.success('Producto eliminado correctamente');
        } catch {
            toast.error('No se pudo eliminar el producto');
        } finally {
            setShowConfirm(false);
            setDeleteId(null);
            setDeleteProductName('');
        }
    }

    async function handleReactivate(id) {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: true }),
            });
            if (!res.ok) throw new Error('Error al reactivar');
            setProducts(products.map(p => (p._id === id || p.id === id) ? { ...p, status: true } : p));
            toast.success('Producto reactivado');
        } catch {
            toast.error('No se pudo reactivar el producto');
        }
    }

    // Función para iniciar edición (cierra cualquier edición previa)
    function startEditing(productId) {
        setEditingProductId(productId);
    }

    // Función para cancelar edición
    function cancelEditing() {
        setEditingProductId(null);
    }

    async function handleEdit(form) {
        try {
            console.log('AdminProducts: handleEdit form:', form);
            const token = localStorage.getItem('token');
            const productId = form.id;
            console.log('AdminProducts: handleEdit productId:', productId);
            console.log('AdminProducts: handleEdit body:', form.body);
            
            const res = await fetch(`${API_URL}/api/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form.body),
            });
            
            if (!res.ok) throw new Error('Error al editar producto');
            
            const updated = await res.json();
            setProducts(products.map(p => (p._id === productId || p.id === productId) ? updated : p));
            setEditingProductId(null);
            toast.success('Producto editado correctamente');
        } catch (err) {
            console.error('AdminProducts: handleEdit error:', err);
            toast.error('No se pudo editar el producto');
        }
    }

    const filteredProducts = products
        .filter(p => showActivos ? p.status : !p.status)
        .filter(p => {
            if (stockFilter === 'conStock') return p.stock > 0;
            if (stockFilter === 'sinStock') return p.stock === 0;
            return true;
        })
        .filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()));

    if (products.length === 0) {
        return null;
    }

    return (
        <div className="w-full mt-6">
            <details className="w-full" ref={productsDetailsRef} onToggle={e => setProductsOpen(productsDetailsRef.current?.open)}>
                <summary className="cursor-pointer px-6 py-4 bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 text-gray-900 rounded-xl font-bold text-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-between gap-3 select-none">
                    <span className="flex items-center gap-3">
                        <FaList className="text-xl text-gray-600" /> Administrar productos ({filteredProducts.length})
                    </span>
                    <FaChevronDown className={`text-xl opacity-70 ml-2 transition-transform duration-300 ${productsOpen ? 'rotate-180' : ''}`} />
                </summary>
                <ProductFilters
                    showActivos={showActivos}
                    setShowActivos={setShowActivos}
                    search={search}
                    setSearch={setSearch}
                    stockFilter={stockFilter}
                    setStockFilter={setStockFilter}
                    showList={showList}
                    setShowList={setShowList}
                />
            </details>

            {/* Lista de productos filtrados */}
            {showList && productsOpen && (
                <FilteredProductsList
                    filteredProducts={filteredProducts}
                    onEdit={handleEdit}
                    onToggleFeatured={toggleFeatured}
                    onDelete={handleDelete}
                    onReactivate={handleReactivate}
                    cotizacion={cotizacion}
                    loadingCotizacion={loadingCotizacion}
                    errorCotizacion={errorCotizacion}
                    editingProductId={editingProductId}
                    onStartEditing={startEditing}
                    onCancelEditing={cancelEditing}
                />
            )}

            {/* Modal de confirmación de eliminación */}
            <ConfirmDeleteProduct
                open={showConfirm}
                title="Confirmar eliminación"
                message="¿Seguro que quieres eliminar este producto?"
                productName={deleteProductName}
                onConfirm={confirmDelete}
                onCancel={() => { 
                    setShowConfirm(false); 
                    setDeleteId(null);
                    setDeleteProductName('');
                }}
            />

        </div>
    );

}