import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱  Seeding database...');

  // ─── Admin User ────────────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@fuchsius.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@fuchsius.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅  Admin user created:', admin.email);

  // ─── Chefs ─────────────────────────────────────────────────────────────────
  const chefs = await Promise.all([
    prisma.chef.upsert({
      where: { id: 1 },
      update: {},
      create: {
        name: 'Marco Rossi',
        title: 'Executive Chef',
        bio: 'Award-winning chef with 20 years of experience in Italian and Mediterranean cuisine.',
        specialty: 'Italian & Mediterranean',
        image: '/images/chefs/chef-marco.jpg',
      },
    }),
    prisma.chef.upsert({
      where: { id: 2 },
      update: {},
      create: {
        name: 'Aiko Tanaka',
        title: 'Sous Chef',
        bio: 'Trained in Tokyo and Paris, Aiko blends Eastern and Western culinary traditions.',
        specialty: 'Fusion & Japanese',
        image: '/images/chefs/chef-aiko.jpg',
      },
    }),
  ]);
  console.log(`✅  ${chefs.length} chefs created`);

  for (const [code, name] of [['APPETIZER', 'Appetizers'], ['MAIN_COURSE', 'Signature Mains'], ['SPECIAL', "Chef Specials"], ['DESSERT', 'Desserts'], ['BEVERAGE', 'Beverages']]) {
    await prisma.menuCategory.upsert({ where: { code }, update: {}, create: { code, name } });
  }
  // ─── Menu Items ────────────────────────────────────────────────────────────
  const menuItems = await Promise.all([
    prisma.menuItem.upsert({
      where: { id: 1 },
      update: {},
      create: {
        name: 'Bruschetta al Pomodoro',
        description: 'Toasted sourdough with fresh tomatoes, basil, and extra virgin olive oil.',
        price: 8.99,
        category: 'APPETIZER',
        image: '/images/dishes/polos-ambula.jpg',
      },
    }),
    prisma.menuItem.upsert({
      where: { id: 2 },
      update: {},
      create: {
        name: 'Grilled Salmon Fillet',
        description: 'Atlantic salmon with lemon butter sauce, seasonal vegetables, and wild rice.',
        price: 24.99,
        category: 'MAIN_COURSE',
        image: '/images/dishes/seafood-fried-rice.jpg',
      },
    }),
    prisma.menuItem.upsert({
      where: { id: 3 },
      update: {},
      create: {
        name: 'Tiramisu Classico',
        description: 'Traditional Italian dessert with mascarpone, espresso-soaked ladyfingers.',
        price: 9.99,
        category: 'DESSERT',
        image: '/images/dishes/lamprais.jpg',
      },
    }),
    prisma.menuItem.upsert({
      where: { id: 4 },
      update: {},
      create: {
        name: 'Craft Orange Lemonade',
        description: 'Fresh-squeezed lemon and orange juice with a hint of mint.',
        price: 5.99,
        category: 'BEVERAGE',
        image: '/images/dishes/fresh-lime-juice.jpg',
      },
    }),
  ]);
  console.log(`✅  ${menuItems.length} menu items created`);

  console.log('🎉  Seeding complete!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
