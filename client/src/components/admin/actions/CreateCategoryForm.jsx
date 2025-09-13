import { useState } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';

export default function CreateCategoryForm({ onSave, onCancel }) {

    const [form, setForm] = useState({
        name: '',
        description: ''
    });

    function handleChange(e) {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    }

    function handleSubmit(e) {
        e.preventDefault();
        onSave(form);
    }

    return (
        <div className="mt-4 bg-white rounded-xl shadow-lg border border-gray-300 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FaPlus className="text-gray-600" />
                    Crear nueva categoría
                </h3>
                <button
                    onClick={onCancel}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors duration-200"
                    title="Cerrar formulario"
                >
                    <FaTimes className="text-lg" />
                </button>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v6a1 1 0 102 0V5zm-1 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">
                            Functionality coming soon
                        </h3>
                        <div className="mt-2 text-sm text-yellow-700">
                            <p>
                                La creación de categorías estará disponible en una próxima actualización.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 opacity-50 pointer-events-none">
                <div>
                    <label className="block text-gray-700 mb-1 font-semibold text-sm">
                        Nombre de la categoría <span className="text-red-500">*</span>
                    </label>
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                        placeholder="Nombre de la categoría"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 mb-1 font-semibold text-sm">Descripción</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm resize-vertical"
                        placeholder="Descripción de la categoría"
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold border border-gray-300 transition-colors duration-200 text-sm"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors duration-200 text-sm shadow-md"
                    >
                        Crear categoría
                    </button>
                </div>
            </form>
        </div>
    );

}