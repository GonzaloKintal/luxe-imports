import { useState, useEffect, useRef } from 'react';
import { FaDollarSign, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import Portal from '../utils/Portal';

export default function PriceFilter({ 
    precioMin, 
    setPrecioMin, 
    precioMax, 
    setPrecioMax 
}) {

    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
    const buttonRef = useRef(null);
    const dropdownRef = useRef(null);

    // Calcular posición del dropdown
    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setPosition({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width
            });
        }
    }, [isOpen]);

    // Cerrar dropdown al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current && 
                !dropdownRef.current.contains(event.target) &&
                buttonRef.current && 
                !buttonRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const getButtonText = () => {
        const hasMin = precioMin && precioMin !== '';
        const hasMax = precioMax && precioMax !== '';
        
        if (hasMin && hasMax) {
            return `$${precioMin} - $${precioMax}`;
        } else if (hasMin) {
            return `Desde $${precioMin}`;
        } else if (hasMax) {
            return `Hasta $${precioMax}`;
        } else {
            return 'Filtrar';
        }
    };

    const handleClearFilters = () => {
        setPrecioMin('');
        setPrecioMax('');
    };

    const hasFilters = (precioMin && precioMin !== '') || (precioMax && precioMax !== '');

    return (
        <div className="flex flex-col w-full">
            <label htmlFor="precioDropdown" className="mb-2 text-sm font-semibold text-gray-700">Precio (USD)</label>
            
            {/* Contenedor para ícono y botón */}
            <div className="flex items-center gap-2">
                <FaDollarSign className="text-gray-500 text-lg" />
                <div className="flex flex-col w-full relative">
                    <button
                        id="precioDropdown"
                        ref={buttonRef}
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className={`
                            flex items-center justify-between w-full px-3 py-2 rounded-md border border-gray-300 
                            focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent 
                            bg-white text-gray-900 transition text-sm hover:bg-gray-50
                            ${hasFilters ? 'border-blue-400 bg-blue-50' : ''}
                        `}
                    >
                        <span className={hasFilters ? 'text-blue-700 font-medium' : 'text-gray-700'}>
                            {getButtonText()}
                        </span>
                        {isOpen ? (
                            <FaChevronUp className="text-gray-400" />
                        ) : (
                            <FaChevronDown className="text-gray-400" />
                        )}
                    </button>

                    {/* Dropdown via Portal */}
                    {isOpen && (
                        <Portal>
                            <div
                                ref={dropdownRef}
                                className="absolute bg-white border border-gray-300 rounded-md shadow-lg z-20 p-4 mt-2"
                                style={{
                                    top: `${position.top}px`,
                                    left: `${position.left}px`,
                                    width: `${position.width}px`
                                }}
                            >
                                <div className="space-y-3">
                                    <div>
                                        <label htmlFor="precioMin" className="block text-xs font-medium text-gray-700 mb-1">
                                            Desde
                                        </label>
                                        <input
                                            id="precioMin"
                                            type="number"
                                            placeholder="Desde $0"
                                            value={precioMin}
                                            onChange={(e) => setPrecioMin(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                            min="0"
                                            step="0.01"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="precioMax" className="block text-xs font-medium text-gray-700 mb-1">
                                            Hasta
                                        </label>
                                        <input
                                            id="precioMax"
                                            type="number"
                                            placeholder="Hasta $999999"
                                            value={precioMax}
                                            onChange={(e) => setPrecioMax(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                            min="0"
                                            step="0.01"
                                        />
                                    </div>

                                    <div className="flex justify-between items-center pt-2">
                                        {hasFilters && (
                                            <button
                                                type="button"
                                                onClick={handleClearFilters}
                                                className="text-xs text-gray-600 hover:text-gray-800 underline"
                                            >
                                                Limpiar filtro
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => setIsOpen(false)}
                                            className="ml-auto px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded transition"
                                        >
                                            Cerrar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Portal>
                    )}
                </div>
            </div>
        </div>
    );
}