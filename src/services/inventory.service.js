'use strict'

const { BadRequestRequestError } = require('../core/error.response')
const {
    inventory
} = require('../models/inventory.model')

const {
    findProduct
} = require('../models/repositories.js/product.repo')

class InventoryService {
    static async addStockToInventory({
        stock,
        productId,
        shopId,
        location = '1234 Xo Viet Nghe Tinh P25 Binh Thanh HCM'
    }) {
        const product = await findProduct({product_id: productId, unSelect: ['__v', 'product_variations']})
        if(!product) throw new BadRequestRequestError('The product does not exist!')

        const query = {inven_shopId: shopId, inven_productId: productId},
        updateSet = {
            $inc: {
                inven_stock: stock
            },
            $set: {
                inven_location: location
            }
        }, options = {upsert: true, new: true}

        return await inventory.findOneAndUpdate(query, updateSet, options)
    }
}

module.exports = InventoryService