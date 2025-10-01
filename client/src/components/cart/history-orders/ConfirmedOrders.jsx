import HistoryItem from './HistoryItem';
import DateRangeFilter from '../../utils/DateRangeFilter';
import { FaSync } from 'react-icons/fa';

export default function ConfirmedOrders({ orders, totalConfirmed, expandedHistorial, onToggleExpanded, onFilterConfirmed, onLoadMore, hasMore, loading, loadingMore, onRefresh, isRefreshing }) {
    
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <div className="h-6 w-1 bg-green-500 rounded-r mr-3"></div>
                    <h2 className="text-lg font-medium text-gray-700">
                        Compras Confirmadas
                    </h2>
                    <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        {totalConfirmed || 0}
                    </span>
                </div>
                {onRefresh && (
                    <button
                        onClick={onRefresh}
                        disabled={isRefreshing || loading}
                        className={`flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 ${(isRefreshing || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <FaSync className={`${isRefreshing ? 'animate-spin' : ''} text-xs`} />
                        <span className="hidden sm:inline">{isRefreshing ? 'Refrescando...' : 'Refrescar'}</span>
                    </button>
                )}
            </div>
            
            {onFilterConfirmed && (
                <DateRangeFilter 
                    onFilter={onFilterConfirmed} 
                    loading={loading}
                    title="Filtrar por fecha"
                    showTitle={true}
                    className="mb-6 w-full"
                />
            )}
            
            {orders && orders.length ? (
                <div className="space-y-4">
                    {orders.map((carrito, index) => (
                        <HistoryItem
                            key={`${carrito._id || carrito.id}-${index}`}
                            carrito={carrito}
                            expanded={expandedHistorial[carrito._id || carrito.id]}
                            onToggleExpanded={onToggleExpanded}
                        />
                    ))}
                </div>
            ) : loading || isRefreshing ? (
                <div className="bg-gray-50 rounded-lg p-6 text-center border border-gray-200">
                    <div className="w-8 h-8 mx-auto border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-3 text-gray-500">Cargando pedidos confirmados...</p>
                </div>
            ) : (
                <div className="bg-gray-50 rounded-lg p-6 text-center border border-gray-200">
                    <svg className="w-12 h-12 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                    </svg>
                    <p className="mt-3 text-gray-500">No hay compras confirmadas.</p>
                </div>
            )}
            
            {/* Botón Cargar más confirmados */}
            {!loading && hasMore && (
                <div className="flex justify-center mt-6">
                    <button
                        onClick={onLoadMore}
                        disabled={loadingMore}
                        className={`
                            px-3 sm:px-6 py-2 sm:py-3 bg-transparent cursor-pointer text-gray-900 text-base sm:font-medium rounded-lg border-2 border-gray-300 hover:border-gray-900 transition-colors duration-300
                            ${loadingMore ? 'bg-gray-400 cursor-not-allowed' : 'bg-transparent'}
                        `}
                    >
                        {loadingMore ? 'Cargando...' : 'Cargar más confirmados'}
                    </button>
                </div>
            )}

            {/* Mensaje cuando se han visto todos */}
            {orders && orders.length > 0 && !hasMore && (
                <div className="text-center mt-6">
                    <p className="text-gray-600 text-sm sm:text-base font-medium">
                        Has visto todo el historial de compras confirmadas
                    </p>
                </div>
            )}

        </div>
    );

}