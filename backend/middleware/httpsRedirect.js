/**
 * HTTPS Redirect Middleware
 * Forces all HTTP traffic to redirect to HTTPS
 */

const httpsRedirect = (req, res, next) => {
  // Check if the request is already HTTPS
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    return next();
  }

  // In development, allow HTTP
  if (process.env.NODE_ENV === 'development' && req.hostname === 'localhost') {
    return next();
  }

  // Construct HTTPS URL
  const httpsUrl = `https://${req.get('host')}${req.url}`;

  // Redirect with 301 (permanent redirect)
  return res.redirect(301, httpsUrl);
};

module.exports = httpsRedirect;
