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

const PORT = process.env.PORT || 5000
const HTTP_PORT = process.env.HTTP_PORT || 8080

// Middleware to redirect HTTP to HTTPS
const redirectToHTTPS = (req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
        return res.redirect(301, `https://${req.header('host')}${req.url}`)
    }
    next()
}

app.use(express.json())
app.use(cookieParser()) // Parse cookies from requests

// Enhanced CORS configuration
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            process.env.FRONTEND_URL || 'https://localhost:3000',
            'https://localhost:3001', // Additional allowed origins
            'https://127.0.0.1:3000'
        ];
        
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true, // Allow cookies to be sent with requests
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-Total-Count'], // Headers exposed to the client
    maxAge: 86400 // Cache preflight response for 24 hours
}))

// Enhanced Helmet configuration
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
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

//Configure https for SSL traffic encryption
const httpsServer = https.createServer({
    key: fs.readFileSync('keys/privatekey.pem'),
    cert: fs.readFileSync('keys/certificate.pem')
}, app)

// Create HTTP server for redirection
const httpApp = express()

// Apply HTTPS redirect middleware to HTTP server
httpApp.use(redirectToHTTPS)

// Fallback redirect for direct HTTP requests
httpApp.all('*', (req, res) => {
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
