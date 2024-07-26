'use strict'
const keyTokenModel = require('../models/keytoken.model')

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
}

module.exports = KeyTokenService