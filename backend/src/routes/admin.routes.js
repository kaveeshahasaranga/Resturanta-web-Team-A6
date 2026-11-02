import { Router } from 'express';
import { protect, adminOnly } from '../middleware/auth.middleware.js';

const router = Router();

const orderInclude = {
  items: { include: { menuItem: true } },
  user: { select: { id: true, name: true, email: true } },
};

router.get('/orders', protect, adminOnly, async (req, res, next) => {
  try {
    const validStatuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED'];
    const status = req.query.status ? String(req.query.status).toUpperCase() : null;
    if (status && !validStatuses.includes(status)) return res.status(400).json({ success: false, message: `Status must be one of: ${validStatuses.join(', ')}` });
    const orders = await req.prisma.order.findMany({ where: status ? { status } : {}, include: orderInclude, orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: orders, count: orders.length });
  } catch (err) { next(err); }
});

router.get('/orders/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const id = /^[0-9]+$/.test(String(req.params.id)) ? Number(req.params.id) : null;
    if (!id) return res.status(400).json({ success: false, message: 'Order id must be a positive integer' });
    const order = await req.prisma.order.findUnique({ where: { id }, include: orderInclude });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: order });
  } catch (err) { next(err); }
});

router.patch('/orders/:id/status', protect, adminOnly, async (req, res, next) => {
  try {
    const id = /^[0-9]+$/.test(String(req.params.id)) ? Number(req.params.id) : null;
    const validStatuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED'];
    if (!id) return res.status(400).json({ success: false, message: 'Order id must be a positive integer' });
    if (!validStatuses.includes(req.body.status)) return res.status(400).json({ success: false, message: `Status must be one of: ${validStatuses.join(', ')}` });
    const order = await req.prisma.order.update({ where: { id }, data: { status: req.body.status }, include: orderInclude });
    res.json({ success: true, data: order });
  } catch (err) { next(err); }
});

// GET /api/admin/dashboard — aggregate stats (protected with admin access check)
router.get('/dashboard', protect, adminOnly, async (req, res, next) => {
  try {
    const colomboDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Colombo' }).format(new Date());
    const today = new Date(`${colomboDate}T00:00:00+05:30`);
    const [totalOrders, revenue, pendingOrders, totalMenuItems, unreadMessages, todayOrders, countsByStatus] = await Promise.all([
      req.prisma.order.count(),
      req.prisma.order.aggregate({ where: { status: { not: 'CANCELLED' } }, _sum: { total: true }, _avg: { total: true } }),
      req.prisma.order.count({ where: { status: 'PENDING' } }),
      req.prisma.menuItem.count({ where: { deletedAt: null } }),
      req.prisma.contactMessage.count({ where: { isRead: false } }),
      req.prisma.order.count({ where: { createdAt: { gte: today } } }),
      req.prisma.order.groupBy({ by: ['status'], _count: { _all: true } }),
    ]);

    const orderCountsByStatus = Object.fromEntries(countsByStatus.map(row => [row.status, row._count._all]));

    res.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue: Number(revenue._sum.total || 0),
        averageOrderValue: Number(revenue._avg.total || 0),
        pendingOrders,
        todayOrders,
        orderCountsByStatus,
        totalMenuItems,
        unreadMessages,
      },
    });
  } catch (err) { 
    next(err); 
  }
});



// GET /api/admin/about — Fetch Content for Admin Management
router.get('/about', async (req, res, next) => {
  try {
    const prisma = req.prisma;

    const aboutData = await prisma.aboutContent.findFirst({
      orderBy: { id: 'desc' }
    });

    const pillars = await prisma.culinaryPillar.findMany({
      orderBy: { id: 'asc' }
    });

    const chefs = await prisma.chef.findMany({
      orderBy: { id: 'asc' }
    });

    res.json({
      success: true,
      data: {
        about: aboutData,
        pillars,
        chefs
      }
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/about — Update Home & About Content from Admin Panel
router.post('/about', async (req, res, next) => {
  try {
    const prisma = req.prisma;
    const { section1, pillars, banner } = req.body;

    const updatedAbout = await prisma.aboutContent.upsert({
      where: { id: 1 },
      update: {
        section1Visible: section1?.visible ?? true,
        heroSubNarrative: section1?.heroSubNarrative || "",
        heroImage: section1?.heroImage || "/images/dishes/clay-pot-cooking.jpg",
        activeAmbience: section1?.activeAmbience || "chimney",
        bannerLive: banner?.live ?? true,
        bannerHeadline: banner?.headline || "",
        bannerSubtext: banner?.subtext || "",
        ctaButtonLabel: banner?.ctaLabel || "EXPLORE OUR MENU",
        targetRoute: banner?.ctaRoute || "/menu"
      },
      create: {
        id: 1,
        section1Visible: section1?.visible ?? true,
        heroSubNarrative: section1?.heroSubNarrative || "",
        heroImage: section1?.heroImage || "/images/dishes/clay-pot-cooking.jpg",
        activeAmbience: section1?.activeAmbience || "chimney",
        bannerLive: banner?.live ?? true,
        bannerHeadline: banner?.headline || "",
        bannerSubtext: banner?.subtext || "",
        ctaButtonLabel: banner?.ctaLabel || "EXPLORE OUR MENU",
        targetRoute: banner?.ctaRoute || "/menu"
      }
    });

    if (pillars && Array.isArray(pillars)) {
      for (const pillar of pillars) {
        if (pillar.id) {
          await prisma.culinaryPillar.update({
            where: { id: Number(pillar.id) },
            data: {
              title: pillar.title,
              eyebrow: pillar.eyebrow,
              description: pillar.description,
              subText1: pillar.subText1,
              subText2: pillar.subText2,
              icon: pillar.icon,
              isActive: pillar.isActive ?? true
            }
          });
        }
      }
    }

    res.json({
      success: true,
      message: "Home & About content published successfully!",
      data: updatedAbout
    });
  } catch (error) {
    next(error);
  }
});

export default router;
