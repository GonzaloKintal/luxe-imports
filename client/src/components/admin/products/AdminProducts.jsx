import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaChevronDown, FaList } from 'react-icons/fa';
import ConfirmDeleteProduct from './ConfirmDeleteProduct';
import FilteredProductsList from './FilteredProductsList';
import ProductFilters from './ProductFilters';

export default function AdminProducts({ products, setProducts, API_URL, loading, error }) {

    const DOLAR_API_URL = import.meta.env.VITE_DOLAR_API_URL;
    const [cotizacion, setCotizacion] = useState(null);
    const [loadingCotizacion, setLoadingCotizacion] = useState(true);
    const [errorCotizacion, setErrorCotizacion] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [showActivos, setShowActivos] = useState(true);
    const [search, setSearch] = useState("");
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

        // Al montar el componente, obtener productos actualizados
        async function fetchProducts() {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_URL}/api/products`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!res.ok) throw new Error('Error al obtener productos');
                const data = await res.json();
                setProducts(data);
            } catch (err) {
                // Opcional: mostrar error
            }
        }
        fetchProducts();
    }, [DOLAR_API_URL, API_URL, setProducts]);

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
                body: JSON.stringify({ status: false }),
            });
            if (!res.ok) throw new Error('Error al eliminar');
            setProducts(products.map(p => (p._id === deleteId || p.id === deleteId) ? { ...p, status: false } : p));
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

    async function handleEdit({ id: productId, formData }) {
        try {
            const token = localStorage.getItem('token');
            
            const res = await fetch(`${API_URL}/api/products/${productId}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Error al editar producto');
            }

            const updated = await res.json();
            setProducts(products.map(p => (p._id === productId || p.id === productId) ? updated : p));
            toast.success('Producto editado correctamente');
            setEditingProductId(null);
        } catch (err) {
            console.error('AdminProducts: handleEdit error:', err);
            toast.error(err.message || 'No se pudo editar el producto');
        }
    }


    const filteredProducts = products
        .filter(p => showActivos ? p.status : !p.status)

        .filter(p => {
            if (stockFilter === 'conStock') return p.stock > 0;
            if (stockFilter === 'sinStock') return p.stock === 0;
            return true;
        })

        .filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()))
        
        .filter(p => {
            if (!categoryFilter) return true;
            if (!p.category) return false;
            
            if (typeof p.category === 'object' && p.category._id) {
                return p.category._id === categoryFilter;
            }
            return p.category === categoryFilter;
        });

    // Si está cargando productos
    if (loading) {
        return (
            <div className="w-full">
                <div className="flex justify-center items-center py-20 text-gray-600">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p>Cargando productos...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Si hay error cargando productos
    if (error) {
        return (
            <div className="w-full">
                <div className="flex justify-center items-center py-20 text-red-600">
                    <div className="text-center">
                        <div className="text-6xl mb-4">⚠️</div>
                        <h3 className="text-xl font-semibold mb-2">Error al cargar productos</h3>
                        <p className="text-gray-600">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    // Si no hay productos
    if (products.length === 0) {
        return (
            <div className="w-full">
                <div className="flex justify-center items-center py-20 text-gray-600">
                    <div className="text-center">
                        <div className="text-6xl mb-4">📦</div>
                        <h3 className="text-xl font-semibold mb-2">No hay productos</h3>
                        <p className="text-gray-500">Crea tu primer producto para comenzar</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">

            {/* Filtros */}
            <ProductFilters
                showActivos={showActivos}
                setShowActivos={setShowActivos}
                search={search}
                setSearch={setSearch}
                stockFilter={stockFilter}
                setStockFilter={setStockFilter}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                products={products}
            />

            {/* Subtítulo */}
            <h2 className="mt-4 text-lg text-gray-500 text-center flex items-center justify-end gap-2">
                Mostrando {filteredProducts.length} productos
            </h2>

            {/* Lista de productos */}
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

            {/* Modal de confirmación */}
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