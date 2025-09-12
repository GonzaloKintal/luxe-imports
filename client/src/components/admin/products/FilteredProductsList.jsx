import React from 'react';
import FilteredProductCard from './FilteredProductCard';

export default function FilteredProductsList({ 
    filteredProducts, 
    onEdit, 
    onToggleFeatured, 
    onDelete, 
    onReactivate 
}) {

    if (filteredProducts.length === 0) {
        return (
            <ul className="space-y-4 w-full mt-4">
                <li className="bg-white p-8 rounded-xl border border-gray-300 shadow-md text-center">
                    <p className="text-gray-500 text-lg">No se encontraron productos con los filtros actuales</p>
                </li>
            </ul>
        );
    }

    return (
        <ul className="space-y-4 w-full mt-4">
            {filteredProducts.map((product) => (

                <FilteredProductCard
                    key={product._id || product.id}
                    product={product}
                    onEdit={onEdit}
                    onToggleFeatured={onToggleFeatured}
                    onDelete={onDelete}
                    onReactivate={onReactivate}
                />
                
            ))}
        </ul>
    );

}