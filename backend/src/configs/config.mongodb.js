'use strict'
require('dotenv').config()

//level 0
// const config = {
//     app: {
//         port: 3000
//     },
//     db: {
//         userName: process.env.USERNAME_MONGO,
//         password: process.env.PASSWORD_MONGO
//     }
// }

//level 1
const dev = {
    app: {
        port: process.env.PORT_DEV || 8080
    },
    db: {
        host: process.env.HOST_MONGO_DEV || 'localhost',
        port: process.env.PORT_MONGO_DEV || 27017,
        name: process.env.NAME_MONGO_DEV || 'e-commerce'
    }
}

const production = {
    app: {
        port: process.env.PORT_PRODUCTION || 3000 
    },
    db: {
        host: process.env.HOST_MONGO_PRODUCTION,
        port: process.env.PORT_MONGO_PRODUCTION,
        name: process.env.NAME_MONGO_PRODUCTION
    }
}
const config = { dev, production }
const env = process.env.NODE_ENV || 'dev'
module.exports = config[env]

