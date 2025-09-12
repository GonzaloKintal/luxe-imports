import React from 'react';
import { FaCheckCircle, FaBan, FaEdit, FaTrash } from 'react-icons/fa';

export default function FilteredProductCard({ 
    product, 
    onEdit, 
    onToggleFeatured, 
    onDelete, 
    onReactivate 
}) {
    return (
        <li className="bg-white p-4 rounded-xl border border-gray-300 shadow-md flex items-center gap-4 transition-all duration-300 hover:shadow-lg">
            <ProductImage 
                src={product.thumbnails?.[0] || 'https://placehold.co/100x100'}
                alt={product.title}
            />
            
            <ProductInfo product={product} />
            
            <ProductActions 
                product={product}
                onEdit={onEdit}
                onToggleFeatured={onToggleFeatured}
                onDelete={onDelete}
                onReactivate={onReactivate}
            />
        </li>
    );
}

function ProductImage({ src, alt }) {
    return (
        <img
            src={src}
            alt={alt}
            className="w-24 h-24 object-cover rounded-md shadow-md flex-shrink-0 bg-gray-100"
        />
    );
}

function ProductInfo({ product }) {
    return (
        <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-lg text-gray-900 truncate">{product.title}</h2>
            <p className="text-gray-700">${typeof product.price === 'number' ? product.price.toFixed(2) : 'N/A'}</p>
            <p className="text-sm text-gray-500">Stock: {product.stock}</p>
        </div>
    );
}

function ProductActions({ product, onEdit, onToggleFeatured, onDelete, onReactivate }) {
    return (
        <div className="flex gap-3 items-center">

            {/* Botón de destacado */}
            <FeaturedButton product={product} onToggleFeatured={onToggleFeatured} />
            
            {/* Botón de editar (solo si está activo) */}
            {product.status && (
                <EditButton product={product} onEdit={onEdit} />
            )}
            
            {/* Botón de eliminar o reactivar */}
            {product.status ? (
                <DeleteButton product={product} onDelete={onDelete} />
            ) : (
                <ReactivateButton product={product} onReactivate={onReactivate} />
            )}

        </div>
    );
}

function FeaturedButton({ product, onToggleFeatured }) {
    return (
        <button
            onClick={() => onToggleFeatured(product)}
            className={`px-4 py-2 rounded-lg border transition-all duration-300 font-semibold flex items-center gap-2 ${
                product.featured 
                    ? 'bg-yellow-100 border-yellow-400 text-yellow-800' 
                    : 'bg-gray-100 border-gray-300 text-gray-700'
            }`}
            title={product.featured ? 'Quitar de destacados' : 'Marcar como destacado'}
        >
            {product.featured ? <FaCheckCircle className="text-yellow-500" /> : <FaBan className="text-gray-400" />}
            {product.featured ? 'Destacado' : 'No destacado'}
        </button>
    );
}

function EditButton({ product, onEdit }) {
    return (
        <button
            onClick={() => onEdit(product)}
            className="p-3 rounded-lg bg-blue-500/60 hover:bg-blue-600 text-white transition-all duration-300 shadow-md flex items-center justify-center"
            title="Editar producto"
        >
            <FaEdit size={20} />
        </button>
    );
}

function DeleteButton({ product, onDelete }) {
    return (
        <button
            onClick={() => onDelete(product._id || product.id)}
            className="p-3 rounded-lg bg-red-500/60 hover:bg-red-600 text-white transition-all duration-300 shadow-md flex items-center justify-center"
            title="Eliminar producto"
        >
            <FaTrash size={20} />
        </button>
    );
}


function ReactivateButton({ product, onReactivate }) {
    return (
        <button
            onClick={() => onReactivate(product._id || product.id)}
            className="bg-green-600 hover:bg-green-700 text-white border border-green-600 px-4 py-2 rounded-lg transition-all duration-300"
        >
            Reactivar
        </button>
    );
}