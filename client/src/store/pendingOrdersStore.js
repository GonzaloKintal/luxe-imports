import { create } from 'zustand';

const API_URL = import.meta.env.VITE_API_URL;
const LIMIT = 10;

const usePendingOrdersStore = create((set, get) => ({
  // Estado
  orders: [],
  total: 0,
  currentPage: 0,
  totalPages: 0,
  hasMoreOrders: true,
  loading: false,
  loadingMore: false,
  error: null,
  isInitialized: false,
  
  // Filtros actuales
  currentFilters: {
    from: '',
    to: ''
  },

  // Acciones básicas
  setLoading: (loading) => set({ loading }),
  setLoadingMore: (loadingMore) => set({ loadingMore }),
  setError: (error) => set({ error }),

  // Función para construir query string de filtros
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

  // Función para cargar pedidos con filtros
  fetchOrders: async (filters = {}) => {
    console.log('fetchOrders llamado con filtros:', filters);
    const { currentFilters } = get();
    
    // Verificar si los filtros cambiaron
    const filtersChanged = JSON.stringify(currentFilters) !== JSON.stringify(filters);
    
    try {
      set({ 
        loading: true, 
        error: null,
        // Si cambiaron los filtros, resetear pedidos
        ...(filtersChanged && { 
          orders: [], 
          currentPage: 0,
          hasMoreOrders: true 
        }),
        currentFilters: filters
      });

      const token = localStorage.getItem('token');
      const queryString = get().buildQueryString(filters, 1);
      const res = await fetch(`${API_URL}/api/carts/pendientes?${queryString}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
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

  // Función para aplicar filtros de fecha
  applyDateFilters: async (fromDate, toDate) => {
    const filters = {
      from: fromDate || '',
      to: toDate || ''
    };
    await get().fetchOrders(filters);
  },

  // Función para limpiar filtros
  clearFilters: async () => {
    const defaultFilters = {
      from: '',
      to: ''
    };
    await get().fetchOrders(defaultFilters);
  },

  // Función para cargar más pedidos (mantiene filtros actuales)
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
      
      const res = await fetch(`${API_URL}/api/carts/pendientes?${queryString}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) throw new Error('Error al cargar más pedidos');
      
      const data = await res.json();
      
      // Agregar nuevos pedidos a los existentes
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

  // Función para remover un pedido del estado (cuando se confirma o elimina)
  removeOrder: (orderId) => {
    const { orders, total } = get();
    const newOrders = orders.filter(order => order._id !== orderId);
    set({
      orders: newOrders,
      total: Math.max(0, total - 1) // Reducir el total en 1
    });
  },

  // Función para resetear el store
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

  // Función para refrescar pedidos con filtros actuales
  refreshOrders: async () => {
    const { currentFilters } = get();
    await get().fetchOrders(currentFilters);
  }
}));

export default usePendingOrdersStore;