export default function LoadHistoryButton({ onLoadHistory, loading, error }) {
    
    return (
        <div className="mt-15 text-center max-w-3xl mx-auto px-4">
            <button
                onClick={onLoadHistory}
                className="relative cursor-pointer inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium transition-all bg-white rounded-md group border border-gray-200 hover:border-gray-300 hover:shadow-sm"
                disabled={loading}
            >
                <span className="absolute inset-0 border-0 transition-all duration-100 ease-linear group-hover:bg-gray-50"></span>
                <span className="relative text-sm font-medium text-gray-700 tracking-wide flex items-center">
                    {loading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Cargando historial...
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                            </svg>
                            Ver historial de compras
                        </>
                    )}
                </span>
            </button>
        </div>
    );

}