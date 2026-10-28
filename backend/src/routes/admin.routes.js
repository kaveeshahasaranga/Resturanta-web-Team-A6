import { Router } from 'express';
import { protect, adminOnly } from '../middleware/auth.middleware.js';

const router = Router();

// GET /api/admin/dashboard — aggregate stats (protected with admin access check)
router.get('/dashboard', protect, adminOnly, async (req, res, next) => {
  try {
    const [totalOrders, totalRevenue, pendingOrders, totalMenuItems, unreadMessages] = await Promise.all([
      req.prisma.order.count(),
      req.prisma.order.aggregate({ _sum: { total: true } }),
      req.prisma.order.count({ where: { status: 'PENDING' } }),
      req.prisma.menuItem.count({ where: { deletedAt: null } }),
      req.prisma.contactMessage.count({ where: { isRead: false } }),
    ]);

    res.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue: totalRevenue._sum.total || 0,
        pendingOrders,
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