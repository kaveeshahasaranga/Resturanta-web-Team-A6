import { Router } from 'express';
import { quoteCart, text, fail } from '../lib/validation.js';
import { protect, adminOnly, customerOnly, optionalAuth } from '../middleware/auth.middleware.js';
import jwt from 'jsonwebtoken';

const router = Router();
const orderInclude = { items: { include: { menuItem: true } } };

// Customer order history and single-order access are always scoped to the token owner.
router.get('/mine', protect, customerOnly, async (req, res, next) => {
  try {
    const orders = await req.prisma.order.findMany({
      where: { userId: req.user.id },
      include: orderInclude,
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: orders, count: orders.length });
  } catch (err) { next(err); }
});

router.get('/mine/:id', protect, customerOnly, async (req, res, next) => {
  try {
    const id = /^[0-9]+$/.test(String(req.params.id)) ? Number(req.params.id) : null;
    if (!id) return res.status(400).json({ success: false, message: 'Order id must be a positive integer' });
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
      include: { items: { include: { menuItem: true } }, user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: orders, count: orders.length });
  } catch (err) { next(err); }
});

// ─── GET /api/orders/:id ─────────────────────────────────────────────────────
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const id = /^[0-9]+$/.test(String(req.params.id)) ? Number(req.params.id) : null;
    if (!id) return res.status(400).json({ success: false, message: 'Order id must be a positive integer' });
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
router.post('/', async (req, res, next) => {
  try {
    const customerName = text(req.body.customerName, 'Customer name', 191);
    const customerEmail = text(req.body.customerEmail, 'Email', 191);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) throw fail('Invalid email');
    const optional = field => req.body[field] == null || req.body[field] === '' ? null : text(req.body[field], field, field === 'customerPhone' ? 40 : 10000);
    let userId = null;
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      try { userId = jwt.verify(token, process.env.JWT_SECRET).id; } catch { throw fail('Invalid or expired session. Please sign in again.', 401); }
    }
    const order = await req.prisma.$transaction(async db => {
      const quote = await quoteCart(db, req.body.items);
      if (!quote.canCheckout) throw fail('Some dishes are unavailable. Please refresh your cart.', 409);
      return db.order.create({
        data: {
          customerName, customerEmail, customerPhone: optional('customerPhone'), deliveryAddress: optional('deliveryAddress'), notes: optional('notes'), userId,
          total: quote.total,
          items: { create: quote.items.map(({ menuItemId, quantity, unitPrice, totalPrice }) => ({ menuItemId, quantity, unitPrice, totalPrice })) },
        },
        include: { items: { include: { menuItem: true } } },
      });
    }, { isolationLevel: 'Serializable' });

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
