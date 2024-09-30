'use strict'

const express = require('express')
const commentController = require('../../controllers/comment.controller')
const router = express.Router()
const asyncHandler = require('../../helpers/asynHandler')
const {authenticationV2} = require('../../auth/authUtils')


router.use(authenticationV2)

router.post('', asyncHandler(commentController.createComment))
router.get('', asyncHandler(commentController.getCommentsByParentId))
router.delete('', asyncHandler(commentController.deleteComments))

module.exports = router