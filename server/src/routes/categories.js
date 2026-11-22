const express = require('express');
const prisma = require('../db/prisma');

const router = express.Router();

// ─── GET / ── List all categories with published post counts ─
router.get('/', async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            posts: {
              where: { status: 'PUBLISHED' },
            },
          },
        },
      },
    });

    return res.json({ categories });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
