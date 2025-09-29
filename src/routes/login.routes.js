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

// Memoria temporal
const pendingRegistrations = {}; // { email: { code, data } }
const pendingPasswords = {}; // { email: { code, verified } }

// ------------------ Registro y verificación ------------------
router.post("/register", async (req, res, next) => {
  try {
    let { email, password, firstName, lastName, telefono } = req.body || {};

    // Validaciones básicas
    if (telefono && !telefono.startsWith("+")) telefono = `+${telefono}`;
    if (!email || !password || !firstName || !lastName || !telefono) {
      console.error("Faltan campos:", req.body);
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    if (!/^\+\d{12,15}$/.test(telefono)) {
      console.error("Teléfono inválido:", telefono);
      return res.status(400).json({ error: "Teléfono inválido, ej: +5491123456789" });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.error("Email inválido:", email);
      return res.status(400).json({ error: "Email inválido" });
    }

    if (password.length < 6) {
      console.error("Contraseña muy corta");
      return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
    }

    // Revisión de usuario existente
    const existingUser = await manager.getUserByEmail(email);
    if (existingUser) {
      console.error("Usuario ya registrado:", email);
      return res.status(409).json({ error: "El email ya está registrado" });
    }

    // Generar código de verificación
    const verificationCode = Math.floor(10000 + Math.random() * 90000).toString();
    const expirationTime = Date.now() + 10 * 60 * 1000; // 10 min

    pendingRegistrations[email] = {
      code: verificationCode,
      expiresAt: expirationTime,
      data: { email, password, firstName, lastName, telefono, role: "user" }
    };

    // Intentar enviar email y capturar error
    try {
      await transporter.sendMail({
        from: process.env.ADMIN_EMAIL_USER,
        to: email,
        subject: "Confirma tu dirección de correo electrónico",
        text: `¡Bienvenido a nuestra plataforma! 🎉\n\nPara completar tu registro, utiliza el siguiente código de verificación:\n\n${verificationCode}\n\nEste código expirará en 10 minutos.\n\nSi no solicitaste este registro, puedes ignorar este mensaje de manera segura.\n\nGracias,\nEl equipo de soporte`,
      });
      console.log("Email enviado a:", email);
    } catch (mailError) {
      console.error("Error enviando email:", mailError);
      // No bloquea el registro, solo loguea
      return res.status(500).json({ error: "No se pudo enviar el email de verificación. Verifique la configuración SMTP" });
    }

    res.status(200).json({ message: "Código de verificación enviado a tu email" });
  } catch (error) {
    console.error("Error en /register:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.post("/verify-code", async (req, res, next) => {
  try {
    const { email, code } = req.body || {};
    if (!email || !code) return res.status(400).json({ error: "Faltan campos requeridos" });

    const pending = pendingRegistrations[email];
    if (!pending) return res.status(400).json({ error: "No hay registro pendiente para este email" });
    if (pending.code !== code) return res.status(400).json({ error: "Código inválido" });

    const hashedPassword = await bcrypt.hash(pending.data.password, 10);
    const newUser = await manager.addUser({ ...pending.data, password: hashedPassword });
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

// ------------------ Login y profile ------------------
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: "Faltan campos requeridos" });

    const user = await manager.getUserByEmail(email);
    if (!user) return res.status(401).json({ error: "Credenciales inválidas" });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ error: "Credenciales inválidas" });

    const tokenPayload = { id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "3h" });

    res.json({
      message: "Login exitoso",
      token,
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/profile/:id", authenticateToken, async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id && req.user.role !== "admin") return res.status(403).json({ error: "Acceso denegado" });
    const user = await manager.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
});

router.get("/users", authenticateToken, isAdmin, async (req, res, next) => {
  try {
    const users = await manager.getUsers();
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);
    res.json(usersWithoutPasswords);
  } catch (error) {
    next(error);
  }
});

router.post("/logout", (req, res) => {
  res.json({ message: "Logout exitoso. Por favor borra el token en el cliente." });
});

// ------------------ Forgot Password ------------------

// POST /forgot-password/send-code -> Enviar código al email
router.post("/forgot-password/send-code", async (req, res, next) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ error: "Email requerido" });

    const user = await manager.getUserByEmail(email);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const code = Math.floor(10000 + Math.random() * 90000).toString();
    pendingPasswords[email] = { code, verified: false };

await transporter.sendMail({
  from: process.env.ADMIN_EMAIL_USER,
  to: email,
  subject: "Recuperación de contraseña - Código de verificación",
  text: `Has solicitado restablecer tu contraseña.\n\nTu código de verificación es:\n\n${code}\n\nEste código expirará en 10 minutos.\n\nSi no solicitaste el restablecimiento de tu contraseña, puedes ignorar este correo de manera segura.\n\nGracias,\nEl equipo de soporte`,
});


    res.status(200).json({ message: "Código enviado a tu email" });
  } catch (error) {
    next(error);
  }
});

// POST /forgot-password/verify-code -> Verificar código
router.post("/forgot-password/verify-code", (req, res, next) => {
  try {
    const { email, code } = req.body || {};
    if (!email || !code) return res.status(400).json({ error: "Faltan campos" });

   const pending = pendingPasswords[email];
	if (!pending) return res.status(400).json({ error: "No hay proceso pendiente" });

	if (pending.expiresAt < Date.now())
	  return res.status(400).json({ error: "El código ha expirado" });

	if (pending.code !== code)
	  return res.status(400).json({ error: "Código inválido" });


    pending.verified = true;
    res.status(200).json({ message: "Código verificado, ya puedes cambiar tu contraseña" });
  } catch (error) {
    next(error);
  }
});

// POST /forgot-password/update -> Actualizar contraseña
router.post("/forgot-password/update", async (req, res, next) => {
  try {
    const { email, newPassword } = req.body || {};
    if (!email || !newPassword) return res.status(400).json({ error: "Faltan campos" });
    if (newPassword.length < 6)
      return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });

    const pending = pendingPasswords[email];
    if (!pending || !pending.verified)
      return res.status(400).json({ error: "No se ha verificado el código" });

    const hashed = await bcrypt.hash(newPassword, 10);
    await manager.updateUserPassword(email, hashed);

    delete pendingPasswords[email];
    res.status(200).json({ message: "Contraseña actualizada con éxito" });
  } catch (error) {
    next(error);
  }
});

export default router;
