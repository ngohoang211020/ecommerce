"use strict";

const { update } = require("lodash");
const keyTokenModel = require("../models/keytoken.model");

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey,privateKey, refreshToken}) => {
    try {
      //level 0

      // const tokens = await keyTokenModel.create({
      //   user,
      //    publicKey,
      //    privateKey,
      // });

      // return tokens ? tokens.publicKey : null;
      
      //level xxx
      const filter = {user: userId} ,update = {
        publicKey, privateKey, refreshTokenUsed: [], refreshToken},
        options = { upsert: true, new: true };
      const tokens = await keyTokenModel.findOneAndUpdate(filter,update,options)

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };
}

module.exports = KeyTokenService;
