'use strict'

const { consumerToQueue, consumerToQueueNormal, consumerToQueueFail } = require('./src/services/consumerQueue.service')

const queueName = 'test-topic'
// consumerToQueue(queueName).then(() => {
//     console.log(`Message consumer started ${queueName}`)
// }).catch(error => {
//     console.error(`Message consumer error::`, error)
// })

consumerToQueueNormal(queueName).then(() => {
    console.log(`Message consumerToQueueNormal started`)
}).catch(error => {
    console.error(`Message consumer error::`, error)
})

consumerToQueueFail(queueName).then(() => {
    console.log(`Message consumerToQueueFail started`)
}).catch(error => {
    console.error(`Message consumer error::`, error)
})