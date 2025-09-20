import HistoryItem from './HistoryItem';
import DateRangeFilter from '../../utils/DateRangeFilter';

export default function PendingOrders({ orders, totalPending, expandedHistorial, onToggleExpanded, onFilterPending, onLoadMore, hasMore, loading, loadingMore }) {
    
    return (
        <div className="mb-8">
            <div className="flex items-center mb-4">
                <div className="h-6 w-1 bg-amber-500 rounded-r mr-3"></div>
                <h2 className="text-lg font-medium text-gray-700">
                    Compras Pendientes de Confirmación
                </h2>
                <span className="ml-2 bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                    {totalPending || 0}
                </span>
            </div>
            
            {onFilterPending && (
                <DateRangeFilter onFilter={onFilterPending} loading={loading} />
            )}
            
            {orders && orders.length ? (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <HistoryItem
                            key={order._id || order.id}
                            carrito={order}
                            expanded={expandedHistorial[order._id || order.id]}
                            onToggleExpanded={onToggleExpanded}
                        />
                    ))}
                </div>
            ) : (
                <div className="bg-gray-50 rounded-lg p-6 text-center border border-gray-200">
                    <svg className="w-12 h-12 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p className="mt-3 text-gray-500">No hay compras pendientes de confirmación.</p>
                </div>
            )}
            
            {/* Botón Cargar más pendientes */}
            {!loading && hasMore && (
                <div className="flex justify-center mt-6">
                    <button
                        onClick={onLoadMore}
                        disabled={loadingMore}
                        className={`
                            px-6 py-3 bg-transparent cursor-pointer text-gray-900 font-medium rounded-lg border-2 border-gray-300 hover:border-gray-900 transition-colors duration-300
                            ${loadingMore ? 'bg-gray-400 cursor-not-allowed' : 'bg-transparent'}
                        `}
                    >
                        {loadingMore ? 'Cargando...' : 'Cargar más pendientes'}
                    </button>
                </div>
            )}
        </div>
    );

}