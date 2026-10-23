import { createApp, prisma } from './app.js';
const app = createApp();
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

