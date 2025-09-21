import express from "express";
import productManager from "../managers/ProductManager.js";
import { authenticateToken, isAdmin } from "../middlewares/auth.js";
import { uploadProductImages } from "../config/cloudinary.js";
import cloudinary from "../config/cloudinary.js";

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

// Ruta GET '/active' -> Lista productos activos con filtros, paginado
// /active?page=1&limit=12&search=termo&category=categoryId&stock=in&sort=price_asc
router.get("/active", async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    
    // Construir filtros dinámicamente
    const filter = { status: true };
    const sort = {};
    
    // Filtro de búsqueda por título
    if (req.query.search && req.query.search.trim()) {
      filter.title = { $regex: req.query.search.trim(), $options: 'i' };
    }
    
    // Filtro por categoría
    if (req.query.category && req.query.category !== '') {
      filter.category = req.query.category;
    }
    
    // Filtro por stock
    if (req.query.stock) {
      if (req.query.stock === 'in') {
        filter.stock = { $gt: 0 };
      } else if (req.query.stock === 'out') {
        filter.stock = { $lte: 0 };
      }
      // 'all' no agrega filtro
    }
    
    // Ordenamiento por precio
    if (req.query.sort) {
      if (req.query.sort === 'price_asc') {
        sort.price = 1;
      } else if (req.query.sort === 'price_desc') {
        sort.price = -1;
      }
    } else {
      // Ordenamiento por defecto: displayOrder ASC, luego createdAt DESC
      sort.displayOrder = 1;
      sort.createdAt = -1;
    }

    const [products, total] = await Promise.all([
      manager.getProducts({ skip, limit, filter, sort }),
      manager.countProducts(filter)
    ]);

    res.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      // Opcional: devolver los filtros aplicados para debugging
      appliedFilters: {
        search: req.query.search || '',
        category: req.query.category || '',
        stock: req.query.stock || 'all',
        sort: req.query.sort || 'newest'
      }
    });
  } catch (error) {
    next(error);
  }
});


