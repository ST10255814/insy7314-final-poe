const express = require('express')
const rateLimiter = require('../middleware/rateLimiter')
const { checkAuth } = require('./checkAuth')
const { checkCustomerAuth } = require('./checkEmployeeAuth')
const { securityHeaders, requireHTTPS } = require('../middleware/security')
const { validateCSRF } = require('../middleware/csrfProtection')

const router = express.Router()

//Controller to be used
const userController = require('../controller/userController')
const paymentController = require('../controller/paymentController')

// Apply security headers to all routes
router.use(securityHeaders)

//Login endpoint - require HTTPS and CSRF for authentication
router.post('/api/login', requireHTTPS, validateCSRF, rateLimiter.userLimiter, userController.loginUser)
router.post('/api/register', requireHTTPS, validateCSRF, rateLimiter.userLimiter, userController.registerUser)
router.post('/api/logout', validateCSRF, userController.logoutUser)

//Payment endpoints - require HTTPS and CSRF for financial operations (Customer only)
router.get('/api/pastPayments', requireHTTPS, checkCustomerAuth, paymentController.getAllPayments)
router.post('/api/createPayment', requireHTTPS, validateCSRF, checkCustomerAuth, paymentController.CreatePayment)
module.exports = router