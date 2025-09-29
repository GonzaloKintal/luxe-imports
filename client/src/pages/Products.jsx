
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchAndFilter from '../components/products/SearchAndFilters';
import ProductList from '../components/products/ProductList';
import useProductsStore from '../store/productsStore';

export default function Products() {
    
    const navigate = useNavigate();

    const {
        productos,
        loading,
        loadingMore,
        error,
        hasMoreProducts,
        fetchProductos,
        cargarMasProductos,
        categorias,
        fetchCategorias,
        isInitialized
    } = useProductsStore();

    // Filtros locales persistentes
    const filtrosGuardados = JSON.parse(sessionStorage.getItem('productosFiltros') || '{}');
    const [busqueda, setBusqueda] = useState(filtrosGuardados.busqueda || '');
    const [filtroCategoria, setFiltroCategoria] = useState(filtrosGuardados.filtroCategoria || '');
    const [precioMin, setPrecioMin] = useState(filtrosGuardados.precioMin || '');
    const [precioMax, setPrecioMax] = useState(filtrosGuardados.precioMax || '');
    const [ordenPrecio, setOrdenPrecio] = useState(filtrosGuardados.ordenPrecio || '');

    const [esCargaInicial, setEsCargaInicial] = useState(true);

    // Cargar categorías al montar
    useEffect(() => {
        fetchCategorias();
    }, [fetchCategorias]);

    // Persistir filtros
    useEffect(() => {
        sessionStorage.setItem('productosFiltros', JSON.stringify({
            busqueda,
            filtroCategoria,
            precioMin,
            precioMax,
            ordenPrecio
        }));
    }, [busqueda, filtroCategoria, precioMin, precioMax, ordenPrecio]);

    // Fetch inicial de productos SOLO si no están cargados
    useEffect(() => {
        if (!isInitialized) {
            const filters = {
                search: busqueda,
                category: filtroCategoria,
                priceMin: precioMin,
                priceMax: precioMax,
                sort: ordenPrecio
            };
            fetchProductos(filters);
        }
    }, [isInitialized, fetchProductos]);

    // Función central para aplicar filtros
    const applyFilters = (filters) => {
        fetchProductos(filters);
    };

    // Handlers de filtros
    const handleSearchChange = (value) => {
        setBusqueda(value);
        applyFilters({
            search: value,
            category: filtroCategoria,
            priceMin: precioMin,
            priceMax: precioMax,
            sort: ordenPrecio
        });
    };

    const handleCategoryChange = (value) => {
        setFiltroCategoria(value);
        applyFilters({
            search: busqueda,
            category: value,
            priceMin: precioMin,
            priceMax: precioMax,
            sort: ordenPrecio
        });
    };

    const handlePriceMinChange = (value) => {
        setPrecioMin(value);
        applyFilters({
            search: busqueda,
            category: filtroCategoria,
            priceMin: value,
            priceMax: precioMax,
            sort: ordenPrecio
        });
    };

    const handlePriceMaxChange = (value) => {
        setPrecioMax(value);
        applyFilters({
            search: busqueda,
            category: filtroCategoria,
            priceMin: precioMin,
            priceMax: value,
            sort: ordenPrecio
        });
    };

    const handleSortChange = (value) => {
        setOrdenPrecio(value);
        applyFilters({
            search: busqueda,
            category: filtroCategoria,
            priceMin: precioMin,
            priceMax: precioMax,
            sort: value
        });
    };

    // Restaurar scroll
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

    const handleGoToDetail = (id) => {
        sessionStorage.setItem('productosScroll', window.scrollY);
        navigate(`/products/product-detail/${id}`);
    };

    const [shouldResetFilters, setShouldResetFilters] = useState(false);

    // Efecto para manejar el reset de filtros
    useEffect(() => {
        if (shouldResetFilters) {
            const defaultFilters = {
                search: '',
                category: '',
                priceMin: '',
                priceMax: '',
                sort: ''
            };
            fetchProductos(defaultFilters);
            setShouldResetFilters(false);
        }
    }, [shouldResetFilters, fetchProductos]);

    const limpiarFiltros = () => {
        setBusqueda('');
        setFiltroCategoria('');
        setPrecioMin('');
        setPrecioMax('');
        setOrdenPrecio('');
        setShouldResetFilters(true);
    };

    return (
        <main className="bg-gray-100 px-0 pt-12 relative overflow-hidden">
            <div className="relative z-10 px-2 sm:px-6 py-10 sm:py-20">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 sm:mb-10 text-center relative
                        after:block after:h-1 after:w-16 sm:after:w-24 after:bg-gray-800 after:mx-auto after:mt-2 sm:after:mt-4">
                    Nuestros Productos
                </h1>

                <SearchAndFilter
                    categorias={categorias}
                    busqueda={busqueda}
                    setBusqueda={handleSearchChange}
                    filtroCategoria={filtroCategoria}
                    setFiltroCategoria={handleCategoryChange}
                    precioMin={precioMin}
                    setPrecioMin={handlePriceMinChange}
                    precioMax={precioMax}
                    setPrecioMax={handlePriceMaxChange}
                    ordenPrecio={ordenPrecio}
                    setOrdenPrecio={handleSortChange}
                    productosFiltrados={productos}
                    onGoToDetail={handleGoToDetail}
                    onLimpiarFiltros={limpiarFiltros}
                />

                <ProductList
                    productos={productos}
                    onGoToDetail={handleGoToDetail}
                    loading={loading}
                    error={error}
                />

                {!loading && !error && hasMoreProducts && (
                    <div className="flex justify-center mt-12 mb-4">
                        <button
                            onClick={cargarMasProductos}
                            disabled={loadingMore}
                            className={`
                                px-6 py-3 bg-transparent cursor-pointer text-gray-900 font-medium rounded-lg border-2 border-gray-300 hover:border-gray-900 transition-colors duration-300
                                ${loadingMore ? 'bg-gray-400 cursor-not-allowed' : 'bg-transparent'}
                            `}
                        >
                            {loadingMore ? 'Cargando...' : 'Cargar más productos'}
                        </button>
                    </div>
                )}

                {!loading && !error && !hasMoreProducts && productos.length > 0 && (
                    <div className="text-center mt-8 mb-4">
                        <p className="text-gray-600 text-sm sm:text-base font-medium">
                            Has visto todos los productos disponibles
                        </p>
                    </div>
                )}

                {!loading && !error && productos.length === 0 && (
                    <div className="text-center mt-8 mb-4">
                        <p className="text-gray-600 text-sm sm:text-base font-medium">
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