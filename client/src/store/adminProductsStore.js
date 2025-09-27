import { create } from 'zustand';

const API_URL = import.meta.env.VITE_API_URL;
const LIMIT = 12;

const useAdminProductsStore = create((set, get) => ({
  // Estado
  products: [],
  currentPage: 0,
  totalPages: 0,
  hasMoreProducts: true,
  loading: false,
  loadingMore: false,
  error: null,
  isInitialized: false,

  // Filtros actuales (para saber si necesitamos resetear al cambiar filtros)
  currentFilters: {
    search: '',
    category: '',
    stock: 'todos',
    status: 'all',
    sort: ''
  },

  categorias: [],
  setCategorias: (categorias) => set({ categorias }),

  // Acciones
  setLoading: (loading) => set({ loading }),
  setLoadingMore: (loadingMore) => set({ loadingMore }),
  setError: (error) => set({ error }),

  // Función para construir query string de filtros para admin
  buildAdminQueryString: (filters, page = 1) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: LIMIT.toString()
    });
    
    if (filters.search?.trim()) {
      params.set('search', filters.search.trim());
    }
    if (filters.category) {
      params.set('category', filters.category);
    }
    if (filters.stock && filters.stock !== 'todos') {
      params.set('stock', filters.stock);
    }
    if (filters.status && filters.status !== 'all') {
      params.set('status', filters.status);
    }
    if (filters.sort) {
      params.set('sort', filters.sort);
    }
    
    return params.toString();
  },

  // Función para cargar productos con filtros (reemplaza fetchProductosIniciales)
  fetchProductos: async (filters = {}) => {
  //
    const { currentFilters } = get();
    
    // Verificar si los filtros cambiaron
    const filtersChanged = JSON.stringify(currentFilters) !== JSON.stringify(filters);
    
    try {
      set({ 
        loading: true, 
        error: null,
        // Si cambiaron los filtros, resetear productos
        ...(filtersChanged && { 
          products: [], 
          currentPage: 0,
          hasMoreProducts: true 
        }),
        currentFilters: filters
      });

      const token = localStorage.getItem('token');
      const queryString = get().buildAdminQueryString(filters, 1);
      const res = await authFetch(`${API_URL}/api/products?${queryString}`);
      
      if (!res.ok) throw new Error('Error al cargar productos');
      
      const data = await res.json();
      
      set({
        products: data.products,
        currentPage: 1,
        totalPages: data.totalPages,
        hasMoreProducts: 1 < data.totalPages,
        isInitialized: true,
        loading: false
      });

    } catch (err) {
      set({ 
        error: err.message || 'Error desconocido',
        loading: false 
      });
    }
  },

  // Función para cargar más productos (mantiene filtros actuales)
  cargarMasProductos: async () => {
    const { hasMoreProducts, loadingMore, currentPage, products, currentFilters } = get();
    
    if (!hasMoreProducts || loadingMore) return;

    try {
      set({ 
        loadingMore: true, 
        error: null 
      });
      
      const nextPage = currentPage + 1;
      const token = localStorage.getItem('token');
      const queryString = get().buildAdminQueryString(currentFilters, nextPage);

      const res = await authFetch(`${API_URL}/api/products?${queryString}`, {
        method: 'GET',
      });
      
      if (!res.ok) throw new Error('Error al cargar más productos');
      
      const data = await res.json();
      
      // Agregar nuevos productos a los existentes
      const nuevosProductos = data.products.filter(
        p => !products.some(existing => existing._id === p._id)
      );

      set({
        products: [...products, ...nuevosProductos],
        currentPage: nextPage,
        hasMoreProducts: nextPage < data.totalPages,
        loadingMore: false
      });

    } catch (err) {
      set({ 
        error: err.message || 'Error al cargar más productos',
        loadingMore: false 
      });
    }
  },

  // Mantener fetchProductosIniciales para compatibilidad (ahora usa filtros por defecto)
  fetchProductosIniciales: async () => {
  //
    const { isInitialized, products } = get();
    
    // Si ya tenemos productos cargados, no hacer fetch innecesario
    if (isInitialized && products.length > 0) {
      return;
    }

    const defaultFilters = {
      search: '',
      category: '',
      stock: 'todos',
      status: 'all',
      sort: 'newest'
    };

    await get().fetchProductos(defaultFilters);
  },

  // Función para actualizar un producto específico en el array
  updateProduct: (productId, updatedData) => {
    const { products } = get();
    set({
      products: products.map(p => 
        (p._id === productId || p.id === productId) 
          ? { ...p, ...updatedData } 
          : p
      )
    });
  },

  // Función para marcar/desmarcar como destacado
  toggleFeatured: async (product) => {
    try {
      const token = localStorage.getItem('token');
      const res = await authFetch(`${API_URL}/api/products/${product._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ featured: !product.featured }),
      });
      
      if (!res.ok) throw new Error('Error al actualizar destacado');
      
      const updated = await res.json();
      get().updateProduct(updated._id, updated);
      
      return {
        success: true,
        message: updated.featured ? 'Marcado como destacado' : 'Quitado de destacados'
      };
    } catch (err) {
      return {
        success: false,
        message: 'No se pudo actualizar el estado de destacado'
      };
    }
  },

  // Función para eliminar (desactivar) producto
  deleteProduct: async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await authFetch(`${API_URL}/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: false }),
      });
      
      if (!res.ok) throw new Error('Error al eliminar');
      
      get().updateProduct(productId, { status: false });
      
      return {
        success: true,
        message: 'Producto eliminado correctamente'
      };
    } catch (err) {
      return {
        success: false,
        message: 'No se pudo eliminar el producto'
      };
    }
  },

  // Función para reactivar producto
  reactivateProduct: async (productId) => {
    try {
      const token = localStorage.getItem('token');

      const res = await authFetch(`${API_URL}/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: true }),
      });
      
      if (!res.ok) throw new Error('Error al reactivar');
      
      get().updateProduct(productId, { status: true });
      
      return {
        success: true,
        message: 'Producto reactivado'
      };
    } catch (err) {
      return {
        success: false,
        message: 'No se pudo reactivar el producto'
      };
    }
  },

  // Función para editar producto
  editProduct: async (productId, formData) => {
    try {
      const token = localStorage.getItem('token');

      const res = await authFetch(`${API_URL}/api/products/${productId}`, {
        method: 'PUT',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al editar producto');
      }

      const updated = await res.json();
      get().updateProduct(productId, updated);
      
      return {
        success: true,
        message: 'Producto editado correctamente'
      };
    } catch (err) {
      return {
        success: false,
        message: err.message || 'No se pudo editar el producto'
      };
    }
  },

  // Función para resetear el store
  resetProducts: () => set({
    products: [],
    currentPage: 0,
    totalPages: 0,
    hasMoreProducts: true,
    loading: false,
    loadingMore: false,
    error: null,
    isInitialized: false,
    currentFilters: {
      search: '',
      category: '',
      stock: 'todos',
      status: 'all',
      sort: ''
    }
  }),

  // Función para refrescar productos con filtros actuales
  refreshProducts: async () => {
    const { currentFilters } = get();
    await get().fetchProductos(currentFilters);
  },

  fetchCategorias: async () => {
    try {
      const res = await authFetch(`${API_URL}/api/products/categories`);
      if (!res.ok) throw new Error('Error al cargar categorías');
      const data = await res.json();
      set({ categorias: data });
    } catch (err) {
      console.error(err);
      set({ categorias: [] });
    }
  },

}));

export default useAdminProductsStore;