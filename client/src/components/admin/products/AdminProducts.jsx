
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import { FaList } from 'react-icons/fa';
import ConfirmDeleteProduct from './ConfirmDeleteProduct';
import FilteredProductsList from './FilteredProductsList';
import ProductFilters from './ProductFilters';
import useAdminProductsStore from '../../../store/adminProductsStore';
import useProductsStore from '../../../store/productsStore';
import { useAuthFetch } from '../../../hooks/useAuthFetch';

export default function AdminProducts() {
    const { authFetch } = useAuthFetch();
    const memoizedAuthFetch = useMemo(() => authFetch, [authFetch]);
    const DOLAR_API_URL = import.meta.env.VITE_DOLAR_API_URL;

    const {
        products,
        loading,
        loadingMore,
        error,
        hasMoreProducts,
        fetchProductos,
        cargarMasProductos,
        toggleFeatured: storeToggleFeatured,
        deleteProduct: storeDeleteProduct,
        reactivateProduct: storeReactivateProduct,
        editProduct: storeEditProduct,
        refreshProducts,
        isInitialized
    } = useAdminProductsStore();

    const { categorias, fetchCategorias } = useProductsStore();

    // Cargar categorías
    useEffect(() => {
        fetchCategorias();
    }, [fetchCategorias]);

    // Cotización del dólar (fetch normal)
    const [cotizacion, setCotizacion] = useState(null);
    const [loadingCotizacion, setLoadingCotizacion] = useState(true);
    const [errorCotizacion, setErrorCotizacion] = useState(null);

    useEffect(() => {
        const fetchDolar = async () => {
            try {
                setLoadingCotizacion(true);
                const res = await fetch(DOLAR_API_URL);
                const data = await res.json();
                setCotizacion(data.venta);
            } catch {
                setErrorCotizacion('No se pudo obtener la cotización');
            } finally {
                setLoadingCotizacion(false);
            }
        };
        fetchDolar();
    }, [DOLAR_API_URL]);

    // Filtros persistentes
    const filtrosGuardados = JSON.parse(sessionStorage.getItem('adminProductosFiltros') || '{}');
    const [categoryFilter, setCategoryFilter] = useState(filtrosGuardados.categoryFilter || '');
    const [showActivos, setShowActivos] = useState(filtrosGuardados.showActivos ?? true);
    const [search, setSearch] = useState(filtrosGuardados.search || '');
    const [stockFilter, setStockFilter] = useState(filtrosGuardados.stockFilter || 'todos');
    const [sortFilter, setSortFilter] = useState(filtrosGuardados.sortFilter || 'display_order');

    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [deleteProductName, setDeleteProductName] = useState('');
    const [editingProductId, setEditingProductId] = useState(null);

    useEffect(() => {
        sessionStorage.setItem('adminProductosFiltros', JSON.stringify({
            categoryFilter,
            showActivos,
            search,
            stockFilter,
            sortFilter
        }));
    }, [categoryFilter, showActivos, search, stockFilter, sortFilter]);

    // Fetch inicial productos
    useEffect(() => {
        if (!isInitialized) {
            const filters = {
                search,
                category: categoryFilter,
                stock: stockFilter,
                status: showActivos ? 'active' : 'inactive',
                sort: sortFilter
            };
            fetchProductos(filters, memoizedAuthFetch);
        }
    }, [isInitialized, fetchProductos, memoizedAuthFetch, search, categoryFilter, stockFilter, showActivos, sortFilter]);

    // Handlers filtros
    const handleSearchChange = (value) => {
        setSearch(value);
        applyFilters({ search: value, category: categoryFilter, stock: stockFilter, status: showActivos ? 'active' : 'inactive', sort: sortFilter });
    };
    const handleCategoryChange = (value) => {
        setCategoryFilter(value);
        applyFilters({ search, category: value, stock: stockFilter, status: showActivos ? 'active' : 'inactive', sort: sortFilter });
    };
    const handleStockChange = (value) => {
        setStockFilter(value);
        applyFilters({ search, category: categoryFilter, stock: value, status: showActivos ? 'active' : 'inactive', sort: sortFilter });
    };
    const handleStatusChange = (value) => {
        setShowActivos(value);
        applyFilters({ search, category: categoryFilter, stock: stockFilter, status: value ? 'active' : 'inactive', sort: sortFilter });
    };
    const handleSortChange = (value) => {
        setSortFilter(value);
        applyFilters({ search, category: categoryFilter, stock: stockFilter, status: showActivos ? 'active' : 'inactive', sort: value });
    };

    const applyFilters = useCallback(async (filters) => {
        await fetchProductos(filters, memoizedAuthFetch);
    }, [fetchProductos, memoizedAuthFetch]);

    const limpiarFiltros = () => {
        setSearch('');
        setCategoryFilter('');
        setStockFilter('todos');
        setShowActivos(true);
        setSortFilter('display_order');
        applyFilters({ search: '', category: '', stock: 'todos', status: 'active', sort: 'display_order' });
    };

    // Funciones de productos con authFetch
    const handleToggleFeatured = async (product) => {
        const result = await storeToggleFeatured(product, memoizedAuthFetch);
        toast[result.success ? 'success' : 'error'](result.message);
    };
    const handleDelete = (id, name) => {
        setDeleteId(id);
        setDeleteProductName(name);
        setShowConfirm(true);
    };
    const confirmDelete = async () => {
        const result = await storeDeleteProduct(deleteId, memoizedAuthFetch);
        toast[result.success ? 'success' : 'error'](result.message);
        await applyFilters({ search, category: categoryFilter, stock: stockFilter, status: showActivos ? 'active' : 'inactive', sort: sortFilter });
        setShowConfirm(false);
        setDeleteId(null);
        setDeleteProductName('');
    };
    const handleReactivate = async (id) => {
        const result = await storeReactivateProduct(id, memoizedAuthFetch);
        toast[result.success ? 'success' : 'error'](result.message);
        await applyFilters({ search, category: categoryFilter, stock: stockFilter, status: showActivos ? 'active' : 'inactive', sort: sortFilter });
    };
    const handleEdit = async ({ id, formData }) => {
        const result = await storeEditProduct(id, formData, memoizedAuthFetch);
        toast[result.success ? 'success' : 'error'](result.message);
        if (result.success) {
            await applyFilters({ search, category: categoryFilter, stock: stockFilter, status: showActivos ? 'active' : 'inactive', sort: sortFilter });
        }
    };

    // Renderizado de errores y lista de productos (igual que antes)
    if (error) {
        return (
            <div className="w-full text-center py-20 text-red-600">
                <h3 className="text-xl font-semibold mb-2">Error al cargar productos</h3>
                <p className="text-gray-600">{error}</p>
                <button onClick={() => refreshProducts(memoizedAuthFetch)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                    Intentar de nuevo
                </button>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Filtros */}
            <ProductFilters
                showActivos={showActivos}
                setShowActivos={handleStatusChange}
                search={search}
                setSearch={handleSearchChange}
                stockFilter={stockFilter}
                setStockFilter={handleStockChange}
                categoryFilter={categoryFilter}
                setCategoryFilter={handleCategoryChange}
                sortFilter={sortFilter}
                setSortFilter={handleSortChange}
                categorias={categorias}
            />

            {/* Contador */}
            <div className="flex justify-between items-center mt-4 mb-4">
                <h2 className="text-base sm:text-lg text-gray-500 flex items-center gap-2">
                    <FaList className="text-gray-400" />
                    Mostrando {products.length} productos
                </h2>
            </div>

            {/* Lista de productos */}
            <FilteredProductsList
                filteredProducts={products}
                onEdit={handleEdit}
                onToggleFeatured={handleToggleFeatured}
                onDelete={handleDelete}
                onReactivate={handleReactivate}
                cotizacion={cotizacion}
                loadingCotizacion={loadingCotizacion}
                errorCotizacion={errorCotizacion}
                editingProductId={editingProductId}
                onStartEditing={setEditingProductId}
                onCancelEditing={() => setEditingProductId(null)}
                loading={loading}
            />

            {/* Cargar más */}
            {!loading && !error && hasMoreProducts && (
                <div className="flex justify-center mt-12 mb-4">
                    <button
                        onClick={() => cargarMasProductos(memoizedAuthFetch)}
                        disabled={loadingMore}
                        className={`px-6 py-3 border-2 rounded-lg font-medium ${loadingMore ? 'bg-gray-400 cursor-not-allowed' : 'bg-transparent hover:border-gray-900'}`}
                    >
                        {loadingMore ? 'Cargando...' : 'Cargar más'}
                    </button>
                </div>
            )}

            {/* No hay más */}
            {!loading && !error && !hasMoreProducts && products.length > 0 && (
                <div className="text-center mt-8 mb-4">
                    <p className="text-gray-600 text-sm sm:text-base font-medium">
                        Has visto todos los productos disponibles
                    </p>
                </div>
            )}

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
