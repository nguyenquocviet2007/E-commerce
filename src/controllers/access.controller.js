'use strict'

const AccessService = require("../services/access.service")
const {OK, CREATED, SuccessResponse} = require('../core/success.response')

class AccessController {
    login = async (req, res, next) => {
        new SuccessResponse({
            metadata: await AccessService.login(req.body)
        }).send(res)
    }
    signUp = async(req, res, next) => {
        // return res.status(200).json({
        //     message: '',
        //     metadata: ''
        // })
        new CREATED({
            message: 'Registered Successfully!',
            metadata: await AccessService.signUp(req.body)
        }).send(res)
    }

    logout = async(req, res, next) => {
        new SuccessResponse({
            message: 'Logout Successfully!',
            metadata: await AccessService.logout(req.keyStore),
        }).send(res)
    }
}

module.exports = new AccessController