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

    publishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Published Product Successfully!',
            metadata: await ProductServiceAdvance.publishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id
            })
        }).send(res)
    }

    unPublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'UnPublished Product Successfully!',
            metadata: await ProductServiceAdvance.unPublishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id
            })
        }).send(res)
    }

    /**
     * @desc Get all Drafts Product for Shop
     * @param {String} userId 
     * @param {Number} limit 
     * @param {Number} skip
     * @return {JSON} 
     */
    getAllDraftsForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get List of Draft Product Successfully!',
            metadata: await ProductServiceAdvance.findAllDraftsForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }

    getAllPublishForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get List of Publish Product Successfully!',
            metadata: await ProductServiceAdvance.findAllPublishForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }

    getListSearchProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get List Search Product Successfully!',
            metadata: await ProductServiceAdvance.searchProducs(req.params)
        }).send(res)
    }

    findAllProducts = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get All Product Successfully!',
            metadata: await ProductServiceAdvance.findAllProducts(req.query)
        }).send(res)
    }

    findProducts = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get All Product Successfully!',
            metadata: await ProductServiceAdvance.findProduct({
                product_id: req.params.product_id
            })
        }).send(res)
    }
}

module.exports = new ProductController