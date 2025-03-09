'use strict'
const amqp = require('amqplib')


async function consumerOrderedMessage() {
    const connection = await amqp.connect('amqp://guest:12345@localhost')
    const channel = await connection.createChannel()

    const queueName = 'test-topic' // name of channel
    await channel.assertQueue(queueName, {
        durable: true // do ben - khi server sap va khi khoi dong lai se tu lay nhung queue con lai gui tiep
    }) // dk vao channel
    
    for (let i = 0; i < 10; i++) {
        const message = `ordered-queued-message::${i}`
        console.log(`message: ${message}`)
        channel.sendToQueue(queueName, Buffer.from(message), {
            persistent: true //
        })
    }

    setTimeout(() => {
        connection.close()
    }, 1000)
}


consumerOrderedMessage().catch(err => console.error(err))