
import ProductCard from './ProductCard';

export default function ProductList({ productos, onGoToDetail }) {

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