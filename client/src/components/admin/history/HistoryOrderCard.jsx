import { FaWhatsapp } from 'react-icons/fa';

export default function HistoryOrderCard({ 
    order, 
    expanded, 
    details, 
    onToggleExpand, 
    onFetchDetails 
}) {

    const cartId = order._id;

    const handleToggleExpand = async () => {
        onToggleExpand(cartId);
        if (!expanded && Array.isArray(order.products)) {
            await onFetchDetails(cartId, order.products);
        }
    };

    return (
        <div className="border border-gray-200 rounded-lg bg-gray-50">
            <div className="p-4">
                <div className="flex justify-between items-center">
                    <div className="flex-1">
                        <div className="font-semibold text-gray-900">
                            Pedido {cartId || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-600 mt-1 space-y-1">
                            <div>
                                <span className="font-medium">Usuario:</span>{" "}
                                {order.userId?.firstName} {order.userId?.lastName}
                                {order.userId?.email && (
                                    <span className="text-gray-500 ml-1">
                                    ({order.userId.email})
                                    </span>
                                )}
                                {order.userId?.telefono && (
                                    <a
                                    href={`https://wa.me/${order.userId.telefono.replace(/[^\d]/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-2 text-green-600 hover:text-green-800"
                                    >
                                        <FaWhatsapp className="inline-block text-lg" />
                                    </a>
                                )}
                            </div>
                            
                            <div className="text-sm text-gray-600">
                                <span className="font-medium">Fecha de confirmación:</span>{" "}
                                {order.createdAt ? (
                                    <>
                                    {new Date(order.createdAt).toLocaleDateString("es-AR", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                    })}{" "}
                                    {new Date(order.createdAt).toLocaleTimeString("es-AR", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false,
                                    })}hs
                                    </>
                                ) : (
                                    "N/A"
                                )}
                            </div>

                            <div>
                                <span className="font-medium">Estado:</span> <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    {order.status || 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex mt-2 justify-start md:justify-end md:mt-0">
                    <div className="flex gap-2">
                        <button
                            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors duration-200 shadow-md"
                            onClick={handleToggleExpand}
                        >
                            {expanded ? 'Ocultar productos' : 'Ver productos'}
                        </button>
                    </div>
                </div>

                {expanded && Array.isArray(details) && (
                    <div className="mt-4 border-t border-gray-200 pt-4">
                        <div className="space-y-3">
                            {details.map((p, idx) => {
                                const price = typeof p.price === 'number' ? p.price : 0;
                                const quantity = typeof p.quantity === 'number' ? p.quantity : 0;
                                const subtotal = price * quantity;
                                return (
                                    <div key={p._id || p.id || idx} className="flex flex-col md:flex-row justify-between items-center py-3 px-4 bg-white rounded-lg border border-gray-100">
                                        <div className="flex-1 font-medium text-gray-900">{p.title}</div>
                                        <div className="flex flex-col md:flex-row md:items-center gap-2 text-sm">
                                            <span className="text-gray-600">Precio unitario: <span className="font-semibold text-gray-900">${price.toFixed(2)}</span></span>
                                            <span className="text-gray-600">Cantidad: <span className="font-semibold">x{quantity}</span></span>
                                            <span className="text-gray-600">Subtotal: <span className="font-semibold text-blue-700">${subtotal.toFixed(2)}</span></span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200 text-right">
                            <span className="text-lg font-bold text-gray-900">
                                Total: ${details.reduce((acc, p) => acc + ((typeof p.price === 'number' ? p.price : 0) * (typeof p.quantity === 'number' ? p.quantity : 0)), 0).toFixed(2)}
                            </span>
                        </div>
                    </div>
                )}

            </div>

        </div>
    );

}