

import { useState, useEffect } from 'react';
import { FaPlus, FaTimes, FaImage, FaTrash, FaCheck, FaSpinner, FaGripVertical, FaCrown } from 'react-icons/fa';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const API_URL = import.meta.env.VITE_API_URL;

// Componente para cada imagen sorteable
function SortableImageItem({ imageObj, onRemove, isPortada }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: imageObj.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${isDragging ? 'opacity-50' : ''}`}
    >
      {/* Indicador de portada */}
      {isPortada && (
        <div className="absolute -top-2 -left-2 z-10 bg-yellow-500 text-white rounded-full p-1 text-xs shadow-lg">
          <FaCrown />
        </div>
      )}
      
      {/* Imagen */}
      <div className="relative">
        <img
          src={imageObj.preview}
          alt="Preview"
          className={`w-32 h-32 object-cover rounded-lg border-2 ${
            isPortada ? 'border-yellow-400' : 'border-gray-300'
          } transition-all duration-200 group-hover:shadow-md`}
        />
        
        {/* Handle para arrastrar */}
        <div
          {...attributes}
          {...listeners}
          className="absolute top-1 left-1 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded p-1 cursor-grab active:cursor-grabbing transition-all duration-200 opacity-0 group-hover:opacity-100"
        >
          <FaGripVertical className="text-xs" />
        </div>
        
        {/* Botón eliminar */}
        <button
          type="button"
          onClick={() => onRemove(imageObj.id)}
          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 text-xs transition-colors duration-200 shadow-lg"
        >
          <FaTrash />
        </button>
      </div>
      
      {/* Etiqueta de portada */}
      {isPortada && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
          Portada
        </div>
      )}
    </div>
  );
}

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
        displayOrder: 1,
    };

    const [form, setForm] = useState(initialForm);
    const [categories, setCategories] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    // Configuración de sensores para dnd-kit
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

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
                displayOrder: product.displayOrder || 1,
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

    // Manejar el reordenamiento de imágenes
    function handleDragEnd(event) {
        const { active, over } = event;

        if (active.id !== over.id) {
            setSelectedImages((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }
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

            // Separar imágenes existentes de las nuevas, manteniendo el orden
            const currentImages = selectedImages
                .filter(img => img.isExisting)
                .map(img => img.preview);

            const newImages = selectedImages
                .filter(img => !img.isExisting)
                .map(img => img.file);

            // Crear un array ordenado que preserve el orden final
            // Este array contendrá las URLs de las imágenes existentes en el orden correcto
            const orderedCurrentImages = [];
            const newImageFiles = [];

            selectedImages.forEach(img => {
                if (img.isExisting) {
                    orderedCurrentImages.push(img.preview);
                } else {
                    // Para las nuevas imágenes, necesitamos mantener su posición relativa
                    // Las agregaremos al final del array de archivos
                    newImageFiles.push(img.file);
                }
            });

            // Agregar imágenes existentes en orden (con el nombre esperado por el backend)
            formData.append('currentImages', JSON.stringify(orderedCurrentImages));

            // Agregar nuevas imágenes en orden
            newImageFiles.forEach(imageFile => {
                formData.append('images', imageFile);
            });

            // Crear un mapa de orden para que el backend sepa cómo intercalar las imágenes
            const imageOrder = selectedImages.map(img => ({
                isExisting: img.isExisting || false,
                preview: img.isExisting ? img.preview : null
            }));
            
            formData.append('imageOrder', JSON.stringify(imageOrder));

            // Si hay imágenes eliminadas, informar al backend
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

                {/* Sección de imágenes */}
                <div>
                    <label className="block text-gray-700 mb-2 font-semibold text-sm">
                        Imágenes del producto
                        <span className="text-xs text-gray-500 font-normal ml-1">
                            (Máximo 5 imágenes, 5MB c/u)
                        </span>
                    </label>

                    {/* Información sobre la portada */}
                    {selectedImages.length > 0 && (
                        <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-700 flex items-center gap-2">
                                <FaCrown className="text-yellow-600" />
                                <strong>Tip:</strong> La primera imagen será la portada del producto. Arrastra las imágenes para reordenarlas.
                            </p>
                        </div>
                    )}

                    {/* Input de archivos */}
                    <div className="mb-4">
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                            id="image-upload"
                            disabled={selectedImages.length >= 5}
                        />
                        <label
                            htmlFor="image-upload"
                            className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors duration-200 text-sm ${
                                selectedImages.length >= 5 
                                    ? 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-gray-100 hover:bg-gray-200 border-gray-300'
                            }`}
                        >
                            <FaImage className="text-gray-600" />
                            <span className="sm:hidden">
                                {selectedImages.length >= 5 ? 'Máximo alcanzado' : 'Seleccionar'}
                            </span>
                            <span className="hidden sm:inline">
                                {selectedImages.length >= 5 ? 'Máximo de imágenes alcanzado' : 'Seleccionar imágenes'}
                            </span>
                        </label>
                        
                        {selectedImages.length > 0 && (
                            <span className="ml-3 text-sm text-gray-500">
                                {selectedImages.length}/5 imágenes
                            </span>
                        )}
                    </div>

                    {/* Preview de imágenes con drag and drop */}
                    {selectedImages.length > 0 && (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={selectedImages.map(img => img.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="flex flex-wrap gap-4">
                                    {selectedImages.map((imageObj, index) => (
                                        <SortableImageItem
                                            key={imageObj.id}
                                            imageObj={imageObj}
                                            onRemove={removeImage}
                                            isPortada={index === 0}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
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