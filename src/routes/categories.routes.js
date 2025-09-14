import express from "express";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import { authenticateToken, isAdmin } from "../middlewares/auth.js";

const router = express.Router();

// Listar todas las categorías
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener categorías" });
  }
});

// Crear una categoría (solo admin)
router.post("/", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = new Category({ name, description });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: "Error al crear categoría" });
  }
});

// Editar una categoría (solo admin)
router.put("/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    );
    if (!category)
      return res.status(404).json({ error: "Categoría no encontrada" });
    res.json(category);
  } catch (err) {
    res.status(400).json({ error: "Error al editar categoría" });
  }
});

// Eliminar una categoría (solo admin)
router.delete("/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    // Verificar si hay productos asociados a la categoría
    const productsCount = await Product.countDocuments({ category: req.params.id });
    if (productsCount > 0) {
      return res.status(400).json({ error: "No se puede eliminar la categoría porque tiene productos asociados." });
    }
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category)
      return res.status(404).json({ error: "Categoría no encontrada" });
    res.json({ message: "Categoría eliminada" });
  } catch (err) {
    res.status(400).json({ error: "Error al eliminar categoría" });
  }
});

export default router;
