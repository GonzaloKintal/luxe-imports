import { create } from 'zustand';
import { authFetch } from '../components/utils/useFetch';

const API_URL = import.meta.env.VITE_API_URL;
const LIMIT = 12;

const useAdminProductsStore = create((set, get) => ({
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
  },

  categorias: [],
  setCategorias: (categorias) => set({ categorias }),

  setLoading: (loading) => set({ loading }),
  setLoadingMore: (loadingMore) => set({ loadingMore }),
  setError: (error) => set({ error }),

  buildQueryString: (filters, page = 1) => {
    const params = new URLSearchParams({ page: page.toString(), limit: LIMIT.toString() });
    if (filters.search?.trim()) params.set('search', filters.search.trim());
    if (filters.category) params.set('category', filters.category);
    if (filters.stock && filters.stock !== 'todos') params.set('stock', filters.stock);
    if (filters.status && filters.status !== 'all') params.set('status', filters.status);
    if (filters.sort) params.set('sort', filters.sort);
    return params.toString();
  },

  fetchProductos: async (filters = {}) => {
    const { currentFilters } = get();
    const filtersChanged = JSON.stringify(currentFilters) !== JSON.stringify(filters);

    try {
      set({
        loading: true,
        error: null,
        ...(filtersChanged && { products: [], currentPage: 0, hasMoreProducts: true }),
        currentFilters: filters
      });

      const queryString = get().buildQueryString(filters, 1);
      const res = await authFetch(`${API_URL}/api/products?${queryString}`);
      if (!res.ok) throw new Error('Error al cargar productos');
      const data = await res.json();

      set({
        products: data.products || [],
        currentPage: 1,
        totalPages: data.totalPages || Math.ceil((data.total || data.products.length) / LIMIT),
        hasMoreProducts: 1 < (data.totalPages || Math.ceil((data.total || data.products.length) / LIMIT)),
        isInitialized: true,
        loading: false
      });

    } catch (err) {
      set({ error: err.message || 'Error desconocido', loading: false });
    }
  },

  cargarMasProductos: async () => {
    const { hasMoreProducts, loadingMore, currentPage, products, currentFilters } = get();
    if (!hasMoreProducts || loadingMore) return;

    try {
      set({ loadingMore: true, error: null });

      const nextPage = currentPage + 1;
      const queryString = get().buildQueryString(currentFilters, nextPage);
      const res = await authFetch(`${API_URL}/api/products?${queryString}`);
      if (!res.ok) throw new Error('Error al cargar más productos');

      const data = await res.json();
      const nuevosProductos = data.products.filter(p => !products.some(existing => existing._id === p._id));

      set({
        products: [...products, ...nuevosProductos],
        currentPage: nextPage,
        hasMoreProducts: nextPage < (data.totalPages || Math.ceil((data.total || products.length) / LIMIT)),
        loadingMore: false
      });

    } catch (err) {
      set({ error: err.message || 'Error desconocido', loadingMore: false });
    }
  },

  fetchProductosIniciales: async () => {
    const { isInitialized, products } = get();
    if (isInitialized && products.length > 0) return;

    const defaultFilters = { search: '', category: '', stock: 'todos', status: 'all', sort: 'newest' };
    await get().fetchProductos(defaultFilters);
  },

  refreshProducts: async () => {
    const { currentFilters } = get();
    await get().fetchProductos(currentFilters);
  },

  resetProducts: () => set({
    products: [],
    currentPage: 0,
    totalPages: 0,
    hasMoreProducts: true,
    loading: false,
    loadingMore: false,
    error: null,
    isInitialized: false,
    currentFilters: { search: '', category: '', stock: 'todos', status: 'all', sort: '' }
  }),

  updateProduct: (productId, updatedData) => {
    const { products } = get();
    set({ products: products.map(p => (p._id === productId ? { ...p, ...updatedData } : p)) });
  },

  toggleFeatured: async (product) => {
    try {
      const res = await authFetch(`${API_URL}/api/products/${product._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !product.featured })
      });
      if (!res.ok) throw new Error('Error al actualizar destacado');
      const updated = await res.json();
      get().updateProduct(updated._id, updated);
      return { success: true, message: updated.featured ? 'Marcado como destacado' : 'Quitado de destacados' };
    } catch {
      return { success: false, message: 'No se pudo actualizar el estado de destacado' };
    }
  },

  deleteProduct: async (productId) => {
    try {
      const res = await authFetch(`${API_URL}/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: false })
      });
      if (!res.ok) throw new Error('Error al eliminar');
      get().updateProduct(productId, { status: false });
      return { success: true, message: 'Producto eliminado correctamente' };
    } catch {
      return { success: false, message: 'No se pudo eliminar el producto' };
    }
  },

  reactivateProduct: async (productId) => {
    try {
      const res = await authFetch(`${API_URL}/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: true })
      });
      if (!res.ok) throw new Error('Error al reactivar');
      get().updateProduct(productId, { status: true });
      return { success: true, message: 'Producto reactivado' };
    } catch {
      return { success: false, message: 'No se pudo reactivar el producto' };
    }
  },

  editProduct: async (productId, formData) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/products/${productId}`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` }, body: formData });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al editar producto');
      }
      const updated = await res.json();
      get().updateProduct(productId, updated);
      return { success: true, message: 'Producto editado correctamente' };
    } catch (err) {
      return { success: false, message: err.message || 'No se pudo editar el producto' };
    }
  },

  fetchCategorias: async () => {
    try {
      const res = await authFetch(`${API_URL}/api/products/categories`);
      if (!res.ok) throw new Error('Error al cargar categorías');
      const data = await res.json();
      set({ categorias: data });
    } catch {
      set({ categorias: [] });
    }
  }
}));

export default useAdminProductsStore;
