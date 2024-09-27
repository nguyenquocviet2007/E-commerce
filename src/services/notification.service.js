'use strict'

const {notification} = require('../models/notification.model')

class NotificationService {
    static async pushNotiToSystem({
        type = 'SHOP-001',
        receiverId = 1,
        senderId = 1,
        options = {}
    }) {
        let noti_content

        if (type === 'SHOP-001') {
            noti_content = `@@@ has just added a new product: @@@@`
        } else if (type === 'PROMOTION-001') {
            noti_content = `@@@ has just added a new voucher: @@@@`
        }

        const newNoti = await notification.create({
            noti_type: type,
            noti_content,
            noti_senderId: senderId,
            noti_receiverId: receiverId,
            noti_option: options
        })

        return newNoti
    }

    static async getNotisByUser({
        userId = 1,
        type = 'ALL',
        isRead = 0
    }) {
        const match = {noti_receiverId: userId}
        if (type !== 'ALL') {
            match['noti_type'] = type
        }

        return await notification.aggregate([
            {
                $match: match
            },
            {
                $project: {
                    noti_type: 1,
                    noti_senderId: 1,
                    noti_receiverId: 1,
                    noti_content: {
                        $concat: [
                            {
                                $substr: ['$noti_option.shop_name', 0, -1]
                            },
                            ' has just added a new product: ',
                            {
                                $substr: ['$noti_option.product_name', 0, -1]
                            }
                        ]
                    },
                    createAt: 1,
                    noti_option: 1
                }
            }
        ])
    }
}

module.exports = NotificationService