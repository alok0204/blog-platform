const jwt = require('jsonwebtoken');

/**
 * Authenticate middleware (optional auth).
 * Reads JWT from "token" cookie or Authorization: Bearer header.
 * Sets req.user = { id, email, role } if valid, or null if no token.
 * Always calls next() — does not block unauthenticated requests.
 */
const authenticate = (req, res, next) => {
  try {
    let token = null;

    // Check cookie first
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // Fall back to Authorization header
    if (!token && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        token = parts[1];
      }
    }

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
    return next();
  } catch (err) {
    // Token invalid or expired — treat as unauthenticated
    req.user = null;
    return next();
  }
};

/**
 * Require authentication middleware.
 * Calls authenticate first, then blocks if no valid user.
 */
const requireAuth = (req, res, next) => {
  authenticate(req, res, (err) => {
    if (err) return next(err);

    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required. Please log in.' });
    }
    return next();
  });
};

/**
 * Require admin role middleware.
 * Calls requireAuth first, then blocks if user is not an ADMIN.
 */
const requireAdmin = (req, res, next) => {
  requireAuth(req, res, (err) => {
    if (err) return next(err);

    // If requireAuth already sent a 401, the response is finished
    if (res.headersSent) return;

    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin access required.' });
    }
    return next();
  });
};

module.exports = { authenticate, requireAuth, requireAdmin };
