import { useState } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaTimes } from 'react-icons/fa';
const API_URL = import.meta.env.VITE_API_URL;

export default function CreateCategoryForm({ onSave, onCancel }) {

    const [form, setForm] = useState({
        name: '',
        description: ''
    });

    function handleChange(e) {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/categories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Error al crear categoría');
            }
            const data = await res.json();
            toast.success('Categoría creada correctamente');
            if (onSave) onSave(data);
        } catch (err) {
            toast.error(err.message);
        }
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

            <form onSubmit={handleSubmit} className="space-y-4">
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