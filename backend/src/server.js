import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// ─── Load env vars ──────────────────────────────────────────────────────────
dotenv.config();

// ─── Prisma Client (singleton) ──────────────────────────────────────────────
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

// ─── Express App ────────────────────────────────────────────────────────────
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
  req.prisma = prisma;
  next();
});

// ─── Routes ─────────────────────────────────────────────────────────────────
import authRoutes        from './routes/auth.routes.js';
import menuRoutes        from './routes/menu.routes.js';
import orderRoutes       from './routes/order.routes.js';
import chefRoutes        from './routes/chef.routes.js';
import contactRoutes     from './routes/contact.routes.js';
import adminRoutes       from './routes/admin.routes.js';

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
  console.error(`[ERROR] ${err.stack}`);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ─── Start Server ────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('✅  Prisma connected to database');

    app.listen(PORT, () => {
      console.log(`🚀  FUCHSIUS API running on http://localhost:${PORT}`);
      console.log(`📦  Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('❌  Failed to connect to database:', error);
    process.exit(1);
  }
};

startServer();

// ─── Graceful Shutdown ───────────────────────────────────────────────────────
process.on('SIGINT',  async () => { await prisma.$disconnect(); process.exit(0); });
process.on('SIGTERM', async () => { await prisma.$disconnect(); process.exit(0); });

export { prisma };
