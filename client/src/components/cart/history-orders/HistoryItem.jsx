export default function HistoryItem({ carrito: order, expanded, onToggleExpanded }) {
    const id = order._id || order.id;
    const products = order.products || order.productos || [];
    const productCount = products.length;

    const total = products.reduce((acc, p) => {
        const price = typeof p.price === 'number' ? p.price : 0;
        const quantity = typeof p.quantity === 'number' ? p.quantity : 0;
        return acc + price * quantity;
    }, 0);

    return (
        <div className="bg-white border border-gray-300 p-4 rounded shadow">
            <div className="flex flex-col">
                <div>
                    <p className="text-black font-semibold">ID Pedido: {id}</p>
                    <p className="text-sm text-gray-600"><span className="font-medium">Productos:</span> {productCount}</p>
                    <p className="text-sm text-gray-600"><span className="font-medium">Total:</span> ${total}</p>
                    <p className="text-sm text-gray-600"><span className="font-medium">Estado:</span> {order.status}</p>
                    {order.createdAt && (
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">Fecha de creación:</span>{' '}
                            {`${new Date(order.createdAt).toLocaleDateString('es-AR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                            })} ${new Date(order.createdAt).toLocaleTimeString('es-AR', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false,
                            })}hs`}
                        </p>
                    )}
                    {order.pendingAt && (
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">Pendiente de confirmación:</span>{' '}
                            {`${new Date(order.pendingAt).toLocaleDateString('es-AR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                            })} ${new Date(order.pendingAt).toLocaleTimeString('es-AR', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false,
                            })}hs`}
                        </p>
                    )}
                    {order.confirmedAt && (
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">Confirmado:</span>{' '}
                            {`${new Date(order.confirmedAt).toLocaleDateString('es-AR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                            })} ${new Date(order.confirmedAt).toLocaleTimeString('es-AR', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false,
                            })}hs`}
                        </p>
                    )}
                </div>

                <div className="flex mt-2 justify-end">
                    <div className="flex gap-2">
                        <button
                            onClick={() => onToggleExpanded(id)}
                            className="ml-4 px-3 py-1 mt-4 sm:mt-0 rounded bg-gray-200 text-black text-sm font-medium"
                        >
                            {expanded ? 'Cerrar' : 'Ver productos'}
                        </button>
                    </div>
                </div>
            </div>

            {expanded && (
                <ul className="mt-4 space-y-2 list-none">
                    {products.map((p, idx) => {
                        const title = p.title || (p.productId && (p.productId.title || p.productId.name)) || 'Producto';
                        const price = typeof p.price === 'number' ? p.price : (p.productId && typeof p.productId.price === 'number' ? p.productId.price : 0);
                        const quantity = typeof p.quantity === 'number' ? p.quantity : 0;
                        const subtotal = price * quantity;
                        return (
                            <li
                                key={p._id || idx}
                                className="flex items-center gap-3 border-b border-gray-300 pb-2"
                            >
                                <img
                                    src={p.thumbnails?.[0] || 'https://placehold.co/80x80'}
                                    alt={title}
                                    className="w-16 h-16 object-cover rounded-md shadow bg-gray-200 flex-shrink-0"
                                />
                                <span className="font-semibold text-black truncate">{title}</span>
                                <span className="ml-2 text-gray-700">x{quantity}</span>
                                <span className="ml-2 text-gray-700">${price.toFixed(2)}</span>
                                <span className="ml-2 text-blue-700 font-semibold">Subtotal: ${subtotal.toFixed(2)}</span>
                            </li>
                        );
                    })}
                </ul>
            )}

            <div className="mt-4 pt-4 border-t border-gray-200 text-right">
                <span className="text-lg font-bold text-gray-900">
                    Total: ${total.toFixed(2)}
                </span>
            </div>

        </div>
    );
}