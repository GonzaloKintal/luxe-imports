
export default function ProductDetailSkeleton() {

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col py-8 pt-20">
      {/* Botón de volver skeleton */}
      <div className="w-full px-4 sm:px-6 lg:px-8 mt-6 mb-4">
        <div className="flex items-center gap-2 text-gray-300 animate-pulse">
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded w-16"></div>
        </div>
      </div>

      {/* Contenedor principal skeleton */}
      <div className="flex-grow flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-0 w-full">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
            <div className="lg:grid lg:grid-cols-2 lg:gap-0">
              
              {/* Galería de imágenes skeleton */}
              <div className="p-6 lg:p-8">
                <div className="aspect-square bg-gray-300 rounded-xl mb-4 max-w-lg mx-auto"></div>
                <div className="flex gap-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-16 h-16 bg-gray-300 rounded-lg"></div>
                  ))}
                </div>
              </div>
              
              {/* Información del producto skeleton */}
              <div className="p-6 lg:p-8 lg:border-l lg:border-gray-200">
                <div className="space-y-6">
                  
                  {/* Título y categoría skeleton */}
                  <div>
                    <div className="h-8 bg-gray-300 rounded mb-2 w-3/4"></div>
                    <div className="h-6 bg-gray-300 rounded-full w-20"></div>
                  </div>

                  {/* Precios skeleton */}
                  <div className="flex flex-col gap-1 mb-2">
                    <div className="h-10 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-300 rounded w-full mt-1"></div>
                  </div>

                  {/* Descripción skeleton */}
                  <div>
                    <div className="h-6 bg-gray-300 rounded mb-2 w-1/4"></div>
                    <div className="h-4 bg-gray-300 rounded mb-1"></div>
                    <div className="h-4 bg-gray-300 rounded mb-1 w-5/6"></div>
                    <div className="h-4 bg-gray-300 rounded w-4/6"></div>
                  </div>

                  {/* Código y stock skeleton */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="h-4 bg-gray-300 rounded mb-1 w-1/3"></div>
                      <div className="h-5 bg-gray-300 rounded w-2/3"></div>
                    </div>
                    <div>
                      <div className="h-4 bg-gray-300 rounded mb-1 w-1/3"></div>
                      <div className="h-5 bg-gray-300 rounded w-2/3"></div>
                    </div>
                  </div>

                  {/* Botón agregar al carrito skeleton */}
                  <div className="w-full h-12 bg-gray-300 rounded-lg"></div>

                  {/* Estado del producto skeleton */}
                  <div className="flex items-center gap-2">
                    <div className="h-4 bg-gray-300 rounded w-12"></div>
                    <div className="h-6 bg-gray-300 rounded-full w-16"></div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}