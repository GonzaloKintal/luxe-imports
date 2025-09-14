import CartItem from './CartItem';

export default function CartItems({ 
    products, 
    onAdd, 
    onRemove, 
    onRemoveInactive 
}) {
    if (!products.length) {
        return (
            <p className="text-center text-gray-500 py-8">
                No hay productos en el carrito.
            </p>
        );
    }

    return (
        <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-lg shadow-sm p-4">
            <div className="flex flex-col gap-4">
                {products.map((product) => (
                    <CartItem
                        key={product._id}
                        product={product}
                        onAdd={onAdd}
                        onRemove={onRemove}
                        onRemoveInactive={onRemoveInactive}
                    />
                ))}
            </div>
        </div>
    );
    
}