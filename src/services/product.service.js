'use strict'

const {product, clothing, electronic} = require('../models/product.model')
const {BadRequestRequestError} = require('../core/error.response')
// define Factory class to create product

class ProductFactory {
    /*
        type: 'Clothing'
    */

    static async createProduct(type, payload) {
        switch (type) {
            case 'Clothing':
                return new Clothing(payload).createProduct()
            case 'Electronic':
                return new Electronic(payload).createProduct()
            default:
                throw new BadRequestRequestError(`Invalid Product Types ${type}`)
        }
    }
}


// define base product class

class Product {
    constructor ({
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_quantity,
        product_type,
        product_shop,
        product_attributes,
    }){
        this.product_name = product_name,
        this.product_thumb = product_thumb,
        this.product_description = product_description,
        this.product_price = product_price,
        this.product_quantity = product_quantity,
        this.product_type = product_type,
        this.product_shop = product_shop,
        this.product_attributes = product_attributes
    }

    async createProduct() {
        return await product.create(this)
    }
}

// define sub-class for different product type = clothing
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create(this.product_attributes)
        if(!newClothing) throw new BadRequestRequestError('Create New Clothing Error!')

        const newProduct = await super.createProduct()
        if(!newProduct) throw new BadRequestRequestError('Create New Product Error!')

        return newProduct
    }
}

class Electronic extends Product {
    async createProduct() {
        const newElectronic = await clothing.create(this.product_attributes)
        if(!newElectronic) throw new BadRequestRequestError('Create New Electronic Error!')

        const newProduct = await super.createProduct()
        if(!newProduct) throw new BadRequestRequestError('Create New Product Error!')

        return newProduct
    }
}

module.exports = ProductFactory