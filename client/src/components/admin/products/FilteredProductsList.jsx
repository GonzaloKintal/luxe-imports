import React from 'react';
import FilteredProductCard from './FilteredProductCard';
import FilteredProductCardSkeleton from './FilteredProductCardSkeleton';

export default function FilteredProductsList({ 
    filteredProducts, 
    onEdit, 
    onToggleFeatured, 
    onDelete, 
    onReactivate,
    cotizacion,
    loadingCotizacion,
    errorCotizacion,
    editingProductId,
    onStartEditing,
    onCancelEditing,
    loading,
    editingLoading
}) {

    if (loading) {
        return (
            <ul className="space-y-4 w-full mt-4">
                {[...Array(6)].map((_, index) => (
                    <FilteredProductCardSkeleton key={index} />
                ))}
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
                    cotizacion={cotizacion}
                    loadingCotizacion={loadingCotizacion}
                    errorCotizacion={errorCotizacion}
                    isEditing={editingProductId === (product._id || product.id)}
                    onStartEditing={() => onStartEditing(product._id || product.id)}
                    onCancelEditing={onCancelEditing}
                    editingLoading={editingLoading}
                />
            ))}
        </ul>
    );

}