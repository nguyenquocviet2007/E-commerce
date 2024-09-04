'use strict'

const { BadRequestRequestError } = require("../core/error.response")
const { findCartById } = require("../models/repositories.js/cart.repo")
const { checkProductByServer } = require("../models/repositories.js/product.repo")
const { getDiscountAmount } = require("./discount.service")

class CheckoutService {
    static async checkoutReview({
        cartId, userId, shop_orders_ids = []
    }) {
        // check cartId ton tai khong?
        const foundCart = await findCartById(cartId)
        if(!foundCart) throw new BadRequestRequestError('Cart does not exist!')

        const checkout_order = {
            totalPrice: 0, // tong tien hang
            feeShip: 0, // phi van chuyen
            totalDiscount: 0, // tong tien discount
            totalCheckout: 0 // tien phai thanh toan
        }, shop_order_ids_new = []

        for (let i = 0; i < shop_orders_ids.length; i++) {
            const {shopId, shop_discounts = [], item_products = []} = shop_orders_ids[i]
            // check product available
            const checkProduct = await checkProductByServer(item_products)
            if(!checkProduct[0]) throw new BadRequestRequestError('Order Wrong!!!')
            // tong tien don hang
            const checkoutPrice = checkProduct.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)
            // tong tien truoc khi xu ly
            checkout_order.totalPrice = checkout_order.totalPrice + checkoutPrice

            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice,
                priceApplyDiscount: checkoutPrice,
                item_products: checkProduct
            }

            // neu shop_discounts ton tai > 0, check xem co hop le khong
            if(shop_discounts.length > 0) {
                const {totalOrder, totalPrice, discount} = await getDiscountAmount({
                    code_id: shop_discounts[0].codeId,
                    userId,
                    shop_id: shopId,
                    products: checkProduct
                })

                checkout_order.totalDiscount += discount

                if (discount > 0) {
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                }
            }

            // tong thanh taon cuoi cung
            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
            shop_order_ids_new.push(itemCheckout)
        }
        return {
            shop_orders_ids,
            shop_order_ids_new,
            checkout_order
        }
    }
}

module.exports = CheckoutService