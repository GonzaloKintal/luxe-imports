export default function PendingOrderCardSkeleton() {
    
    return (
        <div className="border border-gray-200 rounded-lg bg-gray-50 animate-pulse">
            <div className="p-4">
                <div className="flex justify-between items-center">
                    <div className="flex-1">
                        {/* ID del pedido skeleton */}
                        <div className="h-6 bg-gray-200 rounded w-1/3 mb-3"></div>
                        
                        <div className="space-y-3">
                            {/* Información del usuario skeleton */}
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="flex gap-2">
                                    <div className="h-4 bg-gray-200 rounded w-6"></div>
                                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                                </div>
                            </div>

                            {/* Fechas skeleton */}
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="flex items-center gap-2">
                                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                                    <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Botones skeleton */}
                <div className="flex mt-4 justify-start md:justify-end">
                    <div className="flex gap-2">
                        <div className="w-32 h-10 bg-gray-200 rounded-lg"></div>
                        <div className="w-32 h-10 bg-gray-200 rounded-lg"></div>
                        <div className="w-32 h-10 bg-gray-200 rounded-lg"></div>
                    </div>
                </div>
            </div>
        </div>
    );
    
}