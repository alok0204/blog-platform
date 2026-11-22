const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const prisma = require('../db/prisma');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

/**
 * Generate a JWT for a given user.
 */
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

/**
 * Set the JWT as an httpOnly cookie on the response.
 */
function setTokenCookie(res, token) {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('token', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

/**
 * Strip passwordHash from a user object before sending to client.
 */
function sanitizeUser(user) {
  const { passwordHash, ...rest } = user;
  return rest;
}

// ─── POST /register ─────────────────────────────────────────
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validate name
    if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 50) {
      return res.status(400).json({ error: 'Name must be between 2 and 50 characters.' });
    }

    // Validate email
    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    // Validate password
    if (!password || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    }
    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({ error: 'Password must contain at least one uppercase letter.' });
    }
    if (!/[a-z]/.test(password)) {
      return res.status(400).json({ error: 'Password must contain at least one lowercase letter.' });
    }
    if (!/[0-9]/.test(password)) {
      return res.status(400).json({ error: 'Password must contain at least one number.' });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase(),
        passwordHash,
      },
    });

    // Generate token and set cookie
    const token = generateToken(user);
    setTokenCookie(res, token);

    return res.status(201).json({ user: sanitizeUser(user) });
  } catch (err) {
    return next(err);
  }
});

// ─── POST /login ────────────────────────────────────────────
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Compare password
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Generate token and set cookie
    const token = generateToken(user);
    setTokenCookie(res, token);

    return res.json({ user: sanitizeUser(user) });
  } catch (err) {
    return next(err);
  }
});

// ─── POST /logout ───────────────────────────────────────────
router.post('/logout', (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.clearCookie('token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
  });
  return res.json({ message: 'Logged out successfully' });
});

// ─── GET /me ────────────────────────────────────────────────
router.get('/me', authenticate, async (req, res, next) => {
  try {
    if (!req.user) {
      return res.json({ user: null });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        bio: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.json({ user: null });
    }

    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

// ─── POST /admin-setup ─────────────────────────────────────
router.post('/admin-setup', async (req, res, next) => {
  try {
    const { email, setupKey } = req.body;

    if (!email || !setupKey) {
      return res.status(400).json({ error: 'Email and setup key are required.' });
    }

    // Verify setup key
    if (setupKey !== process.env.ADMIN_SETUP_KEY) {
      return res.status(403).json({ error: 'Invalid admin setup key.' });
    }

    // Find user and promote to admin
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) {
      return res.status(404).json({ error: 'User not found with this email.' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { role: 'ADMIN' },
    });

    return res.json({ message: 'User promoted to admin successfully.', user: sanitizeUser(updatedUser) });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
