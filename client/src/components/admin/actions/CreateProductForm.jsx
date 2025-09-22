

import { useState, useEffect } from 'react';
import { FaPlus, FaSpinner } from 'react-icons/fa';
import ProductImageManager from '../products/ProductImageManager';

const API_URL = import.meta.env.VITE_API_URL;

export default function CreateProductForm({ onSave }) {
    const initialForm = {
        title: '',
        description: '',
        price: '',
        status: true,
        stock: '',
        stockCritico: '',
        category: '',
        displayOrder: 1,
    };
    const [form, setForm] = useState(initialForm);
    const [categories, setCategories] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const [deletedImages, setDeletedImages] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        setForm(initialForm);
        setSelectedImages([]);
        setDeletedImages([]);
        fetchCategories();
    }, []);

    async function fetchCategories() {
        try {
            const res = await fetch(`${API_URL}/api/categories`);
            if (!res.ok) return;
            const data = await res.json();
            setCategories(data);
        } catch { }
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
        } else if (name === 'displayOrder') {
            if (value === '') {
                newValue = '';
            } else {
                const num = parseInt(value);
                newValue = num < 1 ? 1 : num;
            }
        }
        setForm({ ...form, [name]: newValue });
    }



    async function handleSubmit(e) {
        e.preventDefault();
        setIsUploading(true);

        try {
            const formData = new FormData();

            // Agregar datos del formulario
            Object.keys(form).forEach(key => {
                formData.append(key, form[key]);
            });

            // Agregar imágenes en orden
            selectedImages.forEach(imageObj => {
                formData.append('images', imageObj.file);
            });

            // Crear imageOrder para el backend
            const imageOrder = selectedImages.map(() => ({
                isExisting: false
            }));
            formData.append('imageOrder', JSON.stringify(imageOrder));

            await onSave(formData);

            // Reset form
            setForm(initialForm);
            // Limpiar previews
            selectedImages.forEach(img => URL.revokeObjectURL(img.preview));
            setSelectedImages([]);
            setDeletedImages([]);

        } catch (error) {
            console.error('Error al crear producto:', error);
        } finally {
            setIsUploading(false);
        }
    }

    return (
        <div className="mt-4 bg-white rounded-xl shadow-lg border border-gray-300 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FaPlus className="text-gray-600" />
                    Crear nuevo producto
                </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="mb-4">
                    <label htmlFor="title" className="block text-gray-700 mb-1 font-semibold text-sm">
                        Título <span className="text-red-500">*</span>
                    </label>
                    <input
                        id='title'
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                        placeholder="Nombre del producto"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-gray-700 mb-1 font-semibold text-sm">Descripción</label>
                    <textarea
                        id='description'
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
                        <label htmlFor="price" className="block text-gray-700 mb-1 font-semibold text-sm">
                            Precio (USD)<span className="text-red-500">*</span>
                        </label>
                        <input
                            id='price'
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
                        <label htmlFor="stock" className="block text-gray-700 mb-1 font-semibold text-sm">
                            Stock <span className="text-red-500">*</span>
                        </label>
                        <input
                            id='stock'
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
                        <label htmlFor="stockCritico" className="block text-gray-700 mb-1 font-semibold text-sm">
                            Stock crítico
                            <span className="text-xs text-gray-500 font-normal ml-1">(alerta de bajo stock)</span>
                        </label>
                        <input
                            id='stockCritico'
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
                        <label htmlFor='status' className="block text-gray-700 mb-1 font-semibold text-sm">Estado</label>
                        <select
                            id='status'
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="category" className="block text-gray-700 mb-1 font-semibold text-sm">Categoría</label>
                        <select
                            id='category'
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
                        <label htmlFor="displayOrder" className="block text-gray-700 mb-1 font-semibold text-sm">
                            Orden de visualización
                            <span className="text-xs text-gray-500 font-normal ml-1">(número mayor = aparece después)</span>
                        </label>
                        <input
                            id='displayOrder'
                            name="displayOrder"
                            type="number"
                            min="1"
                            value={form.displayOrder === 0 ? '' : form.displayOrder || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm"
                            placeholder="1"
                        />
                    </div>
                </div>

                {/* Componente de gestión de imágenes */}
                <ProductImageManager
                    selectedImages={selectedImages}
                    onImagesChange={setSelectedImages}
                    onDeletedImagesChange={setDeletedImages}
                />

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                        type="submit"
                        disabled={isUploading}
                        className={`px-5 py-2 rounded-lg font-semibold transition-colors duration-200 text-sm shadow-md ${isUploading
                            ? 'bg-gray-400 cursor-not-allowed text-gray-700'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                            } flex items-center justify-center gap-2`}
                    >
                        {isUploading ? (
                            <>
                                <FaSpinner className="animate-spin mr-2 text-gray-500" />
                                Creando producto...
                            </>
                        ) : 'Crear producto'}
                    </button>
                </div>
            </form>
        </div>
    );
}
