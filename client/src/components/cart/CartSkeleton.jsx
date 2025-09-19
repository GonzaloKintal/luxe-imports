export default function CartSkeleton() {

  return (
    <main className="bg-white px-0 pt-12 relative overflow-hidden min-h-screen text-black">
      <div className="relative z-10 px-6 py-20 max-w-7xl mx-auto">
        {/* Título skeleton */}
        <div className="flex justify-center mb-10">
          <div className="h-10 bg-gray-300 rounded w-48 animate-pulse"></div>
        </div>

        {/* Información del vendedor skeleton */}
        <div className="mb-6 flex items-center justify-start gap-2 max-w-3xl mx-auto animate-pulse">
          <div className="h-7 bg-gray-300 rounded w-32"></div>
          <div className="bg-gray-300 p-1.5 rounded-full w-8 h-8"></div>
        </div>

        {/* Items del carrito skeleton */}
        <div className="max-w-3xl mx-auto space-y-4 mb-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Imagen skeleton */}
                <div className="w-full sm:w-24 h-24 bg-gray-300 rounded-lg flex-shrink-0"></div>
                
                {/* Contenido del producto skeleton */}
                <div className="flex-grow space-y-3">
                  {/* Título y categoría */}
                  <div>
                    <div className="h-5 bg-gray-300 rounded mb-1 w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                  </div>

                  {/* Precio y controles */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="space-y-2">
                      <div className="h-6 bg-gray-300 rounded w-20"></div>
                      <div className="h-4 bg-gray-300 rounded w-16"></div>
                    </div>
                    
                    {/* Controles de cantidad skeleton */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <div className="w-8 h-8 bg-gray-300 rounded-l-lg"></div>
                        <div className="w-12 h-8 bg-gray-300 border-x border-gray-300 flex items-center justify-center">
                        </div>
                        <div className="w-8 h-8 bg-gray-300 rounded-r-lg"></div>
                      </div>
                      
                      {/* Botón eliminar skeleton */}
                      <div className="w-8 h-8 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total y botón de compra skeleton */}
        <div className="flex flex-col sm:flex-row justify-between items-center max-w-3xl mx-auto p-4 bg-gray-50 rounded-lg border border-gray-200 animate-pulse">
          <div className="flex flex-col gap-2 sm:gap-2">
            <div className="h-4 bg-gray-300 rounded w-24"></div>
            <div className="h-8 bg-gray-300 rounded w-20"></div>
          </div>

          <div className="mt-2 sm:mt-0">
            <div className="h-12 bg-gray-300 rounded-lg w-40"></div>
          </div>
        </div>

        {/* Historial skeleton */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="h-8 bg-gray-300 rounded mb-6 w-48 animate-pulse"></div>
          
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
                <div className="flex justify-between items-start mb-3">
                  <div className="space-y-2">
                    <div className="h-5 bg-gray-300 rounded w-32"></div>
                    <div className="h-4 bg-gray-300 rounded w-24"></div>
                  </div>
                  <div className="h-6 bg-gray-300 rounded-full w-20"></div>
                </div>
                
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
                
                <div className="mt-3 flex justify-between items-center">
                  <div className="h-4 bg-gray-300 rounded w-20"></div>
                  <div className="h-6 bg-gray-300 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );

}