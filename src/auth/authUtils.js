'use strict'

const JWT = require('jsonwebtoken');
const { asyncHandler } = require('./checkAuth');
const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
    CLIENT_ID: 'client-id'
}
const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        // access token
        const accessToken = await JWT.sign(payload,publicKey,{
            expiresIn: '2 days'
        })

          const refreshToken = await JWT.sign(payload,privateKey,{
            expiresIn: '7 days'
        })

        JWT.verify(accessToken, publicKey, (err, decoded) => {
            if (err) {
                console.error('Access token verification failed:', err);
            } else {
                console.log('Access token is valid:', decoded);
            }
        });

        return { accessToken, refreshToken }
    } catch (error) {
        
    }
}

const authentication = asyncHandler( async (req, res, next) => {
    // Check userId in request
    // Get access token from request header
    // Verify token
    // Check user in bds
    // Check keyStore with this userId
    // Ok all => return next()
    const userId = req.headers[HEADER_CLIENT_ID]
    if(!userId) {
        throw new AuthenticationError('Authentication Error')
    }

    //2 
    const keyStore = await KeyStoreService.findByUserId(userId);
    if(!keyStore) {
        throw new AuthenticationError('Authentication Error')
    }
    
})

module.exports = {
    createTokenPair
}