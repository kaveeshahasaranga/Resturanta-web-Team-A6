import { Router } from 'express';

const router = Router();

// GET /api/admin/dashboard — aggregate stats
router.get('/dashboard', async (req, res, next) => {
  try {
    const [totalOrders, totalRevenue, pendingOrders, totalMenuItems, unreadMessages] = await Promise.all([
      req.prisma.order.count(),
      req.prisma.order.aggregate({ _sum: { total: true } }),
      req.prisma.order.count({ where: { status: 'PENDING' } }),
      req.prisma.menuItem.count(),
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
  } catch (err) { next(err); }
});

export default router;
