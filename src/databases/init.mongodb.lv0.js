'use strict'

const { default: mongoose } = require("mongoose")

const connectString = `mongodb+srv://vietnguyen200701:Sp7zYe2r1RaKGlW4@ecommerce.scjxten.mongodb.net/?retryWrites=true&w=majority&appName=ecommerce`
mongoose.connect(connectString)
    .then( _ => console.log(`Connected Mongodb Success`))
    .catch(err => console.log(`Error Connect!`))

if (1 === 1) {
    mongoose.set('debug', true)
    mongoose.set('debug', {color: true})
}

module.exports = mongoose

