'use strict'

const { SuccessResponse } = require("../core/success.response")
const { BadRequestRequestError } = require("../core/error.response")
const { uploadFromUrl, uploadFromLocal } = require("../services/upload.service")


class UploadController {
    uploadFromUrl = async(req, res, next) => {
        new SuccessResponse({
            message: 'Upload Image Successfully!',
            metadata: await uploadFromUrl()
        }).send(res)
    }

    uploadFromLocal = async(req, res, next) => {
        const {file} = req
        if (!file) {
            throw new BadRequestRequestError('File missing')
        }
        new SuccessResponse({
            message: 'Upload Image Successfully!',
            metadata: await uploadFromLocal(file.path)
        }).send(res)
    }
}    


module.exports = new UploadController()