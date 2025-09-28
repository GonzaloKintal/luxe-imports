import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { io } from '../app.js';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      error: 'Token no proporcionado',
      message: 'Debe proporcionar un token de acceso válido'
    });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      // Para cualquier error de token, emitir una sola vez
      io.emit('tokenExpired', { 
        message: err.name === 'TokenExpiredError' ? 'Sesión expirada' : 'Token inválido',
        timestamp: Date.now()
      });

      return res.status(401).json({ 
        error: err.name === 'TokenExpiredError' 
          ? 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.'
          : 'El token proporcionado no es válido',
        expired: true
      });
    }
    
    req.user = user;
    next();
  });
}

export function isAdmin(req, res, next) {
  if (req.user?.role === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      error: 'Acceso denegado',
      message: 'Solo los administradores pueden acceder a este recurso'
    });
  }
}