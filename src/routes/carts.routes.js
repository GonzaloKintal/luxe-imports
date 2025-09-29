import express from 'express';
import cartManager from '../managers/CartManager.js';
import { authenticateToken, isAdmin } from '../middlewares/auth.js';
import User from '../models/User.js';

const router = express.Router();
const manager = cartManager;

// POST /api/carts/:cid/confirm-request => Marcar carrito como pendiente de confirmación
router.post('/:cid/confirm-request', authenticateToken, async (req, res, next) => {
  try {
    const cart = await manager.getCartById(req.params.cid);
    // Validar que el carrito pertenezca al usuario autenticado o sea admin
    const userId = (req.user._id || req.user.id);
    if (userId.toString() !== cart.userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No autorizado para marcar como pendiente de confirmación este carrito' });
    }
    const result = await manager.markAsPendingConfirmation(req.params.cid);
    res.json({ message: 'El carrito está pendiente de confirmación.', cart: result });
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({ error: error.message });
    } else {
      next(error);
    }
  }
});

// GET /api/carts/pendientes => Obtener todos los carritos pendientes de confirmación (solo admin)
router.get('/pendientes', authenticateToken, isAdmin, async (req, res, next) => {
  try {
    const { from, to, limit = 10, page = 1, username } = req.query;
    const filters = { status: 'pendiente de confirmacion' };
    if (from || to) {
      filters.pendingAt = {};
      if (from) {
        // Crear fecha en zona horaria Argentina (UTC-3)
        const fromDate = new Date(from + 'T00:00:00-03:00');
        filters.pendingAt.$gte = fromDate;
      }
      if (to) {
        // Crear fecha en zona horaria Argentina (UTC-3)
        const toDate = new Date(to + 'T23:59:59-03:00');
        filters.pendingAt.$lte = toDate;
      }
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Si hay filtro por username => primero obtenemos los IDs de usuarios que coinciden
    if (username) {
      const users = await User.find({
        $expr: {
          $regexMatch: {
            input: { $concat: ["$firstName", " ", "$lastName"] },
            regex: username,
            options: "i"
          }
        }
      }).select('_id');

      if (users.length === 0) {
        return res.json({
          total: 0,
          page: parseInt(page),
          limit: parseInt(limit),
          results: []
        });
      }

      filters.userId = { $in: users.map(u => u._id) };
    }

    const total = await manager.countPurchaseHistoryByUserId(filters);
    const carts = await manager.getPurchaseHistoryByUserId(filters, parseInt(limit), skip);

    // El ordenamiento ahora se hace en la base de datos (CartManager)
    res.json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      results: carts
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/carts/ => Crear nuevo carrito
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id; // MongoDB _id o fallback
    const existing = await manager.getCartByUserId(userId);
    if (existing) return res.status(409).json({ error: 'El usuario ya tiene un carrito' });

    const newCart = await manager.createCart(userId);
    res.status(201).json(newCart);
  } catch (error) {
    next(error);
  }
});

// POST /api/carts/active => Obtener carrito activo del usuario o crear uno si no existe
router.post('/active', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id; // MongoDB _id o fallback
    
    // Primero intentar obtener carrito existente
    let cart = await manager.getCartByUserId(userId);
    
    // Si no existe, crear uno nuevo
    if (!cart) {
      cart = await manager.createCart(userId);
    }
    
    res.json(cart);
  } catch (error) {
    next(error);
  }
});


