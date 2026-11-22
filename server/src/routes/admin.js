const express = require('express');
const prisma = require('../db/prisma');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// All admin routes require admin role
router.use(requireAdmin);

// ─── GET /stats ── Admin dashboard statistics ───────────────
router.get('/stats', async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalPosts,
      publishedPosts,
      draftPosts,
      totalComments,
      recentPosts,
      recentComments,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.post.count(),
      prisma.post.count({ where: { status: 'PUBLISHED' } }),
      prisma.post.count({ where: { status: 'DRAFT' } }),
      prisma.comment.count(),

      prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          author: { select: { id: true, name: true, avatarUrl: true } },
          category: { select: { id: true, name: true, slug: true } },
          _count: { select: { comments: true } },
        },
      }),

      prisma.comment.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          author: { select: { id: true, name: true, avatarUrl: true } },
          post: { select: { id: true, title: true, slug: true } },
        },
      }),
    ]);

    return res.json({
      totalUsers,
      totalPosts,
      publishedPosts,
      draftPosts,
      totalComments,
      recentPosts,
      recentComments,
    });
  } catch (err) {
    return next(err);
  }
});

// ─── GET /posts ── List all posts (all users, all statuses) ─
router.get('/posts', async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, Math.min(50, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const where = {};

    if (req.query.status) {
      where.status = req.query.status;
    }

    if (req.query.search) {
      where.OR = [
        { title: { contains: req.query.search, mode: 'insensitive' } },
        { content: { contains: req.query.search, mode: 'insensitive' } },
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { id: true, name: true, avatarUrl: true } },
          category: { select: { id: true, name: true, slug: true } },
          _count: { select: { comments: true } },
        },
      }),
      prisma.post.count({ where }),
    ]);

    return res.json({
      posts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    return next(err);
  }
});

// ─── GET /comments ── List all comments ─────────────────────
router.get('/comments', async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, Math.min(50, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { id: true, name: true, avatarUrl: true } },
          post: { select: { id: true, title: true, slug: true } },
        },
      }),
      prisma.comment.count(),
    ]);

    return res.json({
      comments,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    return next(err);
  }
});

// ─── DELETE /comments/:id ── Delete any comment ─────────────
router.delete('/comments/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found.' });
    }

    await prisma.comment.delete({ where: { id } });

    return res.json({ message: 'Comment deleted successfully.' });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
