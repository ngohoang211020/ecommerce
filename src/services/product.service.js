'use strict'

const {product,clothing,electronic} = require('../models/product.model')
const { BadRequestError } = require('../core/error.response')



class ProductFactory {

    static productRegistry = {}

    static registerProductType(type, productClass) {
        if (this.productRegistry[type]) {
            throw new BadRequestError(`Product type ${type} is already registered`)
        }
        this.productRegistry[type] = productClass
    }

    static async createProduct(type, payload){
        const ProductClass = this.productRegistry[type]
        if (!ProductClass) {
            throw new BadRequestError(`Product type ${type} is not registered`)
        }

        return new ProductClass(payload).createProduct()
    }
}

//define base product class

class Product {
     constructor({
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_quantity,
        product_type,
        product_shop,
        product_attributes
    }) {
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_description = product_description
        this.product_price = product_price
        this.product_quantity = product_quantity
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
    }

    async createProduct(product_id) {
        return await product.create({...this, _id: product_id})
    }
}


// Define sub-classes for specific product types
class Clothing extends Product {
    async createProduct(){
        const newClothing = await clothing.create({...this.product_attributes, product_shop : this.product_shop})
        if(!newClothing) {
            throw new BadRequestError('Failed to create clothing product')
        }
        const newProduct = await super.createProduct(newClothing._id)
        if(!newProduct) {
            throw new BadRequestError('Failed to create product')
        }

        return newProduct
    }
}

class Electronics extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({...this.product_attributes, product_shop : this.product_shop})
        if(!newElectronic) {
            throw new BadRequestError('Failed to create electronic product')
        }
        const newProduct = await super.createProduct(newElectronic._id)
        if(!newProduct) {
            throw new BadRequestError('Failed to create product')
        }

        return newProduct
    }
}

ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Electronics', Electronics)

module.exports = ProductFactory