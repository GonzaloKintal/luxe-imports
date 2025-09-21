import { useState } from 'react';
import { FaImage, FaTrash, FaGripVertical, FaCrown } from 'react-icons/fa';
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

export default function ProductImageManager({ 
  selectedImages, 
  onImagesChange, 
  onDeletedImagesChange 
}) {
    
  const [deletedImages, setDeletedImages] = useState([]);
  
  // Configuración de sensores para dnd-kit
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

    const updatedImages = [...selectedImages, ...newImages];
    onImagesChange(updatedImages);
  }

  // Manejar el reordenamiento de imágenes
  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      const newImages = [...selectedImages];
      const oldIndex = newImages.findIndex(item => item.id === active.id);
      const newIndex = newImages.findIndex(item => item.id === over.id);
      
      const reorderedImages = arrayMove(newImages, oldIndex, newIndex);
      onImagesChange(reorderedImages);
    }
  }

  function removeImage(imageId) {
    const imageToRemove = selectedImages.find(img => img.id === imageId);
    const updatedImages = selectedImages.filter(img => img.id !== imageId);
    
    if (imageToRemove) {
      // Si es una imagen existente, guardar su URL para eliminar en backend
      if (imageToRemove.isExisting) {
        const newDeletedImages = [...deletedImages, imageToRemove.preview];
        setDeletedImages(newDeletedImages);
        onDeletedImagesChange(newDeletedImages);
      } else {
        // Limpiar URL del objeto que se elimina para evitar memory leaks
        URL.revokeObjectURL(imageToRemove.preview);
      }
    }
    
    onImagesChange(updatedImages);
  }

  return (
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
  );

}