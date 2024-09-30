'user strict' // giam ro ri bo nho trong nodejs

const {model, Schema} = require('mongoose')

const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'Discounts'

const discountSchema = new Schema({
    discount_name: {
        type: String,
        required: true
    },
    discount_description: {
        type: String,
        required: true
    },
    discount_type: {
        type: String,
        default: 'fixed_amount' // theo so tien - fixed amount; theo phan tram - percentage
    },
    discount_value: {
        type: Number, // fixed amount: 10000 - percentage: 10
        required: true
    },
    discount_max_value: {
        type: Number,
        required: true
    },
    discount_code: {
        type: String,
        required: true
    },
    discount_start_date: {
        type: Date,
        required: true
    },
    discount_end_date: {
        type: Date,
        required: true
    },
    discount_max_use: {
        type: Number,
        required: true
    },
    discount_use_count: {
        type: Number,
        required: true
        // so discount da su dung
    },
    discount_users_use: {
        type: Array,
        default: []
        // nhung user da su dung discount
    },
    discount_max_use_per_user: {
        type: Number,
        required: true
        // Moi user duoc su dung toi da bao nhieu lan discount nay
    },
    discount_min_order_value: {
        type: Number,
        required: true
    },
    discount_shop_id: {
        type: Schema.Types.ObjectId,
        ref: "Shop"
    },
    discount_is_active: {
        type: Boolean,
        default: true
    },
    discount_applies_to: {
        type: String,
        required: true,
        enum: ['all', 'specific']
    },
    discount_product_ids: {
        type: Array,
        default: []
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = {
    discount: model(DOCUMENT_NAME, discountSchema)
}
