import { Router } from 'express';
import { adminOnly, optionalAuth, protect } from '../middleware/auth.middleware.js';

const router = Router();
const orderInclude = { items: { include: { menuItem: { include: { category: true } } } } };

// GET /api/orders/mine — current customer's order history.
router.get('/mine', protect, async (req, res, next) => {
  try {
    const orders = await req.prisma.order.findMany({
      where: { userId: req.user.id },
      include: orderInclude,
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: orders, count: orders.length });
  } catch (err) { next(err); }
});

// GET /api/orders/mine/:id — one order from the signed-in customer's history.
router.get('/mine/:id', protect, async (req, res, next) => {
  try {
    const id = /^\d+$/.test(String(req.params.id)) ? Number(req.params.id) : null;
    if (id === null) return res.status(400).json({ success: false, message: 'Order id must be a positive integer' });
    const order = await req.prisma.order.findFirst({ where: { id, userId: req.user.id }, include: orderInclude });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: order });
  } catch (err) { next(err); }
});

// ─── GET /api/orders ─────────────────────────────────────────────────────────
router.get('/', protect, adminOnly, async (req, res, next) => {
  try {
    const { status } = req.query;
    const where = status ? { status: status.toUpperCase() } : {};
    const orders = await req.prisma.order.findMany({
      where,
      include: { items: { include: { menuItem: { include: { category: true } } } }, user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: orders, count: orders.length });
  } catch (err) { next(err); }
});

// ─── GET /api/orders/:id ─────────────────────────────────────────────────────
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const id = /^\d+$/.test(String(req.params.id)) ? Number(req.params.id) : null;
    if (id === null) return res.status(400).json({ success: false, message: 'Order id must be a positive integer' });
    if (!req.user) return res.status(401).json({ success: false, message: 'Sign in to view this order' });
    const order = await req.prisma.order.findUnique({
      where: { id, ...(req.user.role === 'ADMIN' ? {} : { userId: req.user.id }) },
      include: orderInclude,
    });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: order });
  } catch (err) { next(err); }
});

// ─── POST /api/orders ────────────────────────────────────────────────────────
// Body: { customerName, customerEmail, customerPhone?, deliveryAddress?, notes?, items: [{menuItemId, quantity}] }
router.post('/', optionalAuth, async (req, res, next) => {
  try {
    const { customerName, customerEmail, customerPhone, deliveryAddress, notes, items, voucherCode } = req.body;
    if (!customerName?.trim() || !customerEmail?.trim() || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'customerName, customerEmail, and items are required' });
    }

    const normalizedItems = items.map(item => ({ menuItemId: Number(item?.menuItemId), quantity: Number(item?.quantity) }));
    if (normalizedItems.some(item => !Number.isInteger(item.menuItemId) || item.menuItemId < 1 || !Number.isInteger(item.quantity) || item.quantity < 1)) {
      return res.status(400).json({ success: false, message: 'Each item needs a valid menuItemId and positive integer quantity' });
    }
    if (new Set(normalizedItems.map(item => item.menuItemId)).size !== normalizedItems.length) {
      return res.status(400).json({ success: false, message: 'Each menu item must appear only once; combine its quantities' });
    }

    // Fetch prices from DB to avoid price tampering
    const menuItems = await req.prisma.menuItem.findMany({
      where: { id: { in: normalizedItems.map(i => i.menuItemId) }, isAvailable: true },
    });

    const orderItems = normalizedItems.map(item => {
      const dbItem = menuItems.find(m => m.id === item.menuItemId);
      if (!dbItem) throw Object.assign(new Error(`Menu item ${item.menuItemId} not found or unavailable`), { statusCode: 400 });
      const unitPrice = parseFloat(dbItem.price);
      return {
        menuItemId: item.menuItemId,
        quantity:   item.quantity,
        unitPrice,
        totalPrice: unitPrice * item.quantity,
      };
    });

    const subtotal = orderItems.reduce((sum, i) => sum + i.totalPrice, 0);
    const normalizedVoucher = typeof voucherCode === 'string' ? voucherCode.trim().toUpperCase() : '';
    const total = normalizedVoucher === 'HEARTH10' ? subtotal * 0.9 : subtotal;

    const order = await req.prisma.order.create({
      data: {
        customerName, customerEmail, customerPhone, deliveryAddress, notes, total,
        userId: req.user?.id ?? null,
        items: { create: orderItems },
      },
      include: { items: { include: { menuItem: { include: { category: true } } } } },
    });

    res.status(201).json({ success: true, data: order });
  } catch (err) { next(err); }
});

// ─── PATCH /api/orders/:id/status ────────────────────────────────────────────
router.patch('/:id/status', protect, adminOnly, async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['PENDING','CONFIRMED','PREPARING','READY','DELIVERED','CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${validStatuses.join(', ')}` });
    }
    const order = await req.prisma.order.update({
      where: { id: +req.params.id },
      data: { status },
    });
    res.json({ success: true, data: order });
  } catch (err) { next(err); }
});

// ─── DELETE /api/orders/:id ──────────────────────────────────────────────────
router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    await req.prisma.order.delete({ where: { id: +req.params.id } });
    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (err) { next(err); }
});

export default router;
