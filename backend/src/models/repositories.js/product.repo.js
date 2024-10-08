'use strict'

const {ObjectId} = require('mongodb')
const {product, electronic, clothing, furniture} = require('../../models/product.model')
const {getSelectData, unGetSelectData} = require('../../utils/index')

const queryProduct = async (query, limit, skip) => {
    return await product.find(query)
        .populate('product_shop', 'name email -_id')
        .sort({updateAt: -1})
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}
const findAllDraftsForShop = async ({query, limit, skip}) => {
    return await queryProduct(query, limit, skip)
}
const findAllPublishForShop = async ({query, limit, skip}) => {
    return await queryProduct(query, limit, skip)
}
const findAllProducts = async ({limit, sort, page, filter, select}) => {
    const skip = (page - 1)* limit
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1}
    const products = await product.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()
    
    return products
}
const findProduct = async ({product_id, unSelect}) => {
    return await product.findById(product_id).select(unGetSelectData(unSelect))
}
const searchProductByUser = async ({keySearch}) => {
    const regexSearch = new RegExp(keySearch)
    const results = await product.find({
        isPublished: true,
        $text: {$search: regexSearch}
    }, {score: {$meta: 'textScore'}})
    .sort({score: {$meta: 'textScore'}})
    .lean()

    return results
}

const checkProductByServer = async (products) => {
    return await Promise.all(products.map( async product => {
        const foundProduct = await findProduct({product_id: product.productId, unSelect: ['__v', 'product_variations']})
        if(foundProduct) {
            return {
                price: foundProduct.product_price,
                quantity: product.quantity,
                productId: product.productId
            }
        }
    }))
}

const publishProductByShop = async ({product_shop, product_id}) => {
    const foundShop = await product.findOne({
        product_shop: ObjectId.createFromHexString(product_shop),
        _id: ObjectId.createFromHexString(product_id)
    })

    if(!foundShop) return null

    foundShop.isDraft = false
    foundShop.isPublished = true
    const {modifiedCount} = await foundShop.updateOne(foundShop)

    return modifiedCount
}

const unPublishProductByShop = async ({product_shop, product_id}) => {
    const foundShop = await product.findOne({
        product_shop: ObjectId.createFromHexString(product_shop),
        _id: ObjectId.createFromHexString(product_id)
    })

    if(!foundShop) return null

    foundShop.isDraft = true
    foundShop.isPublished = false
    const {modifiedCount} = await foundShop.updateOne(foundShop)

    return modifiedCount
}

const updateProductById = async({
    product_id,
    bodyUpdate,
    model,
    isNew = true
}) => {
    return await model.findByIdAndUpdate(product_id, bodyUpdate, {
        new: isNew
    })
}



module.exports = {
    findAllDraftsForShop,
    publishProductByShop,
    unPublishProductByShop,
    findAllPublishForShop,
    findAllProducts,
    findProduct,
    searchProductByUser,
    updateProductById,
    checkProductByServer
}