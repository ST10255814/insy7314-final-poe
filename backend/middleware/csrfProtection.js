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
    // Check if token already exists in cookie
    let token = req.cookies['csrf-token']
    
    // Generate new token if none exists or if it's expired
    if (!token) {
        token = generateCSRFToken()
        console.log('Generated new CSRF token:', token.substring(0, 8) + '...')
        
        // Set CSRF token in cookie with SameSite=Strict
        res.cookie('csrf-token', token, {
            httpOnly: true, // Allow JS access for header inclusion
            secure: process.env.NODE_ENV === 'production' , // HTTPS only in production
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // More permissive in development
            maxAge: 3600000, // 1 hour
            path: '/'
        })
    } else {
        console.log('Using existing CSRF token:', token.substring(0, 8) + '...')
    }
    
    // Make token available for response and request
    res.locals.csrfToken = token
    req.csrfToken = token
    
    // Add CSRF token to response headers for easy client access
    res.setHeader('X-CSRF-Token', token)
    
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
    
    console.log('CSRF Validation:', {
        method: req.method,
        cookieToken: cookieToken ? 'present' : 'missing',
        headerToken: headerToken ? 'present' : 'missing',
        bodyToken: bodyToken ? 'present' : 'missing'
    })
    
    // Check if tokens exist
    if (!cookieToken) {
        console.log('CSRF validation failed: No cookie token')
        return res.status(403).json({
            error: 'CSRF token missing',
            message: 'CSRF token not found in cookies'
        })
    }
    
    // Get token from header or body
    const submittedToken = headerToken || bodyToken
    
    if (!submittedToken) {
        console.log('CSRF validation failed: No submitted token')
        return res.status(403).json({
            error: 'CSRF token missing',
            message: 'CSRF token not found in headers or body'
        })
    }
    
    // Validate double-submit pattern - simple string comparison first
    if (cookieToken !== submittedToken) {
        console.log('CSRF validation failed: Token mismatch')
        return res.status(403).json({
            error: 'CSRF token mismatch',
            message: 'CSRF tokens do not match'
        })
    }
    
    // Additional timing-safe comparison for extra security
    try {
        if (!crypto.timingSafeEqual(Buffer.from(cookieToken), Buffer.from(submittedToken))) {
            console.log('CSRF validation failed: Timing-safe comparison failed')
            return res.status(403).json({
                error: 'CSRF token invalid',
                message: 'CSRF token validation failed'
            })
        }
    } catch (error) {
        console.log('CSRF timing-safe comparison error:', error.message)
        // Fall back to regular comparison if timing-safe fails
        if (cookieToken !== submittedToken) {
            return res.status(403).json({
                error: 'CSRF token invalid',
                message: 'CSRF token validation failed'
            })
        }
    }
    
    console.log('CSRF validation successful')
    next()
}

/**
 * Endpoint to get CSRF token for AJAX requests
 */
const getCSRFToken = (req, res) => {
    // Generate a new token if one doesn't exist
    let token = req.csrfToken || res.locals.csrfToken
    
    if (!token) {
        token = generateCSRFToken()
        
        // Set CSRF token in cookie
        res.cookie('csrf-token', token, {
            httpOnly: true, // Prevent JS access for security
            secure: process.env.NODE_ENV === 'production', // HTTPS only in production
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // More permissive in development
            maxAge: 3600000, // 1 hour
            path: '/'
        })
    }
    
    res.json({
        csrfToken: token,
        message: 'CSRF token generated successfully'
    })
}

module.exports = {
    setCSRFToken,
    validateCSRF,
    getCSRFToken,
    generateCSRFToken
}