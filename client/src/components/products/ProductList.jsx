import { FaPlus, FaMinus } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function ProductList({ 
    productos, 
    cartInfo, 
    isAdmin, 
    onAddToCart, 
    onRemoveFromCart, 
    onSelectProduct 
}) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-5 max-w-7xl mx-auto animate-fadeInUp">
            {productos.map((producto) => {
                const cantidad = cartInfo.items[producto._id] || 0;
                const sinStock = !producto.stock || Number(producto.stock) <= 0;
                
                return (
                    <div
                        key={producto._id}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 cursor-pointer hover:scale-[1.01] hover:shadow-lg transition-all duration-200 relative border border-blue-100 dark:border-blue-900 min-h-[120px] group flex flex-col sm:grid sm:grid-cols-1"
                        onClick={() => onSelectProduct(producto)}
                    >
                        {sinStock && (
                            <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-0.5 rounded font-bold text-[10px] shadow-sm z-20 pointer-events-none">
                                SIN STOCK
                            </span>
                        )}
                        
                        <div className="flex flex-col sm:flex-col gap-3 items-center h-full w-full">
                            <img
                                src={producto.thumbnails?.[0] || 'https://placehold.co/250x250'}
                                alt={producto.title}
                                className="w-[180px] h-[180px] sm:w-[250px] sm:h-[250px] object-cover rounded-md shadow-md transition-all duration-200 flex-shrink-0 mx-auto"
                            />
                            
                            <div className="flex flex-col justify-between flex-1 h-full w-full items-center sm:items-start">
                                <h2 className="text-base font-bold mb-0.5 text-blue-700 dark:text-blue-300 truncate drop-shadow transition-all duration-200 text-center sm:text-left w-full">
                                    {producto.title}
                                </h2>
                                
                                <div className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-1 text-center sm:text-left w-full">
                                    ${producto.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                                
                                <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start w-full">
                                    {!sinStock && (
                                        <div className="flex w-full gap-2">
                                            <button
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    if (isAdmin) {
                                                        toast.error('Los administradores no pueden generar pedidos');
                                                        return;
                                                    }
                                                    if (cantidad < 1) {
                                                        toast.error('No puedes quitar productos si la cantidad es 0');
                                                        return;
                                                    }
                                                    onRemoveFromCart(producto);
                                                }}
                                                className="rounded-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white h-10 sm:h-8 flex items-center justify-center shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 flex-1 min-w-0 text-base"
                                                title={isAdmin ? "Los administradores no pueden generar pedidos" : cantidad < 1 ? "No puedes quitar productos si la cantidad es 0" : "Quitar uno"}
                                            >
                                                <FaMinus />
                                            </button>
                                            
                                            <span className="font-bold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-700 rounded-full px-3 py-2 sm:py-1 text-base sm:text-xs shadow-sm text-center min-w-[40px]">
                                                {cantidad}
                                            </span>
                                            
                                            <button
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    if (isAdmin) {
                                                        toast.error('Los administradores no pueden generar pedidos');
                                                        return;
                                                    }
                                                    onAddToCart(producto);
                                                }}
                                                className="rounded-full bg-gradient-to-r from-blue-600 to-purple-500 hover:from-blue-700 hover:to-purple-600 text-white h-10 sm:h-8 flex items-center justify-center shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 flex-1 min-w-0 text-base"
                                                title={isAdmin ? "Los administradores no pueden generar pedidos" : "Agregar uno"}
                                            >
                                                <FaPlus />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}