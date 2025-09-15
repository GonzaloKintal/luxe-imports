import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { io } from "../app.js";

class CartManager {
  // Obtiene todos los carritos
  async getCarts() {
    return await Cart.find().populate("products.productId").populate("userId");
  }

  // Busca un carrito por ID
  async getCartById(id) {
    const cart = await Cart.findById(id).populate("products.productId");
    if (!cart) {
      const error = new Error("Carrito no encontrado");
      error.status = 404;
      throw error;
    }
    // Actualizar stock y status en cada producto del carrito
    cart.products.forEach((item) => {
      if (item.productId) {
        item.stock = item.productId.stock;
        item.status = item.productId.status;
      }
    });
    return cart;
  }

  async getCartByUserId(userId) {
    return await Cart.findOne({ userId, status: "abierto" }).populate(
      "products.productId"
    );
  }

  async createCart(userId) {
    if (!userId) {
      const error = new Error("El userId es requerido para crear un carrito");
      error.status = 400;
      throw error;
    }

    // Verificar si el usuario existe y no es admin
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("Usuario no encontrado");
      error.status = 404;
      throw error;
    }

    if (user.role === "admin") {
      const error = new Error("Los administradores no pueden tener carritos");
      error.status = 403;
      throw error;
    }

    // Verificar si ya existe un carrito abierto
    const existingCart = await Cart.findOne({ userId, status: "abierto" });
    if (existingCart) {
      const error = new Error("Ya existe un carrito abierto para este usuario");
      error.status = 409;
      throw error;
    }

