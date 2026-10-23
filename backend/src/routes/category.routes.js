import { Router } from 'express';
import { protect, adminOnly } from '../middleware/auth.middleware.js';
import { id, text, fail } from '../lib/validation.js';
const router = Router();
router.get('/', async (req, res, next) => {
  try { res.json({ success: true, data: await req.prisma.menuCategory.findMany({ orderBy: { name: 'asc' } }) }); } catch (e) { next(e); }
});
function categoryData(body, partial = false) {
  const data = {};
  if (!partial || body.name !== undefined) data.name = text(body.name, 'Category name', 100);
  if (!partial || body.code !== undefined) {
    data.code = text(body.code, 'Category code', 64).toUpperCase();
    if (!/^[A-Z][A-Z0-9_]*$/.test(data.code)) throw fail('Category code must start with a letter and contain letters, numbers or underscores');
  }
  if (body.description !== undefined) data.description = body.description === null || body.description === '' ? null : text(body.description, 'Description');
  return data;
}
router.post('/', protect, adminOnly, async (req, res, next) => {
  try { res.status(201).json({ success: true, data: await req.prisma.menuCategory.create({ data: categoryData(req.body) }) }); } catch (e) { next(e); }
});
router.put('/:id', protect, adminOnly, async (req, res, next) => {
  try { res.json({ success: true, data: await req.prisma.menuCategory.update({ where: { id: id(req.params.id) }, data: categoryData(req.body, true) }) }); } catch (e) { next(e); }
});
router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    // The foreign key also prevents races with new dishes using this category.
    await req.prisma.menuCategory.delete({ where: { id: id(req.params.id) } });
    res.json({ success: true, message: 'Category deleted' });
  } catch (e) { next(e); }
});
export default router;
