import { useState } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaSpinner } from 'react-icons/fa';
import { useAuthFetch } from '../../hooks/useAuthFetch'; // importamos el hook
const API_URL = import.meta.env.VITE_API_URL;

export default function CreateCategoryForm({ onSave }) {
    const [form, setForm] = useState({
        name: '',
        description: ''
    });

    const [isUploading, setIsUploading] = useState(false);

    const { authFetch } = useAuthFetch(); // usamos authFetch

    function handleChange(e) {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setIsUploading(true);
        try {
            const res = await authFetch(`${API_URL}/api/categories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });

            if (!res) return; // si token expiró, authFetch ya manejó el modal/notificación

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Error al crear categoría');
            }

            const data = await res.json();
            toast.success('Categoría creada correctamente');
            if (onSave) onSave(data);
        } catch (err) {
            toast.error(err.message || 'Error al crear categoría');
        } finally {
            setIsUploading(false);
        }
    }

    return (
        <div className="mt-4 bg-white rounded-xl shadow-lg border border-gray-300 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FaPlus className="text-gray-600" />
                    <span className="sm:hidden">Crear categoría</span>
                    <span className="hidden sm:inline">Crear nueva categoría</span>
                </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="category-name" className="block text-gray-700 mb-1 font-semibold text-sm">
                        Nombre de la categoría <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="category-name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                        placeholder="Nombre de la categoría"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-gray-700 mb-1 font-semibold text-sm">
                        Descripción
                    </label>
                    <textarea
                        id="description"
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
                        type="submit"
                        disabled={isUploading}
                        className={`px-5 py-2 rounded-lg font-semibold transition-colors duration-200 text-sm shadow-md ${
                            isUploading
                                ? 'bg-gray-400 cursor-not-allowed text-gray-700'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                        } flex items-center justify-center gap-2`}
                    >
                        {isUploading ? (
                            <>
                                <FaSpinner className="animate-spin mr-2 text-gray-500" />
                                Creando categoría...
                            </>
                        ) : (
                            'Crear categoría'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
