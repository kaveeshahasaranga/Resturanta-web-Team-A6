import express from 'express';

const router = express.Router();

// GET /api/footer — Fetch Footer details for Customer Side
router.get('/', async (req, res, next) => {
  try {
    const prisma = req.prisma;

    let footer = await prisma.footerContent.findFirst();

   
    if (!footer) {
      footer = {
        brandName: "PRANEETHA",
        tagline: "Authentic Ceylon Hearth & Culinary Heritage.",
        address: "123 Heritage Lane, Colombo, Sri Lanka",
        phone: "+94 11 234 5678",
        email: "concierge@praneetha.com",
        hours: "Tue - Sun: 11:00 AM - 10:00 PM",
        copyright: "© 2026 Praneetha Restaurant. All rights reserved."
      };
    }

    res.json({
      success: true,
      data: footer
    });
  } catch (error) {
    next(error);
  }
});

export default router;