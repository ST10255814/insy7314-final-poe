/**
 * Modern CSRF Protection Middleware
 * Implements double-submit cookie pattern with SameSite=Strict
 */

const crypto = require('crypto')
const { v4: uuidv4 } = require('uuid')

/**
 * Generate a cryptographically secure CSRF token
 */
const generateCSRFToken = () => {
    return crypto.randomBytes(32).toString('hex')
}

/**
 * CSRF Token Generator Middleware
 * Sets CSRF token in both cookie and makes it available for headers
 */
const setCSRFToken = (req, res, next) => {
    const token = generateCSRFToken()
    
    // Set CSRF token in httpOnly cookie with SameSite=Strict
    res.cookie('csrf-token', token, {
        httpOnly: false, // Allow JS access for header inclusion
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        sameSite: 'strict', // Strict CSRF protection
        maxAge: 3600000, // 1 hour
        path: '/'
    })
    
    // Make token available for response (for initial page load)
    res.locals.csrfToken = token
    req.csrfToken = token
    
    next()
}

/**
 * CSRF Protection Middleware for state-changing operations
 * Validates double-submit cookie pattern
 */
const validateCSRF = (req, res, next) => {
    // Skip CSRF for safe methods
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        return next()
    }
    
    const cookieToken = req.cookies['csrf-token']
    const headerToken = req.headers['x-csrf-token'] || req.headers['csrf-token']
    const bodyToken = req.body._csrf
    
    // Check if tokens exist
    if (!cookieToken) {
        return res.status(403).json({
            error: 'CSRF token missing',
            message: 'CSRF token not found in cookies'
        })
    }
    
    // Get token from header or body
    const submittedToken = headerToken || bodyToken
    
    if (!submittedToken) {
        return res.status(403).json({
            error: 'CSRF token missing',
            message: 'CSRF token not found in headers or body'
        })
    }
    
    // Validate double-submit pattern
    if (cookieToken !== submittedToken) {
        return res.status(403).json({
            error: 'CSRF token mismatch',
            message: 'CSRF tokens do not match'
        })
    }
    
    // Additional timing-safe comparison
    if (!crypto.timingSafeEqual(Buffer.from(cookieToken), Buffer.from(submittedToken))) {
        return res.status(403).json({
            error: 'CSRF token invalid',
            message: 'CSRF token validation failed'
        })
    }
    
    next()
}

/**
 * Endpoint to get CSRF token for AJAX requests
 */
const getCSRFToken = (req, res) => {
    res.json({
        csrfToken: req.csrfToken,
        message: 'CSRF token generated'
    })
}

module.exports = {
    setCSRFToken,
    validateCSRF,
    getCSRFToken,
    generateCSRFToken
}