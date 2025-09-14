

import { useState, useEffect } from 'react';
const API_URL = import.meta.env.VITE_API_URL;
import { FaPlus, FaTimes } from 'react-icons/fa';

export default function CreateProductForm({ onSave, onCancel }) {
    const initialForm = {
        title: '',
        description: '',
        code: '',
        price: '',
        status: true,
        stock: '',
        stockCritico: '',
        category: '',
        thumbnails: []
    };
    const [form, setForm] = useState(initialForm);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        setForm(initialForm);
        fetchCategories();
    }, []);

    async function fetchCategories() {
        try {
            const res = await fetch(`${API_URL}/api/categories`);
            if (!res.ok) return;
            const data = await res.json();
            setCategories(data);
        } catch {}
    }

    function handleChange(e) {
        const { name, value } = e.target;
        let newValue = value;
        if (name === 'status') {
            newValue = value === 'true';
        } else if (name === 'stock' || name === 'price' || name === 'stockCritico') {
            if (value === '') {
                newValue = '';
            } else {
                const num = Number(value);
                newValue = num < 0 ? 0 : num;
            }
        }
        setForm({ ...form, [name]: newValue });
    }

    function handleThumbnails(e) {
        setForm({ ...form, thumbnails: e.target.value.split(',').map(t => t.trim()).filter(Boolean) });
    }

    function handleSubmit(e) {
        e.preventDefault();
        onSave(form);
        setForm(initialForm);
    }

    return (
        <div className="mt-4 bg-white rounded-xl shadow-lg border border-gray-300 p-6">
            <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FaPlus className="text-gray-600" />
                Crear nuevo producto
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                <label className="block text-gray-700 mb-1 font-semibold text-sm">
                    Título <span className="text-red-500">*</span>
                </label>
                <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                    placeholder="Nombre del producto"
                />
                </div>

                <div>
                <label className="block text-gray-700 mb-1 font-semibold text-sm">
                    Código <span className="text-red-500">*</span>
                </label>
                <input
                    name="code"
                    value={form.code}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                    placeholder="Código único del producto"
                />
                </div>
            </div>

            <div>
                <label className="block text-gray-700 mb-1 font-semibold text-sm">Descripción</label>
                <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm resize-vertical"
                placeholder="Descripción detallada del producto"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                <label className="block text-gray-700 mb-1 font-semibold text-sm">
                    Precio (USD)<span className="text-red-500">*</span>
                </label>
                <input
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price === 0 ? 0 : form.price || ''}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                    placeholder="0.00"
                />
                </div>

                <div>
                    <label className="block text-gray-700 mb-1 font-semibold text-sm">
                        Stock <span className="text-red-500">*</span>
                    </label>
                    <input
                        name="stock"
                        type="number"
                        min="0"
                        value={form.stock === 0 ? 0 : form.stock || ''}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                        placeholder="0"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-1 font-semibold text-sm">
                        Stock crítico
                        <span className="text-xs text-gray-500 font-normal ml-1">(alerta de bajo stock)</span>
                    </label>
                    <input
                        name="stockCritico"
                        type="number"
                        min="0"
                        value={form.stockCritico === 0 ? 0 : form.stockCritico || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 text-sm"
                        placeholder="Ej: 5"
                    />
                </div>

                <div>
                <label className="block text-gray-700 mb-1 font-semibold text-sm">Estado</label>
                <select
                    name="status"
                    value={form.status ? 'true' : 'false'}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                >
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                </select>
                </div>
            </div>

            <div>
                <label className="block text-gray-700 mb-1 font-semibold text-sm">Categoría</label>
                <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                    required
                >
                    <option value="">Selecciona una categoría</option>
                    {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-gray-700 mb-1 font-semibold text-sm">
                Imágenes (URLs)
                <span className="text-xs text-gray-500 font-normal ml-1">
                    Separar múltiples URLs con comas
                </span>
                </label>
                <input
                name="thumbnails"
                value={form.thumbnails.join(',')}
                onChange={handleThumbnails}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                placeholder="https://ejemplo.com/imagen1.jpg, https://ejemplo.com/imagen2.jpg"
                />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                type="button"
                onClick={() => {
                    setForm(initialForm);
                    onCancel();
                }}
                className="px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold border border-gray-300 transition-colors duration-200 text-sm"
                >
                Cancelar
                </button>
                <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors duration-200 text-sm shadow-md"
                >
                Crear producto
                </button>
            </div>
            </form>
        </div>
        );


}