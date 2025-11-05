const express = require('express')
const rateLimiter = require('../middleware/rateLimiter')
const { checkEmployeeAuth } = require('../auth/checkEmployeeAuth')
const { securityHeaders, requireHTTPS } = require('../middleware/security')
const { validateCSRF } = require('../middleware/csrfProtection')

const router = express.Router()

//Controller to be used
const employeeController = require('../controller/employeeController')
const paymentController = require('../controller/paymentController')

// Apply security headers to all routes
router.use(securityHeaders)

// Employee portal endpoints - require HTTPS, CSRF, and Employee authentication
router.get('/api/employee/pending-payments', requireHTTPS, checkEmployeeAuth, employeeController.getPendingPayments)
router.post('/api/employee/verify-swift/:paymentId', requireHTTPS, validateCSRF, checkEmployeeAuth, employeeController.verifySwiftCode)
router.post('/api/employee/submit-swift/:paymentId', requireHTTPS, validateCSRF, checkEmployeeAuth, employeeController.submitToSwift)
router.get('/api/employee/submitted-payments', requireHTTPS, checkEmployeeAuth, employeeController.getSubmittedPayments)
router.post('/api/employee/updateSwift/:paymentId', requireHTTPS, validateCSRF, checkEmployeeAuth, paymentController.UpdatePaymentStatus)

module.exports = router