export default function HistoryOrderCardSkeleton() {
    
    return (
        <div className="border border-gray-200 rounded-lg bg-gray-50 animate-pulse">
            <div className="p-4">
                <div className="flex justify-between items-center">
                    <div className="flex-1">
                        {/* ID del pedido skeleton */}
                        <div className="h-5 bg-gray-200 rounded w-1/3 mb-3"></div>
                        
                        <div className="space-y-2">
                            {/* Usuario skeleton */}
                            <div className="flex items-center gap-2">
                                <div className="h-4 bg-gray-200 rounded w-16"></div>
                                <div className="h-4 bg-gray-200 rounded w-32"></div>
                                <div className="h-4 bg-gray-200 rounded w-24"></div>
                            </div>

                            {/* Fechas skeleton */}
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                                </div>
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
            </div>
        </div>
    );

}