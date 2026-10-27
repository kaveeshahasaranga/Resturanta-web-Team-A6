import express from 'express';

const router = express.Router();


router.get('/', async (req, res, next) => {
  try {
    const prisma = req.prisma;

    const aboutData = await prisma.aboutContent.findFirst({
      orderBy: { id: 'desc' }
    });

    const pillars = await prisma.culinaryPillar.findMany({
      orderBy: { id: 'asc' }
    });

    const chefs = await prisma.chef.findMany({
      where: { isPublic: true },
      orderBy: { id: 'asc' }
    });

    res.json({
      success: true,
      data: {
        about: aboutData,
        pillars,
        chefs
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;