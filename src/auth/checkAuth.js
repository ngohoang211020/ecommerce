'use strict'

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}
const ApiKeyService = require('../services/apiKey.service')

const apiKey = async (req,res,next) => {
    try {
        const key= req.headers[HEADER.API_KEY]?.toString();

        if(!key) {
            return res.status(403).json({ message: 'Forbidden Error' });
        }

        //check objKey
        const objKey = await ApiKeyService.findById(key);
        if(!objKey) {
            return res.status(403).json({ message: 'Forbidden Error' });
        }
        req.objKey = objKey;
        return next();

    } catch (error) {
        
    }
}


const permissions = (permission) => {
    return (req,res,next) => {
        if(!req.objKey.permissions){
            return res.status(403).json({ 
                message: 'permission denied', 
            })
        }

        console.log('permissions', req.objKey.permissions)

        if(!req.objKey.permissions.includes(permission)) {
            return res.status(403).json({ 
                message: 'permission denied', 
            })
        }

        return next()
    }
}


const asyncHandler = (fn) => {
    return (req,res,next) => {
        fn(req,res,next).catch(next)
    }
}
module.exports = {
    apiKey,
    permissions,
    asyncHandler
}