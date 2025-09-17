
export default function AdminProductCardSkeleton() {
  return (
    <li className="bg-white p-4 rounded-xl border border-gray-300 shadow-md animate-pulse">
      <div className="flex flex-col gap-4">
        {/* Contenido principal */}
        <div className="flex items-center gap-4">
          {/* Imagen skeleton */}
          <div className="w-24 h-24 bg-gray-300 rounded-md flex-shrink-0"></div>
          
          {/* Información skeleton */}
          <div className="flex-1 min-w-0 space-y-3">
            {/* Título */}
            <div className="h-6 bg-gray-300 rounded w-3/4"></div>
            
            {/* Precios */}
            <div className="space-y-2">
              <div className="h-5 bg-gray-300 rounded w-1/2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            </div>
            
            {/* Stock */}
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          </div>
        </div>

        {/* Botones skeleton */}
        <div className="flex justify-start md:justify-end">
          <div className="flex gap-2">
            <div className="w-32 h-10 bg-gray-300 rounded-lg"></div>
            <div className="w-10 h-10 bg-gray-300 rounded-lg"></div>
            <div className="w-10 h-10 bg-gray-300 rounded-lg"></div>
          </div>
        </div>
      </div>
    </li>
  );
}