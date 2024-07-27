'use strict'

const express = require('express')
const accessController = require('../../controllers/access.controller')
const router = express.Router()

const {asyncHandler} = require('../../auth/checkAuth')
const { authentication } = require('../../auth/authUtils')



router.post('/shop/signup', asyncHandler(accessController.signUp))
router.post('/shop/login', asyncHandler(accessController.login))

// Authentication
router.use(authentication)

router.post('/shop/logout', asyncHandler(accessController.logout))

// Authentication
module.exports = router