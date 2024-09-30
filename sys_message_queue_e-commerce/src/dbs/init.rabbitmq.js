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

module.exports = {
    connectToRabbitMQ,
    connectToRabbitMQForTest
}