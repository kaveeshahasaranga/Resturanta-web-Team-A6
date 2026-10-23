import { Router } from 'express';
import { quoteCart } from '../lib/validation.js';
const router = Router();
router.post('/quote', async (req, res, next) => {
  try { res.json({ success: true, data: await quoteCart(req.prisma, req.body.items) }); } catch (e) { next(e); }
});
export default router;
