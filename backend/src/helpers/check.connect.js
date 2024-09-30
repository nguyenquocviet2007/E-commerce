'use strict'

const { default: mongoose } = require("mongoose")
const os = require('os')
const process = require('process')
const _SECONDS = 5000

//Count Connect
const countConnect = () => {
    const numConnection = mongoose.connections.length
    console.log(`Number of Connection::${numConnection}`)
}

//Check Overload Connect
const checkOverload = () => {
    setInterval(() => {
        const numConnection = mongoose.connections.length
        const numCores = os.cpus().length
        const memoryUsage = process.memoryUsage().rss
        // Ex: maximum number of connections based on number of cores
        const maxConnections = numCores*5; // nen set nho hon so luong max co the chiu duoc thuc te
        
        console.log(`Active connection:: ${numConnection}`)
        console.log(`Memory usage:: ${memoryUsage/1024/1024} MB`)

        if(numConnection > maxConnections) {
            console.log(`Connection Overload Detected!`)
            //notify.send(...)
        }
    }, _SECONDS) //monitor every 5s
}

module.exports = {
    countConnect,
    checkOverload
}