// GET /api/carts/history/pending => Obtener historial de pedidos pendientes (con filtros de fecha)
router.get('/history/pending', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { from, to, limit = 10, page = 1 } = req.query;

    const filters = { userId, status: 'pendiente de confirmacion' };

    if (from || to) {
      filters.pendingAt = {};
      if (from) {
        // Crear fecha en zona horaria Argentina (UTC-3)
        const fromDate = new Date(from + 'T00:00:00-03:00');
        filters.pendingAt.$gte = fromDate;
      }
      if (to) {
        // Crear fecha en zona horaria Argentina (UTC-3) 
        const toDate = new Date(to + 'T23:59:59-03:00');
        filters.pendingAt.$lte = toDate;
      }
    }

    // Paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await manager.countPurchaseHistoryByUserId(filters);
    const carts = await manager.getPurchaseHistoryByUserId(filters, parseInt(limit), skip);

    // El ordenamiento ahora se hace en la base de datos (CartManager)
    res.json({ total, page: parseInt(page), limit: parseInt(limit), results: carts });
  } catch (error) {
    next(error);
  }
});

// GET /api/carts/history/confirmed => Obtener historial de pedidos confirmados (con filtros de fecha)
router.get('/history/confirmed', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { from, to, limit = 10, page = 1 } = req.query;

    const filters = { userId, status: 'confirmado' };

    if (from || to) {
      filters.confirmedAt = {};
      if (from) {
        // Crear fecha en zona horaria Argentina (UTC-3)
        const fromDate = new Date(from + 'T00:00:00-03:00');
        filters.confirmedAt.$gte = fromDate;
      }
      if (to) {
        // Crear fecha en zona horaria Argentina (UTC-3)
        const toDate = new Date(to + 'T23:59:59-03:00');
        filters.confirmedAt.$lte = toDate;
      }
    }

    // Paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await manager.countPurchaseHistoryByUserId(filters);
    const carts = await manager.getPurchaseHistoryByUserId(filters, parseInt(limit), skip);

    // El ordenamiento ahora se hace en la base de datos (CartManager)
    res.json({ total, page: parseInt(page), limit: parseInt(limit), results: carts });
  } catch (error) {
    next(error);
  }
});

// GET /api/carts/current => Obtener carrito actual (activo/abierto)
router.get('/current', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    
    // Primero intentar obtener un carrito existente directamente
    const existing = await manager.getCartByUserId(userId);
    
    if (existing) {
      return res.json(existing);
    }
    
    // Si no hay carrito directo, buscar en el historial
    // Un carrito "activo" puede tener diferentes estados según tu lógica
    const filters = { 
      userId, 
      $or: [
        { status: { $exists: false } },
        { status: 'abierto' },
        { status: '' },
        { status: null }
      ]
    };
    
    const carts = await manager.getPurchaseHistoryByUserId(filters, 1, 0);
    
    if (carts.length === 0) {
      return res.status(404).json({ error: 'No hay carrito activo' });
    }
    
    // Retornar el más reciente
    const currentCart = carts.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))[0];
    res.json(currentCart);
    
  } catch (error) {
    next(error);
  }
});



