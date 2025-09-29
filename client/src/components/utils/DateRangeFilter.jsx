import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function DateRangeFilter({
    onFilter,
    loading = false,
    title = "Filtrar por fecha",
    showTitle = true,
    className = ""
}) {

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

    const [open, setOpen] = useState(false);

    return (
        <div className={`relative w-full mx-auto mb-6 ${className}`}>
            <button
                type="button"
                className="w-full flex justify-between items-center bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-left text-gray-900 font-medium shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                onClick={() => setOpen(o => !o)}
            >
                <span>{showTitle ? title : 'Filtrar por fecha'}</span>
                <svg className={`w-5 h-5 ml-2 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </button>

            {open && (
                <div
                    className="relative top-1 left-0 right-0 z-20 bg-white border border-gray-200 rounded-b-lg shadow-xl p-4 mt-1 animate-fadeInUp w-full min-w-0"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                        {/* Desde */}
                        <div className="flex flex-col min-w-0">
                            <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-1">
                                Desde
                            </label>
                            <DatePicker
                                id="from"
                                selected={fromDate}
                                onChange={setFromDate}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="dd/mm/yyyy"
                                maxDate={toDate || new Date()}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                showPopperArrow={false}
                            />
                        </div>
                        {/* Hasta */}
                        <div className="flex flex-col min-w-0">
                            <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1">
                                Hasta
                            </label>
                            <DatePicker
                                id="to"
                                selected={toDate}
                                onChange={setToDate}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="dd/mm/yyyy"
                                minDate={fromDate}
                                maxDate={new Date()}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                showPopperArrow={false}
                            />
                        </div>
                        {/* Botones */}
                        <div className="flex flex-row gap-2 justify-end min-w-0">
                            <button
                                onClick={handleFilter}
                                disabled={loading || (!fromDate && !toDate)}
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading && (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                )}
                                Filtrar
                            </button>
                            <button
                                onClick={handleClear}
                                disabled={loading || (!fromDate && !toDate)}
                                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Limpiar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
