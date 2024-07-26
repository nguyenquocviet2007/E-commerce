'use strict'
const shopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require('./keyToken.service')
const { createTokenPair } = require('../auth/authUtils')
const { getInforData } = require('../utils')
const { BadRequestRequestError, ConflictRequestError, AuthFailureError } = require('../core/error.response')
const { findByEmail } = require('./shop.service')
const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {
    static signUp = async ({name, email, password}) => {
        try {
            //step 1: Check email exist?
            const holderShop = await shopModel.findOne({email}).lean() //help reduce size of returned model - original object js

            if(holderShop) {
                throw new BadRequestRequestError('Error: Shop already registered!')
            }

            const hashedPassword = await bcrypt.hash(password, 10)
            const newShop = await shopModel.create({
                name, email, password: hashedPassword, roles: [RoleShop.SHOP]
            })

            if(newShop) {
                // Create Private Key - Do not store and Public Key - store

                const privateKey = crypto.randomBytes(64).toString('hex')
                const publicKey = crypto.randomBytes(64).toString('hex')
                // public key CryptoGraphy Standards 1
                console.log({privateKey, publicKey})

                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey: publicKey,
                    privateKey: privateKey
                })
                
                if(!keyStore) {
                    // throw new BadRequestRequestError('Error: Shop already registered!')
                    return {
                        code: 'xxxx',
                        message: 'keyStore Error'
                    }
                }

                // create token pair
                const tokens = await createTokenPair({userId: newShop._id, email}, publicKey, privateKey)
                console.log(`Created Token Success::`, tokens)

                return {
                    code: 201,
                    metadata: {
                        shop: getInforData({
                            fields: ['_id', 'name', 'email'],
                            object: newShop
                        }),
                        tokens
                    }
                }
            }
            return {
                code: 200,
                metadata: null
            }

        } catch (error) {
            console.error(error)
            return {
                code: 'xxx',
                message: error.message,
                status: 'error'
            }
        }
    }

    static login = async ({email, password, refreshToken = null}) => {
        /*
            1. Check email in dbs
            2. Match password
            3. Create AccessToken and Refresh Token
            4. Generate Tokens
            5. Get data return login
        */
        // 1.
        const foundShop = await findByEmail({email})
        if(!foundShop) throw new BadRequestRequestError('Shop is not registered')        
        
        // 2.
        const matchPassword = bcrypt.compare(password, foundShop.password)
        if(!matchPassword) throw new AuthFailureError('Authentication Error')

        // 3.
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')

        // 4.
        const tokens = await createTokenPair({userId:foundShop._id, email}, publicKey, privateKey)
        await KeyTokenService.createKeyToken({
            userId: foundShop._id,
            refreshToken: tokens.refreshToken,
            privateKey,
            publicKey
        })

        // 5.
        return {
            metadata: {
                shop: getInforData({fields: ['_id', 'name', 'email'], object: foundShop}),
                tokens
            }
        }
    }
}

module.exports = AccessService