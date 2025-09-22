export default function HistoryItem({ carrito: order, expanded, onToggleExpanded }) {
    const id = order._id || order.id;
    const products = order.products || order.productos || [];
    const productCount = products.length;

    const totalUSD = products.reduce((acc, p) => {
        const price = typeof p.priceUSD === 'number' ? p.priceUSD : (typeof p.price === 'number' ? p.price : 0);
        const quantity = typeof p.quantity === 'number' ? p.quantity : 0;
        return acc + price * quantity;
    }, 0);
    const totalARS = products.reduce((acc, p) => {
        const price = typeof p.priceARS === 'number' ? p.priceARS : 0;
        const quantity = typeof p.quantity === 'number' ? p.quantity : 0;
        return acc + price * quantity;
    }, 0);

    return (
        <div className="bg-white border border-gray-300 p-4 rounded shadow">
            <div className="flex flex-col">
                <div className="flex flex-col gap-1">
                    <p className="text-black font-semibold">ID Pedido: {id}</p>
                    <p className="text-sm text-gray-600"><span className="font-medium">Productos:</span> <span className="font-bold">{productCount}</span></p>

                    <div className="flex flex-col gap-1 text-sm text-gray-600">
                        {order.pendingAt && (
                            <span>
                                <span className="font-medium">Pedido el</span>{' '}
                                <span className="font-semibold text-orange-600">
                                {new Date(order.pendingAt).toLocaleDateString('es-AR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                })}
                                </span>{' '}
                                <span className="font-medium">a las</span>{' '}
                                <span className="font-semibold text-orange-600">
                                {new Date(order.pendingAt).toLocaleTimeString('es-AR', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false,
                                })}hs
                                </span>
                            </span>
                        )}

                        {order.confirmedAt && (
                            <span>
                                <span className="font-medium">Confirmado el</span>{' '}
                                <span className="font-semibold text-green-700">
                                {new Date(order.confirmedAt).toLocaleDateString('es-AR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                })}
                                </span>{' '}
                                <span className="font-medium">a las</span>{' '}
                                <span className="font-semibold text-green-700">
                                {new Date(order.confirmedAt).toLocaleTimeString('es-AR', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false,
                                })}hs
                                </span>
                            </span>
                        )}
                    </div>

                    <p className="text-sm text-gray-600">
                        <span className="font-medium">Estado:</span>{' '}
                        {order.status === "pendiente de confirmacion" ? (
                            <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-600">
                            Pendiente
                            </span>
                        ) : order.status === "confirmado" ? (
                            <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-200 text-green-800">
                            Confirmado
                            </span>
                        ) : (
                            <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                            {order.status
                                ? order.status.charAt(0).toUpperCase() + order.status.slice(1)
                                : 'N/A'}
                            </span>
                        )}
                    </p>

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
                <ul className="mt-4 space-y-4 list-none">
                    {products.map((p, idx) => {
                        const title =
                            p.title ||
                            (p.productId && (p.productId.title || p.productId.name)) ||
                            "Producto";
                        const priceUSD = typeof p.priceUSD === "number" ? p.priceUSD : (typeof p.price === "number" ? p.price : 0);
                        const priceARS = typeof p.priceARS === "number" ? p.priceARS : 0;
                        const quantity = typeof p.quantity === "number" ? p.quantity : 0;
                        const subtotalUSD = priceUSD * quantity;
                        const subtotalARS = priceARS * quantity;

                        return (
                            <li
                                key={p._id || idx}
                                className="grid grid-cols-[auto_1fr] gap-3 items-center border-b border-gray-300 pb-3"
                            >
                                {/* Columna izquierda (imagen) */}
                                <img
                                    src={p.thumbnails?.[0] || "https://placehold.co/80x80"}
                                    alt={title}
                                    className="w-20 h-20 object-cover rounded-md shadow bg-gray-200"
                                />

                                {/* Columna derecha (texto e info) */}
                                <div className="flex flex-col">
                                    <span className="font-semibold text-black mb-1">{title}</span>
                                    <div className="flex flex-wrap gap-2 text-sm text-gray-700">
                                        <span>x{quantity}</span>
                                        <span>USD ${priceUSD.toFixed(2)}</span>
                                        <span>AR$ {priceARS.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 text-xs text-gray-500 mt-1">
                                        <span className="text-blue-700 font-semibold">Subtotal USD: ${subtotalUSD.toFixed(2)}</span>
                                        <span className="text-green-700 font-semibold">Subtotal AR$: {subtotalARS.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}



            <div className="mt-4 pt-4 border-t border-gray-200 text-right flex flex-col gap-1">
                <span className="text-lg font-bold text-gray-900">
                    Total USD: ${totalUSD.toFixed(2)}
                </span>
                <span className="text-lg font-bold text-green-700">
                    Total AR$: {totalARS.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </span>
            </div>

        </div>
    );
}