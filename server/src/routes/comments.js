const express = require('express');
const prisma = require('../db/prisma');
const { requireAuth } = require('../middleware/auth');
const { sanitizeHtml } = require('../utils/sanitize');

const router = express.Router();

// ─── GET comments for a post ────────────────────────────────
const handleGetComments = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, Math.min(50, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    // Verify post exists
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: { postId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { id: true, name: true, avatarUrl: true } },
        },
      }),
      prisma.comment.count({ where: { postId } }),
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
};

router.get('/posts/:postId/comments', handleGetComments);
router.get('/post/:postId', handleGetComments);
router.get('/:postId', handleGetComments);

// ─── POST create comment ────────────────────────────────────
const handleCreateComment = async (req, res, next) => {
  try {
    const postId = req.params.postId || req.body.postId;
    const { content } = req.body;

    if (!postId) {
      return res.status(400).json({ error: 'Post ID is required to comment.' });
    }

    // Validate content
    if (!content || typeof content !== 'string' || content.trim().length < 1 || content.trim().length > 2000) {
      return res.status(400).json({ error: 'Comment content must be between 1 and 2000 characters.' });
    }

    // Verify post exists and is published
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }
    if (post.status !== 'PUBLISHED') {
      return res.status(400).json({ error: 'Comments can only be added to published posts.' });
    }

    const comment = await prisma.comment.create({
      data: {
        content: sanitizeHtml(content.trim()),
        authorId: req.user.id,
        postId,
      },
      include: {
        author: { select: { id: true, name: true, avatarUrl: true } },
      },
    });

    return res.status(201).json({ comment });
  } catch (err) {
    return next(err);
  }
};

router.post('/posts/:postId/comments', requireAuth, handleCreateComment);
router.post('/', requireAuth, handleCreateComment);

// ─── PUT /:id ── Update a comment ───────────────────────────
router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    // Validate content
    if (!content || typeof content !== 'string' || content.trim().length < 1 || content.trim().length > 2000) {
      return res.status(400).json({ error: 'Comment content must be between 1 and 2000 characters.' });
    }

    // Find comment
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found.' });
    }

    // Verify ownership
    if (comment.authorId !== req.user.id) {
      return res.status(403).json({ error: 'You are not authorized to edit this comment.' });
    }

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { content: sanitizeHtml(content.trim()) },
      include: {
        author: { select: { id: true, name: true, avatarUrl: true } },
      },
    });

    return res.json({ comment: updatedComment });
  } catch (err) {
    return next(err);
  }
});

// ─── DELETE /:id ── Delete a comment ────────────────────────
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;

    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found.' });
    }

    // Verify ownership or admin
    if (comment.authorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'You are not authorized to delete this comment.' });
    }

    await prisma.comment.delete({ where: { id } });

    return res.json({ message: 'Comment deleted successfully.' });
  } catch (err) {
    return next(err);
  }
});

router.handleGetComments = handleGetComments;
router.handleCreateComment = handleCreateComment;

module.exports = router;
