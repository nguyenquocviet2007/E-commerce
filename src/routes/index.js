'use strict'

const express = require('express')
const { apiKey, permission } = require('../auth/checkAuth')
const router = express.Router()

// Check API Key
router.use(apiKey)
// Check Permission
router.use(permission('0000'))



router.use('/v1/api', require('./access'))
// router.get('/', (req, res, next) => {
//     return res.status(200).json({
//         message: 'Welcome to E-commerce website'
//     })
// })

module.exports = router