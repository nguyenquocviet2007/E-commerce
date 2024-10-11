'use strict'

const amqp = require('amqplib')

const connectToRabbitMQ = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:quocviet01@localhost')
        if (!connection) throw new Error('Connect UnSuccessfully!')

        const channel = await connection.createChannel()

        return {channel, connection}
    } catch (error) {
        console.error(error)
    }
}

const connectToRabbitMQForTest = async () => {
    try {
        const {channel, connection} = await connectToRabbitMQ()

        const queue = 'test-queue'
        const message = 'Hello, E-Commerce by VizNg'
        await channel.assertQueue(queue)
        await channel.sendToQueue(queue, Buffer.from(message))

        // close connection
        await connection.close()
    } catch (error) {
        console.error(`Error Connecting to RabbitMQ`, error)
    }
}

const consumerQueue = async (channel, queueName) => {
    try {
        await channel.assertQueue(queueName, {durable: true})
        console.log(`Waiting to message ...`)
        channel.consume(queueName, msg => {
            console.log(`Received message: ${queueName}::`, msg.content.toString())
            // 1. Find User following Shop
            // 2. Send message to User
            // 3. Yes, Ok ==> Success
            // 4. Error ==> Setup DLX
        }, {
            noAck: true // msg da xu ly roi, thi ko nhan nua
        })
    } catch (error) {
        console.error('Error publish message to rabbitMQ::', error)
    }
}

module.exports = {
    connectToRabbitMQ,
    connectToRabbitMQForTest,
    consumerQueue
}