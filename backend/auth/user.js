const express = require('express')
const rateLimiter = require('../middleware/rateLimiter')
const { checkAuth } = require('./checkAuth')
const { securityHeaders, requireHTTPS } = require('../middleware/security')

const router = express.Router()

//Controller to be used
const userController = require('../controller/userController')
const paymentController = require('../controller/paymentController')

// Apply security headers to all routes
router.use(securityHeaders)

//Login endpoint - require HTTPS for authentication
router.post('/api/login', requireHTTPS, rateLimiter.userLimiter, userController.loginUser)
router.post('/api/register', requireHTTPS, rateLimiter.userLimiter, userController.registerUser)
router.post('/api/logout', userController.logoutUser)

//Payment endpoints - require HTTPS for financial operations
router.get('/api/pastPayments', requireHTTPS, checkAuth, paymentController.getAllPayments)
router.post('/api/createPayment', requireHTTPS, checkAuth, paymentController.CreatePayment)
module.exports = router