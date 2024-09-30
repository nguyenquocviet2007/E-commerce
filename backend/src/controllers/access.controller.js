'use strict'

const AccessService = require("../services/access.service")
const {OK, CREATED, SuccessResponse} = require('../core/success.response')

class AccessController {
    handleRefreshToken = async (req, res, next) => {
        // new SuccessResponse({
        //     message: 'Get Token Successfully!',
        //     metadata: await AccessService.handleRefreshToken(req.body.refreshToken)
        // }).send(res)

        //Version2: No need accessToken
        new SuccessResponse({
            message: 'Get Token Successfully!',
            metadata: await AccessService.handleRefreshTokenV2({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore: req.keyStore
            })
        }).send(res)
    }

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