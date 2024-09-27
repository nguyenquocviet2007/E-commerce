'use strict'

'use strict'

const { SuccessResponse } = require('../core/success.response')

const {
    getNotisByUser
} = require('../services/notification.service')

class NotificationController {
    getNotisByUser = async (req, res, next) => {
        new SuccessResponse({
            message: 'delete comments successfully!',
            metadata: await getNotisByUser(req.query)
        }).send(res)
    }
}


module.exports = new NotificationController()