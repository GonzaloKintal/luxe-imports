
import { useState, useEffect } from 'react';
import { FaPlus, FaTimes, FaImage, FaTrash, FaCheck, FaSpinner } from 'react-icons/fa';
const API_URL = import.meta.env.VITE_API_URL;

export default function EditProductForm({ product, onSave, onCancel }) {
    const initialForm = {
        title: '',
        description: '',
        code: '',
        price: '',
        status: true,
        stock: '',
        stockCritico: '',
        category: '',
    };

    const [form, setForm] = useState(initialForm);
    const [categories, setCategories] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (product) {
            setForm({
                title: product.title || '',
                description: product.description || '',
                code: product.code || '',
                price: product.price || '',
                status: product.status !== undefined ? product.status : true,
                stock: product.stock || '',
                stockCritico: product.stockCritico || '',
                category: product.category?._id || product.category || '',
            });

            // Si hay imágenes existentes, convertirlas al formato de selectedImages
            if (product.thumbnails && Array.isArray(product.thumbnails)) {
                const existingImages = product.thumbnails.map(url => ({
                    file: null, // No tenemos el archivo original
                    preview: url,
                    id: Math.random().toString(36).substring(2, 9),
                    isExisting: true // Marcar como imagen existente
                }));
                setSelectedImages(existingImages);
            }
        }

        fetchCategories();
    }, [product]);

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
        }
        setForm({ ...form, [name]: newValue });
    }

    function handleImageSelect(e) {
        const files = Array.from(e.target.files);

        // Validar que no excedan 5 imágenes
        if (selectedImages.length + files.length > 5) {
            alert('Máximo 5 imágenes permitidas');
            return;
        }

        // Validar tamaño de archivos (5MB máximo cada uno)
        const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
        if (oversizedFiles.length > 0) {
            alert('Algunas imágenes exceden los 5MB permitidos');
            return;
        }

        // Crear preview de las imágenes
        const newImages = files.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            id: Math.random().toString(36).substring(2, 9)
        }));

        setSelectedImages(prev => [...prev, ...newImages]);
    }

    // Guardar imágenes eliminadas para informar al backend
    const [deletedImages, setDeletedImages] = useState([]);

    function removeImage(imageId) {
        setSelectedImages(prev => {
            const updated = prev.filter(img => img.id !== imageId);
            const imageToRemove = prev.find(img => img.id === imageId);
            if (imageToRemove) {
                // Si es una imagen existente, guardar su URL para eliminar en backend
                if (imageToRemove.isExisting) {
                    setDeletedImages(d => [...d, imageToRemove.preview]);
                } else {
                    // Limpiar URL del objeto que se elimina para evitar memory leaks
                    URL.revokeObjectURL(imageToRemove.preview);
                }
            }
            return updated;
        });
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


            // Separar imágenes existentes de las nuevas
            const currentImages = selectedImages
                .filter(img => img.isExisting)
                .map(img => img.preview);

            const newImages = selectedImages
                .filter(img => !img.isExisting)
                .map(img => img.file);

            // Agregar imágenes existentes (con el nombre esperado por el backend)
            formData.append('currentImages', JSON.stringify(currentImages));

            // Agregar nuevas imágenes
            newImages.forEach(imageFile => {
                formData.append('images', imageFile);
            });

            // Si hay imágenes eliminadas, informar al backend{
            formData.append('deletedImages', JSON.stringify(deletedImages));

            await onSave({ id: product._id, formData });

            // Limpiar deletedImages después de guardar
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

                {/* Sección de imágenes */}
                <div>
                    <label className="block text-gray-700 mb-2 font-semibold text-sm">
                        Imágenes del producto
                        <span className="text-xs text-gray-500 font-normal ml-1">
                            (Máximo 5 imágenes, 5MB c/u)
                        </span>
                    </label>

                    {/* Input de archivos */}
                    <div className="mb-4">
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                            id="image-upload"
                        />
                        <label
                            htmlFor="image-upload"
                            className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 transition-colors duration-200 text-sm"
                        >
                            <FaImage className="text-gray-600" />

                            {/* Texto en mobile */}
                            <span className="sm:hidden">Seleccionar</span>

                            {/* Texto en sm y más grande */}
                            <span className="hidden sm:inline">Seleccionar imágenes</span>
                        </label>

                    </div>

                    {/* Preview de imágenes */}
                    {selectedImages.length > 0 && (
                        <div className="flex flex-wrap gap-4">
                            {selectedImages.map((imageObj) => (
                                <div key={imageObj.id} className="relative">
                                    <img
                                        src={imageObj.preview}
                                        alt="Preview"
                                        className="w-30 h-30 object-cover rounded-lg border border-gray-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(imageObj.id)}
                                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 text-xs transition-colors duration-200"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

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