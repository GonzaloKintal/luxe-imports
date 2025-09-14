export default function HistoryHeader({ onClose }) {
    
    return (
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-light text-gray-800">Historial de Compras</h1>
            <button
                onClick={onClose}
                className="flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                Cerrar
            </button>
        </div>
    );

}