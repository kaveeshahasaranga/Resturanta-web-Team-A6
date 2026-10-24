import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import categoryRoutes from './routes/category.routes.js';
import cartRoutes from './routes/cart.routes.js';
import { uploadDir } from './lib/images.js';
import authRoutes        from './routes/auth.routes.js';
import menuRoutes        from './routes/menu.routes.js';
import orderRoutes       from './routes/order.routes.js';
import chefRoutes        from './routes/chef.routes.js';
import contactRoutes     from './routes/contact.routes.js';
import adminRoutes       from './routes/admin.routes.js';

// ─── Load env vars ──────────────────────────────────────────────────────────
dotenv.config();

// ─── Prisma Client (singleton) ──────────────────────────────────────────────
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

// ─── Express App ────────────────────────────────────────────────────────────
export function createApp(database = prisma) {
const app = express();

// ─── Middleware ─────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Attach Prisma to every request ────────────────────────────────────────
app.use((req, _res, next) => {
  req.prisma = database;
  next();
});

app.use('/uploads/menu', express.static(uploadDir, { dotfiles: 'deny', setHeaders(res) { res.setHeader('X-Content-Type-Options', 'nosniff'); } }));
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);

// ─── Routes ─────────────────────────────────────────────────────────────────

app.use('/api/auth',    authRoutes);
app.use('/api/menu',    menuRoutes);
app.use('/api/orders',  orderRoutes);
app.use('/api/chefs',   chefRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin',   adminRoutes);

// ─── Health Check ───────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString(), service: 'FUCHSIUS API' });
});

// ─── 404 Handler ────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  if (err.code === 'P2025') return res.status(404).json({ success: false, message: 'Record not found' });
  if (err.code === 'P2002') return res.status(409).json({ success: false, message: 'Category code already exists' });
  if (err.code === 'P2003') return res.status(409).json({ success: false, message: 'Category is used by menu items. Reassign all items, including archived dishes, before deleting it.' });
  if (err.name === 'MulterError') return res.status(400).json({ success: false, message: err.code === 'LIMIT_FILE_SIZE' ? 'Image must be smaller than 5 MB' : err.message });
  console.error(`[ERROR] ${err.message}`);
  res.status(err.statusCode || err.status || 500).json({
    success: false,
    message: err.statusCode || err.status ? err.message : 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});


return app;
}
export { prisma };
