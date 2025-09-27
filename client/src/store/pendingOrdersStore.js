import { create } from 'zustand';
import { authFetch } from '../components/utils/useFetch';

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
    to: ''
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
    
    return params.toString();
  },

  fetchOrders: async (filters = {}) => {

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

      const token = localStorage.getItem('token');
      const queryString = get().buildQueryString(filters, 1);
      const res = await authFetch(`${API_URL}/api/carts/pendientes?limit=10?${queryString}`);
      
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

  applyDateFilters: async (fromDate, toDate) => {
    const filters = {
      from: fromDate || '',
      to: toDate || ''
    };
    await get().fetchOrders(filters);
  },

  clearFilters: async () => {
    const defaultFilters = {
      from: '',
      to: ''
    };
    await get().fetchOrders(defaultFilters);
  },

  cargarMasPedidos: async () => {
    const { hasMoreOrders, loadingMore, currentPage, orders, currentFilters } = get();
    
    if (!hasMoreOrders || loadingMore) return;

    try {
      set({ 
        loadingMore: true, 
        error: null 
      });
      
      const nextPage = currentPage + 1;
      const token = localStorage.getItem('token');
      const queryString = get().buildQueryString(currentFilters, nextPage);
      
      const res = await authFetch(`${API_URL}/api/carts/pendientes?${queryString}`);
      
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
      to: ''
    }
  }),

  refreshOrders: async () => {
    const { currentFilters } = get();
    await get().fetchOrders(currentFilters);
  }
}));

export default usePendingOrdersStore;