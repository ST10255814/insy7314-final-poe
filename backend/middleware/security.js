/**
 * Security Middleware Collection
 * Comprehensive security middleware for the API
 */

const httpsRedirect = require('./httpsRedirect');

/**
 * Security headers middleware for API endpoints
 */
const securityHeaders = (req, res, next) => {
  // Force HTTPS in production
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  }

  // Additional API-specific security headers
  res.setHeader('X-API-Version', '1.0');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');

  next();
};

/**
 * HTTPS enforcement for sensitive endpoints
 */
const requireHTTPS = (req, res, next) => {
  // In production, always require HTTPS
  if (process.env.NODE_ENV === 'production') {
    if (!req.secure && req.get('x-forwarded-proto') !== 'https') {
      return res.status(426).json({
        error: 'HTTPS Required',
        message: 'This endpoint requires a secure connection'
      });
    }
  }

  next();
};

module.exports = {
  httpsRedirect,
  securityHeaders,
  requireHTTPS
};
