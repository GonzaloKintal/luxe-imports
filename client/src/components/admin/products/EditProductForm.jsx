import React, { useState, useEffect } from 'react';
import { FaTimes, FaCheck } from 'react-icons/fa';

export default function EditProductForm({ product, onSave, onCancel }) {

    const [form, setForm] = useState(product || {});
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        setForm(product || {});
        setHasChanges(false);
    }, [product]);

    useEffect(() => {
        if (!product) return;
        const keys = ['title','description','code','price','status','stock','category','thumbnails'];
        const changed = keys.some(k => {
            if (k === 'thumbnails') {
                return Array.isArray(form[k]) ? form[k].join(',') !== (Array.isArray(product[k]) ? product[k].join(',') : '') : form[k] !== product[k];
            }
            return form[k] !== product[k];
        });
        setHasChanges(changed);
    }, [form, product]);

    function handleChange(e) {
        const { name, value } = e.target;
        let newValue = value;
        
        if (name === 'status') {
            newValue = value === 'true';
        } else if (name === 'stock' || name === 'price') {
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
        if (!hasChanges) return;
        
        // Eliminar id/_id del objeto antes de guardar
        const { _id, id, ...body } = form;
        const productId = product?._id || product?.id || _id || id;
        
        if (!productId) return;
        
        onSave({ id: productId, body });
    }

    return (
        <div className="space-y-4 mt-4">
            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <label className="block text-gray-700 mb-1 font-semibold text-xs">
                            Título <span className="text-red-500">*</span>
                        </label>
                        <input
                            name="title"
                            value={form.title || ''}
                            onChange={handleChange}
                            required
                            className="w-full px-2 py-1 text-sm rounded-md border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1 font-semibold text-xs">
                            Código <span className="text-red-500">*</span>
                        </label>
                        <input
                            name="code"
                            value={form.code || ''}
                            onChange={handleChange}
                            required
                            className="w-full px-2 py-1 text-sm rounded-md border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-gray-700 mb-1 font-semibold text-xs">Descripción</label>
                    <textarea
                        name="description"
                        value={form.description || ''}
                        onChange={handleChange}
                        rows={2}
                        className="w-full px-2 py-1 text-sm rounded-md border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-vertical"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                        <label className="block text-gray-700 mb-1 font-semibold text-xs">
                            Precio <span className="text-red-500">*</span>
                        </label>
                        <input
                            name="price"
                            type="number"
                            step="0.01"
                            min="0"
                            value={form.price === 0 ? 0 : form.price || ''}
                            onChange={handleChange}
                            required
                            className="w-full px-2 py-1 text-sm rounded-md border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1 font-semibold text-xs">
                            Stock <span className="text-red-500">*</span>
                        </label>
                        <input
                            name="stock"
                            type="number"
                            min="0"
                            value={form.stock === 0 ? 0 : form.stock || ''}
                            onChange={handleChange}
                            required
                            className="w-full px-2 py-1 text-sm rounded-md border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1 font-semibold text-xs">Estado</label>
                        <select
                            name="status"
                            value={form.status ? 'true' : 'false'}
                            onChange={handleChange}
                            className="w-full px-2 py-1 text-sm rounded-md border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                            <option value="true">Activo</option>
                            <option value="false">Inactivo</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-gray-700 mb-1 font-semibold text-xs">Categoría</label>
                    <input
                        name="category"
                        value={form.category || ''}
                        onChange={handleChange}
                        className="w-full px-2 py-1 text-sm rounded-md border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 mb-1 font-semibold text-xs">
                        Imágenes
                        <span className="text-xs text-gray-500 font-normal ml-1">
                            (separar URLs con comas)
                        </span>
                    </label>
                    <input
                        name="thumbnails"
                        value={Array.isArray(form.thumbnails) ? form.thumbnails.join(',') : form.thumbnails || ''}
                        onChange={handleThumbnails}
                        className="w-full px-2 py-1 text-sm rounded-md border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-3 py-1 text-xs rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold border border-gray-300 transition-colors duration-200"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={!hasChanges}
                        className={`px-3 py-1 text-xs rounded-md bg-blue-600 text-white font-semibold transition-colors duration-200 flex items-center gap-1 ${!hasChanges ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                    >
                        <FaCheck className="text-xs" />
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    );

}