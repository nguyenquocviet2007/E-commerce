'use strict'

const express = require('express')
const accessController = require('../../controllers/access.controller')
const router = express.Router()

const {asyncHandler} = require('../../auth/checkAuth')
const { authentication, authenticationV2 } = require('../../auth/authUtils')



router.post('/shop/signup', asyncHandler(accessController.signUp))
router.post('/shop/login', asyncHandler(accessController.login))

// Authentication
router.use(authenticationV2)

router.post('/shop/logout', asyncHandler(accessController.logout))
router.post('/shop/handleRefreshToken', asyncHandler(accessController.handleRefreshToken))

// Authentication
module.exports = router