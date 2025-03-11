'use strict';

'use strict'

const express = require('express')
const uploadController = require('../../controllers/upload.controller')
const router = express.Router()
const asyncHandler = require('../../helpers/asynHandler')
const {uploadDisk} = require('../../configs/config.multer')
const {authenticationV2} = require('../../auth/authUtils')



// router.use(authenticationV2)
router.post('/product', asyncHandler(uploadController.uploadFromUrl))
router.post('/product/thumb', uploadDisk.single('file'), asyncHandler(uploadController.uploadFromLocal))



module.exports = router