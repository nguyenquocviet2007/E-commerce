'use strict'

const { NotFoundError } = require("../core/error.response")
const { cart } = require("../models/cart.model")
const { findProduct } = require("../models/repositories.js/product.repo")

/* 
    Key feature:
    1 - Add product to Cart [User]
    2 - reduce product by 1 [User]
    3 - increase product by 1 [User]
    4 - get cart [User]
    5 - delete cart [User]
    6 - delete cart item [User]
*/


class CartService {
    /// START REPO CART ///
    static async createUserCart({userId, product}) {
        const query = {cart_userId: userId, cart_state: 'active'},
        updateOrInsert = {
            $addToSet: {
                cart_products: product
            }
        }, options = {upsert: true, new: true}
        return await cart.findOneAndUpdate(query, updateOrInsert, options)
    }

    static async updateUserCartQuantity({userId, product}) {
        const {productId, quantity, price} = product
        const query = {
            cart_userId: userId,
            'cart_products.productId': productId,
            cart_state: 'active'

        }, updateSet = {
            $inc: {
                'cart_products.$.quantity': quantity
            },
            $set: {
                'cart_products.$.price': price
            }
        }, options = {upsert: true, new: true}
        return await cart.findOneAndUpdate(query, updateSet, options)
    }
    /// END REPO CART ///


    // add to cart
    static async addToCart({userId, product = {}}) {
        // check cart ton tai hay khong
        const userCart = await cart.findOne({
            cart_userId: userId
        })
        if(!userCart) {
            // tao cart
            return await CartService.createUserCart({userId, product})
        }

        // gio hang co roi nhung chua co san pham
        if(!userCart.cart_products.length) {
            userCart.cart_products = [product]
            return await userCart.save()
        }
        if(userCart) {
            return await CartService.createUserCart({userId, product})
        }

        // gio hang ton tai, va co san pham => update quantity
        return await CartService.updateUserCartQuantity({userId, product})
    }

    // update cart
    static async addToCartV2({userId, shop_order_ids}) {
        const {productId, quantity, old_quantity} = shop_order_ids[0]?.item_products[0]
        // check product 
        const foundProduct = await findProduct({product_id: productId, unSelect: ['__v', 'product_variations']})
        if(!foundProduct) throw new NotFoundError('Product Not Found')
        
        if(foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
            throw new NotFoundError('Product do not belong to the shop!')
        }
        if(quantity === 0) {
            return await CartService.deleteUserCart({userId, productId})
        }

        return await CartService.updateUserCartQuantity({
            userId,
            product: {
                productId, 
                quantity: quantity - old_quantity,
                price: shop_order_ids[0]?.item_products[0].price
            }
        })
    }

    // delete cart
    static async deleteUserCart({userId, productId}) {
        const query  = {cart_userId: userId, cart_state: 'active'},
        updateSet = {
            $pull: {
                cart_products: {
                    productId
                }
            }
        }

        const deleteCart = await cart.updateOne(query, updateSet)

        return deleteCart
    }

    // get list cart
    static async getListUserCard({userId}) {
        return await cart.findOne({
            cart_userId: +userId
        }).lean()
    }
}

module.exports = CartService