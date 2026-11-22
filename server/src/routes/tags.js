const express = require('express');
const prisma = require('../db/prisma');

const router = express.Router();

// ─── GET / ── List all tags with post counts ────────────────
router.get('/', async (req, res, next) => {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });

    return res.json({ tags });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
