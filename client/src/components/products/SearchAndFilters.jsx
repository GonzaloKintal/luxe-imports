

import { useState } from 'react';
import { FaSearch, FaTag, FaSortAmountDownAlt } from 'react-icons/fa';
import PriceFilter from './PriceFilter';

export default function SearchAndFilters({ 
    categorias = [],
    busqueda: externalBusqueda, 
    setBusqueda: externalSetBusqueda,
    filtroCategoria: externalFiltroCategoria,
    setFiltroCategoria: externalSetFiltroCategoria,
    precioMin: externalPrecioMin,
    setPrecioMin: externalSetPrecioMin,
    precioMax: externalPrecioMax,
    setPrecioMax: externalSetPrecioMax,
    ordenPrecio: externalOrdenPrecio,
    setOrdenPrecio: externalSetOrdenPrecio,
    productosFiltrados = [],
    onLimpiarFiltros
}) {
    
    // Si no se pasan props externas, usar estados internos
    const [internalBusqueda, internalSetBusqueda] = useState('');
    const [internalFiltroCategoria, internalSetFiltroCategoria] = useState('');
    const [internalPrecioMin, internalSetPrecioMin] = useState('');
    const [internalPrecioMax, internalSetPrecioMax] = useState('');
    const [internalOrdenPrecio, internalSetOrdenPrecio] = useState('');

    // Usar estados externos si se proporcionan, de lo contrario usar internos
    const busqueda = externalBusqueda !== undefined ? externalBusqueda : internalBusqueda;
    const setBusqueda = externalSetBusqueda !== undefined ? externalSetBusqueda : internalSetBusqueda;
    const filtroCategoria = externalFiltroCategoria !== undefined ? externalFiltroCategoria : internalFiltroCategoria;
    const setFiltroCategoria = externalSetFiltroCategoria !== undefined ? externalSetFiltroCategoria : internalSetFiltroCategoria;
    const precioMin = externalPrecioMin !== undefined ? externalPrecioMin : internalPrecioMin;
    const setPrecioMin = externalSetPrecioMin !== undefined ? externalSetPrecioMin : internalSetPrecioMin;
    const precioMax = externalPrecioMax !== undefined ? externalPrecioMax : internalPrecioMax;
    const setPrecioMax = externalSetPrecioMax !== undefined ? externalSetPrecioMax : internalSetPrecioMax;
    const ordenPrecio = externalOrdenPrecio !== undefined ? externalOrdenPrecio : internalOrdenPrecio;
    const setOrdenPrecio = externalSetOrdenPrecio !== undefined ? externalSetOrdenPrecio : internalSetOrdenPrecio;

    return (
        <section className="max-w-7xl mx-auto mb-10 animate-fadeInUp">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 bg-white rounded-lg shadow-sm p-6 mb-4 border border-gray-200">

                {/* Filtro de búsqueda */}
                <div className="flex flex-col w-full">
                    <label htmlFor="buscar" className="mb-2 text-sm font-semibold text-gray-700">Buscar</label>
                    <div className="flex items-center gap-2">
                        <FaSearch className="text-gray-500 text-lg" />
                        <input
                            id="buscar"
                            name="buscar"
                            type="text"
                            placeholder="Buscar productos..."
                            value={busqueda}
                            onChange={e => setBusqueda(e.target.value)}
                            className="w-full px-2 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white text-gray-900 transition text-sm"
                        />
                    </div>
                </div>

                {/* Filtro de categoría */}
                <div className="flex flex-col w-full">
                    <label htmlFor="categoria" className="mb-2 text-sm font-semibold text-gray-700">Categoría</label>
                    <div className="flex items-center gap-2">
                        <FaTag className="text-gray-500 text-lg" />
                        <select
                            id="categoria"
                            name="categoria"
                            value={filtroCategoria}
                            onChange={e => setFiltroCategoria(e.target.value)}
                            className="w-full px-2 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white text-gray-900 transition text-sm"
                        >
                            <option value="">Todas las categorías</option>
                            {categorias.map(cat => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Filtro de precio */}
                <PriceFilter
                    precioMin={precioMin}
                    setPrecioMin={setPrecioMin}
                    precioMax={precioMax}
                    setPrecioMax={setPrecioMax}
                />

                {/* Filtro de orden de precio */}
                <div className="flex flex-col w-full">
                    <label htmlFor="ordenPrecio" className="mb-2 text-sm font-semibold text-gray-700">Ordenar por precio</label>
                    <div className="flex items-center gap-2">
                        <FaSortAmountDownAlt className="text-gray-500 text-lg" />
                        <select
                            id="ordenPrecio"
                            name="ordenPrecio"
                            value={ordenPrecio}
                            onChange={e => setOrdenPrecio(e.target.value)}
                            className="w-full px-2 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white text-gray-900 transition text-sm"
                        >
                            <option value="">Sin orden</option>
                            <option value="asc">Precio menor a mayor</option>
                            <option value="desc">Precio mayor a menor</option>
                        </select>
                    </div>
                </div>

            </div>
            <div className="text-right text-sm text-gray-600 mb-2">
                {productosFiltrados.length} producto{productosFiltrados.length === 1 ? '' : 's'} encontrados
            </div>
        </section>
    );

}