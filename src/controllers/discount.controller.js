'use strict'

const DiscountService = require('../services/discount.service')
const {SuccessResponse} = require('../core/success.response')

class DiscountController {
    createDiscountCode = async(req, res, next) => {
        new SuccessResponse({
            message: 'Successfull create discount code' ,
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shop_id: req.user.userId
            })
        }).send(res)
    }

    getAllDiscountCodes = async(req, res, next) => {
        new SuccessResponse({
            message: 'Get discount code successfully',
            metadata: await DiscountService.getAllDiscountCodesByShop({
                ...req.query,
                shop_id: req.user.userId
            })
        }).send(res)
    }

    getAllDiscountAmount = async(req, res, next) => {
        new SuccessResponse({
            message: 'Get discount amount successfully',
            metadata: await DiscountService.getDiscountAmount({
                ...req.body
            })
        }).send(res)
    }

    getAllDiscountCodesWithProduct = async(req, res, next) => {
        new SuccessResponse({
            message: 'Get discount code successfully',
            metadata: await DiscountService.getAllDiscountCodeWithProduct({
                ...req.query
            })
        }).send(res)
    }
}

module.exports = new DiscountController()