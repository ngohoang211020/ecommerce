"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const keyTokenService = require("../services/keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
} = require("../core/error.response");
const { findByEmail } = require("./shop.service");
const KeyTokenService = require("../services/keyToken.service");
const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static handlerRefreshTokenV2 = async ({ keyStore, user, refreshToken }) => {
    const { userId, email } = user;
    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      // Delete all refresh tokens used
      await KeyTokenService.deleteByUserId(user);
      throw new ForbiddenError("Some thing went wrong, please login again");
    }
    if (keyStore.refreshToken !== refreshToken) {
      throw new UnauthorizedError("Shop not registed");
    }
    //check userId
    const foundShop = await findByEmail({ email });
    if (!foundShop) {
      throw new UnauthorizedError("Shop not registed");
    }
    // create new token pair
    const newTokens = await createTokenPair(
      {
        user: foundShop._id,
        email: foundShop.email,
      },
      keyStore.publicKey,
      keyStore.privateKey
    );

    await keyTokenService.updateKeyTokenById(keyStore._id, {
      $set: { refreshToken: newTokens.refreshToken },
      $addToSet: { refreshTokensUsed: refreshToken },
    });

    return {
      user: { user, email },
      newTokens,
    };
  };

  static handlerRefreshToken = async (refreshToken) => {
    //check xem token nay da duoc su dung chua
    const foundToken = await keyTokenService.findByRefreshTokensUsed(
      refreshToken
    );
    if (foundToken) {
      //decode xem cua tk nao
      const { user, email } = await verifyJWT(
        refreshToken,
        foundToken.privateKey
      );

      //xoa tat ca token
      await KeyTokenService.deleteByUserId(user);

      throw new ForbiddenError("Some thing went wrong, please login again");
    }

    // No
    const holderToken = await keyTokenService.findByRefreshToken(refreshToken);
    if (!holderToken) {
      throw new UnauthorizedError("Invalid refresh token");
    }

    //verify token
    const { user, email } = await verifyJWT(
      refreshToken,
      holderToken.privateKey
    );

    //check userId
    const foundShop = await findByEmail({ email });
    if (!foundShop) {
      throw new UnauthorizedError("Shop not registed");
    }

    // create new token pair
    const newTokens = await createTokenPair(
      {
        user: foundShop._id,
        email: foundShop.email,
      },
      holderToken.publicKey,
      holderToken.privateKey
    );

    await keyTokenService.updateKeyTokenById(holderToken._id, {
      $set: { refreshToken: newTokens.refreshToken },
      $addToSet: { refreshTokensUsed: refreshToken },
    });

    return {
      user: { user, email },
      newTokens,
    };
  };

  static logout = async (keyStore) => {
    return await keyTokenService.removeKeyById(keyStore._id);
  };

  static login = async ({ email, password, refreshToken = null }) => {
    // step 1: check email exists?

    const foundShop = await findByEmail({ email });

    if (!foundShop) {
      throw new BadRequestError("Error: Shop not registed");
    }

    // step 2: check password is correct?
    if (!password || !foundShop?.password) {
      throw new BadRequestError("Missing credentials");
    }
    const match = bcrypt.compare(password, foundShop.password);

    if (!match) {
      throw new UnauthorizedError("Authentication failed: Invalid password");
    }

    // step 3: create token pair
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    // step 4: generate key token
    const tokens = await createTokenPair(
      {
        userId: foundShop._id,
        email: foundShop.email,
      },
      publicKey,
      privateKey
    );

    const keyStore = keyTokenService.createKeyToken({
      userId: foundShop._id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });

    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    // step 1: check email exists?
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError("Error: Shop already exists with this email1");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // step 2: create a new shop
    const newShop = await shopModel.create({
      name: name,
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
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");
      // Public key Crypto standard

      const keyStore = keyTokenService.createKeyToken({
        user: newShop._id,
        publicKey: publicKey,
        privateKey: privateKey,
      });

      if (!keyStore) {
        //TODO: handle error
        throw new BadRequestError("Error: Key store creation failed");
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
        metadata: {
          shop: getInfoData({
            fields: ["_id", "name", "email"],
            object: newShop,
          }),
          tokens,
        },
      };
    }
    return {
      code: 200,
      metadata: null,
    };
  };
}

module.exports = AccessService;
