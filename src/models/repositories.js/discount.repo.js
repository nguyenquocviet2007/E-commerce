'use strict'
const {ObjectId} = require('mongodb')
const {
    getSelectData, unGetSelectData
} = require('../../utils')
const { discount } = require('../discount.model')
const { NotFoundError } = require('../../core/error.response')

const findAllDiscountCodesUnSelect = async({
    limit = 50, page = 1, sort = 'ctime', filter, unSelect, model
}) => {
    const skip = (page - 1)*limit
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1}
    const documents = await model.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(unGetSelectData(unSelect))
        .lean()
    
    return documents
}

const findAllDiscountCodesSelect = async({
    limit = 50, page = 1, sort = 'ctime', filter, select, model
}) => {
    const skip = (page - 1)*limit
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1}
    const documents = await model.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()
    
    return documents
}

const checkDiscountExitst = async({model, filter}) => {
    return await model.findOne(filter).lean()
}

const updateDiscount = async({
    discount_id, bodyUpdate, shop_id, isNew = true
}) => {
    const foundDiscount = await discount.findOne({
        _id: ObjectId.createFromHexString(discount_id),
        discount_shop_id: ObjectId.createFromHexString(shop_id)
    })

    if(!foundDiscount) {
        throw new NotFoundError('Discount does not exist!')
    }

    return await discount.findByIdAndUpdate(
        discount_id, bodyUpdate, {
            new: isNew
        }
    )
}

module.exports = {
    findAllDiscountCodesSelect,
    findAllDiscountCodesUnSelect,
    checkDiscountExitst,
    updateDiscount
}