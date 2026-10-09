import { Router } from 'express';

const router = Router();

// POST /api/contact
router.post('/', async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'name, email, and message are required' });
    }
    const contact = await req.prisma.contactMessage.create({ data: { name, email, message } });
    res.status(201).json({ success: true, data: contact, message: 'Message sent successfully' });
  } catch (err) { next(err); }
});

// GET /api/contact (admin)
router.get('/', async (req, res, next) => {
  try {
    const messages = await req.prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: messages, count: messages.length });
  } catch (err) { next(err); }
});

// PATCH /api/contact/:id/read
router.patch('/:id/read', async (req, res, next) => {
  try {
    const msg = await req.prisma.contactMessage.update({
      where: { id: +req.params.id },
      data: { isRead: true },
    });
    res.json({ success: true, data: msg });
  } catch (err) { next(err); }
});

// DELETE /api/contact/:id
router.delete('/:id', async (req, res, next) => {
  try {
    await req.prisma.contactMessage.delete({ where: { id: +req.params.id } });
    res.json({ success: true, message: 'Message deleted' });
  } catch (err) { next(err); }
});

export default router;
