import React from 'react';
import { FaEye, FaEyeSlash, FaFilter, FaSearch, FaListAlt, FaBox } from 'react-icons/fa';

export default function ProductFilters({
    showActivos,
    setShowActivos,
    search,
    setSearch,
    stockFilter,
    setStockFilter,
    showList,
    setShowList
}) {

    return (
        <div className="flex flex-col gap-4 mt-4 p-4 bg-white rounded-xl shadow-lg border border-gray-300">
            <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 w-full">
                    <SearchInput 
                        search={search}
                        setSearch={setSearch}
                    />
                    <StatusFilter 
                        showActivos={showActivos}
                        setShowActivos={setShowActivos}
                    />
                    <StockFilter 
                        stockFilter={stockFilter}
                        setStockFilter={setStockFilter}
                    />
                    <VisibilityToggle 
                        showList={showList}
                        setShowList={setShowList}
                    />
                </div>
            </div>
        </div>
    );
    
}

function StatusFilter({ showActivos, setShowActivos }) {
    return (
        <div className="flex items-center gap-2 w-full">
            <FaFilter className="text-gray-600 text-lg" />
            <select
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

function SearchInput({ search, setSearch }) {
    return (
        <div className="flex items-center gap-2 w-full">
            <FaSearch className="text-gray-600 text-lg" />
            <input
                type="text"
                placeholder="Buscar por nombre..."
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-900 text-sm font-medium"
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
        </div>
    );
}

function StockFilter({ stockFilter, setStockFilter }) {
    return (
        <div className="flex items-center gap-2 w-full">
            <FaBox className="text-gray-600 text-lg" />
            <select
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

function VisibilityToggle({ showList, setShowList }) {
    return (
        <div className="flex items-center gap-2 w-full justify-end">
            <FaListAlt className="text-gray-600 text-lg" />
            <button
                onClick={() => setShowList(v => !v)}
                className={"flex items-center gap-1 px-3 py-2 rounded-lg font-medium border border-gray-300 bg-gray-100 text-gray-900 text-sm transition-all duration-300 w-full"}
            >
                {showList ? <FaEyeSlash className="text-gray-600" /> : <FaEye className="text-gray-600" />}
                {showList ? 'Ocultar' : 'Mostrar'}
            </button>
        </div>
    );
}