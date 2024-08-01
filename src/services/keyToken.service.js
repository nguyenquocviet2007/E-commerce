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

    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keyTokenModel.findOne({refreshTokensUsed: refreshToken}).lean()
    }

    static findByRefreshToken = async (refreshToken) => {
        return await keyTokenModel.findOne({refreshToken: refreshToken})
    }

    static findByUserId = async(userId) => {
        return await keyTokenModel.findOne({user: ObjectId.createFromHexString(userId)})
    }

    static removeKeyById = async (id) => {
        return await keyTokenModel.deleteOne(id)
    }

    static removeRefreshTokenById = async (userId) => {
        return await keyTokenModel.deleteOne({user: ObjectId.createFromHexString(userId)})
    }
}

module.exports = KeyTokenService