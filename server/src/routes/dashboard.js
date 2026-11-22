const express = require('express');
const prisma = require('../db/prisma');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// All dashboard routes require authentication
router.use(requireAuth);

// ─── GET /stats ── Dashboard stats for current user ─────────
router.get('/stats', async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [totalPosts, publishedPosts, draftPosts, totalComments, recentPosts] = await Promise.all([
      // Total posts by user
      prisma.post.count({ where: { authorId: userId } }),

      // Published posts
      prisma.post.count({ where: { authorId: userId, status: 'PUBLISHED' } }),

      // Draft posts
      prisma.post.count({ where: { authorId: userId, status: 'DRAFT' } }),

      // Total comments on user's posts
      prisma.comment.count({
        where: {
          post: { authorId: userId },
        },
      }),

      // Recent 5 posts (any status)
      prisma.post.findMany({
        where: { authorId: userId },
        orderBy: { updatedAt: 'desc' },
        take: 5,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          _count: { select: { comments: true } },
        },
      }),
    ]);

    return res.json({
      totalPosts,
      publishedPosts,
      draftPosts,
      totalComments,
      recentPosts,
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
