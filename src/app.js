import express from 'express';
import http from 'http';
import { Server as SocketIO } from 'socket.io';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import cors from 'cors';

import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import loginRouter from './routes/login.routes.js';
import adminRoutes from './routes/admin.routes.js';
import userRoutes from "./routes/user.routes.js";
import categoriesRouter from './routes/categories.routes.js';
import { errorHandler } from './middlewares/error-handler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const server = http.createServer(app);
const io = new SocketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// WebSocket connection handler
io.on('connection', (socket) => {
  console.log('🟢 Cliente conectado vía WebSocket:', socket.id);
  socket.on('disconnect', () => {
    console.log('🔴 Cliente desconectado:', socket.id);
  });
});

// Export io for use in managers/routes
export { io };


// Middleware
app.use(cors()); 
app.use(express.json());

// Rutas API
app.use("/api/users", userRoutes);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/auth', loginRouter);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoriesRouter);

// Servir front
const clientBuildPath = path.join(__dirname, '../client/dist');
// Servir archivos estáticos
app.use(express.static(clientBuildPath));

// Catch-all para cualquier otra ruta que no sea API
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});



// Error handler
app.use(errorHandler);

// Arrancar servidor
const PORT = process.env.PORT || 3000;
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
    console.log(`🟢 WebSocket activo en http://localhost:${PORT}`);
  });
});
