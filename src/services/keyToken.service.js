"use strict";

const { update, find } = require("lodash");
const keyTokenModel = require("../models/keytoken.model");
const { Types, default: mongoose } = require("mongoose");
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

  // static findByUserId = async (userId) => {
  //     return await keyTokenModel.findOne({user: mongoose.Types.ObjectId(userId)}).lean();
  // };

static findByUserId = async ({userId}) => {
  try {
    return await keyTokenModel.findOne({ user: userId }).lean();
  } catch (error) {
    return null;
  }
};


  static removeKeyById = async (id) => {
    return await keyTokenModel.findByIdAndDelete(id)
  }

static findByRefreshTokensUsed = async (refreshToken) => {
  return await keyTokenModel.findOne({
    refreshTokensUsed: refreshToken,
  }).lean();
}

static findByRefreshToken = async (refreshToken) => {
  return await keyTokenModel.findOne({
    refreshToken: refreshToken,
  }).lean();
}

static deleteByUserId = async (userId) => {
  return await keyTokenModel.deleteOne({ user: userId });
};

static updateKeyTokenById = async (id, update) => {
  return await keyTokenModel.findByIdAndUpdate(id, update, { new: true });
};

}
module.exports = KeyTokenService;
