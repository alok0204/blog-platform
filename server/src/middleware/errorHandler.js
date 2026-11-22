/**
 * Global error handler middleware for INKWELL API.
 * Catches all errors, logs them, and returns a consistent JSON response.
 */
const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Always log errors on the server
  console.error(`[ERROR] ${req.method} ${req.originalUrl} - ${statusCode}: ${message}`);
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    error: statusCode === 500 && process.env.NODE_ENV === 'production'
      ? 'Internal Server Error'
      : message,
  });
};

module.exports = errorHandler;
