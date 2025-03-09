const amqp = require('amqplib')

const message = "New Product: Title new product"

const log = console.log

// console.log = function() {
//     log.apply(console, [new Date()].concat(arguments))
// }

const runProducer = async() => {
    try {
        const connection = await amqp.connect('amqp://guest:12345@localhost')
        const channel = await connection.createChannel()

        const notificationExchange = 'notificationEx' // khai bao 1 notificationEx direct
        const notiQueue = 'notificationQueueProcess' // assert queue
        const notificationExchangeDLX = 'notificationExDLX' // khai bao 1 notificationEx direct khi that bai
        const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX'
        
        // 1. Create exchange
        await channel.assertExchange(notificationExchange, 'direct', {
            durable: true
        })

        // 2. Create queue
        const queueResult = await channel.assertQueue(notiQueue, {
            exclusive: false, // cho phep cac ket noi khac truy cap vao cung 1 hang doi cung 1 luc
            deadLetterExchange: notificationExchangeDLX, // bi loi hoac het hang --> gui den DLX - dinh tuyen den notificationRoutingKeyDLX
            deadLetterRoutingKey: notificationRoutingKeyDLX // khoa dinh tuyen
        })
        
        // 3. Biding queue
        await channel.bindQueue(queueResult.queue, notificationExchange) // dinh tuyen den notificationQueueProcess

        // 4. Send message
        const msg = 'a new product'
        console.log(`Producer msg::`, msg)
        await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
            expiration: '10000'
        })
        setTimeout(() => {
            connection.close()
            process.exit(0)
        }, 500)

    } catch(error) {
        console.error(error)
    }
}

runProducer().catch(console.error)