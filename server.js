const app = require("./src/app")

const PORT = 8080

const server = app.listen(8080, () => {
    console.log(`WSV E-Commerce start with port ${PORT}`)
})

process.on('SIGINT', () => {
    server.close(() => console.log('Exit Server Express'))
})