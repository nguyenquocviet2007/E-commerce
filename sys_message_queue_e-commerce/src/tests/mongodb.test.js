'use strict'

const mongoose = require('mongoose')
const connectString = 'mongodb://localhost:27018/e-commerce'

const TestSchema = new mongoose.Schema({
    name: String
})

const Test = mongoose.model('Test', TestSchema)

describe('Mongoose Connection', () => {
    let connection

    // truoc khi bat dau
    beforeAll(async() => {
        connection = await mongoose.connect(connectString)
    })

    // sau khi ket thuc
    afterAll(async() => {
        await connection.disconnect()
    })

    it('should connect to mongoose', () => {
        expect(mongoose.connection.readyState).toBe(1)
    })

    it('should save a document to database', async () => {
        const user = new Test({name: 'VizNg'})
        await user.save()
        expect(user.isNew).toBe(false)
    })

    it('should find a document to database', async () => {
        const user = await Test.findOne({name: 'VizNg'})
        expect(user.name).toBeDefined()
        expect(user.name).toBe('VizNg')
    })
})