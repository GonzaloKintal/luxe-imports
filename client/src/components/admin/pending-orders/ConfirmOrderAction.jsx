import React, { useEffect, useState } from 'react';
import { FaTimes, FaCheck, FaTrash, FaSpinner } from 'react-icons/fa';

export default function ConfirmOrderAction({
    open,
    title,
    message,
    onConfirm,
    onCancel,
    orderInfo,
    actionType = 'confirm' // 'confirm' o 'delete'
}) {

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


    const [loading, setLoading] = useState(false);

    if (!open) return null;

    const isDelete = actionType === 'delete';
    const actionColor = isDelete ? 'red' : 'green';
    const ActionIcon = isDelete ? FaTrash : FaCheck;
    const actionText = isDelete ? 'Eliminar' : 'Confirmar';

    const handleConfirm = async () => {
        setLoading(true);
        try {
            await onConfirm();
        } finally {
            setLoading(false);
        }
    };

    
    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 px-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md border border-gray-200">
                <h2 className="text-lg font-bold mb-3 text-gray-900 text-center">
                    {title}
                </h2>

                <p className="mb-4 text-gray-700 text-center text-sm font-medium">
                    {message}
                </p>

                {orderInfo && (
                    <div className={`mb-6 p-3 bg-${actionColor}-50 border border-${actionColor}-200 rounded-md text-${actionColor}-700 text-center`}>
                        <p className="font-semibold text-sm">
                            Pedido: {orderInfo.id}
                        </p>
                        {orderInfo.userName && (
                            <p className="text-xs mt-1">
                                Usuario: {orderInfo.userName}
                            </p>
                        )}
                        {orderInfo.pendingAt && (() => {
                            const [datePart, timePart] = orderInfo.pendingAt.split(' ');
                            return (
                                <p className="text-xs mt-1">
                                    Pedido el <span className="font-semibold">{datePart}</span> a las <span className="font-semibold">{timePart}</span>
                                </p>
                            );
                        })()}

                        {orderInfo.confirmedAt && (() => {
                            const [datePart, timePart] = orderInfo.confirmedAt.split(' ');
                            return (
                                <p className="text-xs mt-1">
                                    Confirmado el <span className="font-semibold">{datePart}</span> a las <span className="font-semibold">{timePart}</span>
                                </p>
                            );
                        })()}
                    </div>
                )}



                <div className="flex justify-center gap-3 pt-3 border-t border-gray-200">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="px-4 py-2 text-sm rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold border border-gray-300 transition-colors duration-200 flex items-center gap-1"
                    >
                        <FaTimes className="text-xs" />
                        Cancelar
                    </button>

                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className={`px-4 py-2 text-sm cursor-pointer rounded-md bg-${actionColor}-600 hover:bg-${actionColor}-700 text-white font-semibold transition-colors duration-200 flex items-center gap-1`}
                    >
                        {loading ? (
                            <>
                                <FaSpinner className="animate-spin mr-2 text-white" />
                                {isDelete ? 'Eliminando...' : 'Confirmando...'}
                            </>
                        ) : (
                            <>
                                <ActionIcon className="text-xs" />
                                {actionText}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );

}