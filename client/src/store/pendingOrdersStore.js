import { create } from 'zustand';

const API_URL = import.meta.env.VITE_API_URL;
const LIMIT = 10;

const usePendingOrdersStore = create((set, get) => ({
  orders: [],
  total: 0,
  currentPage: 0,
  totalPages: 0,
  hasMoreOrders: true,
  loading: false,
  loadingMore: false,
  error: null,
  isInitialized: false,
  
  currentFilters: {
    from: '',
    to: '',
    username: ''
  },

  setLoading: (loading) => set({ loading }),
  setLoadingMore: (loadingMore) => set({ loadingMore }),
  setError: (error) => set({ error }),

  buildQueryString: (filters, page = 1) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: LIMIT.toString()
    });
    
    if (filters.from) {
      params.set('from', filters.from);
    }
    if (filters.to) {
      params.set('to', filters.to);
    }
    if (filters.username?.trim()) {
      params.set('username', filters.username.trim());
    }
    
    return params.toString();
  },

  fetchOrders: async (filters = {}, authFetchFn) => {
    const { currentFilters } = get();
    
    const filtersChanged = JSON.stringify(currentFilters) !== JSON.stringify(filters);
    
    try {
      set({ 
        loading: true, 
        error: null,
        ...(filtersChanged && { 
          orders: [], 
          currentPage: 0,
          hasMoreOrders: true 
        }),
        currentFilters: filters
      });

      const queryString = get().buildQueryString(filters, 1);
      const res = await authFetchFn(`${API_URL}/api/carts/pendientes?${queryString}`);
      
      // Si res es null (token expirado), no continúes
      if (!res) return;
      
      if (!res.ok) throw new Error('Error al cargar pedidos pendientes');
      
      const data = await res.json();
      
      set({
        orders: data.results || [],
        total: data.total || 0,
        currentPage: 1,
        totalPages: data.total ? Math.ceil(data.total / data.limit) : 0,
        hasMoreOrders: 1 < Math.ceil(data.total / data.limit),
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

  // También modifica cargarMasPedidos
  cargarMasPedidos: async (authFetchFn) => {
    const { hasMoreOrders, loadingMore, currentPage, orders, currentFilters } = get();
    
    if (!hasMoreOrders || loadingMore) return;

    try {
      set({ 
        loadingMore: true, 
        error: null 
      });
      
      const nextPage = currentPage + 1;
      const queryString = get().buildQueryString(currentFilters, nextPage);
      
      const res = await authFetchFn(`${API_URL}/api/carts/pendientes?${queryString}`);
      
      // Si res es null (token expirado), no continúes
      if (!res) return;
      
      if (!res.ok) throw new Error('Error al cargar más pedidos');
      
      const data = await res.json();
      
      const nuevosPedidos = data.results.filter(
        order => !orders.some(existing => existing._id === order._id)
      );

      set({
        orders: [...orders, ...nuevosPedidos],
        currentPage: nextPage,
        hasMoreOrders: nextPage < Math.ceil(data.total / data.limit),
        loadingMore: false
      });

    } catch (err) {
      set({ 
        error: err.message || 'Error al cargar más pedidos',
        loadingMore: false 
      });
    }
  },

  // Y modifica las funciones que llaman a estas
  applyDateFilters: async (fromDate, toDate, authFetchFn) => {
    const filters = {
      from: fromDate || '',
      to: toDate || ''
    };
    await get().fetchOrders(filters, authFetchFn);
  },

  clearFilters: async (authFetchFn) => {
    const defaultFilters = {
      from: '',
      to: '',
      username: ''
    };
    await get().fetchOrders(defaultFilters, authFetchFn);
  },

  refreshOrders: async (authFetchFn) => {
    const { currentFilters } = get();
    await get().fetchOrders(currentFilters, authFetchFn);
  },


  removeOrder: (orderId) => {
    const { orders, total } = get();
    const newOrders = orders.filter(order => order._id !== orderId);
    set({
      orders: newOrders,
  total: Math.max(0, total - 1)
    });
  },

  resetOrders: () => set({
    orders: [],
    total: 0,
    currentPage: 0,
    totalPages: 0,
    hasMoreOrders: true,
    loading: false,
    loadingMore: false,
    error: null,
    isInitialized: false,
    currentFilters: {
      from: '',
      to: '',
      username: ''
    }
  }),

  refreshOrders: async () => {
    const { currentFilters } = get();
    await get().fetchOrders(currentFilters);
  }
}));

export default usePendingOrdersStore;