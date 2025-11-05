const express = require('express');
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const https = require('https');
const http = require('http');
const fs = require('fs');
const cookieParser = require('cookie-parser');

const { connectMongo } = require('./database/db');
const userRoutes = require('./auth/user');
const employeeRoutes = require('./auth/employee');
const { setupEmployees } = require('./scripts/setupEmployees');
const { setCSRFToken, getCSRFToken } = require('./middleware/csrfProtection');
const { apiCSP } = require('./middleware/strictCSP');

const PORT = process.env.PORT || 5000;
const HTTP_PORT = process.env.HTTP_PORT || 8080;

// Middleware to redirect HTTP to HTTPS
// eslint-disable-next-line no-unused-vars
const redirectToHTTPS = (req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https') {
    return res.redirect(301, `https://${req.header('host')}${req.url}`);
  }
  next();
};

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser()); // Parse cookies from requests

// Strict CORS configuration - lock down to specific origins, methods, and headers
app.use(cors({
  origin: function (origin, callback) {
    // Whitelist of allowed origins
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'https://localhost:3000',
      'https://localhost:3000',
      'https://localhost:3001', // Only for development
      'http://localhost:3000', // Allow HTTP for development
      'http://localhost:3001'  // Allow HTTP for development
    ];

    console.log('CORS check - Origin:', origin, 'Allowed origins:', allowedOrigins);
    console.log('NODE_ENV:', process.env.NODE_ENV);

    // In production, be stricter
    if (process.env.NODE_ENV === 'production') {
      if (!origin || !allowedOrigins.includes(origin)) {
        console.log('CORS blocked in production mode:', origin);
        return callback(new Error('Blocked by CORS policy'), false);
      }
    } else {
      // Development: be more permissive with localhost
      if (origin) {
        // Check exact matches first
        if (allowedOrigins.includes(origin)) {
          console.log('CORS allowed - exact match:', origin);
          return callback(null, true);
        }
        // Check localhost pattern
        if (origin.match(/^https?:\/\/(localhost|127\.0\.0\.1):(3000|3001)$/)) {
          console.log('CORS allowed - localhost pattern:', origin);
          return callback(null, true);
        }
        // Block if not matching
        console.log('CORS blocked origin:', origin);
        return callback(new Error('Blocked by CORS policy'), false);
      } else {
        // Allow requests without origin (like server-to-server or tools)
        console.log('CORS allowed - no origin header');
        return callback(null, true);
      }
    }

    callback(null, true);
  },
  credentials: true, // Required for CSRF cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Only allow necessary methods
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-CSRF-Token',
    'CSRF-Token'
  ], // Minimal required headers
  exposedHeaders: ['X-CSRF-Token'], // Expose CSRF token header to client
  maxAge: 300, // Short cache time for preflight (5 minutes)
  optionsSuccessStatus: 204 // Better for legacy browsers
}));

// Enhanced Helmet configuration
app.use(helmet({
  contentSecurityPolicy: false, // We'll use our custom strict CSP
  crossOriginEmbedderPolicy: false, // Disable for API compatibility
  hsts: {
    maxAge: 63072000, // 2 years (recommended by OWASP)
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  frameguard: { action: 'deny' },
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  // Additional security headers
  hidePoweredBy: true, // Hide X-Powered-By header
  ieNoOpen: true, // Set X-Download-Options for IE8+
  dnsPrefetchControl: { allow: false }, // Control DNS prefetching
  permittedCrossDomainPolicies: false // Restrict Flash and PDF cross-domain policies
}));

// Apply our strict CSP for API endpoints
app.use(apiCSP);

// CSRF Token Generation - must be before routes
app.use(setCSRFToken);

// CSRF token endpoint
app.get('/api/csrf-token', getCSRFToken);

//Configure https for SSL traffic encryption
const httpsServer = https.createServer({
  key: fs.readFileSync('keys/privatekey.pem'),
  cert: fs.readFileSync('keys/certificate.pem')
}, app);

// Create HTTP server for redirection
const httpApp = express();

// Apply HTTPS redirect middleware to HTTP server - this handles all routes
httpApp.use((req, res) => {
  // Build the HTTPS URL for redirection
  const httpsUrl = `https://localhost:${PORT}${req.url}`;
  // Validate the URL before redirecting to prevent open redirect attacks
  if (httpsUrl.startsWith(`https://localhost:${PORT}/`)) {
    res.redirect(301, httpsUrl);
  } else {
    // If validation fails, redirect to safe default
    res.redirect(301, `https://localhost:${PORT}/`);
  }
});

const httpServer = http.createServer(httpApp);

// Simple test route
app.get('/', (_, res) => {
  res.json({ message: 'API is running!' });
});

app.use(userRoutes); //User endpoints
app.use(employeeRoutes); //Employee endpoints

//Initiate connection to mongoDB
connectMongo().then(async () => {
  // Setup employee accounts after database connection
  try {
    await setupEmployees();
  } catch (error) {
    console.error('Failed to setup employees:', error.message);
  }
});

//Start the HTTPS server
httpsServer.listen(PORT, () => {
  console.log(`HTTPS Server running on port ${PORT}`);
});

//Start the HTTP server for redirection
httpServer.listen(HTTP_PORT, () => {
  console.log(`HTTP Server running on port ${HTTP_PORT} - redirecting to HTTPS`);
});
