'use strict'

const { convertToObjectIdMongodb } = require('../../utils')
const { inventory } = require('../inventory.model')



const insertInventory = async ({
    productId, shopId, stock, location = 'unKnown', reservations = []
}) => {
    return await inventory.create({
        inven_productId: convertToObjectIdMongodb(productId),
        inven_location: location,
        inven_stock: stock,
        inven_shopId: convertToObjectIdMongodb(shopId),
        inven_reservations: reservations
    })
}

const reservationInventory = async ({productId, quantity, cartId}) => {
    const query = {
        inven_productId: convertToObjectIdMongodb(productId),
        inven_stock: {$gte: quantity}
    }, updateSet = {
        $inc: {
            inven_stock: -quantity
        },
        $push: {
            inven_reservations: {
                quantity,
                cartId,
                createOn: new Date()
            }
        }
    }, options= {
        upsert:true, new: true
    }

    return await inventory.updateOne(query,options)
}
module.exports = {
    insertInventory,
    reservationInventory
}