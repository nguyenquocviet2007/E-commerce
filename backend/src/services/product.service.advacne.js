'use strict'

const {product, clothing, electronic, furniture} = require('../models/product.model')
const {BadRequestRequestError, NotFoundError} = require('../core/error.response')
const { 
    findAllDraftsForShop, 
    publishProductByShop,
    unPublishProductByShop,
    findAllPublishForShop, 
    searchProductByUser,
    findAllProducts,
    findProduct,
    updateProductById
} = require('../models/repositories.js/product.repo')
const { removeUndefineObject, updateNestedObjectParser } = require('../utils')
const { insertInventory } = require('../models/repositories.js/inventory.repo')
const { pushNotiToSystem } = require('./notification.service')
const shopModel = require('../models/shop.model')
// define Factory class to create product

class ProductFactory {
    /*
        type: 'Clothing'
    */
    static productRegistry = {}

    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef
    }

    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if(!productClass) throw new BadRequestRequestError(`Invalid Product Types ${type}`)
        
        return new productClass(payload).createProduct()
    }

    // Put & Post
    static async publishProductByShop ({product_shop, product_id}) {
        return await publishProductByShop({product_shop, product_id})
    }
    static async unPublishProductByShop ({product_shop, product_id}) {
        return await unPublishProductByShop({product_shop, product_id})
    }
    static async updateProduct(type, product_id, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if(!productClass) throw new BadRequestRequestError(`Invalid Product Types ${type}`)
        
        return new productClass(payload).updateProduct(product_id)
    }
    // End Put

    // query //
    static async findAllDraftsForShop({product_shop, limit = 50, skip = 0}) { 
        const query = {product_shop, isDraft: true}
        return await findAllDraftsForShop({query, limit, skip})
    }
    static async findAllPublishForShop({product_shop, limit = 50, skip = 0}) {
        const query = {product_shop, isPublished: true}
        return await findAllPublishForShop({query, limit, skip})
    }
    static async searchProducs({keySearch}) {
        return await searchProductByUser({keySearch})
    }
    static async findAllProducts({limit = 50, sort = 'ctime', page = 1, filter = {isPublished: true}}) {
        return await findAllProducts({limit, sort, filter, page, select: ['product_name', 'product_price', 'product_thumb', 'product_shop']})
    }
    static async findProduct({product_id}) {
        return await findProduct({product_id, unSelect: ['__v', 'product_variations']})
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

    async createProduct(product_id) {
        const newProduct = await product.create({...this, _id: product_id})

        if(newProduct) {
            // Insert Inventory
            const invenData = await insertInventory({
                product_id: newProduct._id,
                shop_id: this.product_shop,
                stock: this.product_quantity
            })

            const shop = await shopModel.findById(this.product_shop)
            if (!shop) throw new NotFoundError('Shop not found')
            // push noti to system
            pushNotiToSystem({
                type: 'SHOP-001',
                receiverId: 1,
                senderId: this.product_shop,
                options: {
                    product_name: this.product_name,
                    shop_name: shop.name
                }
            }).then(rs => console.log(rs))
            .catch(console.error)
        }

        return newProduct
    }
    async updateProduct(product_id, bodyUpdate) {
        return await updateProductById({product_id, bodyUpdate, model: product})
    }
}

// define sub-class for different product type = clothing
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newClothing) throw new BadRequestRequestError('Create New Clothing Error!')

        const newProduct = await super.createProduct(newClothing._id)
        if(!newProduct) throw new BadRequestRequestError('Create New Product Error!')

        return newProduct
    }

    async updateProduct(product_id) {
        // Remove attribute have value null or undefine
        // Check xem update o cho nao?
        const objectParams = removeUndefineObject(this)

        if (objectParams.product_attributes) {
            // update child
            await updateProductById({
                product_id, 
                bodyUpdate: updateNestedObjectParser(objectParams.product_attributes), 
                model: clothing
            })
        }
        const updateProduct = await super.updateProduct(product_id, updateNestedObjectParser(objectParams))
        return updateProduct
    }
}

class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newElectronic) throw new BadRequestRequestError('Create New Electronic Error!')

        const newProduct = await super.createProduct(newElectronic._id)
        if(!newProduct) throw new BadRequestRequestError('Create New Product Error!')

        return newProduct
    }

    async updateProduct(product_id) {
        // Remove attribute have value null or undefine
        // Check xem update o cho nao?
        const objectParams = removeUndefineObject(this)

        if (objectParams.product_attributes) {
            // update child
            await updateProductById({
                product_id, 
                bodyUpdate: updateNestedObjectParser(objectParams.product_attributes), 
                model: electronic
            })
        }
        const updateProduct = await super.updateProduct(product_id, updateNestedObjectParser(objectParams))
        return updateProduct
    }
}

class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newFurniture) throw new BadRequestRequestError('Create New Furniture Error!')

        const newProduct = await super.createProduct(newFurniture._id)
        if(!newProduct) throw new BadRequestRequestError('Create New Product Error!')

        return newProduct
    }

    async updateProduct(product_id) {
        // Remove attribute have value null or undefine
        // Check xem update o cho nao?
        const objectParams = removeUndefineObject(this)

        if (objectParams.product_attributes) {
            // update child
            await updateProductById({
                product_id, 
                bodyUpdate: updateNestedObjectParser(objectParams.product_attributes), 
                model: furniture
            })
        }
        const updateProduct = await super.updateProduct(product_id, updateNestedObjectParser(objectParams))
        return updateProduct
    }
}

// register product types
ProductFactory.registerProductType('Electronic', Electronic)
ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Furniture', Furniture)

module.exports = ProductFactory