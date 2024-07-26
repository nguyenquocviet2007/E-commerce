require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const app = express();
const {default: helmet} = require('helmet');
const compression = require('compression');

// init middlewares
app.use(morgan("dev"))
// app.use(morgan("combined")) // theo chuan apache
// app.use(morgan("common")) // dau ra nhat ky chung, tieu chuan apache
// app.use(morgan("short")) // ngan hon, bao gom thoi gian phan hoi
// app.use(morgan("tiny")) // ngan hon nua
app.use(helmet())
app.use(compression()) // giam tieu ton bang thong 
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))


// init database
require('./databases/init.mongodb')
// const {checkOverload} = require('./helpers/check.connect')
// checkOverload()
// init router
app.use('', require('./routes'))

// handle error
app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: error.message || 'Internal Server Error'
    })
})

module.exports = app;