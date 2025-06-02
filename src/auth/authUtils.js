'use strict'

const JWT = require('jsonwebtoken');

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

module.exports = {
    createTokenPair
}