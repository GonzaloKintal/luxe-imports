import React from 'react';
import { FaFilter, FaSearch, FaBox, FaTag, FaSort } from 'react-icons/fa';

export default function ProductFilters({
    showActivos,
    setShowActivos,
    search,
    setSearch,
    stockFilter,
    setStockFilter,
    categoryFilter,
    setCategoryFilter,
    sortFilter,
    setSortFilter,
    categorias = []
}) {

    return (
        <div className="flex flex-col gap-4 p-4 bg-white rounded-xl shadow-lg border border-gray-300">
            <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 w-full">
                    <SearchInput 
                        search={search}
                        setSearch={setSearch}
                    />
                    <CategoryFilter 
                        categoryFilter={categoryFilter}
                        setCategoryFilter={setCategoryFilter}
                        categorias={categorias}
                    />
                    <StatusFilter 
                        showActivos={showActivos}
                        setShowActivos={setShowActivos}
                    />
                    <StockFilter 
                        stockFilter={stockFilter}
                        setStockFilter={setStockFilter}
                    />
                    <SortFilter 
                        sortFilter={sortFilter}
                        setSortFilter={setSortFilter}
                    />
                </div>
            </div>
        </div>
    );
    
}


function SearchInput({ search, setSearch }) {
    return (
        <div className="flex items-center gap-2 w-full">
            <FaSearch className="text-gray-600 text-lg" />
            <input
                id="search"
                name="search"
                type="text"
                placeholder="Buscar por nombre..."
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-900 text-sm font-medium"
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
        </div>
    );
}

function CategoryFilter({ categoryFilter, setCategoryFilter, categorias }) {
    return (
        <div className="flex items-center gap-2 w-full">
            <FaTag className="text-gray-600 text-lg" />
            <select
                id="categoryFilter"
                name="categoryFilter"
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-900 text-sm font-medium"
            >
                <option value="">Todas las categorías</option>
                {categorias.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
            </select>
        </div>
    );
}

function StatusFilter({ showActivos, setShowActivos }) {
    return (
        <div className="flex items-center gap-2 w-full">
            <FaFilter className="text-gray-600 text-lg" />
            <select
                id="statusFilter"
                name="statusFilter"
                value={showActivos ? 'activos' : 'inactivos'}
                onChange={e => setShowActivos(e.target.value === 'activos')}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-900 text-sm font-medium"
            >
                <option value="activos">Activos</option>
                <option value="inactivos">Inactivos</option>
            </select>
        </div>
    );
}

function StockFilter({ stockFilter, setStockFilter }) {
    return (
        <div className="flex items-center gap-2 w-full">
            <FaBox className="text-gray-600 text-lg" />
            <select
                id="stockFilter"
                name="stockFilter"
                value={stockFilter}
                onChange={e => setStockFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-900 text-sm font-medium"
            >
                <option value="todos">Todos</option>
                <option value="conStock">Con stock</option>
                <option value="sinStock">Sin stock</option>
            </select>
        </div>
    );
}

function SortFilter({ sortFilter, setSortFilter }) {
    return (
        <div className="flex items-center gap-2 w-full">
            <FaSort className="text-gray-600 text-lg" />
            <select
                id="sortFilter"
                name="sortFilter"
                value={sortFilter}
                onChange={e => setSortFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-900 text-sm font-medium"
            >
                <option value="display_order">Por orden visual</option>
                <option value="newest">Más reciente</option>
                <option value="oldest">Más antiguo</option>
                <option value="price_asc">Precio menor</option>
                <option value="price_desc">Precio mayor</option>
                <option value="title_asc">Nombre A-Z</option>
                <option value="title_desc">Nombre Z-A</option>
            </select>
        </div>
    );
}