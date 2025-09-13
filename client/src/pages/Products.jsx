

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchAndFilter from '../components/products/SearchAndFilters';
import ProductList from '../components/products/ProductList';

export default function Products() {
    const [productos, setProductos] = useState([]);
    const [busqueda, setBusqueda] = useState(sessionStorage.getItem('productosBusqueda') || '');
    const [filtroCategoria, setFiltroCategoria] = useState(sessionStorage.getItem('productosCategoria') || '');
    const [filtroStock, setFiltroStock] = useState(sessionStorage.getItem('productosStock') || 'all');
    const [ordenPrecio, setOrdenPrecio] = useState(sessionStorage.getItem('productosOrden') || '');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();


    // Guardar filtros en sessionStorage cuando cambien
    useEffect(() => {
        sessionStorage.setItem('productosBusqueda', busqueda);
    }, [busqueda]);

    useEffect(() => {
        sessionStorage.setItem('productosCategoria', filtroCategoria);
    }, [filtroCategoria]);

    useEffect(() => {
        sessionStorage.setItem('productosStock', filtroStock);
    }, [filtroStock]);

    useEffect(() => {
        sessionStorage.setItem('productosOrden', ordenPrecio);
    }, [ordenPrecio]);

    // 1️⃣ Fetch de productos
    useEffect(() => {
        async function fetchProductos() {
            try {
                setLoading(true);

                const res = await fetch(`${API_URL}/api/products/`);
                if (!res.ok) throw new Error('Error al cargar productos');
                const data = await res.json();
                setProductos(data);

            } catch (err) {
                setError(err.message || 'Error desconocido');
            } finally {
                setLoading(false);
            }
        }
        fetchProductos();
    }, [API_URL]);

    // 2️⃣ Restaurar scroll cada vez que la página se monta o volvés desde otro lado
    useEffect(() => {
        if (!loading && productos.length > 0) {
            const savedScroll = sessionStorage.getItem('productosScroll');
            if (savedScroll) {
                window.scrollTo(0, parseInt(savedScroll, 10));
                sessionStorage.removeItem('productosScroll');
            } else {
                window.scrollTo(0, 0);
            }
        }
    }, [loading, productos.length]);


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
    };

    // Filtro y búsqueda
    let productosFiltrados = [];
    if (!loading && !error) {
        productosFiltrados = productos
            .filter(producto => producto.status)
            .filter(producto =>
                producto.title.toLowerCase().includes(busqueda.toLowerCase())
            )
            .filter(producto =>
                filtroCategoria ? producto.category === filtroCategoria : true
            )
            .filter(producto =>
                filtroStock === 'all' ? true : filtroStock === 'in' ? Number(producto.stock) > 0 : Number(producto.stock) <= 0
            );

        if (ordenPrecio === 'asc') {
            productosFiltrados = productosFiltrados.slice().sort((a, b) => a.price - b.price);
        } else if (ordenPrecio === 'desc') {
            productosFiltrados = productosFiltrados.slice().sort((a, b) => b.price - a.price);
        }
    }

    return (
        <main className="bg-gray-100 px-0 pt-12 relative overflow-hidden">
            <div className="relative z-10 px-6 py-20">
                <h1 className="text-4xl font-extrabold text-black mb-10 text-center animate-fadeInDown drop-shadow-lg">
                    Nuestros Productos
                </h1>

                {/* Barra de búsqueda y filtros */}
                <SearchAndFilter 
                    productos={productos}
                    busqueda={busqueda}
                    setBusqueda={setBusqueda}
                    filtroCategoria={filtroCategoria}
                    setFiltroCategoria={setFiltroCategoria}
                    filtroStock={filtroStock}
                    setFiltroStock={setFiltroStock}
                    ordenPrecio={ordenPrecio}
                    setOrdenPrecio={setOrdenPrecio}
                    productosFiltrados={productosFiltrados}
                    onGoToDetail={handleGoToDetail}
                    onLimpiarFiltros={limpiarFiltros}
                />

                {/* Lista de productos */}
                <ProductList
                    productos={productosFiltrados}
                    onGoToDetail={handleGoToDetail}
                    loading={loading}
                    error={error}
                />
            </div>
        </main>
    );
}
