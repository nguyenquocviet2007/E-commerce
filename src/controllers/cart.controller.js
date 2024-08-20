'use strict'

const CartService = require('../services/cart.service')
const {SuccessResponse} = require('../core/success.response')

class CartController {
    
    addToCart = async(req, res, next) => {
        new SuccessResponse({
            message: 'Create new Cart successfully!',
            metadata: await CartService.addToCart(req.body)
        }).send(res)
    }

    update = async(req, res, next) => {
        new SuccessResponse({
            message: 'Update Cart successfully!',
            metadata: await CartService.addToCartV2(req.body)
        }).send(res)
    }

    delete = async(req, res, next) => {
        new SuccessResponse({
            message: 'Delete Cart successfully!',
            metadata: await CartService.deleteUserCart(req.body)
        }).send(res)
    }

    listToCart = async(req, res, next) => {
        new SuccessResponse({
            message: 'Get List Cart successfully!',
            metadata: await CartService.getListUserCard(req.query)
        }).send(res)
    }
}

module.exports = new CartController()