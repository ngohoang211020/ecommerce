"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const keyTokenService = require("../services/keyToken.service");
const {createTokenPair} = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError } = require("../core/error.response");
const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static signUp = async ({ name, email, password }) => {
      // step 1: check email exists?
      const holderShop = await shopModel.findOne({ email }).lean();
      if (holderShop) {
        throw new BadRequestError('Error: Shop already exists with this email1');
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
        // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
        //   modulusLength: 4096,
        //   publicKeyEncoding: {
        //     type: "pkcs1",
        //     format: "pem",
        //   },
        //   privateKeyEncoding: {
        //     type: "pkcs1",
        //     format: "pem",
        //   },
        // });
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')
        // Public key Crypto standard        

        const keyStore = keyTokenService.createKeyToken({
          user: newShop._id,
          publicKey: publicKey,
          privateKey: privateKey,
        });

        if (!keyStore) {
          return {
            code: "xxx",
            message: "keyStore error"
          };
        }

        // create token pair
        const tokens = await createTokenPair(
          {
            user: newShop._id,
            email: newShop.email,
          },
          publicKey,
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
  };
}

module.exports = AccessService;