// Ruta GET '/' -> Lista todos los productos con filtros, paginado (para admin)
// /products?page=1&limit=12&search=termo&category=categoryId&stock=conStock&status=active
router.get("/", async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    
    // Construir filtros dinámicamente
    const filter = {};
    const sort = {};
    
    // Filtro de búsqueda por título
    if (req.query.search && req.query.search.trim()) {
      filter.title = { $regex: req.query.search.trim(), $options: 'i' };
    }
    
    // Filtro por categoría
    if (req.query.category && req.query.category !== '') {
      filter.category = req.query.category;
    }
    
    // Filtro por stock (para admin es diferente)
    if (req.query.stock) {
      if (req.query.stock === 'conStock') {
        filter.stock = { $gt: 0 };
      } else if (req.query.stock === 'sinStock') {
        filter.stock = { $eq: 0 };
      }
      // 'todos' no agrega filtro
    }
    
    // Filtro por status (activos/inactivos)
    if (req.query.status) {
      if (req.query.status === 'active') {
        filter.status = true;
      } else if (req.query.status === 'inactive') {
        filter.status = false;
      }
      // 'all' no agrega filtro
    }
    
    // Ordenamiento
    if (req.query.sort) {
      if (req.query.sort === 'price_asc') {
        sort.price = 1;
      } else if (req.query.sort === 'price_desc') {
        sort.price = -1;
      } else if (req.query.sort === 'title_asc') {
        sort.title = 1;
      } else if (req.query.sort === 'title_desc') {
        sort.title = -1;
      } else if (req.query.sort === 'newest') {
        sort.createdAt = -1;
      } else if (req.query.sort === 'oldest') {
        sort.createdAt = 1;
      } else if (req.query.sort === 'display_order') {
        sort.displayOrder = 1;
        sort.createdAt = -1;
      }
    } else {
      // Ordenamiento por defecto: displayOrder ASC, luego createdAt DESC
      sort.displayOrder = 1;
      sort.createdAt = -1;
    }

    const [products, total] = await Promise.all([
      manager.getProducts({ skip, limit, filter, sort }),
      manager.countProducts(filter)
    ]);

    res.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      // Opcional: devolver los filtros aplicados para debugging
      appliedFilters: {
        search: req.query.search || '',
        category: req.query.category || '',
        stock: req.query.stock || 'todos',
        status: req.query.status || 'all',
        sort: req.query.sort || 'newest'
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET '/categories' -> todas las categorías
router.get("/categories", async (req, res, next) => {
  try {
    const categories = await manager.getAllCategories();
    res.json(categories);
  } catch (error) {
    next(error);
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
      displayOrder,
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

    // Manejar imágenes con orden
    let thumbnails = [];
    if (req.files && req.files.length > 0) {
      const uploadedImages = req.files.map(file => file.path);
      
      // Si hay información de orden, reconstruir el array respetando el orden
      if (req.body.imageOrder) {
        try {
          const imageOrder = JSON.parse(req.body.imageOrder);
          let imageIndex = 0;
          
          for (const orderItem of imageOrder) {
            if (!orderItem.isExisting && imageIndex < uploadedImages.length) {
              thumbnails.push(uploadedImages[imageIndex]);
              imageIndex++;
            }
          }
        } catch (e) {
          console.log('Error parsing imageOrder, using original order:', e);
          thumbnails = uploadedImages;
        }
      } else {
        thumbnails = uploadedImages;
      }
    }

    const productData = {
      title,
      description,
      code,
      price: parseFloat(price),
      status: status === 'true',
      stock: parseInt(stock),
      stockCritico: parseInt(stockCritico),
      category,
      thumbnails,
    };

    // Agregar displayOrder si se proporciona, sino usar el default del modelo
    if (displayOrder != null) {
      const parsedDisplayOrder = parseInt(displayOrder);
      if (parsedDisplayOrder >= 1) {
        productData.displayOrder = parsedDisplayOrder;
      }
    }

    const newProduct = await manager.addProduct(productData);
    
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
});

// Ruta PUT '/:pid' -> Actualiza un producto existente (solo admin)
router.put("/:pid", authenticateToken, isAdmin, uploadProductImages.array('images', 5), async (req, res, next) => {
  try {
    const updateData = { ...req.body };
    

    // Manejar imágenes con orden correcto
    let finalThumbnails = [];
    // Si hay información de orden, reconstruir el array respetando el orden
    if (req.body.imageOrder) {
      try {
        const imageOrder = JSON.parse(req.body.imageOrder);
        const currentImages = req.body.currentImages ? JSON.parse(req.body.currentImages) : [];
        const newImages = req.files ? req.files.map(file => file.path) : [];
        let currentImageIndex = 0;
        let newImageIndex = 0;
        for (const orderItem of imageOrder) {
          if (orderItem.isExisting) {
            if (currentImageIndex < currentImages.length) {
              finalThumbnails.push(currentImages[currentImageIndex]);
              currentImageIndex++;
            }
          } else {
            if (newImageIndex < newImages.length) {
              finalThumbnails.push(newImages[newImageIndex]);
              newImageIndex++;
            }
          }
        }
      } catch (e) {
        console.log('Error parsing imageOrder, fallback to original logic:', e);
        // Fallback a la lógica original...
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
        if (req.files && req.files.length > 0) {
          const newImages = req.files.map(file => file.path);
          finalThumbnails = [...finalThumbnails, ...newImages];
        }
      }
    } else {
      // Lógica original como fallback...
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
      if (req.files && req.files.length > 0) {
        const newImages = req.files.map(file => file.path);
        finalThumbnails = [...finalThumbnails, ...newImages];
      }
    }

    // Eliminar imágenes de Cloudinary si corresponde
    if (req.body.deletedImages) {
      try {
        const deletedImages = JSON.parse(req.body.deletedImages);
        if (Array.isArray(deletedImages) && deletedImages.length > 0) {
          for (const url of deletedImages) {
            const match = url.match(/\/upload\/[^/]+\/(.+)\.[a-zA-Z]+$/);
            if (match) {
              const publicId = match[1];
              try {
                await cloudinary.uploader.destroy(publicId);
              } catch (err) {
                console.log('Error eliminando imagen de Cloudinary:', err);
              }
            }
          }
        }
      } catch (e) {
        console.log('Error parsing deletedImages:', e);
      }
    }

    // Actualizar thumbnails solo si hay cambios en las imágenes
    if (req.files?.length > 0 || req.body.currentImages || req.body.imageOrder) {
      updateData.thumbnails = finalThumbnails;
    }

    // Limpiar campos temporales
    delete updateData.currentImages;
    delete updateData.deletedImages;
    delete updateData.imageOrder;

    // Limpiar campos temporales
    delete updateData.currentImages;
    delete updateData.deletedImages;

    // Convertir tipos de datos si es necesario
    if (updateData.price) updateData.price = parseFloat(updateData.price);
    if (updateData.stock) updateData.stock = parseInt(updateData.stock);
    if (updateData.stockCritico) updateData.stockCritico = parseInt(updateData.stockCritico);
    if (updateData.displayOrder != null) {
      const parsedDisplayOrder = parseInt(updateData.displayOrder);
      if (parsedDisplayOrder >= 1) {
        updateData.displayOrder = parsedDisplayOrder;
      } else {
        delete updateData.displayOrder; // No actualizar si es inválido
      }
    }
    if (updateData.status !== undefined) {
    if (typeof updateData.status === 'string') {
      updateData.status = updateData.status === 'true';
    } else {
      updateData.status = Boolean(updateData.status);
    }
    // Si el producto se desactiva, también dejar de destacar
    if (updateData.status === false) {
      updateData.featured = false;
    }
    // Si el producto queda sin stock, también dejar de destacar
    if (typeof updateData.stock === 'number' && updateData.stock === 0) {
      updateData.featured = false;
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
// router.put("/:pid", authenticateToken, isAdmin, uploadProductImages.array('images', 5), async (req, res, next) => {
//   try {
//     const updateData = { ...req.body };
    
//     let finalThumbnails = [];
    
//     // Si hay información de orden, reconstruir el array respetando el orden
//     if (req.body.imageOrder) {
//       try {
//         const imageOrder = JSON.parse(req.body.imageOrder);
//         const currentImages = req.body.currentImages ? JSON.parse(req.body.currentImages) : [];
//         const newImages = req.files ? req.files.map(file => file.path) : [];
        
//         let currentImageIndex = 0;
//         let newImageIndex = 0;
        
//         // Reconstruir el array según el orden especificado
//         for (const orderItem of imageOrder) {
//           if (orderItem.isExisting) {
//             if (currentImageIndex < currentImages.length) {
//               finalThumbnails.push(currentImages[currentImageIndex]);
//               currentImageIndex++;
//             }
//           } else {
//             if (newImageIndex < newImages.length) {
//               finalThumbnails.push(newImages[newImageIndex]);
//               newImageIndex++;
//             }
//           }
//         }
//       } catch (e) {
//         console.log('Error parsing imageOrder, fallback to original logic:', e);
//         // Fallback a la lógica original...
//       }
//     } else {
//       // Lógica original como fallback...
//       if (req.body.currentImages) {
//         try {
//           const currentImages = JSON.parse(req.body.currentImages);
//           if (Array.isArray(currentImages)) {
//             finalThumbnails = [...currentImages];
//           }
//         } catch (e) {
//           console.log('Error parsing currentImages:', e);
//         }
//       }

//       if (req.files && req.files.length > 0) {
//         const newImages = req.files.map(file => file.path);
//         finalThumbnails = [...finalThumbnails, ...newImages];
//       }
//     }

//     // Resto del código igual...
//     // Eliminar imágenes de Cloudinary si corresponde
//     if (req.body.deletedImages) {
//       // ... código de eliminación igual
//     }

//     // Actualizar thumbnails solo si hay cambios en las imágenes
//     if (req.files?.length > 0 || req.body.currentImages) {
//       updateData.thumbnails = finalThumbnails;
//     }

//     // Limpiar campos temporales
//     delete updateData.currentImages;
//     delete updateData.deletedImages;
//     delete updateData.imageOrder; // Nuevo campo a limpiar

//     // Resto del código igual...
//   } catch (error) {
//     next(error);
//   }
// });

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