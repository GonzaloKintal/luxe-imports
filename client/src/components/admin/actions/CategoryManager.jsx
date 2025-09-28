import { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaEye, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import ConfirmDeleteCategory from './ConfirmDeleteCategory';
import { useAuthFetch } from "../../../hooks/useAuthFetch";


const API_URL = import.meta.env.VITE_API_URL;

export default function CategoryManager() {
    const { authFetch } = useAuthFetch();

    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({ name: '', description: '' });
    const [editingId, setEditingId] = useState(null);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    async function fetchCategories() {
        try {
            const res = await authFetch(`${API_URL}/api/categories`);
            if (!res) return; // si hubo 401 ya lo maneja el hook
            if (!res.ok) {
                toast.error(`Error del servidor (${res.status}): ${res.statusText}`);
                return;
            }
            const data = await res.json();
            setCategories(data);
        } catch (err) {
            toast.error('Error de red o inesperado: ' + err.message);
        }
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            let res, data;
            if (editingId) {
                res = await authFetch(`${API_URL}/api/categories/${editingId}`, {
                    method: 'PUT',
                    body: JSON.stringify(form)
                });
                if (!res) return;
                if (!res.ok) throw new Error('Error al editar categoría');
                data = await res.json();
                toast.success('Categoría editada');
            } else {
                res = await authFetch(`${API_URL}/api/categories`, {
                    method: 'POST',
                    body: JSON.stringify(form)
                });
                if (!res) return;
                if (!res.ok) throw new Error('Error al crear categoría');
                data = await res.json();
                toast.success('Categoría creada');
            }
            setForm({ name: '', description: '' });
            setEditingId(null);
            fetchCategories();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    }

    function handleDeleteRequest(cat) {
        setCategoryToDelete(cat);
        setConfirmOpen(true);
    }

    async function confirmDelete() {
        try {
            const res = await authFetch(`${API_URL}/api/categories/${categoryToDelete._id}`, {
                method: 'DELETE'
            });
            if (!res) return;
            if (!res.ok) {
                let errorMsg = 'Error al eliminar categoría';
                try {
                    const errorData = await res.json();
                    errorMsg = errorData.error || errorMsg;
                } catch {}
                throw new Error(errorMsg);
            }
            toast.success('Categoría eliminada');
            fetchCategories();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setConfirmOpen(false);
            setCategoryToDelete(null);
        }
    }

    function handleEdit(cat) {
        setForm({ name: cat.name, description: cat.description || '' });
        setEditingId(cat._id);
    }

    function handleCancelEdit() {
        setForm({ name: '', description: '' });
        setEditingId(null);
    }

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-300 p-6 mt-4">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FaEye className="text-gray-600" />
                    Administrar categorías
                </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
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
                    {editingId && (
                        <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold border border-gray-300 transition-colors duration-200 text-sm"
                        >
                            Cancelar edición
                        </button>
                    )}
                    <button
                        type="submit"
                        className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors duration-200 text-sm shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                        disabled={loading}
                    >
                        {loading && <FaSpinner className="animate-spin-slow" />}
                        {loading ? (editingId ? 'Guardando...' : 'Creando...') : (editingId ? 'Guardar cambios' : 'Crear categoría')}
                    </button>
                </div>
            </form>

            <div>
                <h4 className="text-lg font-semibold mb-2">Categorías existentes</h4>
                {categories.length === 0 ? (
                    <div className="text-gray-500 text-sm py-6 text-center">No hay categorías creadas.</div>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {categories.map(cat => (
                            <li key={cat._id} className="py-3 flex items-center justify-between">
                                <div>
                                    <span className="font-bold text-gray-800">{cat.name}</span>
                                    {cat.description && (
                                        <span className="ml-2 text-gray-500 text-sm">{cat.description}</span>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(cat)}
                                        className="p-2 rounded-lg bg-blue-500/60 hover:bg-blue-600 text-white transition-all duration-300 shadow-md flex items-center justify-center"
                                        title="Editar"
                                    >
                                        <FaEdit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteRequest(cat)}
                                        className="p-2 rounded-lg bg-red-500/60 hover:bg-red-600 text-white transition-all duration-300 shadow-md flex items-center justify-center"
                                        title="Eliminar"
                                    >
                                        <FaTrash size={16} />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <ConfirmDeleteCategory
                open={confirmOpen}
                categoryName={categoryToDelete?.name}
                onConfirm={confirmDelete}
                onCancel={() => setConfirmOpen(false)}
            />
        </div>
    );
}
