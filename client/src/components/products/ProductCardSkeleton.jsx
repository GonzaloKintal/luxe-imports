export default function ProductCardSkeleton() {
    
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 w-full max-w-sm mx-auto flex flex-col animate-pulse">
      {/* Imagen skeleton */}
      <div className="w-full aspect-square bg-gray-300 rounded-t-2xl"></div>

      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        {/* Título skeleton */}
        <div className="flex items-start gap-2 mb-3">
          <div className="w-4 h-4 bg-gray-200 rounded mt-1 flex-shrink-0"></div>
          <div className="flex-1">
            <div className="h-5 bg-gray-200 rounded mb-2"></div>
            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>

        {/* Espacio flexible */}
        <div className="flex flex-col mt-auto">
          {/* Precio en pesos skeleton */}
          <div className="h-6 bg-gray-200 rounded mb-1 w-2/3"></div>
          
          {/* Precio en dólares skeleton */}
          <div className="h-5 bg-gray-200 rounded mb-3 sm:mb-4 w-1/2"></div>

          {/* Botón skeleton */}
          <div className="w-full h-10 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );

}