// GET /api/carts/confirmados => Obtener todos los carritos confirmados (solo admin)
router.get('/confirmados', authenticateToken, isAdmin, async (req, res, next) => {
  try {
    const { from, to, limit = 10, page = 1 } = req.query;
    const filters = { status: 'confirmado' };
    if (from || to) {
      filters.confirmedAt = {};
      if (from) {
        // Crear fecha en zona horaria Argentina (UTC-3)
        const fromDate = new Date(from + 'T00:00:00-03:00');
        filters.confirmedAt.$gte = fromDate;
      }
      if (to) {
        // Crear fecha en zona horaria Argentina (UTC-3)
        const toDate = new Date(to + 'T23:59:59-03:00');
        filters.confirmedAt.$lte = toDate;
      }
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await manager.countPurchaseHistoryByUserId(filters);
    const carts = await manager.getPurchaseHistoryByUserId(filters, parseInt(limit), skip);
    // El ordenamiento ahora se hace en la base de datos (CartManager)
    res.json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      results: carts
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/carts/:cid => Obtener productos del carrito
router.get('/:cid', authenticateToken, async (req, res, next) => {
  try {
    const cart = await manager.getCartById(req.params.cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    // Solo el dueño o admin
    const userId = (req.user._id || req.user.id);
    // Si cart.userId es un ObjectId, conviértelo a string para comparar
    if (userId.toString() !== cart.userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No tienes permiso para ver este carrito' });
    }

    res.json(cart.products);
  } catch (error) {
    next(error);
  }
});

// POST /api/carts/:cid/product/:pid => Agregar producto al carrito
router.post('/:cid/product/:pid', authenticateToken, async (req, res, next) => {
  try {
    const cart = await manager.getCartById(req.params.cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    // Validar que el carrito pertenezca al usuario autenticado
    const userId = (req.user._id || req.user.id);
    if (userId.toString() !== cart.userId.toString()) {
      return res.status(403).json({ error: 'No autorizado para modificar este carrito' });
    }

    const updatedCart = await manager.addProductToCart(req.params.cid, req.params.pid);
    res.json(updatedCart);
  } catch (error) {
    if (
      error.message === 'Producto no encontrado' ||
      error.message === 'Cantidad supera stock disponible' ||
      error.message === 'Producto sin stock disponible'
    ) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
});

// DELETE /api/carts/:cid/product/:pid => Quitar producto del carrito
router.delete('/:cid/product/:pid', authenticateToken, async (req, res, next) => {
  try {
    const cart = await manager.getCartById(req.params.cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    const userId = (req.user._id || req.user.id);
    if (userId.toString() !== cart.userId.toString()) {
      return res.status(403).json({ error: 'No autorizado para modificar este carrito' });
    }

    const updatedCart = await manager.removeProductFromCart(req.params.cid, req.params.pid);
    res.json(updatedCart);
  } catch (error) {
    if (error.message === 'Carrito no encontrado' || error.message === 'Producto no encontrado en el carrito') {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
});

// PUT /api/carts/:cid/product/:pid => Actualizar cantidad de producto en carrito
router.put('/:cid/product/:pid', authenticateToken, async (req, res, next) => {
  try {
    const cart = await manager.getCartById(req.params.cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    const userId = (req.user._id || req.user.id);
    if (userId.toString() !== cart.userId.toString()) {
      return res.status(403).json({ error: 'No autorizado para modificar este carrito' });
    }

    const { quantity } = req.body;
    if (typeof quantity !== 'number' || quantity < 1) {
      return res.status(400).json({ error: 'Cantidad inválida. Debe ser un número entero mayor o igual a 1.' });
    }

    const updatedCart = await manager.updateProductQuantity(req.params.cid, req.params.pid, quantity);

    if (!updatedCart) {
      return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
    }

    res.json(updatedCart);
  } catch (error) {
    if (
      error.message === 'Producto no encontrado' ||
      error.message === 'Cantidad supera stock disponible'
    ) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
});

// DELETE /api/carts/:cid => Eliminar carrito (sólo dueño)
router.delete('/:cid', authenticateToken, async (req, res, next) => {
  try {
    const cart = await manager.getCartById(req.params.cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    // Validar que el carrito pertenezca al usuario autenticado o sea admin
    const userId = (req.user._id || req.user.id);
    if (userId.toString() !== cart.userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No autorizado para eliminar este carrito' });
    }

    await manager.deleteCart(req.params.cid);

    res.json({ message: 'Carrito eliminado correctamente' });
  } catch (error) {
    next(error);
  }
});

// POST /api/carts/:cid/confirmar => Confirmar el carrito
router.post('/:cid/confirmar', authenticateToken, isAdmin, async (req, res, next) => {
  try {
    const cart = await manager.getCartById(req.params.cid);

    // Validar que el carrito pertenezca al usuario autenticado o sea admin
    const userId = (req.user._id || req.user.id);
    if (userId.toString() !== cart.userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No autorizado para confirmar este carrito' });
    }

    const result = await manager.confirmCart(req.params.cid);
    res.json({ message: 'Carrito confirmado correctamente', cart: result });
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({ error: error.message });
    } else {
      next(error);
    }
  }
});

export default router;
