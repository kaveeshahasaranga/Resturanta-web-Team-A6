import { Router } from 'express';
import { protect, adminOnly } from '../middleware/auth.middleware.js';
import { id, text, price, boolean, fail, publicItem, includeCategory } from '../lib/validation.js';
import { upload, saveImage, removeImage } from '../lib/images.js';
const router = Router();
async function findItem(req) {
  const item = await req.prisma.menuItem.findFirst({ where: { id: id(req.params.id), deletedAt: null }, include: includeCategory });
  if (!item) throw fail('Menu item not found', 404);
  return item;
}
async function dataFor(req, partial = false) {
  const body = req.body, data = {};
  if (!partial || body.name !== undefined) data.name = text(body.name, 'Name', 191);
  if (!partial || body.description !== undefined) data.description = text(body.description, 'Description');
  if (!partial || body.price !== undefined) data.price = price(body.price);
  if (!partial || body.category !== undefined) {
    data.category = text(body.category, 'Category', 64).toUpperCase();
    if (!await req.prisma.menuCategory.findUnique({ where: { code: data.category } })) throw fail('Category not found');
  }
  if (body.isAvailable !== undefined) data.isAvailable = boolean(body.isAvailable);
  if (body.image !== undefined) {
    if (!body.image) data.image = null;
    else {
      const image = text(body.image, 'Image URL', 191);
      if (!/^https?:\/\/[^\s]+$/i.test(image) && !/^\/images\/[a-zA-Z0-9_./-]+$/.test(image)) throw fail('Use an HTTP image URL or upload an image');
      data.image = image;
    }
  }
  return data;
}
router.get('/', async (req, res, next) => {
  try {
    const { category, available, search } = req.query;
    const where = { deletedAt: null };
    if (category !== undefined) where.category = text(category, 'Category', 64).toUpperCase();
    if (available !== undefined) {
      if (!['true', 'false'].includes(available)) throw fail('available must be true or false');
      where.isAvailable = available === 'true';
    }
    if (search) { const q = text(search, 'Search', 100); where.OR = [{ name: { contains: q } }, { description: { contains: q } }]; }
    const items = await req.prisma.menuItem.findMany({ where, include: includeCategory, orderBy: [{ category: 'asc' }, { name: 'asc' }] });
    res.json({ success: true, data: items.map(publicItem), count: items.length });
  } catch (e) { next(e); }
});
router.get('/:id', async (req, res, next) => {
  try { res.json({ success: true, data: publicItem(await findItem(req)) }); } catch (e) { next(e); }
});
router.post('/', protect, adminOnly, async (req, res, next) => {
  try { res.status(201).json({ success: true, data: publicItem(await req.prisma.menuItem.create({ data: await dataFor(req), include: includeCategory })) }); } catch (e) { next(e); }
});
router.put('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const old = await findItem(req), data = await dataFor(req, true);
    const item = await req.prisma.menuItem.update({ where: { id: old.id }, data, include: includeCategory });
    if (data.image !== undefined && old.image !== data.image) await removeImage(old.image);
    res.json({ success: true, data: publicItem(item) });
  } catch (e) { next(e); }
});
router.patch('/:id/availability', protect, adminOnly, async (req, res, next) => {
  try {
    const old = await findItem(req);
    const item = await req.prisma.menuItem.update({ where: { id: old.id }, data: { isAvailable: boolean(req.body.isAvailable) }, include: includeCategory });
    res.json({ success: true, data: publicItem(item) });
  } catch (e) { next(e); }
});
router.post('/:id/image', protect, adminOnly, upload, async (req, res, next) => {
  let image;
  try {
    const old = await findItem(req);
    image = await saveImage(req.file);
    const item = await req.prisma.menuItem.update({ where: { id: old.id }, data: { image }, include: includeCategory });
    await removeImage(old.image);
    res.json({ success: true, data: publicItem(item) });
  } catch (e) { if (image) await removeImage(image); next(e); }
});
router.delete('/:id/image', protect, adminOnly, async (req, res, next) => {
  try {
    const old = await findItem(req);
    const item = await req.prisma.menuItem.update({ where: { id: old.id }, data: { image: null }, include: includeCategory });
    await removeImage(old.image);
    res.json({ success: true, data: publicItem(item) });
  } catch (e) { next(e); }
});
router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const old = await findItem(req);
    // Archive to preserve historical order item references.
    await req.prisma.menuItem.update({ where: { id: old.id }, data: { deletedAt: new Date(), isAvailable: false, image: null } });
    await removeImage(old.image);
    res.json({ success: true, message: 'Menu item deleted' });
  } catch (e) { next(e); }
});
export default router;
