import { Router } from 'express';

const router = Router();

// GET /api/chefs
router.get('/', async (req, res, next) => {
  try {
    const chefs = await req.prisma.chef.findMany({ orderBy: { name: 'asc' } });
    res.json({ success: true, data: chefs });
  } catch (err) { next(err); }
});

// GET /api/chefs/:id
router.get('/:id', async (req, res, next) => {
  try {
    const chef = await req.prisma.chef.findUnique({ where: { id: +req.params.id } });
    if (!chef) return res.status(404).json({ success: false, message: 'Chef not found' });
    res.json({ success: true, data: chef });
  } catch (err) { next(err); }
});

// POST /api/chefs
router.post('/', async (req, res, next) => {
  try {
    const { name, title, bio, specialty, image } = req.body;
    if (!name || !title || !bio || !specialty) {
      return res.status(400).json({ success: false, message: 'name, title, bio, and specialty are required' });
    }
    const chef = await req.prisma.chef.create({ data: { name, title, bio, specialty, image } });
    res.status(201).json({ success: true, data: chef });
  } catch (err) { next(err); }
});

// PUT /api/chefs/:id
router.put('/:id', async (req, res, next) => {
  try {
    const { name, title, bio, specialty, image } = req.body;
    const chef = await req.prisma.chef.update({
      where: { id: +req.params.id },
      data: {
        ...(name      && { name }),
        ...(title     && { title }),
        ...(bio       && { bio }),
        ...(specialty && { specialty }),
        ...(image     !== undefined && { image }),
      },
    });
    res.json({ success: true, data: chef });
  } catch (err) { next(err); }
});

// DELETE /api/chefs/:id
router.delete('/:id', async (req, res, next) => {
  try {
    await req.prisma.chef.delete({ where: { id: +req.params.id } });
    res.json({ success: true, message: 'Chef deleted successfully' });
  } catch (err) { next(err); }
});

export default router;
