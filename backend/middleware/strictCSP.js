/**
 * Strict Content Security Policy Middleware
 * Generates nonces and implements strict CSP rules
 */

const crypto = require('crypto');

/**
 * Generate cryptographically secure nonce
 */
const generateNonce = () => {
  return crypto.randomBytes(16).toString('base64');
};

/**
 * CSP Middleware with nonce generation
 */
const strictCSP = (req, res, next) => {
  // Generate nonces for this request
  const scriptNonce = generateNonce();
  const styleNonce = generateNonce();

  // Store nonces in res.locals for template access
  res.locals.scriptNonce = scriptNonce;
  res.locals.styleNonce = styleNonce;

  // Strict Content Security Policy
  const cspDirectives = [
    'default-src \'none\'',
    'base-uri \'self\'',
    `script-src 'self' 'nonce-${scriptNonce}' 'strict-dynamic'`,
    `style-src 'self' 'nonce-${styleNonce}'`,
    'img-src \'self\' data: https:',
    'font-src \'self\'',
    'connect-src \'self\'',
    'media-src \'self\'',
    'object-src \'none\'',
    'child-src \'none\'',
    'frame-src \'none\'',
    'worker-src \'none\'',
    'frame-ancestors \'none\'',
    'form-action \'self\'',
    'block-all-mixed-content',
    'upgrade-insecure-requests',
    'require-trusted-types-for \'script\''
  ].join('; ');

  res.setHeader('Content-Security-Policy', cspDirectives);

  // Additional security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  next();
};

/**
 * API-specific CSP for JSON responses
 */
const apiCSP = (req, res, next) => {
  const cspDirectives = [
    'default-src \'none\'',
    'frame-ancestors \'none\'',
    'block-all-mixed-content'
  ].join('; ');

  res.setHeader('Content-Security-Policy', cspDirectives);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');

  next();
};

module.exports = {
  strictCSP,
  apiCSP,
  generateNonce
};
