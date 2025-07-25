'use strict'

const redis = require('redis')
const redisClient = redis.createClient()
const {promisify} = require('util')
const { product } = require('../models/product.model')
const {reservationInventory} = require("../models/repositories/inventory.repo")

const pexpire = promisify(redisClient.pExpire).bind(redisClient)

const setnxAsync = promisify(redisClient.setNX).bind(redisClient)

const acquireLock = async(productId, quantity, cartId) => {
    const key =`lock_v2025_${productId}`
    const retrtTimes = 10
    const expireTime = 3000 // 3 seconds tam lock

    for(let index=0; index < retrtTimes.length; i++){
        const result = await setnxAsync(key,expireTime)
        console.log(`result:::`, result)
        if(result ===1){
            // thao tac voi inventory
            const isReservationInventory = await reservationInventory({productId,quantity,cartId})
            if(isReservationInventory.modifiedCount){
                await pexpire(key,expireTime)
                return key
            }
            return null
        } else {
            await new Promise((resolve) => setTimeout(resolve, 50))
        }
    }
}

const releaseLock = async keyLock => {
    const delAsyncKey = promisify(redisClient.del).bind(redisClient)
    return await delAsyncKey(keyLock)
}

module.exports={
    acquireLock,
    releaseLock
}