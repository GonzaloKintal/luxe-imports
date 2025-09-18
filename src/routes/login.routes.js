import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userManager from "../managers/UserManager.js";
import { authenticateToken, isAdmin } from "../middlewares/auth.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const router = express.Router();
const manager = userManager;

// Configuración de nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL_USER,
    pass: process.env.ADMIN_EMAIL_PASS,
  },
});


// Objeto en memoria para guardar códigos temporales
const pendingRegistrations = {}; // { email: { code: "12345", data: { ... } } }

// POST /register -> Genera código y lo envía al email
router.post("/register", async (req, res, next) => {
  try {
    let { email, password, firstName, lastName, telefono } = req.body || {};

    if (telefono && !telefono.startsWith("+")) {
      telefono = `+${telefono}`;
    }

    if (!email || !password || !firstName || !lastName || !telefono) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    const telefonoRegex = /^\+\d{12,15}$/;
    if (!telefonoRegex.test(telefono)) {
      return res.status(400).json({
        error: "El teléfono debe tener formato internacional, ej: +5491123456789",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Formato de email inválido" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "La contraseña debe tener al menos 6 caracteres" });
    }

    // Verificar que el usuario no exista ya en DB
    const existingUser = await manager.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: "El email ya está registrado" });
    }

    // Generar código de 5 dígitos
    const verificationCode = Math.floor(10000 + Math.random() * 90000).toString();

    // Guardar en memoria
    pendingRegistrations[email] = {
      code: verificationCode,
      data: { email, password, firstName, lastName, telefono, role: "user" },
    };

    // Enviar mail con el código
	await transporter.sendMail({
	  from: process.env.ADMIN_EMAIL_USER, // tu Gmail (bandeja de salida)
	  to: email,                          // correo del usuario que se registra
	  subject: "Confirma tu correo",
	  text: `Tu código de verificación es: ${verificationCode}`,
	});

    res.status(200).json({
      message: "Código de verificación enviado a tu email",
    });
  } catch (error) {
    next(error);
  }
});

// POST /verify-code -> Valida código y crea usuario en DB
router.post("/verify-code", async (req, res, next) => {
  try {
    const { email, code } = req.body || {};

    if (!email || !code) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    const pending = pendingRegistrations[email];
    if (!pending) {
      return res.status(400).json({ error: "No hay registro pendiente para este email" });
    }

    if (pending.code !== code) {
      return res.status(400).json({ error: "Código inválido" });
    }

    // Crear usuario en DB
    const hashedPassword = await bcrypt.hash(pending.data.password, 10);
    const newUser = await manager.addUser({ ...pending.data, password: hashedPassword });

    // Limpiar memoria
    delete pendingRegistrations[email];

    res.status(201).json({
      message: "Registro exitoso",
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        telefono: newUser.telefono,
        role: newUser.role,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /login -> Login normal
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    const user = await manager.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "2h" });

    res.json({
      message: "Login exitoso",
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /profile/:id -> Proteger con JWT
router.get("/profile/:id", authenticateToken, async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Acceso denegado" });
    }

    const user = await manager.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
});

// GET /users -> Solo admin
router.get("/users", authenticateToken, isAdmin, async (req, res, next) => {
  try {
    const users = await manager.getUsers();
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);
    res.json(usersWithoutPasswords);
  } catch (error) {
    next(error);
  }
});

// POST /logout -> Mensaje simple
router.post("/logout", (req, res) => {
  res.json({
    message: "Logout exitoso. Por favor borra el token en el cliente.",
  });
});

export default router;
