'use strict'

const {
    consumerQueue,
    connectToRabbitMQ
} = require('../dbs/init.rabbitmq')

// const log = console.log

// console.log = function() {
//     log.apply(console, [new Date()].concat(arguments))
// }

const messageService = {
    consumerToQueue: async (queueName) => {
        try {
            const {channel, connection} = await connectToRabbitMQ()
            await consumerQueue(channel, queueName)
        } catch (error) {
            console.error(`Error consumerToQueue::`, error)
        }
    },

    // case processing
    consumerToQueueNormal: async (queueName) => {
        try {
            const {channel, connection} = await connectToRabbitMQ()
            const notiQueue = 'notificationQueueProcess'


            // 1. TTL Error
            /*const timeExpired = 15000
            setTimeout(() => {
                channel.consume(notiQueue, msg => {
                    console.log(`Send notificationQueue successfully process::`, msg.content.toString())
                    channel.ack(msg)
                }) 
            }, timeExpired)*/

            // 2. logic Error   
            channel.consume(notiQueue, msg => {
                try {
                    const numberTest = Math.random()
                    console.log({numberTest})
                    if (numberTest < 0.8) {
                        throw new Error('Send notification failed:: HOT FIX')
                    }
                    console.log(`Send notificationQueue successfully process::`, msg.content.toString())
                    channel.ack(msg)
                } catch (error) {
                    // console.error('Send notification failed: ', error)
                    channel.nack(msg, false, false)
                    /*
                        nack: negative acknowledgement
                        doi so 1: thong bao loi cua hang doi truoc do
                        doi so 2: chi dinh co nen sap xep lai hay khong
                                  false: message se khong dua vao hang doi ban dau, ma day vao hang doi loi
                                  true: message se bi day lai vao hang doi ban dau
                        doi so 3: co tu choi nhieu thu khong?
                                  false: chi tin nhan hien tai bi tu choi
                                  true: co the tu choi nhieu tin nhan 
                    */ 
                }
            })
        } catch (error) {
            console.error(error)
        }
    },

    // case processing fail
    consumerToQueueFail: async (queueName) => {
        try {
            const {channel, connection} = await connectToRabbitMQ()
            const notificationExchangeDLX = 'notificationExDLX' // khai bao 1 notificationEx direct khi that bai
            const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX'
            const notiQueueHandle = 'notificationQueueHotFix'

            await channel.assertExchange(notificationExchangeDLX, 'direct', {
                durable: true
            })

            const queueResult = await channel.assertQueue(notiQueueHandle, {
                exclusive: false
            })

            await channel.bindQueue(queueResult.queue, notificationExchangeDLX, notificationRoutingKeyDLX)
            await channel.consume(queueResult.queue, msgFailed => {
                console.log(`This notification get error, pls hot fix::`, msgFailed.content.toString())
            }, {
                noAck: true
            })
        } catch (error) {
            console.error(error)
            throw error            
        }
    }
}


module.exports = messageService