import express from "express";
import productManager from "../managers/ProductManager.js";
import { authenticateToken, isAdmin } from "../middlewares/auth.js";
import { uploadProductImages } from "../config/cloudinary.js";

const router = express.Router();
const manager = productManager;

// Ruta GET '/featured' -> Lista productos destacados
router.get("/featured", async (req, res, next) => {
  try {
    const featuredProducts = await manager.getFeaturedProducts();
    if (featuredProducts.length >= 7) {
      res.json(featuredProducts);
    } else {
      // Si hay menos de 7 destacados, tomar los primeros 7 con stock > 0 y status = true
      const allProducts = await manager.getProducts();
      const validProducts = allProducts.filter(
        (p) => p.stock > 0 && p.status === true
      );
      res.json(validProducts.slice(0, 7));
    }
  } catch (error) {
    next(error);
  }
});

// Ruta GET '/active' -> Lista solo productos activos
router.get("/active", async (req, res, next) => {
  try {
    const products = await manager.getProducts();
    const activeProducts = products.filter(p => p.status === true);
    res.json(activeProducts);
  } catch (error) {
    next(error);
  }
});

// Ruta GET '/' -> Lista todos los productos
router.get("/", async (req, res, next) => {
  try {
    const products = await manager.getProducts();
    res.json(products);
  } catch (error) {
    next(error); // En caso de error, pasa al middleware de manejo de errores
  }
});

// Ruta GET '/:pid' -> Obtiene un producto por su ID
router.get("/:pid", async (req, res, next) => {
  try {
    const product = await manager.getProductById(req.params.pid);
    if (!product)
      return res.status(404).json({ error: "Producto no encontrado" });
    res.json(product);
  } catch (error) {
    next(error);
  }
});

// Ruta POST '/' -> Crea un nuevo producto (solo admin)
// router.post("/", authenticateToken, isAdmin, async (req, res, next) => {
//   try {
//     if (!req.body || typeof req.body !== "object") {
//       return res
//         .status(400)
//         .json({ error: "El cuerpo de la solicitud está vacío o no es válido" });
//     }

//     const {
//       title,
//       description,
//       code,
//       price,
//       status,
//       stock,
//       stockCritico,
//       category,
//       thumbnails,
//     } = req.body;

//     if (
//       !title ||
//       !description ||
//       !code ||
//       price == null ||
//       status == null ||
//       stock == null ||
//       stockCritico == null ||
//       !category
//     ) {
//       return res.status(400).json({ error: "Faltan campos requeridos" });
//     }

//     const newProduct = await manager.addProduct({
//       title,
//       description,
//       code,
//       price,
//       status,
//       stock,
//       stockCritico,
//       category,
//       thumbnails,
//     });
//     res.status(201).json(newProduct);
//   } catch (error) {
//     next(error);
//   }
// });
router.post("/", authenticateToken, isAdmin, uploadProductImages.array('images', 5), async (req, res, next) => {
  try {
    if (!req.body || typeof req.body !== "object") {
      return res
        .status(400)
        .json({ error: "El cuerpo de la solicitud está vacío o no es válido" });
    }

    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      stockCritico,
      category,
    } = req.body;

    // Validar campos requeridos
    if (
      !title ||
      !description ||
      !code ||
      price == null ||
      status == null ||
      stock == null ||
      stockCritico == null ||
      !category
    ) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    // Obtener las URLs de las imágenes subidas
    const thumbnails = req.files ? req.files.map(file => file.path) : [];

    const newProduct = await manager.addProduct({
      title,
      description,
      code,
      price: parseFloat(price),
      status: status === 'true',
      stock: parseInt(stock),
      stockCritico: parseInt(stockCritico),
      category,
      thumbnails,
    });
    
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
});

// Ruta PUT '/:pid' -> Actualiza un producto existente (solo admin)
// router.put("/:pid", authenticateToken, isAdmin, async (req, res, next) => {
//   try {
//     const updated = await manager.updateProduct(req.params.pid, req.body);
//     if (!updated)
//       return res.status(404).json({ error: "Producto no encontrado" });
//     res.json(updated);
//   } catch (error) {
//     next(error);
//   }
// });
router.put("/:pid", authenticateToken, isAdmin, uploadProductImages.array('images', 5), async (req, res, next) => {
  try {
    const updateData = { ...req.body };
    
    // Manejar imágenes
    let finalThumbnails = [];
    
    // Obtener imágenes actuales que se mantienen
    if (req.body.currentImages) {
      try {
        const currentImages = JSON.parse(req.body.currentImages);
        if (Array.isArray(currentImages)) {
          finalThumbnails = [...currentImages];
        }
      } catch (e) {
        console.log('Error parsing currentImages:', e);
      }
    }
    
    // Agregar nuevas imágenes si las hay
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.path);
      finalThumbnails = [...finalThumbnails, ...newImages];
    }
    
    // Actualizar thumbnails solo si hay cambios en las imágenes
    if (req.files?.length > 0 || req.body.currentImages) {
      updateData.thumbnails = finalThumbnails;
    }

    // Limpiar currentImages del updateData ya que no es un campo del modelo
    delete updateData.currentImages;

    // Convertir tipos de datos si es necesario
    if (updateData.price) updateData.price = parseFloat(updateData.price);
    if (updateData.stock) updateData.stock = parseInt(updateData.stock);
    if (updateData.stockCritico) updateData.stockCritico = parseInt(updateData.stockCritico);
    if (updateData.status !== undefined) {
    if (typeof updateData.status === 'string') {
      updateData.status = updateData.status === 'true';
    } else {
      updateData.status = Boolean(updateData.status);
    }
  }


    const updated = await manager.updateProduct(req.params.pid, updateData);
    if (!updated)
      return res.status(404).json({ error: "Producto no encontrado" });
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

// Ruta DELETE '/:pid' -> Elimina un producto por ID (solo admin)
router.delete("/:pid", authenticateToken, isAdmin, async (req, res, next) => {
  try {
    const deleted = await manager.deleteProduct(req.params.pid);
    if (!deleted)
      return res.status(404).json({ error: "Producto no encontrado" });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

export default router;