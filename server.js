const app = require("./src/app")

const PORT = process.env.PORT_DEV || 8081

const server = app.listen(PORT, () => {
    console.log(`WSV E-Commerce start with port ${PORT}`)
})

// process.on('SIGINT', () => {
//     server.close(() => console.log('Exit Server Express'))
// })