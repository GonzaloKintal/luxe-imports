import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

class CartManager {
  // Obtiene todos los carritos
  async getCarts() {
    return await Cart.find().populate("products.productId");
  }

  // Busca un carrito por ID
  async getCartById(id) {
    const cart = await Cart.findById(id).populate("products.productId");
    if (!cart) {
      const error = new Error("Carrito no encontrado");
      error.status = 404;
      throw error;
    }
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
  // Marcar carrito como pendiente de confirmación
  async markAsPendingConfirmation(cartId) {
    const cart = await Cart.findById(cartId);
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
    cart.status = "pendiente de confirmacion";
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
    if (quantity > product.stock)
      throw new Error("Cantidad supera stock disponible");
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
    if (
      cart.status !== "abierto" ||
      cart.status === "pendiente de confirmacion"
    ) {
      const error = new Error(
        "Solo se pueden eliminar carritos abiertos o pendientes de confirmación."
      );
      error.status = 400;
      throw error;
    }
    await Cart.findByIdAndDelete(cartId);
  }

  async payCart(cartId) {
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
    }
    cart.status = "confirmado";
    cart.paidAt = new Date();
    await cart.save();
  }

  async getPurchaseHistoryByUserId(userId) {
    return await Cart.find({
      userId,
      status: { $in: ["confirmado", "pendiente de confirmacion"] },
    }).populate("products.productId");
  }
}

const cartManager = new CartManager();
export default cartManager;