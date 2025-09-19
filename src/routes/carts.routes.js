import express from 'express';
import cartManager from '../managers/CartManager.js';
import { authenticateToken, isAdmin } from '../middlewares/auth.js';

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
    const { from, to, limit = 10, page = 1 } = req.query;
    const filters = { status: 'pendiente de confirmacion' };
    if (from || to) {
      filters.pendingAt = {};
      if (from) filters.pendingAt.$gte = new Date(from);
      if (to) filters.pendingAt.$lte = new Date(to);
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await manager.countPurchaseHistoryByUserId(filters);
    const carts = await manager.getPurchaseHistoryByUserId(filters, parseInt(limit), skip);
    const sorted = carts.sort((a, b) => (b.pendingAt ? new Date(b.pendingAt) : 0) - (a.pendingAt ? new Date(a.pendingAt) : 0));
    res.json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      results: sorted
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

// GET /api/carts/history => Obtener historial de pedidos del usuario
router.get('/history', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { status, from, to, limit = 10, page = 1 } = req.query;
    const filters = { userId };
    if (status) filters.status = status;
    if (from || to) {
      // Filtrar por fechas (confirmedAt o pendingAt según status)
      const dateField = status === 'confirmado' ? 'confirmedAt' : 'pendingAt';
      filters[dateField] = {};
      if (from) filters[dateField].$gte = new Date(from);
      if (to) filters[dateField].$lte = new Date(to);
    }

    // Paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await manager.countPurchaseHistoryByUserId(filters);
    const carts = await manager.getPurchaseHistoryByUserId(filters, parseInt(limit), skip);

    // Ordenar: confirmados por confirmedAt, pendientes por pendingAt, ambos descendente
    const sorted = carts.sort((a, b) => {
      const getDate = cart => cart.status === 'confirmado' ? new Date(cart.confirmedAt || 0) : new Date(cart.pendingAt || 0);
      return getDate(b) - getDate(a);
    });
    res.json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      results: sorted
    });
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
      if (from) filters.confirmedAt.$gte = new Date(from);
      if (to) filters.confirmedAt.$lte = new Date(to);
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await manager.countPurchaseHistoryByUserId(filters);
    const carts = await manager.getPurchaseHistoryByUserId(filters, parseInt(limit), skip);
    const sorted = carts.sort((a, b) => (b.confirmedAt ? new Date(b.confirmedAt) : 0) - (a.confirmedAt ? new Date(a.confirmedAt) : 0));
    res.json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      results: sorted
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
