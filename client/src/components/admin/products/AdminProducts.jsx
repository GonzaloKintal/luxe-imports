import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaChevronDown, FaList } from 'react-icons/fa';
import ConfirmDeleteProduct from './ConfirmDeleteProduct';
import FilteredProductsList from './FilteredProductsList';
import ProductFilters from './ProductFilters';
import useAdminProductsStore from '../../../store/adminProductsStore';
import useProductsStore from '../../../store/productsStore';

export default function AdminProducts() {
    const DOLAR_API_URL = import.meta.env.VITE_DOLAR_API_URL;
    
    // Estados del store global
    const {
        products,
        loading,
        loadingMore,
        error,
        hasMoreProducts,
        fetchProductos,
        cargarMasProductos,
        toggleFeatured,
        deleteProduct,
        reactivateProduct,
        editProduct,
        refreshProducts
    } = useAdminProductsStore();

    const { categorias, fetchCategorias } = useProductsStore();

    useEffect(() => {
        fetchCategorias();
    }, [fetchCategorias]);

    // Estado para cotización del dólar
    const [cotizacion, setCotizacion] = useState(null);
    const [loadingCotizacion, setLoadingCotizacion] = useState(true);
    const [errorCotizacion, setErrorCotizacion] = useState(null);

    // Estados locales para filtros
    const filtrosGuardados = JSON.parse(sessionStorage.getItem('adminProductosFiltros') || '{}');
    const [categoryFilter, setCategoryFilter] = useState(filtrosGuardados.categoryFilter || '');
    const [showActivos, setShowActivos] = useState(
        filtrosGuardados.showActivos !== undefined ? filtrosGuardados.showActivos : true
    );
    const [search, setSearch] = useState(filtrosGuardados.search || '');
    const [stockFilter, setStockFilter] = useState(filtrosGuardados.stockFilter || 'todos');

    // Estados para modal de confirmación
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [deleteProductName, setDeleteProductName] = useState('');

    // Estado para edición
    const [editingProductId, setEditingProductId] = useState(null);

    // Estado para controlar si necesitamos aplicar filtros
    const [shouldApplyFilters, setShouldApplyFilters] = useState(true);
    const [esCargaInicial, setEsCargaInicial] = useState(true);

    // Persistencia de filtros en sessionStorage
    useEffect(() => {
        sessionStorage.setItem('adminProductosFiltros', JSON.stringify({
            categoryFilter,
            showActivos,
            search,
            stockFilter
        }));
    }, [categoryFilter, showActivos, search, stockFilter]);

    // Aplicar filtros cuando cambien
    useEffect(() => {
        if (shouldApplyFilters) {
            const filters = {
                search: search,
                category: categoryFilter,
                stock: stockFilter,
                status: showActivos ? 'active' : 'inactive',
                sort: 'newest'
            };
            
            fetchProductos(filters);
            setShouldApplyFilters(false);
        }
    }, [search, categoryFilter, stockFilter, showActivos, shouldApplyFilters, fetchProductos]);

    // Cargar datos iniciales al montar el componente
    useEffect(() => {
        if (esCargaInicial) {
            setShouldApplyFilters(true);
            setEsCargaInicial(false);
        }

        // Cargar cotización del dólar
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
    }, [DOLAR_API_URL, esCargaInicial]);

    // Wrapper para toggleFeatured con toast
    async function handleToggleFeatured(product) {
        const result = await toggleFeatured(product);
        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
    }

    // Función para mostrar modal de confirmación de eliminación
    function handleDelete(id, name) {
        setDeleteId(id);
        setDeleteProductName(name);
        setShowConfirm(true);
    }

    // Confirmar eliminación
    async function confirmDelete() {
        const result = await deleteProduct(deleteId);
        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
        
        // Limpiar estado del modal
        setShowConfirm(false);
        setDeleteId(null);
        setDeleteProductName('');
    }

    // Wrapper para reactivar producto con toast
    async function handleReactivate(id) {
        const result = await reactivateProduct(id);
        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
    }

    // Función para iniciar edición
    function startEditing(productId) {
        setEditingProductId(productId);
    }

    // Función para cancelar edición
    function cancelEditing() {
        setEditingProductId(null);
    }

    // Wrapper para editar producto con toast
    async function handleEdit({ id: productId, formData }) {
        const result = await editProduct(productId, formData);
        if (result.success) {
            toast.success(result.message);
            setEditingProductId(null);
        } else {
            toast.error(result.message);
        }
    }

    // Funciones para manejar cambios de filtros
    const handleSearchChange = (value) => {
        setSearch(value);
        setShouldApplyFilters(true);
    };

    const handleCategoryChange = (value) => {
        setCategoryFilter(value);
        setShouldApplyFilters(true);
    };

    const handleStockChange = (value) => {
        setStockFilter(value);
        setShouldApplyFilters(true);
    };

    const handleStatusChange = (value) => {
        setShowActivos(value);
        setShouldApplyFilters(true);
    };

    // Función para limpiar filtros
    const limpiarFiltros = () => {
        setSearch('');
        setCategoryFilter('');
        setStockFilter('todos');
        setShowActivos(true);
        setShouldApplyFilters(true);
    };

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
                        <button
                            onClick={refreshProducts}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                            Intentar de nuevo
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Si no hay productos
    if (products.length === 0 && !loading) {
        return (
            <div className="w-full">
                <ProductFilters
                    showActivos={showActivos}
                    setShowActivos={handleStatusChange}
                    search={search}
                    setSearch={handleSearchChange}
                    stockFilter={stockFilter}
                    setStockFilter={handleStockChange}
                    categoryFilter={categoryFilter}
                    setCategoryFilter={handleCategoryChange}
                    categorias={categorias}
                />
                
                <div className="flex justify-center items-center py-20 text-gray-600">
                    <div className="text-center">
                        <div className="text-6xl mb-4">📦</div>
                        <h3 className="text-xl font-semibold mb-2">No se encontraron productos</h3>
                        <p className="text-gray-500">No hay productos que coincidan con los filtros aplicados</p>
                        <button
                            onClick={limpiarFiltros}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                            Limpiar filtros
                        </button>
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
                setShowActivos={handleStatusChange}
                search={search}
                setSearch={handleSearchChange}
                stockFilter={stockFilter}
                setStockFilter={handleStockChange}
                categoryFilter={categoryFilter}
                setCategoryFilter={handleCategoryChange}
                categorias={categorias}
            />

            {/* Subtítulo con contador */}
            <div className="flex justify-between items-center mt-4 mb-4">
                <h2 className="text-lg text-gray-500 flex items-center gap-2">
                    <FaList className="text-gray-400" />
                    Mostrando {products.length} productos
                </h2>
            </div>

            {/* Lista de productos */}
            <FilteredProductsList
                filteredProducts={products} // Ahora son los productos ya filtrados del backend
                onEdit={handleEdit}
                onToggleFeatured={handleToggleFeatured}
                onDelete={handleDelete}
                onReactivate={handleReactivate}
                cotizacion={cotizacion}
                loadingCotizacion={loadingCotizacion}
                errorCotizacion={errorCotizacion}
                editingProductId={editingProductId}
                onStartEditing={startEditing}
                onCancelEditing={cancelEditing}
            />

            {/* Botón "Cargar más" si hay más productos */}
            {!loading && !error && hasMoreProducts && (
                <div className="flex justify-center mt-12 mb-4">
                    <button
                        onClick={cargarMasProductos}
                        disabled={loadingMore}
                        className={`
                            px-6 py-3 bg-transparent cursor-pointer text-gray-900 font-medium rounded-lg border-2 border-gray-300 hover:border-gray-900 transition-colors duration-300
                            ${loadingMore 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-transparent'
                            }
                        `}
                    >
                        {loadingMore ? 'Cargando...' : 'Cargar más'}
                    </button>
                </div>
            )}

            {/* Indicador de que no hay más productos */}
            {!loading && !error && !hasMoreProducts && products.length > 0 && (
                <div className="text-center mt-8 mb-4">
                    <p className="text-gray-600 font-medium">
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