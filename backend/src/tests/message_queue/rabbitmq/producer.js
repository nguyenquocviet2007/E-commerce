const amqp = require('amqplib')

const message = "New Product: Title new product"

const runProducer = async() => {
    try {
        const connection = await amqp.connect('amqp://guest:12345@localhost')
        const channel = await connection.createChannel()

        const queueName = 'test-topic' // name of channel
        await channel.assertQueue(queueName, {
            durable: true // do ben - khi server sap va khi khoi dong lai se tu lay nhung queue con lai gui tiep
        }) // dk vao channel

        // send message to consumer
        channel.sendToQueue(queueName, Buffer.from(message))
        console.log(`message sent: `, message)

    } catch(error) {
        console.error(error)
    }
}

runProducer().catch(console.error)