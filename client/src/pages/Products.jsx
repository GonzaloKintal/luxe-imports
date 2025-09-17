
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchAndFilter from '../components/products/SearchAndFilters';
import ProductList from '../components/products/ProductList';
import useProductsStore from '../store/productsStore';

export default function Products() {

    const navigate = useNavigate();

    // Estados del store global
    const {
        productos,
        loading,
        loadingMore,
        error,
        hasMoreProducts,
        fetchProductos,
        cargarMasProductos,
        resetProducts,
        categorias,
        fetchCategorias
    } = useProductsStore();

    // Estados locales para filtros
    const filtrosGuardados = JSON.parse(sessionStorage.getItem('productosFiltros') || '{}');
    const [busqueda, setBusqueda] = useState(filtrosGuardados.busqueda || '');
    const [filtroCategoria, setFiltroCategoria] = useState(filtrosGuardados.filtroCategoria || '');
    const [filtroStock, setFiltroStock] = useState(filtrosGuardados.filtroStock || 'all');
    const [ordenPrecio, setOrdenPrecio] = useState(filtrosGuardados.ordenPrecio || '');

    // Estado para controlar si necesitamos aplicar filtros
    const [shouldApplyFilters, setShouldApplyFilters] = useState(true);
    const [esCargaInicial, setEsCargaInicial] = useState(true);

    useEffect(() => {
        fetchCategorias();
    }, [fetchCategorias]);


    // Persistencia de filtros en sessionStorage
    useEffect(() => {
        sessionStorage.setItem('productosFiltros', JSON.stringify({
            busqueda,
            filtroCategoria,
            filtroStock,
            ordenPrecio
        }));
    }, [busqueda, filtroCategoria, filtroStock, ordenPrecio]);

    // Cargar productos cuando cambian los filtros
    useEffect(() => {
        if (shouldApplyFilters) {
            const filters = {
                search: busqueda,
                category: filtroCategoria,
                stock: filtroStock,
                sort: ordenPrecio
            };
            
            fetchProductos(filters);
            setShouldApplyFilters(false);
        }
    }, [busqueda, filtroCategoria, filtroStock, ordenPrecio, shouldApplyFilters, fetchProductos]);

    // Cargar productos iniciales al montar el componente
    useEffect(() => {
        if (esCargaInicial) {
            setShouldApplyFilters(true);
        }
    }, [esCargaInicial]);

    // Restaurar scroll cuando se cargan los productos iniciales
    useEffect(() => {
        if (!loading && productos.length > 0 && esCargaInicial) {
            const savedScroll = sessionStorage.getItem('productosScroll');
            if (savedScroll) {
                setTimeout(() => {
                    window.scrollTo(0, parseInt(savedScroll, 10));
                    sessionStorage.removeItem('productosScroll');
                }, 100);
            } else {
                window.scrollTo(0, 0);
            }
            setEsCargaInicial(false);
        }
    }, [loading, productos.length, esCargaInicial]);

    // Guardamos scroll antes de ir a detalle
    const handleGoToDetail = (id) => {
        sessionStorage.setItem('productosScroll', window.scrollY);
        navigate(`/products/product-detail/${id}`);
    };

    // Función para limpiar todos los filtros
    const limpiarFiltros = () => {
        setBusqueda('');
        setFiltroCategoria('');
        setFiltroStock('all');
        setOrdenPrecio('');
        setShouldApplyFilters(true);
        setEsCargaInicial(true);
    };

    // Funciones para manejar cambios de filtros
    const handleSearchChange = (value) => {
        setBusqueda(value);
        setShouldApplyFilters(true);
    };

    const handleCategoriaChange = (value) => {
        setFiltroCategoria(value);
        setShouldApplyFilters(true);
    };

    const handleStockChange = (value) => {
        setFiltroStock(value);
        setShouldApplyFilters(true);
    };

    const handleOrdenChange = (value) => {
        setOrdenPrecio(value);
        setShouldApplyFilters(true);
    };

    return (
        <main className="bg-gray-100 px-0 pt-12 relative overflow-hidden">
            <div className="relative z-10 px-6 py-20">
                <h1 className="text-4xl font-extrabold text-black mb-10 text-center animate-fadeInDown drop-shadow-lg">
                    Nuestros Productos
                </h1>

                {/* Barra de búsqueda y filtros */}
                <SearchAndFilter
                    categorias={categorias}
                    busqueda={busqueda}
                    setBusqueda={handleSearchChange}
                    filtroCategoria={filtroCategoria}
                    setFiltroCategoria={handleCategoriaChange}
                    filtroStock={filtroStock}
                    setFiltroStock={handleStockChange}
                    ordenPrecio={ordenPrecio}
                    setOrdenPrecio={handleOrdenChange}
                    productosFiltrados={productos}
                    onGoToDetail={handleGoToDetail}
                    onLimpiarFiltros={limpiarFiltros}
                />

                {/* Lista de productos */}
                <ProductList
                    productos={productos}
                    onGoToDetail={handleGoToDetail}
                    loading={loading}
                    error={error}
                />

                {/* Botón "Cargar más" */}
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
                            {loadingMore ? 'Cargando...' : 'Cargar más productos'}
                        </button>
                    </div>
                )}

                {/* Mostrar cuando no hay más productos */}
                {!loading && !error && !hasMoreProducts && productos.length > 0 && (
                    <div className="text-center mt-8 mb-4">
                        <p className="text-gray-600 font-medium">
                            Has visto todos los productos disponibles
                        </p>
                    </div>
                )}

                {/* Mensaje cuando no hay productos con los filtros actuales */}
                {!loading && !error && productos.length === 0 && (
                    <div className="text-center mt-8 mb-4">
                        <p className="text-gray-600 font-medium">
                            No se encontraron productos con los filtros aplicados
                        </p>
                        <button
                            onClick={limpiarFiltros}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                            Limpiar filtros
                        </button>
                    </div>
                )}
            </div>
        </main>
    );

}