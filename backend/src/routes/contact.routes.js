import { Router } from 'express';
import { protect, adminOnly } from '../middleware/auth.middleware.js';
import { fail, id, text } from '../lib/validation.js';
import { restaurantContactInfo, restaurantLocation } from '../lib/restaurant.js';

const router = Router();

function contactMessageData(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw fail('Request body must be an object');

  const name = text(body.name, 'Name', 191);
  const email = text(body.email, 'Email', 191);
  const message = text(body.message, 'Message', 10000);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw fail('Enter a valid email address');
  return { name, email, message };
}

// GET /api/contact/info
router.get('/info', (_req, res) => {
  res.json({ success: true, data: restaurantContactInfo() });
});

// GET /api/contact/location
router.get('/location', (_req, res) => {
  res.json({ success: true, data: restaurantLocation() });
});

// POST /api/contact
router.post('/', async (req, res, next) => {
  try {
    const contact = await req.prisma.contactMessage.create({ data: contactMessageData(req.body) });
    res.status(201).json({ success: true, data: contact, message: 'Message sent successfully' });
  } catch (err) { next(err); }
});

// GET /api/contact (admin)
router.get('/', protect, adminOnly, async (req, res, next) => {
  try {
    const messages = await req.prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: messages, count: messages.length });
  } catch (err) { next(err); }
});

// PATCH /api/contact/:id/read
router.patch('/:id/read', protect, adminOnly, async (req, res, next) => {
  try {
    const msg = await req.prisma.contactMessage.update({
      where: { id: id(req.params.id) },
      data: { isRead: true },
    });
    res.json({ success: true, data: msg });
  } catch (err) { next(err); }
});

// DELETE /api/contact/:id
router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    await req.prisma.contactMessage.delete({ where: { id: id(req.params.id) } });
    res.json({ success: true, message: 'Message deleted' });
  } catch (err) { next(err); }
});

export default router;
