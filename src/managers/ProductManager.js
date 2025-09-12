import Product from "../models/Product.js";

class ProductManager {
  // Obtiene productos destacados
  async getFeaturedProducts() {
    return await Product.find({ featured: true });
  }

  // Obtiene todos los productos desde MongoDB
  async getProducts() {
    return await Product.find();
  }

  // Busca un producto por ID, lanza error si no lo encuentra
  async getProductById(id) {
    const product = await Product.findById(id);
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
    const product = await Product.findByIdAndUpdate(id, updates, { new: true });
    if (!product) {
      const error = new Error("Producto no encontrado");
      error.status = 404;
      throw error;
    }
    // Notificar si el stock es bajo o 0
    if (typeof product.stock === 'number' && product.stock <= 3) {
      // Importar dinámicamente para evitar problemas en test
      const { notifyAdminLowStock } = await import('../utils/notifyAdmin.js');
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
