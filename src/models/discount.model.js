'use strict'

const { Schema, model } = require('mongoose')

const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'discounts'

const discountSchema = new Schema({
    discount_name: { type: String, required: true},
    discount_description: { type: String, required: true},
    discount_type: { type: String, default: 'fixed_amount'}, // percentage, fixed_amount
    discount_value: { type: Number, required: true}, // e.g. 10
    discount_code : { type: String, required: true}, // unique code for the discount
    discount_start_date: { type: Date, required: true},// start date for the discount validity
    discount_end_date: { type: Date, required: true}, // start and end date for the discount validity
    discount_max_uses: { type: Number, required: true}, // maximum number of times the discount can be used
    discount_uses_count: { type: Number, default: 0}, // number of times the discount has been used
    discount_users_used: { type: Array, default: []}, // array of user IDs who have used the discount
    discount_max_uses_per_user: { type: Number, required: true}, // maximum number of times a user can use the discount
    discount_min_order_value: { type: Number, required: true}, // minimum order value to apply the discount
    discount_shopId: { type: Schema.Types.ObjectId, ref: 'Shop', required: true }, // shop ID where the discount is applicable
    discount_is_active: { type: Boolean, default: true }, // whether the discount is active or not
    discount_applies_to: { type: String, required: true, enum: ['all', 'specific_products', 'categories'] }, // applies to all products, specific products or categories
    discount_product_ids: { type: Array, default: [] }, // array of product IDs if
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

//export the model
module.exports = {
  discount: model(DOCUMENT_NAME, discountSchema)
}