"use strict";

const keyTokenModel = require("../models/keytoken.model");

class KeyTokenService {
  static createKeyToken = async ({ user, publicKey }) => {
    try {
      const publicKeyString = publicKey.toString();
      const tokens = await keyTokenModel.create({
        user,
        publicKey: publicKeyString,
      });

      return tokens ? tokens.publicKey : null;
      
    } catch (error) {
      return error;
    }
  };
}

module.exports = KeyTokenService;
