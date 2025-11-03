const express = require('express')
const app = express()
const cors = require('cors')
const helmet = require('helmet')
const https = require('https')
const http = require('http')
const fs = require('fs')
const cookieParser = require('cookie-parser')

const { connectMongo } = require('./database/db')
const userRoutes = require('./auth/user')
const { setCSRFToken, getCSRFToken } = require('./middleware/csrfProtection')
const { apiCSP } = require('./middleware/strictCSP')

const PORT = process.env.PORT || 5000
const HTTP_PORT = process.env.HTTP_PORT || 8080

// Middleware to redirect HTTP to HTTPS
const redirectToHTTPS = (req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
        return res.redirect(301, `https://${req.header('host')}${req.url}`)
    }
    next()
}

app.use(express.json({ limit: '10mb' }))
app.use(cookieParser()) // Parse cookies from requests

// Strict CORS configuration - lock down to specific origins, methods, and headers
app.use(cors({
    origin: function (origin, callback) {
        // Whitelist of allowed origins
        const allowedOrigins = [
            process.env.FRONTEND_URL || 'https://localhost:3000',
            'https://localhost:3001' // Only for development
        ]
        
        // In production, be stricter
        if (process.env.NODE_ENV === 'production') {
            if (!origin || !allowedOrigins.includes(origin)) {
                return callback(new Error('Blocked by CORS policy'), false)
            }
        } else {
            // Development: still validate but allow localhost variations
            if (origin && !allowedOrigins.includes(origin) && 
                !origin.match(/^https?:\/\/(localhost|127\.0\.0\.1):(3000|3001)$/)) {
                return callback(new Error('Blocked by CORS policy'), false)
            }
        }
        
        callback(null, true)
    },
    credentials: true, // Required for CSRF cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Only allow necessary methods
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-CSRF-Token',
        'CSRF-Token'
    ], // Minimal required headers
    exposedHeaders: [], // Don't expose any headers
    maxAge: 300, // Short cache time for preflight (5 minutes)
    optionsSuccessStatus: 204 // Better for legacy browsers
}))

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
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    // Additional security headers
    hidePoweredBy: true, // Hide X-Powered-By header
    ieNoOpen: true, // Set X-Download-Options for IE8+
    dnsPrefetchControl: { allow: false }, // Control DNS prefetching
    permittedCrossDomainPolicies: false // Restrict Flash and PDF cross-domain policies
}))

// Apply our strict CSP for API endpoints
app.use(apiCSP)

// CSRF Token Generation - must be before routes
app.use(setCSRFToken)

// CSRF token endpoint
app.get('/api/csrf-token', getCSRFToken)

//Configure https for SSL traffic encryption
const httpsServer = https.createServer({
    key: fs.readFileSync('keys/privatekey.pem'),
    cert: fs.readFileSync('keys/certificate.pem')
}, app)

// Create HTTP server for redirection
const httpApp = express()

// Apply HTTPS redirect middleware to HTTP server - this handles all routes
httpApp.use((req, res) => {
    const httpsUrl = `https://${req.header('host') || 'localhost'}:${PORT}${req.url}`
    res.redirect(301, httpsUrl)
})

const httpServer = http.createServer(httpApp)

// Simple test route
app.get('/', (_, res) => {
    res.json({ message: 'API is running!' });
});

app.use(userRoutes) //User endpoints

//Initiate connection to mongoDB
connectMongo()

//Start the HTTPS server
httpsServer.listen(PORT, () => {
    console.log(`HTTPS Server running on port ${PORT}`)
})

//Start the HTTP server for redirection
httpServer.listen(HTTP_PORT, () => {
    console.log(`HTTP Server running on port ${HTTP_PORT} - redirecting to HTTPS`)
})
