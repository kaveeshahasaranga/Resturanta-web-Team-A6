import { Router } from 'express';
import { protect, adminOnly } from '../middleware/auth.middleware.js';
import { fail, id, text } from '../lib/validation.js';

const router = Router();

function chefData(body, partial = false) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw fail('Request body must be an object');

  const data = {};
  for (const [field, max] of Object.entries({ name: 191, title: 191, bio: 10000, specialty: 191 })) {
    if (!partial || body[field] !== undefined) data[field] = text(body[field], field, max);
  }

  if (body.image !== undefined) {
    if (body.image === null || body.image === '') {
      data.image = null;
    } else {
      const image = text(body.image, 'Image URL', 191);
      if (!/^https?:\/\/[^\s]+$/i.test(image) && !/^\/images\/[a-zA-Z0-9_./-]+$/.test(image)) {
        throw fail('Use an HTTP image URL or a path under /images');
      }
      data.image = image;
    }
  }

  if (partial && Object.keys(data).length === 0) throw fail('Provide at least one chef field to update');
  return data;
}

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
    const chef = await req.prisma.chef.findUnique({ where: { id: id(req.params.id) } });
    if (!chef) return res.status(404).json({ success: false, message: 'Chef not found' });
    res.json({ success: true, data: chef });
  } catch (err) { next(err); }
});

// POST /api/chefs
router.post('/', protect, adminOnly, async (req, res, next) => {
  try {
    const chef = await req.prisma.chef.create({ data: chefData(req.body) });
    res.status(201).json({ success: true, data: chef });
  } catch (err) { next(err); }
});

// PUT /api/chefs/:id
router.put('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const chef = await req.prisma.chef.update({
      where: { id: id(req.params.id) },
      data: chefData(req.body, true),
    });
    res.json({ success: true, data: chef });
  } catch (err) { next(err); }
});

// DELETE /api/chefs/:id
router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    await req.prisma.chef.delete({ where: { id: id(req.params.id) } });
    res.json({ success: true, message: 'Chef deleted successfully' });
  } catch (err) { next(err); }
});

export default router;
