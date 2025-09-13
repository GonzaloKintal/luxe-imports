
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';

export default function ProductList({ productos, onGoToDetail, loading, error }) {

    // Si está cargando, mostrar skeletons
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-full mx-auto px-4 animate-fadeInUp">
                {Array.from({ length: 10 }).map((_, index) => (
                    <ProductCardSkeleton key={index} />
                ))}
            </div>
        );
    }

    // Si hay error, mostrar mensaje
    if (error) {
        return (
            <div className="flex justify-center items-center py-20 text-red-600">
                <div className="text-center">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h3 className="text-xl font-semibold mb-2">Error al cargar productos</h3>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    // Si no hay productos después de filtrar
    if (productos.length === 0) {
        return (
            <div className="flex justify-center items-center py-20 text-gray-600">
                <div className="text-center">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold mb-2">No se encontraron productos</h3>
                    <p className="text-gray-500">Prueba ajustando los filtros de búsqueda</p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-full mx-auto px-4 animate-fadeInUp">
            {productos.map((producto) => (
                <ProductCard 
                    key={producto._id} 
                    {...producto} 
                    id={producto._id}
                    onClick={() => onGoToDetail(producto._id)}
                />
            ))}
        </div>
    );
}