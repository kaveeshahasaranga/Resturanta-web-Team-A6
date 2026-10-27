import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

// Import Routes
import aboutRoutes from './routes/about.routes.js';
import footerRoutes from './routes/footer.routes.js';
import adminRoutes from './routes/admin.routes.js';

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Attach prisma to request object
app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

// Register Routes 
app.use('/api/about', aboutRoutes);
app.use('/api/footer', footerRoutes);
app.use('/api/admin', adminRoutes);

// Root test route
app.get('/', (req, res) => {
  res.json({ success: true, message: 'FUCHSIUS API is running successfully!' });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: `Route ${req.path} not found` });
});

// Start Server & Connect Database
const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Prisma connected to database');

    app.listen(PORT, () => {
      console.log(`🚀 FUCHSIUS API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to database:', error);
    process.exit(1);
  }
};

startServer();

// Graceful Shutdown
process.on('SIGINT', async () => { 
  await prisma.$disconnect(); 
  process.exit(0); 
});
process.on('SIGTERM', async () => { 
  await prisma.$disconnect(); 
  process.exit(0); 
});