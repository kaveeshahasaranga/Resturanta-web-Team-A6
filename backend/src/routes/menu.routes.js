import { Router } from 'express';

const router = Router();

// ─── GET /api/menu ───────────────────────────────────────────────────────────
router.get('/', async (req, res, next) => {
  try {
    const { category, available } = req.query;
    const where = {};
    if (category)  where.category   = category.toUpperCase();
    if (available !== undefined) where.isAvailable = available === 'true';

    const items = await req.prisma.menuItem.findMany({
      where,
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });
    res.json({ success: true, data: items, count: items.length });
  } catch (err) { next(err); }
});

// ─── GET /api/menu/:id ───────────────────────────────────────────────────────
router.get('/:id', async (req, res, next) => {
  try {
    const item = await req.prisma.menuItem.findUnique({ where: { id: +req.params.id } });
    if (!item) return res.status(404).json({ success: false, message: 'Menu item not found' });
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
});

// ─── POST /api/menu ──────────────────────────────────────────────────────────
router.post('/', async (req, res, next) => {
  try {
    const { name, description, price, category, image, isAvailable } = req.body;
    if (!name || !description || !price || !category) {
      return res.status(400).json({ success: false, message: 'name, description, price, and category are required' });
    }
    const item = await req.prisma.menuItem.create({
      data: { name, description, price: parseFloat(price), category, image, isAvailable },
    });
    res.status(201).json({ success: true, data: item });
  } catch (err) { next(err); }
});

// ─── PUT /api/menu/:id ───────────────────────────────────────────────────────
router.put('/:id', async (req, res, next) => {
  try {
    const { name, description, price, category, image, isAvailable } = req.body;
    const item = await req.prisma.menuItem.update({
      where: { id: +req.params.id },
      data: {
        ...(name        && { name }),
        ...(description && { description }),
        ...(price       && { price: parseFloat(price) }),
        ...(category    && { category }),
        ...(image       !== undefined && { image }),
        ...(isAvailable !== undefined && { isAvailable }),
      },
    });
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
});

// ─── DELETE /api/menu/:id ────────────────────────────────────────────────────
router.delete('/:id', async (req, res, next) => {
  try {
    await req.prisma.menuItem.delete({ where: { id: +req.params.id } });
    res.json({ success: true, message: 'Menu item deleted successfully' });
  } catch (err) { next(err); }
});

export default router;
