import React from 'react';
import { FaClock } from 'react-icons/fa';

export default function PendingOrders({ loading, onClose }) {
    
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
                <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <FaClock className="text-orange-500" />
                        Pedidos Pendientes
                    </h3>
                    <p className="text-gray-600 mt-1">
                        Revisa los pedidos que aún no han sido completados
                    </p>
                </div>

                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-flex items-center gap-3 text-gray-600">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                                <span className="text-lg">Cargando pedidos...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <FaClock className="text-6xl mx-auto" />
                            </div>
                            <h4 className="text-xl font-medium text-gray-600 mb-2">
                                Functionality coming soon
                            </h4>
                            <p className="text-gray-500">
                                Aquí podrás ver y gestionar los pedidos pendientes
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

}
