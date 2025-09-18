// import { create } from 'zustand';

// const API_URL = import.meta.env.VITE_API_URL;
// const LIMIT = 12;

// const useProductsStore = create((set, get) => ({
//   // Estado
//   productos: [],
//   currentPage: 0,
//   totalPages: 0,
//   hasMoreProducts: true,
//   loading: false,
//   loadingMore: false,
//   error: null,
//   isInitialized: false,
  
//   // Filtros actuales (para saber si necesitamos resetear al cambiar filtros)
//   currentFilters: {
//     search: '',
//     category: '',
//     stock: 'all',
//     sort: ''
//   },

//   // Categorías
//   categorias: [],
//   setCategorias: (categorias) => set({ categorias }),


//   // Acciones
//   setLoading: (loading) => set({ loading }),
//   setLoadingMore: (loadingMore) => set({ loadingMore }),
//   setError: (error) => set({ error }),

//   // Función para construir query string de filtros
//   buildQueryString: (filters, page = 1) => {
//     const params = new URLSearchParams({
//       page: page.toString(),
//       limit: LIMIT.toString()
//     });
    
//     if (filters.search?.trim()) {
//       params.set('search', filters.search.trim());
//     }
//     if (filters.category) {
//       params.set('category', filters.category);
//     }
//     if (filters.stock && filters.stock !== 'all') {
//       params.set('stock', filters.stock);
//     }
//     if (filters.sort) {
//       params.set('sort', filters.sort === 'asc' ? 'price_asc' : filters.sort === 'desc' ? 'price_desc' : filters.sort);
//     }
    
//     return params.toString();
//   },

//   // Función para cargar productos con filtros
//   fetchProductos: async (filters = {}) => {
//     console.log('fetchProductos llamado con filtros:', filters);
//     const { currentFilters } = get();
    
//     // Verificar si los filtros cambiaron
//     const filtersChanged = JSON.stringify(currentFilters) !== JSON.stringify(filters);
    
//     try {
//       set({ 
//         loading: true, 
//         error: null,
//         // Si cambiaron los filtros, resetear productos
//         ...(filtersChanged && { 
//           productos: [], 
//           currentPage: 0,
//           hasMoreProducts: true 
//         }),
//         currentFilters: filters
//       });

//       const queryString = get().buildQueryString(filters, 1);
//       const res = await fetch(`${API_URL}/api/products/active?${queryString}`);
      
//       if (!res.ok) throw new Error('Error al cargar productos');
      
//       const data = await res.json();
      
//       set({
//         productos: data.products,
//         currentPage: 1,
//         totalPages: data.totalPages,
//         hasMoreProducts: 1 < data.totalPages,
//         isInitialized: true,
//         loading: false
//       });

//     } catch (err) {
//       set({ 
//         error: err.message || 'Error desconocido',
//         loading: false 
//       });
//     }
//   },

//   // Función para cargar más productos (mantiene filtros actuales)
//   cargarMasProductos: async () => {
//     const { hasMoreProducts, loadingMore, currentPage, productos, currentFilters } = get();
    
//     if (!hasMoreProducts || loadingMore) return;

//     try {
//       set({ 
//         loadingMore: true, 
//         error: null 
//       });
      
//       const nextPage = currentPage + 1;
//       const queryString = get().buildQueryString(currentFilters, nextPage);
      
//       const res = await fetch(`${API_URL}/api/products/active?${queryString}`);
//       if (!res.ok) throw new Error('Error al cargar más productos');
      
//       const data = await res.json();
      
//       // Agregar nuevos productos a los existentes
//       const nuevosProductos = data.products.filter(
//         p => !productos.some(existing => existing._id === p._id)
//       );

//       set({
//         productos: [...productos, ...nuevosProductos],
//         currentPage: nextPage,
//         hasMoreProducts: nextPage < data.totalPages,
//         loadingMore: false
//       });

//     } catch (err) {
//       set({ 
//         error: err.message || 'Error al cargar más productos',
//         loadingMore: false 
//       });
//     }
//   },

//   fetchProductosIniciales: async () => {
//       const { isInitialized } = get();
//       if (isInitialized) return;
//       await get().fetchProductos();
//   },


