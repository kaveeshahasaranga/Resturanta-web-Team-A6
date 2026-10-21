import { Router } from 'express';

const router = Router();
const itemInclude = { category: { select: { id: true, name: true, slug: true } } };
const normalizeItem = ({ category, ...item }) => ({ ...item, category: category?.slug ?? null, categoryDetails: category ?? null });
const parseId = value => /^\d+$/.test(String(value)) ? Number(value) : null;

async function resolveCategory(prisma, value) {
  const slug = String(value ?? '').trim().toUpperCase();
  if (!slug) return null;
  const name = slug.replaceAll('_', ' ').replace(/\b\w/g, character => character.toUpperCase());
  return prisma.menuCategory.upsert({ where: { slug }, update: {}, create: { slug, name } });
}

// GET /api/menu/categories — category records used by the menu filter.
router.get('/categories', async (req, res, next) => {
  try {
    const categories = await req.prisma.menuCategory.findMany({
      where: { items: { some: { isAvailable: true } } },
      orderBy: { name: 'asc' },
      include: { _count: { select: { items: true } } },
    });
    res.json({ success: true, data: categories, count: categories.length });
  } catch (err) { next(err); }
});

// GET /api/menu/categories/:category — explicit category-filtered menu page.
router.get('/categories/:category', async (req, res, next) => {
  try {
    const slug = req.params.category.trim().toUpperCase();
    const category = await req.prisma.menuCategory.findUnique({ where: { slug } });
    if (!category) return res.status(404).json({ success: false, message: 'Menu category not found' });
    const items = await req.prisma.menuItem.findMany({ where: { categoryId: category.id }, include: itemInclude, orderBy: { name: 'asc' } });
    const data = items.map(normalizeItem);
    res.json({ success: true, data, count: data.length, category });
  } catch (err) { next(err); }
});

// GET /api/menu?category=APPETIZER&available=true
router.get('/', async (req, res, next) => {
  try {
    const { category, available } = req.query;
    const where = {};
    if (category) where.category = { slug: String(category).trim().toUpperCase() };
    if (available !== undefined) {
      if (!['true', 'false'].includes(String(available).toLowerCase())) return res.status(400).json({ success: false, message: 'available must be true or false' });
      where.isAvailable = String(available).toLowerCase() === 'true';
    }
    const items = await req.prisma.menuItem.findMany({ where, include: itemInclude, orderBy: [{ category: { name: 'asc' } }, { name: 'asc' }] });
    const data = items.map(normalizeItem);
    res.json({ success: true, data, count: data.length });
  } catch (err) { next(err); }
});

// GET /api/menu/:id — full food item details, including its category.
router.get('/:id', async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ success: false, message: 'Menu item id must be a positive integer' });
    const item = await req.prisma.menuItem.findUnique({ where: { id }, include: itemInclude });
    if (!item) return res.status(404).json({ success: false, message: 'Menu item not found' });
    res.json({ success: true, data: normalizeItem(item) });
  } catch (err) { next(err); }
});

// POST /api/menu/cart-check — authoritative prices and stock/availability for cart lines.
router.post('/cart-check', async (req, res, next) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ success: false, message: 'items must be a non-empty array' });
    const ids = items.map(item => parseId(item?.menuItemId ?? item?.id));
    const quantities = items.map(item => Number(item?.quantity));
    if (ids.some(id => id === null) || quantities.some(quantity => !Number.isInteger(quantity) || quantity < 1)) {
      return res.status(400).json({ success: false, message: 'Each item needs a valid menuItemId and positive integer quantity' });
    }
    const uniqueIds = [...new Set(ids)];
    const menuItems = await req.prisma.menuItem.findMany({ where: { id: { in: uniqueIds } }, include: itemInclude });
    const byId = new Map(menuItems.map(item => [item.id, item]));
    const data = items.map((item, index) => {
      const menuItem = byId.get(ids[index]);
      return {
        menuItemId: ids[index],
        quantity: quantities[index],
        available: Boolean(menuItem?.isAvailable),
        unitPrice: menuItem ? Number(menuItem.price) : null,
        lineTotal: menuItem ? Number((Number(menuItem.price) * quantities[index]).toFixed(2)) : null,
        item: menuItem ? normalizeItem(menuItem) : null,
        message: !menuItem ? 'Menu item not found' : !menuItem.isAvailable ? 'Menu item is unavailable' : undefined,
      };
    });
    const unavailable = data.filter(line => !line.available).length;
    res.json({ success: true, data, available: unavailable === 0, unavailableCount: unavailable });
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, description, price, category, image, isAvailable } = req.body;
    const numericPrice = Number(price);
    if (!name?.trim() || !description?.trim() || !category || !Number.isFinite(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({ success: false, message: 'name, description, a positive price, and category are required' });
    }
    const menuCategory = await resolveCategory(req.prisma, category);
    const item = await req.prisma.menuItem.create({ data: { name: name.trim(), description: description.trim(), price: numericPrice, categoryId: menuCategory.id, image, ...(isAvailable !== undefined && { isAvailable }) }, include: itemInclude });
    res.status(201).json({ success: true, data: normalizeItem(item) });
  } catch (err) { next(err); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ success: false, message: 'Menu item id must be a positive integer' });
    const { name, description, price, category, image, isAvailable } = req.body;
    if (price !== undefined && (!Number.isFinite(Number(price)) || Number(price) <= 0)) return res.status(400).json({ success: false, message: 'price must be a positive number' });
    const menuCategory = category !== undefined ? await resolveCategory(req.prisma, category) : null;
    const item = await req.prisma.menuItem.update({ where: { id }, data: {
      ...(name !== undefined && { name: String(name).trim() }),
      ...(description !== undefined && { description: String(description).trim() }),
      ...(price !== undefined && { price: Number(price) }),
      ...(menuCategory && { categoryId: menuCategory.id }),
      ...(image !== undefined && { image }),
      ...(isAvailable !== undefined && { isAvailable }),
    }, include: itemInclude });
    res.json({ success: true, data: normalizeItem(item) });
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ success: false, message: 'Menu item id must be a positive integer' });
    await req.prisma.menuItem.delete({ where: { id } });
    res.json({ success: true, message: 'Menu item deleted successfully' });
  } catch (err) { next(err); }
});

export default router;
