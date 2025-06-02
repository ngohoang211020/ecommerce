"use strict";

const keyTokenModel = require("../models/keytoken.model");

class KeyTokenService {
  static createKeyToken = async ({ user, publicKey,privateKey}) => {
    try {
      const tokens = await keyTokenModel.create({
        user,
         publicKey,
         privateKey,
      });

      return tokens ? tokens.publicKey : null;
      
    } catch (error) {
      return error;
    }
  };
}

module.exports = KeyTokenService;
