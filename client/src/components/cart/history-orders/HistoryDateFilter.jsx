import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function HistoryDateFilter({ onFilter, loading }) {
    
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);

    // Función para convertir Date a formato yyyy-mm-dd para el backend
    function formatDateForBackend(date) {
        if (!date) return null;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function handleFilter() {
        const fromFormatted = formatDateForBackend(fromDate);
        const toFormatted = formatDateForBackend(toDate);
        onFilter(fromFormatted, toFormatted);
    }

    function handleClear() {
        setFromDate(null);
        setToDate(null);
        onFilter(null, null);
    }

    return (
        <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
            <div className="flex flex-wrap items-end gap-4">
                <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Desde
                    </label>
                    <DatePicker
                        selected={fromDate}
                        onChange={setFromDate}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="dd/mm/yyyy"
                        maxDate={toDate || new Date()}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        showPopperArrow={false}
                    />
                </div>
                
                <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hasta
                    </label>
                    <DatePicker
                        selected={toDate}
                        onChange={setToDate}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="dd/mm/yyyy"
                        minDate={fromDate}
                        maxDate={new Date()}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        showPopperArrow={false}
                    />
                </div>
                
                <div className="flex gap-2">
                    <button
                        onClick={handleFilter}
                        disabled={loading}
                        className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading && (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        )}
                        Filtrar
                    </button>
                    <button
                        onClick={handleClear}
                        disabled={loading}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Limpiar
                    </button>
                </div>
            </div>
        </div>
    );

}