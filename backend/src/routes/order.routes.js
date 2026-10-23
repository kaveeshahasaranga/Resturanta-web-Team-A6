import { Router } from 'express';
import { quoteCart, text, fail } from '../lib/validation.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';
import jwt from 'jsonwebtoken';

const router = Router();

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
router.get('/:id', async (req, res, next) => {
  try {
    const order = await req.prisma.order.findUnique({
      where: { id: +req.params.id },
      include: { items: { include: { menuItem: true } } },
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
