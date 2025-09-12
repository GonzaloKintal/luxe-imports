import React, { useEffect } from 'react';
import { FaTimes, FaCheck } from 'react-icons/fa';

export default function ConfirmDeleteProduct({ open, title, message, onConfirm, onCancel, productName }) {

    useEffect(() => {
        if (open) {
            // bloquea scroll
            document.body.style.overflow = 'hidden';
        } else {
            // lo vuelve a habilitar
            document.body.style.overflow = '';
        }

        // cleanup por seguridad si el componente se desmonta
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    if (!open) return null;

    if (!open) return null;
    
    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 px-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md border border-gray-200">
                <h2 className="text-lg font-bold mb-3 text-gray-900 text-center">
                    {title}
                </h2>
                
                <p className="mb-4 text-gray-700 text-center text-sm font-medium">
                    {message}
                </p>
                
                {productName && (
                    <p className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-center font-semibold">
                        "{productName}"
                    </p>
                )}
                
                <div className="flex justify-center gap-3 pt-3 border-t border-gray-200">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold border border-gray-300 transition-colors duration-200 flex items-center gap-1"
                    >
                        <FaTimes className="text-xs" />
                        Cancelar
                    </button>
                    
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 text-sm rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors duration-200 flex items-center gap-1"
                    >
                        <FaCheck className="text-xs" />
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );

}