import HistoryItem from './HistoryItem';

export default function ConfirmedOrders({ orders, expandedHistorial, onToggleExpanded }) {
    
    return (
        <div className="mb-8">
            <div className="flex items-center mb-4">
                <div className="h-6 w-1 bg-green-500 rounded-r mr-3"></div>
                <h2 className="text-lg font-medium text-gray-700">
                    Compras Confirmadas
                </h2>
                <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    {orders ? orders.length : 0}
                </span>
            </div>
            
            {orders && orders.length ? (
                <div className="space-y-4">
                    {orders.map((carrito) => (
                        <HistoryItem
                            key={carrito._id || carrito.id}
                            carrito={carrito}
                            expanded={expandedHistorial[carrito._id || carrito.id]}
                            onToggleExpanded={onToggleExpanded}
                        />
                    ))}
                </div>
            ) : (
                <div className="bg-gray-50 rounded-lg p-6 text-center border border-gray-200">
                    <svg className="w-12 h-12 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                    </svg>
                    <p className="mt-3 text-gray-500">No hay compras confirmadas.</p>
                </div>
            )}
        </div>
    );

}