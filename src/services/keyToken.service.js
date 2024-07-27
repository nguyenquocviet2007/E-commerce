'use strict'
const keyTokenModel = require('../models/keytoken.model')
const {ObjectId} = require('mongodb')
class KeyTokenService {
    static createKeyToken = async({userId, publicKey, privateKey, refreshToken}) => {
        try {
            // lv0
            // const tokens = await keyTokenModel.create({
            //     user: userId,
            //     publicKey: publicKey,
            //     privateKey: privateKey
            // })

            // return tokens ? tokens.publicKey : null

            // lv higher
            const filter = {user: userId}, update = {publicKey, privateKey, refreshTokensUsed: [], refreshToken}, options = {upsert: true, new: true}
            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options)
            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error
        }
    }

    static findByUserId = async(userId) => {
        return await keyTokenModel.findOne({user: ObjectId.createFromHexString(userId)}).lean()
    }

    static removeKeyById = async (id) => {
        return await keyTokenModel.deleteOne(id)
    }
}

module.exports = KeyTokenService