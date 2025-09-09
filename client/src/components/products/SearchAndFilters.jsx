import { useState } from 'react';
import { FaSearch, FaTag, FaFilter, FaSortAmountDownAlt } from 'react-icons/fa';

export default function SearchAndFilters({ 
    productos = [], 
    busqueda: externalBusqueda, 
    setBusqueda: externalSetBusqueda,
    filtroCategoria: externalFiltroCategoria,
    setFiltroCategoria: externalSetFiltroCategoria,
    filtroStock: externalFiltroStock,
    setFiltroStock: externalSetFiltroStock,
    ordenPrecio: externalOrdenPrecio,
    setOrdenPrecio: externalSetOrdenPrecio,
    productosFiltrados = []
}) {
    // Si no se pasan props externas, usar estados internos
    const [internalBusqueda, internalSetBusqueda] = useState('');
    const [internalFiltroCategoria, internalSetFiltroCategoria] = useState('');
    const [internalFiltroStock, internalSetFiltroStock] = useState('all');
    const [internalOrdenPrecio, internalSetOrdenPrecio] = useState('');

    // Usar estados externos si se proporcionan, de lo contrario usar internos
    const busqueda = externalBusqueda !== undefined ? externalBusqueda : internalBusqueda;
    const setBusqueda = externalSetBusqueda !== undefined ? externalSetBusqueda : internalSetBusqueda;
    const filtroCategoria = externalFiltroCategoria !== undefined ? externalFiltroCategoria : internalFiltroCategoria;
    const setFiltroCategoria = externalSetFiltroCategoria !== undefined ? externalSetFiltroCategoria : internalSetFiltroCategoria;
    const filtroStock = externalFiltroStock !== undefined ? externalFiltroStock : internalFiltroStock;
    const setFiltroStock = externalSetFiltroStock !== undefined ? externalSetFiltroStock : internalSetFiltroStock;
    const ordenPrecio = externalOrdenPrecio !== undefined ? externalOrdenPrecio : internalOrdenPrecio;
    const setOrdenPrecio = externalSetOrdenPrecio !== undefined ? externalSetOrdenPrecio : internalSetOrdenPrecio;

    // Obtener categorías únicas
    const categorias = Array.from(new Set(productos.map(p => p.category).filter(Boolean)));

    return (
        <section className="max-w-7xl mx-auto mb-10 animate-fadeInUp">
            <div className="flex flex-wrap gap-4 items-center justify-between bg-white rounded-lg shadow-sm p-5 mb-4 border border-gray-200">
                <div className="flex items-center gap-2 w-full sm:w-64">
                    <FaSearch className="text-gray-500 text-lg" />
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white text-gray-900 transition text-sm"
                    />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-48">
                    <FaTag className="text-gray-500 text-lg" />
                    <select
                        value={filtroCategoria}
                        onChange={e => setFiltroCategoria(e.target.value)}
                        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white text-gray-900 transition text-sm"
                    >
                        <option value="">Todas las categorías</option>
                        {categorias.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-40">
                    <FaFilter className="text-gray-500 text-lg" />
                    <select
                        value={filtroStock}
                        onChange={e => setFiltroStock(e.target.value)}
                        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white text-gray-900 transition text-sm"
                    >
                        <option value="all">Todos</option>
                        <option value="in">Con stock</option>
                        <option value="out">Sin stock</option>
                    </select>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-48">
                    <FaSortAmountDownAlt className="text-gray-500 text-lg" />
                    <select
                        value={ordenPrecio}
                        onChange={e => setOrdenPrecio(e.target.value)}
                        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white text-gray-900 transition text-sm"
                    >
                        <option value="">Sin orden</option>
                        <option value="asc">Precio menor a mayor</option>
                        <option value="desc">Precio mayor a menor</option>
                    </select>
                </div>
            </div>
            <div className="text-right text-sm text-gray-600 mb-2">
                {productosFiltrados.length} producto{productosFiltrados.length === 1 ? '' : 's'} encontrados
            </div>
        </section>
    );
}