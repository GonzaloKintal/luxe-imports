import express from "express";
import User from "../models/User.js";
import { authenticateToken } from "../middlewares/auth.js";

const router = express.Router();

// Endpoint para obtener info del usuario autenticado
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({
      id: user._id,
      email: user.email,
      nombre: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      telefono: user.telefono || null,
      role: user.role,
    });
  } catch (error) {
    console.error("Error en /me:", error);
    res.status(500).json({ error: "Error al obtener info del usuario" });
  }
});

export default router;
