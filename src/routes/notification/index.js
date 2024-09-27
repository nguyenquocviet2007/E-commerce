'use strict'

const express = require('express')
const notiController = require('../../controllers/notification.controller')
const router = express.Router()
const asyncHandler = require('../../helpers/asynHandler')
const {authenticationV2} = require('../../auth/authUtils')

// noti chua loggin

router.use(authenticationV2)

router.get('', asyncHandler(notiController.getNotisByUser))


module.exports = router