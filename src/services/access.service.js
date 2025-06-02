"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const keyTokenService = require("../services/keyToken.service");
const {createTokenPair} = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      // step 1: check email exists?
      const holderShop = await shopModel.findOne({ email }).lean();
      if (holderShop) {
        return {
          code: "xxx",
          message: "Shop already exists",
          status: "error",
        };
      }

      const passwordHash = await bcrypt.hash(password, 10);

      // step 2: create a new shop
      const newShop = await shopModel.create({
        name:name,
        email: email,
        password: passwordHash,
        roles: [RoleShop.SHOP],
      });

      if (newShop) {
        // Create private key and public key for the shop
        const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: "pkcs1",
            format: "pem",
          },
          privateKeyEncoding: {
            type: "pkcs1",
            format: "pem",
          },
        });

        const publicKeyString = keyTokenService.createKeyToken({
          user: newShop._id,
          publicKey: publicKey,
        });

        if (!publicKeyString) {
          return {
            code: "xxx",
            message: "Failed to create public key",
            status: "error",
          };
        }

        const publicKeyObject = crypto.createPublicKey({
          key: publicKeyString
        });

        // create token pair
        const tokens = await createTokenPair(
          {
            user: newShop._id,
            email: newShop.email,
          },
          publicKeyObject,
          privateKey
        );

        console.log(`Create token success::`, tokens);

        return {
          code: 201,
          metadata: {
            shop: getInfoData({fields: ['_id', 'name', 'email'], object: newShop}),
            tokens,
          },
        };
        // const tokens = await shopModel.findByIdAndUpdate(
      }
      return {
        code: 200,
        metadata: null,
      };
    } catch (error) {
      return {
        code: "xxx",
        message: error.message,
        status: "error",
      };
    }
  };
}

module.exports = AccessService;
