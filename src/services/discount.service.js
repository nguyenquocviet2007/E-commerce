'user strict'

const { BadRequestRequestError, NotFoundError } = require("../core/error.response")
const {discount} = require('../models/discount.model')
const { findAllDiscountCodesUnSelect } = require("../models/repositories.js/discount.repo")
const { findAllProducts } = require("../models/repositories.js/product.repo")
const { convertToObjectIdMongodb } = require("../utils")

/* 
    Discount Services
    1 - Generate Discount Code [Shop | Admin]
    2 - Get discount amount [User]
    3 - Get all discount code [User | Shop]
    4 - Verify discount code [User]
    5 - Delete discount code [Shop | Admin]
    6- Cancel discount code [User] 
*/

class DiscountService {

    static async createDiscountCode(payload) {
        const {
            code, start_date, end_date, is_active,
            shop_id, min_order_value, product_ids,
            applies_to, name, description, type, value,
            max_value, max_use, use_count, max_use_per_user,
            users_use
        } = payload

        // kiem tra
        if(new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
            throw new BadRequestRequestError('Discount code has expired')
        }
        
        if(new Date(start_date) > new Date(end_date)) {
            throw new BadRequestRequestError('Start Date must be before End Date')
        }

        // create index for discount code
        const foundDiscount  = await discount.findOne({
            discount_code: code,
            discount_shop_id: convertToObjectIdMongodb(shop_id)
        }).lean()

        if(foundDiscount && foundDiscount.discount_is_active) {
            throw new BadRequestRequestError('Discount already existed!')
        }

        const newDiscount = await discount.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_code: code,
            discount_value: value,
            discount_min_order_value: min_order_value || 0,
            discount_max_value: max_value,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_use: max_use,
            discount_use_count: use_count,
            discount_users_use: users_use,
            discount_shop_id: shop_id,
            discount_max_use_per_user: max_use_per_user,
            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === 'all' ? [] : product_ids
        })

        return newDiscount
    }

    static async updateDiscountCode() {
        //....
    }

    //Get all discount code available with product
    static async getAllDiscountCodeWithProduct({
        code, shop_id, user_id, limit, page
    }) {
        // create index for discount_code
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shop_id: convertToObjectIdMongodb(shop_id)
        }).lean()

        if(!foundDiscount || !foundDiscount.discount_is_active) {
            throw new NotFoundError('Discount Not Exist!')
        }
        
        const {discount_applies_to, discount_product_ids} = foundDiscount
        if(discount_applies_to === 'all') {
            // get all product
            products = await findAllProducts({
                filter: {
                    product_shop: convertToObjectIdMongodb(shop_id),
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }
        if(discount_applies_to === 'specific') {
            // get product ids
            products = await findAllProducts({
                filter: {
                    _id: {$in: discount_product_ids},
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }

        return products
    }

    // Get all discount code of shop
    static async getAllDiscountCodesByShop({
        limit, page, shop_id
    }) {
        const discounts = await findAllDiscountCodesUnSelect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shop_id: convertToObjectIdMongodb(shop_id),
                discount_is_active: true
            },
            unSelect: ['__v', 'discount_shop_id'],
            model: discount
        })
        
        return discounts
    }
}