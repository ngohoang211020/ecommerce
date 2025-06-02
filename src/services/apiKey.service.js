'use strict'

const apiKeyModel = require('../models/apikey.model')


class ApiKeyService {
    static findById = async (key) => {
        try {   
            // const objectKey = await apiKeyModel.create({key, status: true, permissions: ['0000']});
            // if (!objectKey) {
            //     return null;
            // }

            const objKey = await apiKeyModel.findOne({key,status:true});
            return objKey ? objKey : null;
        } catch (error) {
            return error;
        }
    }
}

module.exports =ApiKeyService