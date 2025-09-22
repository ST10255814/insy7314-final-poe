const express = require('express')
const rateLimiter = require('../middleware/rateLimiter')

const router = express.Router()

//Controller to be used
const userController = require('../controller/userController')

//Login endpoint
router.post('/api/login', rateLimiter.userLimiter, userController.loginUser)
router.post('/api/register', rateLimiter.userLimiter, userController.registerUser)

module.exports = router