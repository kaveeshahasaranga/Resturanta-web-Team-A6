import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱  Seeding database with authentic restaurant data...');

  // ─── 1. Admin & Customer Users ─────────────────────────────────────────────
  const adminPassword = await bcrypt.hash('admin123', 10);
  const customerPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@fuchsius.com' },
    update: { password: adminPassword, role: 'ADMIN' },
    create: {
      name: 'Admin User',
      email: 'admin@fuchsius.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅  Admin user ready:', admin.email, '(password: admin123)');

  const customer = await prisma.user.upsert({
    where: { email: 'customer@fuchsius.com' },
    update: { password: customerPassword, role: 'CUSTOMER' },
    create: {
      name: 'Kasun Bandara',
      email: 'customer@fuchsius.com',
      password: customerPassword,
      role: 'CUSTOMER',
    },
  });
  console.log('✅  Customer user ready:', customer.email, '(password: password123)');

  // ─── 2. Categories ─────────────────────────────────────────────────────────
  const categories = [
    { code: 'APPETIZER',   name: 'Appetizers & Starters', description: 'Traditional Ceylon small plates and clay-hearth bites' },
    { code: 'MAIN_COURSE', name: 'Signature Hearth Mains', description: 'Slow-simmered curries and village feasts cooked over embers' },
    { code: 'SPECIAL',     name: "Chef's Hearth Specials", description: 'Lagoon fresh seafood and ceremonial delicacies' },
    { code: 'DESSERT',     name: 'Sweet Heritage Desserts', description: 'Kithul treacle, buffalo curd, and roasted coconut creations' },
    { code: 'BEVERAGE',    name: 'Fresh Island Beverages', description: 'Hand-pressed fruit coolers, spiced iced teas and lime mint elixirs' },
  ];

  for (const cat of categories) {
    await prisma.menuCategory.upsert({
      where: { code: cat.code },
      update: { name: cat.name, description: cat.description },
      create: cat,
    });
  }
  console.log(`✅  ${categories.length} categories seeded`);

  // ─── 3. Menu Items (Hasaranga's Scope) ──────────────────────────────────────
  const dishes = [
    {
      id: 1,
      name: 'Village Clay Pot Feast',
      description: 'Slow-simmered country chicken in a hand-thrown earthenware clay pot over aromatic coconut shell embers. Tempered with green cardamom, roasted goraka, and organic garden turmeric. Served with fragrant red parboiled rice and fresh coconut sambol.',
      price: 1850.00,
      category: 'MAIN_COURSE',
      image: '/images/dishes/clay-pot-cooking.jpg',
      isAvailable: true,
    },
    {
      id: 2,
      name: 'Dutch-Era Heritage Lamprais',
      description: 'The ceremonial Dutch Burgher parcel: fragrant samba rice simmered in rich stock, paired with a slow-cooked four-meat curry, frikkadels (Dutch meatballs), sweet seeni sambol, and ash plantain pahi, wrapped and baked inside a charred banana leaf.',
      price: 1450.00,
      category: 'MAIN_COURSE',
      image: '/images/dishes/lamprais.jpg',
      isAvailable: true,
    },
    {
      id: 3,
      name: 'Fiery Street-Style Kottu Roti',
      description: 'Crisp godamba roti chopped live on an iron griddle with tender chicken, garden leeks, farm eggs, and our signature slow-roasted chilli paste honouring the legendary Galle Face Green night-market recipe.',
      price: 1150.00,
      category: 'MAIN_COURSE',
      image: '/images/dishes/chicken-kottu.jpg',
      isAvailable: true,
    },
    {
      id: 4,
      name: 'Batticaloa Lagoon Crab in Charred Coconut',
      description: 'Wild lagoon crab sourced fresh from eastern brackish waters, braised inside porous clay with scorched coconut cream, hand-ground goraka reduction, and wild cinnamon bark. Broth is deep, fragrant, and profoundly savoury.',
      price: 3200.00,
      category: 'SPECIAL',
      image: '/images/dishes/lagoon-crab.jpg',
      isAvailable: true,
    },
    {
      id: 5,
      name: 'Spiced Jumbo Sea Prawns',
      description: 'Indian Ocean tiger prawns flash-tossed in garlic-infused coconut oil, sun-dried chilli flakes, curry leaves, and freshly squeezed southern lime juice. Served sizzling in a terracotta bowl.',
      price: 2400.00,
      category: 'SPECIAL',
      image: '/images/dishes/sea-prawns.jpg',
      isAvailable: true,
    },
    {
      id: 6,
      name: 'Tender Polos Ambula (Baby Jackfruit Curry)',
      description: 'Young green jackfruit slow-cooked for 12 hours in an ancient clay pot with black roasted curry powder and goraka until meltingly tender. A beloved ancestral highland vegetarian masterpiece.',
      price: 950.00,
      category: 'APPETIZER',
      image: '/images/dishes/polos-ambula.jpg',
      isAvailable: true,
    },
    {
      id: 7,
      name: 'Crispy Spiced Chicken Wings',
      description: 'Free-range chicken drumettes marinated in ground Ceylon spices, honey treacle glaze, and bird’s eye chilli dip. Crisp exterior with succulent hearth-smoked interior.',
      price: 1200.00,
      category: 'APPETIZER',
      image: '/images/dishes/spiced-chicken-wings.jpg',
      isAvailable: true,
    },
    {
      id: 8,
      name: 'Black Pork Curry (Pol Pork)',
      description: 'Tender heritage pork simmered in toasted black curry powder, goraka pulp, garlic, and fresh black peppercorns until the dark, rich gravy clings intimately to every morsel.',
      price: 1650.00,
      category: 'MAIN_COURSE',
      image: '/images/dishes/pol-pork.jpg',
      isAvailable: true,
    },
    {
      id: 9,
      name: 'Seafood Wok Fried Rice',
      description: 'Wok-charred fragrant basmati rice tossed with calamari, lagoon prawns, scrambled egg, scallions, and home-crafted chilli oyster glaze. Accompanied by homemade chilli paste.',
      price: 1550.00,
      category: 'MAIN_COURSE',
      image: '/images/dishes/seafood-fried-rice.jpg',
      isAvailable: true,
    },
    {
      id: 10,
      name: 'Watalappam Soufflé with Kithul Treacle',
      description: 'Decadent spiced coconut custard steamed with dark jaggery, crushed cardamom, and nutmeg, finished with toasted cashew slivers and a drizzle of warm organic Sinharaja kithul treacle.',
      price: 850.00,
      category: 'DESSERT',
      image: '/images/dishes/lamprais.jpg',
      isAvailable: true,
    },
    {
      id: 11,
      name: 'Fresh Ceylon Lime & Mint Cooler',
      description: 'Zesty pressed local key lime juice blended with wild garden spearmint, ginger syrup, soda fizz, and a crystalline pinch of Himalayan rock salt.',
      price: 550.00,
      category: 'BEVERAGE',
      image: '/images/dishes/fresh-lime-juice.jpg',
      isAvailable: true,
    },
  ];

  for (const item of dishes) {
    await prisma.menuItem.upsert({
      where: { id: item.id },
      update: {
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        image: item.image,
        isAvailable: item.isAvailable,
        deletedAt: null,
      },
      create: item,
    });
  }
  console.log(`✅  ${dishes.length} menu items seeded with full details & images`);

  // ─── 4. Chefs ──────────────────────────────────────────────────────────────
  const chefs = [
    {
      id: 1,
      name: 'Rohan Samarasinghe',
      title: 'Executive Head Chef',
      bio: 'Over 22 years mastering open wood-fire cuisine and village clay pot traditions across the southern lowlands of Ceylon.',
      specialty: 'Clay Pot & Wood-Fire Cuisine',
      image: '/images/dishes/chef-asanka.jpg',
    },
    {
      id: 2,
      name: 'Mahinda Jayawardena',
      title: 'Senior Sous Chef',
      bio: 'Master of heritage recipes, Dutch Burgher lamprais preparations, and coastal seafood curries steeped in generations of lore.',
      specialty: 'Heritage & Burgher Recipes',
      image: '/images/dishes/chef-mahinda.jpg',
    },
  ];

  for (const chef of chefs) {
    await prisma.chef.upsert({
      where: { id: chef.id },
      update: chef,
      create: chef,
    });
  }
  console.log(`✅  ${chefs.length} chefs seeded`);

  // ─── 5. Sample Customer Orders ─────────────────────────────────────────────
  const existingOrders = await prisma.order.count();
  if (existingOrders === 0) {
    const order1 = await prisma.order.create({
      data: {
        customerName: 'Nimasha Fernando',
        customerEmail: 'nimasha@example.com',
        customerPhone: '+94 77 123 4567',
        deliveryAddress: '45/2 Ward Place, Colombo 07',
        total: 3300.00,
        status: 'CONFIRMED',
        notes: 'Please pack banana leaf extra tight.',
        userId: customer.id,
        items: {
          create: [
            { menuItemId: 1, quantity: 1, unitPrice: 1850.00, totalPrice: 1850.00 },
            { menuItemId: 2, quantity: 1, unitPrice: 1450.00, totalPrice: 1450.00 },
          ],
        },
      },
    });

    const order2 = await prisma.order.create({
      data: {
        customerName: 'Sahan Wickramasinghe',
        customerEmail: 'sahan@example.com',
        customerPhone: '+94 71 987 6543',
        deliveryAddress: '12 Marine Drive, Kollupitiya',
        total: 3200.00,
        status: 'PREPARING',
        notes: 'Extra spicy crab curry please!',
        items: {
          create: [
            { menuItemId: 4, quantity: 1, unitPrice: 3200.00, totalPrice: 3200.00 },
          ],
        },
      },
    });

    const order3 = await prisma.order.create({
      data: {
        customerName: 'Chamari Atapattu',
        customerEmail: 'chamari@example.com',
        customerPhone: '+94 76 555 1234',
        deliveryAddress: '88 Galle Road, Bambalapitiya',
        total: 2300.00,
        status: 'DELIVERED',
        notes: 'Leave at front reception.',
        items: {
          create: [
            { menuItemId: 3, quantity: 2, unitPrice: 1150.00, totalPrice: 2300.00 },
          ],
        },
      },
    });

    console.log(`✅  3 sample customer orders seeded for admin orders panel`);
  }

  // ─── 6. Sample Contact Messages ────────────────────────────────────────────
  const existingMessages = await prisma.contactMessage.count();
  if (existingMessages === 0) {
    await prisma.contactMessage.createMany({
      data: [
        {
          name: 'Dinesh Chandimal',
          email: 'dinesh@example.com',
          message: 'Can I book a private hearth dining table for 10 guests next Saturday?',
          isRead: false,
        },
        {
          name: 'Anushka Perera',
          email: 'anushka@example.com',
          message: 'The Batticaloa lagoon crab feast was unforgettable! Thank you chef Rohan!',
          isRead: true,
        },
      ],
    });
    console.log(`✅  Sample contact messages seeded`);
  }

  console.log('🎉  All seeding complete! Database is 100% ready for Menu, Cart, Orders & Admin!');
}

main()
  .catch((e) => {
    console.error('❌  Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
