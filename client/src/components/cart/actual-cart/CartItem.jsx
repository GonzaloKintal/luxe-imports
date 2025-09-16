export default function CartItem({ product, onAdd, onRemove, onRemoveInactive, loading = {} }) {

    const isInactiveOrNoStock = product.stock === 0 || product.status === false;
    const superaStock = typeof product.stock === 'number' && product.quantity > product.stock;

    return (
        <div className="animate-fadeInDown flex flex-col sm:flex-row items-center gap-4 justify-between border-b border-gray-200 pb-4 last:border-b-0">
            <img
                src={product.thumbnails?.[0] || 'https://placehold.co/120x120'}
                alt={product.title}
                className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-md shadow-md flex-shrink-0 bg-gray-200 mx-auto sm:mx-0"
            />

            <div className="flex-1 min-w-0 w-full">
                <h2 className="font-semibold text-lg text-black truncate">{product.title}</h2>
                <p className="text-gray-800 text-sm">
                    Precio: ${typeof product.price === 'number' ? product.price.toFixed(2) : 'N/A'}
                </p>
                {(isInactiveOrNoStock || superaStock) && (
                    <div className="mt-2 flex gap-2 items-center">
                        {product.stock === 0 && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-300 text-black text-xs font-bold shadow">
                                Sin stock
                            </span>
                        )}
                        {product.status === false && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-400 text-white text-xs font-bold shadow">
                                Producto inactivo
                            </span>
                        )}
                        {superaStock && product.stock > 0 && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-200 text-red-700 text-xs font-bold shadow">
                                Cantidad ({product.quantity}) supera stock actual ({product.stock})
                            </span>
                        )}
                    </div>
                )}
            </div>

            <div className="flex flex-row items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
                {isInactiveOrNoStock ? (
                    <button
                        onClick={() => onRemoveInactive(product)}
                        className="bg-gray-300 hover:bg-gray-500 text-black hover:text-white px-3 py-2 rounded-full shadow-md"
                        title="Eliminar producto"
                        disabled={loading.removeInactive}
                        style={loading.removeInactive ? { opacity: 0.6, pointerEvents: 'none' } : {}}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                ) : (
                    <>
                        <button
                            onClick={() => onRemove(product)}
                            className="rounded-full bg-black hover:bg-gray-800 text-white h-9 w-9 flex items-center justify-center shadow-md transition-all duration-200"
                            title={product.quantity > 1 ? "Quitar uno" : "Eliminar producto"}
                            disabled={loading.remove}
                            style={loading.remove ? { opacity: 0.6, pointerEvents: 'none' } : {}}
                        >
                            {product.quantity > 1 ? '–' : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>

                        <span className="font-bold text-black bg-gray-200 border border-gray-400 rounded-full px-3 py-2 text-base shadow-sm text-center min-w-[40px]">
                            {product.quantity}
                        </span>

                        <button
                            onClick={() => onAdd(product)}
                            className="rounded-full bg-black hover:bg-gray-800 text-white h-9 w-9 flex items-center justify-center shadow-md transition-all duration-200"
                            title="Agregar uno"
                            disabled={loading.add}
                            style={loading.add ? { opacity: 0.6, pointerEvents: 'none' } : {}}
                        >
                            +
                        </button>
                    </>
                )}
            </div>

            <span className="px-2 font-semibold text-black text-base">
                ${(product.price * product.quantity).toFixed(2)}
            </span>
        </div>
    );

}