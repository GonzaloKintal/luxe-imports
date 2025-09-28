export default function HistoryOrderCardSkeleton() {
    
    return (
        <div className="border border-gray-200 rounded-lg bg-gray-50 animate-pulse">
            <div className="p-4">
                <div className="flex justify-between items-center">
                    <div className="flex-1">
                        {/* ID del pedido skeleton */}
                        <div className="h-6 bg-gray-200 rounded w-1/3 mb-3"></div>
                        
                        <div className="text-sm text-gray-600 mt-1 space-y-3">
                            {/* Información del usuario skeleton */}
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="flex items-center gap-2">
                                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                                </div>
                            </div>

                            {/* Fechas skeleton */}
                            <div className="flex flex-col gap-2">
                                {/* Fecha de pedido */}
                                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                {/* Fecha de confirmación */}
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            </div>

                            {/* Estado skeleton */}
                            <div className="flex items-center gap-2">
                                <div className="h-4 bg-gray-200 rounded w-14"></div>
                                <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Botón skeleton */}
                <div className="flex mt-4 justify-start md:justify-end md:mt-0">
                    <div className="w-32 h-10 bg-gray-200 rounded-lg"></div>
                </div>

                {/* Sección de productos expandida skeleton */}
                <div className="mt-4 border-t border-gray-200 pt-4">
                    <div className="space-y-3">
                        {/* Producto 1 skeleton */}
                        <div className="flex flex-col md:flex-row justify-between py-3 px-4 bg-white rounded-lg border border-gray-100">
                            <div className="flex-1 h-5 bg-gray-200 rounded mb-2 md:mb-0"></div>
                            <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-2">
                                <div className="h-4 bg-gray-200 rounded w-28 md:w-32"></div>
                                <div className="h-4 bg-gray-200 rounded w-32 md:w-36"></div>
                                <div className="h-4 bg-gray-200 rounded w-20 md:w-24"></div>
                                <div className="h-4 bg-gray-200 rounded w-24 md:w-28"></div>
                                <div className="h-4 bg-gray-200 rounded w-28 md:w-32"></div>
                            </div>
                        </div>
                        
                        {/* Producto 2 skeleton */}
                        <div className="flex flex-col md:flex-row justify-between py-3 px-4 bg-white rounded-lg border border-gray-100">
                            <div className="flex-1 h-5 bg-gray-200 rounded mb-2 md:mb-0"></div>
                            <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-2">
                                <div className="h-4 bg-gray-200 rounded w-28 md:w-32"></div>
                                <div className="h-4 bg-gray-200 rounded w-32 md:w-36"></div>
                                <div className="h-4 bg-gray-200 rounded w-20 md:w-24"></div>
                                <div className="h-4 bg-gray-200 rounded w-24 md:w-28"></div>
                                <div className="h-4 bg-gray-200 rounded w-28 md:w-32"></div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Totales skeleton */}
                    <div className="mt-4 pt-4 border-t border-gray-200 text-right flex flex-col gap-2">
                        <div className="h-6 bg-gray-200 rounded w-40 ml-auto"></div>
                        <div className="h-6 bg-gray-200 rounded w-48 ml-auto"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}