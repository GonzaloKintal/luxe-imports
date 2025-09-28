import { useState, useEffect } from 'react';
import { FaPlus, FaTimes, FaSpinner } from 'react-icons/fa';
import ProductImageManager from './ProductImageManager';
import RichTextEditor from '../../utils/RichTextEditor';
import getEmptyLexicalState from '../../utils/getEmptyLexicalState';
import { useAuthFetch } from '../../../hooks/useAuthFetch';

const API_URL = import.meta.env.VITE_API_URL;

export default function EditProductForm({ product, onSave, onCancel }) {
    const { authFetch } = useAuthFetch();

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
    const [isFormReady, setIsFormReady] = useState(false);

    useEffect(() => {
        if (product) {
            const newForm = {
                title: product.title || '',
                description: product.description || getEmptyLexicalState(),
                price: product.price || '',
                status: product.status !== undefined ? product.status : true,
                stock: product.stock || '',
                stockCritico: product.stockCritico || '',
                category: product.category?._id || product.category || '',
                displayOrder: product.displayOrder || 1,
            };
            setForm(newForm);
            setIsFormReady(true);

            if (product.thumbnails && Array.isArray(product.thumbnails)) {
                const existingImages = product.thumbnails.map(url => ({
                    file: null,
                    preview: url,
                    id: Math.random().toString(36).substring(2, 9),
                    isExisting: true
                }));
                setSelectedImages(existingImages);
            }
        }

        fetchCategories();
    }, [product]);

    async function fetchCategories() {
        try {
            const res = await authFetch(`${API_URL}/api/categories`);
            if (!res.ok) return;
            const data = await res.json();
            setCategories(data);
        } catch (err) {
            console.error('Error al cargar categorías:', err);
        }
    }

    function handleChange(e) {
        const { name, value } = e.target;
        let newValue = value;
        if (name === 'status') {
            newValue = value === 'true';
        } else if (['stock', 'price', 'stockCritico'].includes(name)) {
            newValue = value === '' ? '' : Math.max(0, Number(value));
        } else if (name === 'displayOrder') {
            newValue = value === '' ? '' : Math.max(1, parseInt(value));
        }
        setForm({ ...form, [name]: newValue });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setIsUploading(true);

        try {
            const formData = new FormData();

            Object.keys(form).forEach(key => {
                formData.append(key, form[key]);
            });

            const currentImages = selectedImages.filter(img => img.isExisting).map(img => img.preview);
            const newImages = selectedImages.filter(img => !img.isExisting).map(img => img.file);

            formData.append('currentImages', JSON.stringify(currentImages));
            newImages.forEach(file => formData.append('images', file));
            formData.append('imageOrder', JSON.stringify(selectedImages.map(img => ({
                isExisting: img.isExisting || false,
                preview: img.isExisting ? img.preview : null
            }))));
            formData.append('deletedImages', JSON.stringify(deletedImages));

            // Usar authFetch para guardar
            await onSave({ id: product._id, formData, authFetch });

            setDeletedImages([]);
        } catch (error) {
            console.error('Error al actualizar producto:', error);
        } finally {
            setIsUploading(false);
        }
    }

    return (
        <div className="mt-4 bg-white rounded-xl shadow-lg border border-gray-300 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FaPlus className="text-gray-600" />
                    Editar producto
                </h3>
                <button
                    onClick={onCancel}
                    className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                    <FaTimes className="text-lg" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="mb-4">
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
                    <label className="block text-gray-700 mb-1 font-semibold text-sm">Descripción</label>
                    {isFormReady ? (
                        <RichTextEditor
                            value={form.description}
                            onChange={(content) => setForm({ ...form, description: content })}
                            placeholder="Descripción detallada del producto"
                        />
                    ) : (
                        <div className="w-full h-[120px] border border-gray-300 rounded-lg bg-gray-50 animate-pulse"></div>
                    )}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            Orden de visualización
                            <span className="text-xs text-gray-500 font-normal ml-1">(número mayor = aparece después)</span>
                        </label>
                        <input
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
                        type="button"
                        onClick={onCancel}
                        className="px-5 py-2 rounded-lg font-semibold transition-colors duration-200 text-sm shadow-md bg-gray-200 hover:bg-gray-300 text-gray-700"
                    >
                        Cancelar
                    </button>
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
                                Actualizando producto...
                            </>
                        ) : 'Actualizar producto'}
                    </button>
                </div>
            </form>
        </div>
    );
}