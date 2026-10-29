import { Router } from 'express';
import { protect, adminOnly } from '../middleware/auth.middleware.js';
import { fail, id, text } from '../lib/validation.js';
import {
  defaultRestaurantSettings,
  restaurantContactInfo,
  restaurantLocation,
} from '../lib/restaurant.js';

const router = Router();

function contactMessageData(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw fail('Request body must be an object');

  const name = text(body.name, 'Name', 191);
  const email = text(body.email, 'Email', 191);
  const message = text(body.message, 'Message', 10000);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw fail('Enter a valid email address');
  return { name, email, message };
}

function restaurantSettingsData(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw fail('Request body must be an object');
  const name = text(body.name, 'Restaurant name', 191);
  const address = text(body.address, 'Address', 500);
  const email = text(body.email, 'Email', 191);
  const phone = text(body.phone, 'Phone', 50);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw fail('Enter a valid email address');

  let mapUrl = null;
  if (body.mapUrl !== undefined && body.mapUrl !== null && body.mapUrl !== '') {
    mapUrl = text(body.mapUrl, 'Map URL', 1000);
    let parsed;
    try { parsed = new URL(mapUrl); } catch { throw fail('Enter a valid HTTPS map URL'); }
    if (parsed.protocol !== 'https:' || !['google.com', 'www.google.com', 'maps.google.com', 'maps.app.goo.gl'].includes(parsed.hostname)) {
      throw fail('Map URL must be a secure Google Maps link');
    }
  }
  return { name, address, email, phone, mapUrl };
}

async function getRestaurantSettings(db) {
  return await db.restaurantSettings.findUnique({ where: { id: 1 } }) || defaultRestaurantSettings;
}

// GET /api/contact/info
router.get('/info', async (req, res, next) => {
  try {
    res.json({ success: true, data: restaurantContactInfo(await getRestaurantSettings(req.prisma)) });
  } catch (err) { next(err); }
});

// GET /api/contact/location
router.get('/location', async (req, res, next) => {
  try {
    res.json({ success: true, data: restaurantLocation(await getRestaurantSettings(req.prisma)) });
  } catch (err) { next(err); }
});

// PUT /api/contact/settings (admin)
router.get('/settings', protect, adminOnly, async (req, res, next) => {
  try {
    const settings = await getRestaurantSettings(req.prisma);
    res.json({
      success: true,
      data: {
        name: settings.name,
        address: settings.address,
        email: settings.email,
        phone: settings.phone,
        mapUrl: settings.mapUrl || '',
      },
    });
  } catch (err) { next(err); }
});

router.put('/settings', protect, adminOnly, async (req, res, next) => {
  try {
    const data = restaurantSettingsData(req.body);
    const settings = await req.prisma.restaurantSettings.upsert({
      where: { id: 1 },
      create: { id: 1, ...data },
      update: data,
    });
    res.json({
      success: true,
      data: {
        name: settings.name,
        address: settings.address,
        email: settings.email,
        phone: settings.phone,
        mapUrl: settings.mapUrl || '',
      },
    });
  } catch (err) { next(err); }
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

// POST /api/contact/:id/reply (admin)
router.post('/:id/reply', protect, adminOnly, async (req, res, next) => {
  try {
    const reply = text(req.body?.reply, 'Reply', 10000);
    const msg = await req.prisma.contactMessage.update({
      where: { id: id(req.params.id) },
      data: { reply, repliedAt: new Date(), isRead: true },
    });
    res.json({ success: true, data: msg, message: 'Reply saved; open the email draft to send it' });
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
