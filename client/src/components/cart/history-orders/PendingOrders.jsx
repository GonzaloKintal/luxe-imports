import HistoryItem from './HistoryItem';

export default function PendingOrders({ orders, expandedHistorial, onToggleExpanded }) {
    
    return (
        <div className="mb-8">
            <div className="flex items-center mb-4">
                <div className="h-6 w-1 bg-amber-500 rounded-r mr-3"></div>
                <h2 className="text-lg font-medium text-gray-700">
                    Compras Pendientes de Confirmación
                </h2>
                <span className="ml-2 bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                    {orders ? orders.length : 0}
                </span>
            </div>
            
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
        </div>
    );

}