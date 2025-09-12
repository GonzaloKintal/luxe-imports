

import React from 'react';
import { FaEye, FaEyeSlash, FaFilter, FaSearch, FaListAlt, FaCheckCircle, FaBan } from 'react-icons/fa';

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
                <div className="grid grid-cols-1 lg:flex gap-3 w-full lg:w-auto">
                    <StatusFilter 
                        showActivos={showActivos}
                        setShowActivos={setShowActivos}
                    />
                    
                    <SearchInput 
                        search={search}
                        setSearch={setSearch}
                    />
                    
                    <StockFilter 
                        stockFilter={stockFilter}
                        setStockFilter={setStockFilter}
                    />
                </div>
                
                <VisibilityToggle 
                    showList={showList}
                    setShowList={setShowList}
                />
            </div>
        </div>
    );
    
}

function StatusFilter({ showActivos, setShowActivos }) {
    return (
        <div className="flex items-center gap-2 w-full lg:w-auto">
            <FaFilter className="text-gray-600 text-lg" />
            <select
                value={showActivos ? 'activos' : 'inactivos'}
                onChange={e => setShowActivos(e.target.value === 'activos')}
                className="w-full lg:w-auto px-3 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-900 text-sm font-medium"
            >
                <option value="activos">Activos</option>
                <option value="inactivos">Inactivos</option>
            </select>
            {showActivos ? (
                <FaCheckCircle className="text-green-600 ml-1" />
            ) : (
                <FaBan className="text-red-600 ml-1" />
            )}
        </div>
    );
}

function SearchInput({ search, setSearch }) {
    return (
        <div className="flex items-center gap-2 w-full lg:w-64">
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
        <div className="flex items-center gap-2 w-full lg:w-auto">
            <span className="font-semibold text-gray-700 whitespace-nowrap">Stock:</span>
            <select
                value={stockFilter}
                onChange={e => setStockFilter(e.target.value)}
                className="w-full lg:w-auto px-3 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-900 text-sm font-medium"
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
        <div className="flex items-center gap-2 w-full lg:w-auto justify-end lg:justify-start">
            <FaListAlt className="text-gray-600 text-lg" />
            <button
                onClick={() => setShowList(v => !v)}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg font-medium border border-gray-300 bg-gray-100 text-gray-900 text-sm transition-all duration-300 w-full lg:w-auto ${
                    showList ? 'opacity-100' : 'opacity-60'
                }`}
            >
                {showList ? <FaEyeSlash className="text-gray-600" /> : <FaEye className="text-gray-600" />}
                {showList ? 'Ocultar' : 'Mostrar'}
            </button>
        </div>
    );
}