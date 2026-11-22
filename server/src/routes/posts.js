const express = require('express');
const slugify = require('slugify');
const crypto = require('crypto');
const prisma = require('../db/prisma');
const { authenticate, requireAuth } = require('../middleware/auth');
const { sanitizeHtml } = require('../utils/sanitize');
const commentsRouter = require('./comments');

const router = express.Router();

/**
 * Generate a unique slug from a title.
 * If the slug already exists, append a random 4-character suffix.
 */
async function generateUniqueSlug(title) {
  let slug = slugify(title, { lower: true, strict: true });

  const existing = await prisma.post.findUnique({ where: { slug } });
  if (existing) {
    const suffix = crypto.randomBytes(2).toString('hex'); // 4 hex chars
    slug = `${slug}-${suffix}`;
  }

  return slug;
}

// ─── GET / ── Public: list published posts ──────────────────
router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, Math.min(50, parseInt(req.query.limit) || 9));
    const skip = (page - 1) * limit;

    const { search, category, tag, author } = req.query;

    // Build the where clause
    const where = { status: 'PUBLISHED' };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = { slug: category };
    }

    if (tag) {
      where.tags = {
        some: {
          tag: { slug: tag },
        },
      };
    }

    if (author) {
      where.authorId = author;
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
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

// ─── GET /my (and /my/posts) ── Current user's posts (all statuses) ─
const handleMyPosts = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, Math.min(50, parseInt(req.query.limit) || 9));
    const skip = (page - 1) * limit;

    const where = { authorId: req.user.id };

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
        orderBy: { updatedAt: 'desc' },
        include: {
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
};

router.get('/my', requireAuth, handleMyPosts);
router.get('/my/posts', requireAuth, handleMyPosts);

// ─── Nested Post Comments ───────────────────────────────────
router.get('/:postId/comments', commentsRouter.handleGetComments);
router.post('/:postId/comments', requireAuth, commentsRouter.handleCreateComment);

