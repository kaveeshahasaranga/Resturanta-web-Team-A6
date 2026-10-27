import { Router } from 'express';
import { adminOnly, protect } from '../middleware/auth.middleware.js';

const router = Router();
router.use(protect, adminOnly);

const orderInclude = {
  items: { include: { menuItem: { include: { category: true } } } },
  user: { select: { id: true, name: true, email: true } },
};

// GET /api/admin/orders — filterable admin order management list.
router.get('/orders', async (req, res, next) => {
  try {
    const { status } = req.query;
    const validStatuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED'];
    if (status && !validStatuses.includes(String(status).toUpperCase())) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${validStatuses.join(', ')}` });
    }
    const orders = await req.prisma.order.findMany({
      where: status ? { status: String(status).toUpperCase() } : {},
      include: orderInclude,
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: orders, count: orders.length });
  } catch (err) { next(err); }
});

// GET /api/admin/orders/:id — full order and line item details.
router.get('/orders/:id', async (req, res, next) => {
  try {
    const id = /^\d+$/.test(String(req.params.id)) ? Number(req.params.id) : null;
    if (id === null) return res.status(400).json({ success: false, message: 'Order id must be a positive integer' });
    const order = await req.prisma.order.findUnique({ where: { id }, include: orderInclude });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: order });
  } catch (err) { next(err); }
});

// PATCH /api/admin/orders/:id/status — admin-only status changes.
router.patch('/orders/:id/status', async (req, res, next) => {
  try {
    const id = /^\d+$/.test(String(req.params.id)) ? Number(req.params.id) : null;
    const { status } = req.body;
    const validStatuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED'];
    if (id === null) return res.status(400).json({ success: false, message: 'Order id must be a positive integer' });
    if (!validStatuses.includes(status)) return res.status(400).json({ success: false, message: `Status must be one of: ${validStatuses.join(', ')}` });
    const order = await req.prisma.order.update({ where: { id }, data: { status }, include: orderInclude });
    res.json({ success: true, data: order });
  } catch (err) { next(err); }
});

// GET /api/admin/dashboard — aggregate stats
router.get('/dashboard', async (req, res, next) => {
  try {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const [totalOrders, revenue, pendingOrders, totalMenuItems, unreadMessages, todayOrders, countsByStatus] = await Promise.all([
      req.prisma.order.count(),
      req.prisma.order.aggregate({ where: { status: { not: 'CANCELLED' } }, _sum: { total: true }, _avg: { total: true } }),
      req.prisma.order.count({ where: { status: 'PENDING' } }),
      req.prisma.menuItem.count(),
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
  } catch (err) { next(err); }
});

export default router;
