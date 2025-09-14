import { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaEye, FaPlus, FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL;

export default function CategoryManager({ onClose }) {
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({ name: '', description: '' });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    async function fetchCategories() {
        try {
            const res = await fetch(`${API_URL}/api/categories`);
            const contentType = res.headers.get('content-type');
            if (!res.ok) {
                toast.error(`Error del servidor (${res.status}): ${res.statusText}`);
                return;
            }
            if (!contentType || !contentType.includes('application/json')) {
                toast.error('La respuesta del servidor no es JSON. Puede que el backend esté caído o la ruta no exista.');
                return;
            }
            const data = await res.json();
            setCategories(data);
        } catch (err) {
            if (err instanceof SyntaxError) {
                toast.error('Error de formato: la respuesta no es JSON válido.');
            } else {
                toast.error('Error de red o inesperado: ' + err.message);
            }
        }
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            let res, data;
            if (editingId) {
                res = await fetch(`${API_URL}/api/categories/${editingId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(form)
                });
                if (!res.ok) throw new Error('Error al editar categoría');
                data = await res.json();
                toast.success('Categoría editada');
            } else {
                res = await fetch(`${API_URL}/api/categories`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(form)
                });
                if (!res.ok) throw new Error('Error al crear categoría');
                data = await res.json();
                toast.success('Categoría creada');
            }
            setForm({ name: '', description: '' });
            setEditingId(null);
            fetchCategories();
        } catch (err) {
            toast.error(err.message);
        }
    }

    async function handleDelete(id) {
        const result = await Swal.fire({
            title: '¿Eliminar esta categoría?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });
        if (!result.isConfirmed) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/categories/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error('Error al eliminar categoría');
            toast.success('Categoría eliminada');
            fetchCategories();
        } catch (err) {
            toast.error(err.message);
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
                <button
                    onClick={onClose}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors duration-200"
                    title="Cerrar"
                >
                    <FaTimes className="text-lg" />
                </button>
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
                        className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors duration-200 text-sm shadow-md"
                    >
                        {editingId ? 'Guardar cambios' : 'Crear categoría'}
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
                                        className="p-2 rounded-lg bg-yellow-100 hover:bg-yellow-200 text-yellow-700"
                                        title="Editar"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cat._id)}
                                        className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-700"
                                        title="Eliminar"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