//   // Función para resetear el store
//   resetProducts: () => set({
//     productos: [],
//     currentPage: 0,
//     totalPages: 0,
//     hasMoreProducts: true,
//     loading: false,
//     loadingMore: false,
//     error: null,
//     isInitialized: false,
//     currentFilters: {
//       search: '',
//       category: '',
//       stock: 'all',
//       sort: ''
//     }
//   }),

//   // Función para refrescar productos con filtros actuales
// refreshProducts: async () => {
//   const { currentFilters } = get();
//   await get().fetchProductos(currentFilters);
// },

// fetchCategorias: async () => {
//   try {
//     const res = await fetch(`${API_URL}/api/products/categories`);
//     if (!res.ok) throw new Error('Error al cargar categorías');
//     const data = await res.json();
//     set({ categorias: data });
//   } catch (err) {
//     console.error(err);
//     set({ categorias: [] });
//   }
// }



  
// }));

// export default useProductsStore;


import { create } from 'zustand';

const API_URL = import.meta.env.VITE_API_URL;
const LIMIT = 12;

const useProductsStore = create((set, get) => ({
  // Estado
  productos: [],
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
    stock: 'all',
    sort: ''
  },

  // Categorías
  categorias: [],
  setCategorias: (categorias) => set({ categorias }),

  // Acciones
  setLoading: (loading) => set({ loading }),
  setLoadingMore: (loadingMore) => set({ loadingMore }),
  setError: (error) => set({ error }),

  // Función para construir query string de filtros
  buildQueryString: (filters, page = 1) => {
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
    if (filters.stock && filters.stock !== 'all') {
      params.set('stock', filters.stock);
    }
    if (filters.sort) {
      params.set('sort', filters.sort === 'asc' ? 'price_asc' : filters.sort === 'desc' ? 'price_desc' : filters.sort);
    }
    
    return params.toString();
  },

  // Función para cargar productos con filtros
  fetchProductos: async (filters = {}) => {
    console.log('fetchProductos llamado con filtros:', filters);
    const { currentFilters } = get();
    
    // Verificar si los filtros cambiaron
    const filtersChanged = JSON.stringify(currentFilters) !== JSON.stringify(filters);
    
    try {
      set({ 
        loading: true, 
        error: null,
        // Si cambiaron los filtros, resetear productos
        ...(filtersChanged && { 
          productos: [], 
          currentPage: 0,
          hasMoreProducts: true 
        }),
        currentFilters: filters
      });

      const queryString = get().buildQueryString(filters, 1);
      const res = await fetch(`${API_URL}/api/products/active?${queryString}`);
      
      if (!res.ok) throw new Error('Error al cargar productos');
      
      const data = await res.json();
      
      set({
        productos: data.products,
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
    const { hasMoreProducts, loadingMore, currentPage, productos, currentFilters } = get();
    
    if (!hasMoreProducts || loadingMore) return;

    try {
      set({ 
        loadingMore: true, 
        error: null 
      });
      
      const nextPage = currentPage + 1;
      const queryString = get().buildQueryString(currentFilters, nextPage);
      
      const res = await fetch(`${API_URL}/api/products/active?${queryString}`);
      if (!res.ok) throw new Error('Error al cargar más productos');
      
      const data = await res.json();
      
      // Agregar nuevos productos a los existentes
      const nuevosProductos = data.products.filter(
        p => !productos.some(existing => existing._id === p._id)
      );

      set({
        productos: [...productos, ...nuevosProductos],
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
    console.log('fetchProductosIniciales llamado');
    const { isInitialized, productos } = get();
    
    // Si ya tenemos productos cargados, no hacer fetch innecesario
    if (isInitialized && productos.length > 0) {
      return;
    }

    const defaultFilters = {
      search: '',
      category: '',
      stock: 'all',
      sort: ''
    };

    await get().fetchProductos(defaultFilters);
  },

  // Función para resetear el store
  resetProducts: () => set({
    productos: [],
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
      stock: 'all',
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
      const res = await fetch(`${API_URL}/api/products/categories`);
      if (!res.ok) throw new Error('Error al cargar categorías');
      const data = await res.json();
      set({ categorias: data });
    } catch (err) {
      console.error(err);
      set({ categorias: [] });
    }
  }
}));

export default useProductsStore;