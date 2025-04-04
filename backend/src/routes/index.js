'use strict'

const express = require('express')
const { apiKey, permission } = require('../auth/checkAuth')
const router = express.Router()

// Check API Key
router.use(apiKey)
// Check Permission
router.use(permission('0000'))

router.use('/v1/api/noti', require('./notification'))
router.use('/v1/api/comment', require('./comment'))
router.use('/v1/api/checkout', require('./checkout'))
router.use('/v1/api/discount', require('./discount'))
router.use('/v1/api/inventory', require('./inventory'))
router.use('/v1/api/cart', require('./cart'))
router.use('/v1/api/product', require('./product'))
router.use('/v1/api/upload', require('./upload'))
router.use('/v1/api', require('./access'))


module.exports = router