// ─── GET /:slug ── Public: single published post ────────────
router.get('/:slug', authenticate, async (req, res, next) => {
  try {
    const post = await prisma.post.findUnique({
      where: { slug: req.params.slug },
      include: {
        author: { select: { id: true, name: true, avatarUrl: true, bio: true } },
        category: { select: { id: true, name: true, slug: true } },
        tags: {
          include: {
            tag: { select: { id: true, name: true, slug: true } },
          },
        },
        _count: { select: { comments: true } },
      },
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    // If the post is a draft, only the author or an admin can view it
    if (post.status === 'DRAFT') {
      if (!req.user || (req.user.id !== post.authorId && req.user.role !== 'ADMIN')) {
        return res.status(404).json({ error: 'Post not found.' });
      }
    }

    return res.json({ post });
  } catch (err) {
    return next(err);
  }
});

// ─── POST / ── Create a new post ────────────────────────────
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { title, content, excerpt, coverImage, status, categoryId, tagIds } = req.body;

    // Validate title
    if (!title || typeof title !== 'string' || title.trim().length < 1 || title.trim().length > 200) {
      return res.status(400).json({ error: 'Title is required and must be between 1 and 200 characters.' });
    }

    // Validate content
    if (!content || typeof content !== 'string' || content.trim().length < 1) {
      return res.status(400).json({ error: 'Content is required.' });
    }

    // Generate unique slug
    const slug = await generateUniqueSlug(title.trim());

    // Sanitize content
    const sanitizedContent = sanitizeHtml(content);

    // Determine publishedAt
    const postStatus = status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT';
    const publishedAt = postStatus === 'PUBLISHED' ? new Date() : null;

    // Build create data
    const createData = {
      title: title.trim(),
      slug,
      excerpt: excerpt ? excerpt.trim() : null,
      content: sanitizedContent,
      coverImage: coverImage || null,
      status: postStatus,
      publishedAt,
      author: { connect: { id: req.user.id } },
    };

    if (categoryId) {
      createData.category = { connect: { id: categoryId } };
    }

    // Create post
    const post = await prisma.post.create({
      data: createData,
      include: {
        author: { select: { id: true, name: true, avatarUrl: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
    });

    // Connect tags if provided
    if (tagIds && Array.isArray(tagIds) && tagIds.length > 0) {
      await prisma.postTag.createMany({
        data: tagIds.map((tagId) => ({
          postId: post.id,
          tagId,
        })),
        skipDuplicates: true,
      });
    }

    // Fetch the full post with tags
    const fullPost = await prisma.post.findUnique({
      where: { id: post.id },
      include: {
        author: { select: { id: true, name: true, avatarUrl: true } },
        category: { select: { id: true, name: true, slug: true } },
        tags: {
          include: {
            tag: { select: { id: true, name: true, slug: true } },
          },
        },
      },
    });

    return res.status(201).json({ post: fullPost });
  } catch (err) {
    return next(err);
  }
});

// ─── PUT /:id ── Update a post ──────────────────────────────
router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find existing post
    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    // Verify ownership or admin
    if (existing.authorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'You are not authorized to edit this post.' });
    }

    const { title, content, excerpt, coverImage, status, categoryId, tagIds } = req.body;

    // Build update data
    const updateData = {};

    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim().length < 1 || title.trim().length > 200) {
        return res.status(400).json({ error: 'Title must be between 1 and 200 characters.' });
      }
      updateData.title = title.trim();

      // Regenerate slug if title changed
      if (title.trim() !== existing.title) {
        updateData.slug = await generateUniqueSlug(title.trim());
      }
    }

    if (content !== undefined) {
      if (typeof content !== 'string' || content.trim().length < 1) {
        return res.status(400).json({ error: 'Content cannot be empty.' });
      }
      updateData.content = sanitizeHtml(content);
    }

    if (excerpt !== undefined) {
      updateData.excerpt = excerpt ? excerpt.trim() : null;
    }

    if (coverImage !== undefined) {
      updateData.coverImage = coverImage || null;
    }

    if (categoryId !== undefined) {
      updateData.categoryId = categoryId || null;
    }

    if (status !== undefined) {
      updateData.status = status;
      if (status === 'PUBLISHED' && !existing.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    // Update post
    const updatedPost = await prisma.post.update({
      where: { id },
      data: updateData,
      include: {
        author: { select: { id: true, name: true, avatarUrl: true } },
        category: { select: { id: true, name: true, slug: true } },
        tags: {
          include: {
            tag: { select: { id: true, name: true, slug: true } },
          },
        },
      },
    });

    // Update tags if provided
    if (tagIds !== undefined && Array.isArray(tagIds)) {
      // Remove existing tags
      await prisma.postTag.deleteMany({ where: { postId: id } });

      // Add new tags
      if (tagIds.length > 0) {
        await prisma.postTag.createMany({
          data: tagIds.map((tagId) => ({
            postId: id,
            tagId,
          })),
          skipDuplicates: true,
        });
      }

      // Re-fetch to get updated tags
      const refreshed = await prisma.post.findUnique({
        where: { id },
        include: {
          author: { select: { id: true, name: true, avatarUrl: true } },
          category: { select: { id: true, name: true, slug: true } },
          tags: {
            include: {
              tag: { select: { id: true, name: true, slug: true } },
            },
          },
        },
      });
      return res.json({ post: refreshed });
    }

    return res.json({ post: updatedPost });
  } catch (err) {
    return next(err);
  }
});

// ─── DELETE /:id ── Delete a post ───────────────────────────
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    // Verify ownership or admin
    if (post.authorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'You are not authorized to delete this post.' });
    }

    await prisma.post.delete({ where: { id } });

    return res.json({ message: 'Post deleted successfully.' });
  } catch (err) {
    return next(err);
  }
});

const handleTogglePublish = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    // Verify ownership
    if (post.authorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'You are not authorized to change this post\'s status.' });
    }

    let updateData;
    if (post.status === 'DRAFT') {
      updateData = { status: 'PUBLISHED', publishedAt: new Date() };
    } else {
      updateData = { status: 'DRAFT', publishedAt: null };
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: updateData,
      include: {
        author: { select: { id: true, name: true, avatarUrl: true } },
        category: { select: { id: true, name: true, slug: true } },
        tags: {
          include: {
            tag: { select: { id: true, name: true, slug: true } },
          },
        },
      },
    });

    return res.json({ post: updatedPost });
  } catch (err) {
    return next(err);
  }
};

router.patch('/:id/publish', requireAuth, handleTogglePublish);
router.patch('/:id/toggle-publish', requireAuth, handleTogglePublish);

module.exports = router;
