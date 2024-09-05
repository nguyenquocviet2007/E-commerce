'use strict'

const { convertToObjectIdMongodb } = require('../../utils')
const {inventory} = require('../inventory.model')

const insertInventory = async({
    product_id, shop_id, stock, location = 'UnKnown'
}) => {
    return await inventory.create({
        inven_productId: product_id,
        inven_stock: stock,
        inven_location: location,
        inven_shopId: shop_id,
    })
}


const reservationInventory = async ({productId, quantity, cartId}) => {
    const query = {
        inven_productId: convertToObjectIdMongodb(productId),
        inven_stock: {$gte: quantity}
    }, updateSet = {
        $inc: {
            inven_stock: -quantity
        },
        $push: {
            inven_reservations: {
                quantity,
                cartId,
                createOn: new Date()
            }
        }
    }, options = {upsert: true, new: true}

    return await inventory.updateOne(query, updateSet)
}

module.exports = {
    insertInventory,
    reservationInventory
}