'use strict'

const ProductService = require("../services/product.service")
const ProductServiceAdvance = require("../services/product.service.advacne")
const {SuccessResponse} = require('../core/success.response')

class ProductController {
    createProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create New Product Successfully!',
            metadata: await ProductServiceAdvance.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }
}

module.exports = new ProductController