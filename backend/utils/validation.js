const validator = require('validator');

// Enhanced regex patterns for existing fields
const VALIDATION_PATTERNS = {
    // User registration/login fields
    PASSWORD: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&]).{10,25}$/,
    IDNUMBER: /^\d{13}$/,
    ACCOUNTNUMBER: /^[0-9]{8,12}$/,
    USERNAME: /^[a-zA-Z][a-zA-Z0-9_]{2,15}$/,
    FULLNAME: /^[a-zA-Z\s]{2,50}$/,
    
    // Payment fields
    SWIFTCODE: /^[A-Za-z]{6}[A-Za-z0-9]{2}([A-Za-z0-9]{3})?$/,
    BRANCHCODE: /^[0-9]{6}$/,
    ACCOUNTTYPE: /^(checking|savings|business)$/i,
    ACCOUNTHOLDERNAME: /^[a-zA-Z\s]{2,50}$/,
    SERVICEPROVIDER: /^[a-zA-Z0-9\s&.-]{2,50}$/,
    CURRENCY: /^(USD|EUR|GBP|ZAR)$/,
    AMOUNT: /^\d+(\.\d{1,2})?$/
};

// XSS prevention functions
function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    // Remove HTML tags and escape special characters
    return validator.escape(input.trim());
}

function validateAndSanitize(field, value, pattern) {
    if (!value) {
        throw new Error(`${field} is required`);
    }
    
    // Convert to string and sanitize
    const sanitizedValue = sanitizeInput(String(value));
    
    // Check for potential XSS patterns
    if (containsXSSPatterns(sanitizedValue)) {
        throw new Error(`${field} contains invalid characters`);
    }
    
    // Validate against pattern
    if (pattern && !pattern.test(sanitizedValue)) {
        throw new Error(`Invalid ${field} format`);
    }
    
    return sanitizedValue;
}

function containsXSSPatterns(input) {
    const xssPatterns = [
        /<script[^>]*>.*?<\/script>/gi,
        /<iframe[^>]*>.*?<\/iframe>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /<object[^>]*>.*?<\/object>/gi,
        /<embed[^>]*>/gi,
        /<link[^>]*>/gi,
        /<style[^>]*>.*?<\/style>/gi
    ];
    
    return xssPatterns.some(pattern => pattern.test(input));
}

function validateAmount(amount) {
    const sanitizedAmount = sanitizeInput(String(amount));
    
    if (!VALIDATION_PATTERNS.AMOUNT.test(sanitizedAmount)) {
        throw new Error('Invalid amount format');
    }
    
    const numAmount = parseFloat(sanitizedAmount);
    if (numAmount <= 0 || numAmount > 1000000) {
        throw new Error('Amount must be between 0.01 and 1,000,000');
    }
    
    return numAmount;
}

module.exports = {
    VALIDATION_PATTERNS,
    validateAndSanitize,
    sanitizeInput,
    validateAmount,
    containsXSSPatterns
};