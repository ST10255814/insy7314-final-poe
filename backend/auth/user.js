const express = require('express')
const rateLimiter = require('../middleware/rateLimiter')
const { checkAuth } = require('./checkAuth')

const router = express.Router()

//Controller to be used
const userController = require('../controller/userController')
const paymentController = require('../controller/paymentController')

//Login endpoint
router.post('/api/login', rateLimiter.userLimiter, userController.loginUser)
router.post('/api/register', rateLimiter.userLimiter, userController.registerUser)
router.post('/api/logout', userController.logoutUser)

//Payment endpoints
router.get('/api/pastPayments', checkAuth, paymentController.getAllPayments)
router.post('/api/createPayment', checkAuth, paymentController.CreatePayment)
module.exports = router