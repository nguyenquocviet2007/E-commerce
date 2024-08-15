'use strict'

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


module.exports = {
    insertInventory
}