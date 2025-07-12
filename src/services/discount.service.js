'use strict';

const { Types } = require('mongoose');
const {
    BadRequestError,
    NotFoundError
} = require('../core/error.response');

const discountModel = require('../models/discount.model');
const {
    removeUndefinedObject,
    convertToObjectIdMongodb
} = require('../utils/index');

const {
    updateDiscountById,
    findAllDiscountCodeSelect,
    findAllDiscountCodesUnselect,
    checkDiscountExists
} = require('../models/repositories/discount.repo');


const { findAllProducts } = require('../models/repositories/product.repo');

class DiscountService {
    static async createDiscountCode( payload ) {
        const {
            code, start_date, end_date, is_active, shopId, min_order_value, product_ids, 
            name, applies_to, description, type, value, max_value , 
            max_uses, uses_count, max_uses_per_user,
        } = payload
        
    if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
            throw new BadRequestError('Discount code is not valid for the current date');
    }

    if(new Date(start_date) > new Date(end_date)) {
        throw new BadRequestError('Start date cannot be after end date');
    }

    // create index for discount code
    const foundDiscount = await discountModel.findOne({
        discount_code: code,
        discount_shopId: convertToObjectIdMongodb(shopId)
    }).lean();

    if (foundDiscount && foundDiscount.discount_is_active) {
        throw new BadRequestError('Discount code already exists');
    }

    const newDiscount = await discountModel.create({
        discount_code: code,
        discount_start_date: start_date,
        discount_end_date: end_date,
        discount_is_active: is_active,
        discount_shopId: convertToObjectIdMongodb(shopId),
        discount_min_order_value: min_order_value,
        discount_product_ids: product_ids || [],
        discount_name: name,
        discount_applies_to: applies_to,
        discount_description: description,
        discount_type: type,
        discount_value: value,
        discount_max_value: max_value || 0,
        discount_max_uses: max_uses || 0,
        discount_uses_count: uses_count || 0,
        discount_max_uses_per_user: max_uses_per_user || 1 
    });
    return newDiscount
}
    static async updateDiscountCode( discountId, payload ) {
        const objectParams = removeUndefinedObject(this)
        const updatedDiscount = updateDiscountById({
            discountId: convertToObjectIdMongodb(discountId),
            bodyUpdate: objectParams
    });
    return updatedDiscount;
    }

    static async getAllDiscountCodesWithProduct({
        code, shopId, userId, limit, page
    }) {
        const foundDiscount = await discountModel.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId)
        }).lean();

        if(!foundDiscount || !foundDiscount.discount_is_active) {
            throw new NotFoundError('Discount code not found or is inactive');
        }
        let products
        if(discount_applies_to === 'all'){
            //find all products in shop
            products = await findAllProducts({
                filter: {
                    product_shop: convertToObjectIdMongodb(shopId),
                    isPublish: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }

        if(discount_applies_to === 'specific') {
            //find products by product_ids
            products = await findAllProducts({
                filter: {
                    _id: { $in: discount_product_ids },
                    isPublish: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            });
        }

        return products 
    }

    /*
    Get all discount_code by shopID
    */
    static async getAllDiscountCodesByShop(limit,page,shopId){
        const discounts = await findAllDiscountCodesUnselect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: convertToObjectIdMongodb(shopId),
                discount_is_active: true
            },
            unSelect: ['__v', 'discount_shopID'],
            model: discountModel
        })

        return discounts;
    }


    static async getDiscountAmount({ codeId, userId, shopId, products}){
        const foundDiscount = checkDiscountExists({
            model: discountModel,
            filter: {
                discount_code: codeId,
                discount_shopId: convertToObjectIdMongodb(shopId),
            }
        })

        if(!foundDiscount) {
            throw new NotFoundError('Discount code not found');
        }

        const {
            discount_is_active,
            discount_max_uses,
            discount_min_order_value,
            discount_users_used,
            discount_max_uses_per_user,
            discount_value,
            discount_type
        } = foundDiscount;

        if(!discount_is_active) {
            throw new BadRequestError('Discount code is not active');
        }

        if(discount_max_uses ===0)
        {
            throw new BadRequestError('Discount code has reached its maximum uses');
        }

        if(new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) {
            throw new BadRequestError('Discount code is not valid for the current date');
        }

        let totalOrder = 0 
        if(discount_min_order_value > 0){
            totalOrder = products.reduce((acc,product) => {
                return acc + (product.product_price * product.product_quantity);
            }
            , 0);

            if(totalOrder < discount_min_order_value) {
                throw new BadRequestError('Total order value is less than minimum order value for this discount code');
            }

        }

        if(discount_max_uses_per_user > 0) {
            const userDiscount = discount_users_used.find(
                (user) => user.userId.toString() === userId.toString()
            );
            if(userDiscount && userDiscount.uses >= discount_max_uses_per_user) {
                throw new BadRequestError('You have reached the maximum uses for this discount code');
            }
        }

        //check xen discount nay la fixed or percentage
        const amount = discount_type === 'fixed' ? discount_value : totalOrder * (discount_value / 100);

        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount,
        }
    }

}