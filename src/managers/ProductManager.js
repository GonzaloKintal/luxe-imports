import Product from "../models/Product.js";
import { io } from "../app.js";

class ProductManager {
  // Obtiene productos destacados
  async getFeaturedProducts() {
    return await Product.find({ featured: true }).populate("category");
  }

  // Obtiene todos los productos desde MongoDB
  async getProducts() {
    return await Product.find().populate("category");
  }

  // Busca un producto por ID, lanza error si no lo encuentra
  async getProductById(id) {
    const product = await Product.findById(id).populate("category");
    if (!product) {
      const error = new Error("Producto no encontrado");
      error.status = 404;
      throw error;
    }
    return product;
  }

  // Agrega un producto nuevo
  async addProduct(data) {
    const newProduct = new Product(data);
    await newProduct.save();
    return newProduct;
  }

  // Actualiza un producto existente, lanza error si no lo encuentra
  async updateProduct(id, updates) {
    const prevProduct = await Product.findById(id);
    const product = await Product.findByIdAndUpdate(id, updates, { new: true });
    if (!product) {
      const error = new Error("Producto no encontrado");
      error.status = 404;
      throw error;
    }
    // Emitir evento de actualización de precio si el precio cambió
    if (prevProduct && typeof updates.price === "number" && updates.price !== prevProduct.price) {
      io.emit("priceUpdate", {
        productId: product._id.toString(),
        newPrice: updates.price
      });
    }
    // Emitir evento de actualización de stock si el stock cambió
    if (prevProduct && typeof updates.stock === "number" && updates.stock !== prevProduct.stock) {
      io.emit("stockUpdate", {
        productId: product._id.toString(),
        newStock: updates.stock
      });
    }
    // Emitir evento de actualización de status si el status cambió
    if (prevProduct && typeof updates.status === "boolean" && updates.status !== prevProduct.status) {
      io.emit("statusUpdate", {
        productId: product._id.toString(),
        newStatus: updates.status
      });
    }
    // Notificar si el stock es bajo o igual al stock crítico
    const stockCritico =
      typeof product.stockCritico === "number" ? product.stockCritico : 3;
    if (typeof product.stock === "number" && product.stock <= stockCritico) {
      const { notifyAdminLowStock } = await import("../utils/notifyAdmin.js");
      await notifyAdminLowStock(product);
    }
    return product;
  }

  // Elimina un producto por ID, lanza error si no lo encuentra
  async deleteProduct(id) {
    const result = await Product.findByIdAndDelete(id);
    if (!result) {
      const error = new Error("Producto no encontrado");
      error.status = 404;
      throw error;
    }
    return true;
  }
}

const productManager = new ProductManager();
export default productManager;
