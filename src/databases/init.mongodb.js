'use strict'

const { default: mongoose } = require("mongoose")

const connectString = `mongodb+srv://vietnguyen200701:Sp7zYe2r1RaKGlW4@ecommerce.scjxten.mongodb.net/?retryWrites=true&w=majority&appName=ecommerce`
const {countConnect} = require('../helpers/check.connect')

class Database {
    constructor() {
        this.connect()
    }
    //connect
    connect(type = 'mongodb') {
        if (1 === 1) {
            mongoose.set('debug', true)
            mongoose.set('debug', {color: true})
        }
        mongoose.connect(connectString, {
            maxPoolSize: 50 
            //nhom ket noi la tap hop cac ket noi cua csdl co the tai su dung dc duy tri boi database
            //loi ich khi su dung poolsize: 
            // 1. Cai thien hieu suat
            // 2. kha nang mo rong he thong
            // 3. giam chi phi dong ket noi csdl
        })
            .then( _ => {
                console.log(`Connected Mongodb Success Next level`, countConnect())
            })
            .catch(err => console.log(`Error Connect!`))
    }

    static getInstance() {
        if(!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance
    }
}

const instanceMongodb = Database.getInstance()

module.exports = instanceMongodb