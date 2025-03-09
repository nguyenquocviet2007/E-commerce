'use strict'
const amqp = require('amqplib')

//
async function consumerOrderedMessage() {
    const connection = await amqp.connect('amqp://guest:12345@localhost')
    const channel = await connection.createChannel()

    const queueName = 'test-topic' // name of channel
    await channel.assertQueue(queueName, {
        durable: true
    })

    // Set prefetch to 1 to ensure only one ack a time
    // Đảm bảo mỗi tác vụ chỉ thực hiện 1 lần -- Đảm bảo rằng queue thực hiện theo thứ tự
    channel.prefetch(1)
    
    channel.consume(queueName, msg => {
        const message = msg.content.toString()

        setTimeout(() => {
            console.log('processed;:', message)
            channel.ack(msg) 
        }, Math.random()*1000)
    })
}


consumerOrderedMessage().catch(err => console.error(err))