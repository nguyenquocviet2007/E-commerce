'use strict'
const shopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require('./keyToken.service')
const { createTokenPair, verifyJWT } = require('../auth/authUtils')
const { getInforData } = require('../utils')
const { BadRequestRequestError, ConflictRequestError, AuthFailureError, ForbidentError } = require('../core/error.response')
const { findByEmail } = require('./shop.service')
const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {

    static handleRefreshTokenV2 = async ({refreshToken, user, keyStore}) => {

        const {userId, email} = user;

        if(keyStore.refreshTokensUsed.includes(refreshToken)) {
            await KeyTokenService.removeRefreshTokenById(userId)
            throw new ForbidentError('Something went wrong! Please re-login') 
        }

        if(keyStore.refreshToken !== refreshToken) if(!holderToken) throw new AuthFailureError('Shop is not registered!')

        const foundShop = await findByEmail({email})
        if(!foundShop) throw new AuthFailureError('Shop is not registered!')
            
            // Tao 1 cap token moi
        const tokens = await createTokenPair({userId, email}, keyStore.publicKey, keyStore.privateKey)
    
            // Update token
        await keyStore.updateOne({
            $set: {
                    refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken // add token da su dung vao arary de tao token moi
            }
        })
    
        return {
            user,
            tokens
        }
    }

    static handleRefreshToken = async (refreshToken) => {
        // Check token used?
        const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken)

        if(foundToken) {
            // Decode xem la ai?
            const {userId, email} = await verifyJWT(refreshToken, foundToken.privateKey)
            // Xoa
            await KeyTokenService.removeRefreshTokenById(userId)
            throw new ForbidentError('Something went wrong! Please re-login')
        }

        const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)
        if(!holderToken) throw new AuthFailureError('Shop is not registered!')

        const {userId, email} = await verifyJWT(refreshToken, holderToken.privateKey)

        const foundShop = await findByEmail({email})
        if(!foundShop) throw new AuthFailureError('Shop is not registered!')
        
        // Tao 1 cap token moi
        const tokens = await createTokenPair({userId, email}, holderToken.publicKey, holderToken.privateKey)

        // Update token
        await holderToken.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken // add token da su dung vao arary de tao token moi
            }
        })

        return {
            user: {userId, email},
            tokens
        }
    }

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
        const matchPassword = await bcrypt.compare(password, foundShop.password)
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

    static logout = async (keyStore) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id)
        console.log(delKey)
        return delKey
    }
}

module.exports = AccessService