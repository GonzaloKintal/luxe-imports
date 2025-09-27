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
      // Verificar si el error es específicamente por token expirado
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          error: 'Su sesión ha expirado. Por favor, cierre sesión e inicie sesión nuevamente.',
          expired: true
        });
      }
      
      // Otros errores de token (malformado, firma inválida, etc.)
      io.emit('tokenExpired', { 
        message: 'Token inválido. Por favor, inicie sesión nuevamente.',
        timestamp: Date.now()
      });

      return res.status(403).json({ 
        error: 'El token proporcionado no es válido',
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