    const newCart = new Cart({ userId, products: [], status: "abierto" });
    await newCart.save();
    return newCart;
  }
  // Marcar carrito como pendiente de confirmación y guardar snapshot en products
  async markAsPendingConfirmation(cartId) {
    const cart = await Cart.findById(cartId).populate("products.productId");
    if (!cart) {
      const error = new Error("Carrito no encontrado");
      error.status = 404;
      throw error;
    }
    if (cart.status !== "abierto") {
      const error = new Error(
        "Solo se puede marcar como pendiente de confirmación un carrito abierto."
      );
      error.status = 400;
      throw error;
    }
    // Validar stock y status antes de pasar a pendiente
    for (const item of cart.products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        const error = new Error(
          `Producto con ID ${item.productId} no encontrado.`
        );
        error.status = 404;
        throw error;
      }
      if (product.status === false) {
        const error = new Error(
          `El producto ${product.title} está inactivo y no puede ser comprado.`
        );
        error.status = 400;
        throw error;
      }
      if (product.stock < item.quantity) {
        const error = new Error(
          `Stock insuficiente para el producto ${product.title}.`
        );
        error.status = 400;
        throw error;
      }
    }
    // Guardar snapshot de productos (titulo, precio) en cada item
    cart.products.forEach((p) => {
      p.title = p.productId?.title || "";
      p.price = typeof p.productId?.price === "number" ? p.productId.price : 0;
    });
    cart.status = "pendiente de confirmacion";
    cart.pendingAt = new Date();
    await cart.save();
    return cart;
  }

  async addProductToCart(cartId, productId) {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      const error = new Error("Carrito no encontrado");
      error.status = 404;
      throw error;
    }
    const product = await Product.findById(productId);
    if (!product) {
      const error = new Error("Producto no encontrado");
      error.status = 404;
      throw error;
    }
    if (cart.status !== "abierto") {
      const error = new Error("Solo se pueden modificar carritos abiertos.");
      error.status = 400;
      throw error;
    }
    const item = cart.products.find((p) => p.productId.equals(productId));
    if (item) {
      if (item.quantity + 1 > product.stock) {
        const error = new Error("Cantidad supera stock disponible");
        error.status = 400;
        throw error;
      }
      item.quantity += 1;
    } else {
      if (product.stock < 1) {
        const error = new Error("Producto sin stock disponible");
        error.status = 400;
        throw error;
      }
      cart.products.push({ productId, quantity: 1 });
    }
    await cart.save();
    return cart;
  }

  async removeProductFromCart(cartId, productId) {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      const error = new Error("Carrito no encontrado");
      error.status = 404;
      throw error;
    }
    if (cart.status !== "abierto") {
      const error = new Error("Solo se pueden modificar carritos abiertos.");
      error.status = 400;
      throw error;
    }
    const index = cart.products.findIndex((p) => p.productId.equals(productId));
    if (index === -1) {
      const error = new Error("Producto no encontrado en el carrito");
      error.status = 404;
      throw error;
    }
    // Permitir siempre eliminar el producto, sin importar el stock
    cart.products.splice(index, 1);
    await cart.save();
    return cart;
  }

  async updateProductQuantity(cartId, productId, quantity) {
    const cart = await Cart.findById(cartId);
    if (!cart) return null;
    if (cart.status !== "abierto") {
      const error = new Error("Solo se pueden modificar carritos abiertos.");
      error.status = 400;
      throw error;
    }
    const item = cart.products.find((p) => p.productId.equals(productId));
    if (!item) return null;
    const product = await Product.findById(productId);
    if (!product) throw new Error("Producto no encontrado");
    // Permitir descontar cantidad si la nueva cantidad es menor o igual al stock
    // Si la cantidad es 0, se debe eliminar el producto (esto lo maneja removeProductFromCart)
    if (quantity > product.stock) {
      // Si la operación es para reducir la cantidad, permitir si la nueva cantidad es menor que la actual
      if (quantity < item.quantity) {
        item.quantity = quantity;
        await cart.save();
        return cart;
      }
      // Si la cantidad es mayor, bloquear
      throw new Error("Cantidad supera stock disponible");
    }
    item.quantity = quantity;
    await cart.save();
    return cart;
  }

  async deleteCart(cartId) {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      const error = new Error("Carrito no encontrado");
      error.status = 404;
      throw error;
    }
    if (cart.status === "confirmado") {
      const error = new Error("No se pueden eliminar carritos confirmados.");
      error.status = 400;
      throw error;
    }
    await Cart.findByIdAndDelete(cartId);
  }

  async confirmCart(cartId) {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      const error = new Error("Carrito no encontrado");
      error.status = 404;
      throw error;
    }
    if (cart.status !== "pendiente de confirmacion") {
      throw new Error("El carrito no está pendiente de confirmación.");
    }
    if (!cart.products || cart.products.length === 0) {
      throw new Error("El carrito está vacío.");
    }
    // Importar io para emitir eventos WebSocket
    for (const item of cart.products) {
      const product = await Product.findById(item.productId);
      if (!product)
        throw new Error(`Producto con ID ${item.productId} no encontrado.`);
      if (product.stock < item.quantity)
        throw new Error(
          `Stock insuficiente para el producto ${product.title}.`
        );
    }
    for (const item of cart.products) {
      const product = await Product.findById(item.productId);
      product.stock -= item.quantity;
      await product.save();
      // Emitir evento de actualización de stock por WebSocket
      io.emit("stockUpdate", {
        productId: product._id.toString(),
        newStock: product.stock,
      });
      // Notificar si el stock baja a stock crítico
      const stockCritico =
        typeof product.stockCritico === "number" ? product.stockCritico : 3;
      if (typeof product.stock === "number" && product.stock <= stockCritico) {
        const { notifyAdminLowStock } = await import("../utils/notifyAdmin.js");
        await notifyAdminLowStock(product);
      }
    }
    cart.status = "confirmado";
    cart.confirmedAt = new Date();
    await cart.save();
  }

  async getPurchaseHistoryByUserId(userId) {
    return await Cart.find({
      userId,
    })
      .populate("products.productId")
      .populate("userId");
  }
}

const cartManager = new CartManager();
export default cartManager;
