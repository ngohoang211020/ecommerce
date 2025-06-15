"use strict";

const { UnauthorizedError, NotFoundError } = require("../core/error.response");
const KeyStoreService = require("../services/keyToken.service");
const JWT = require("jsonwebtoken");
const { asyncHandler } = require("../helpers/asyncHandler");
const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
  CLIENT_ID: "client-id",
  REFRESH_TOKEN: "x-rftoken",
};
const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // access token
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    JWT.verify(accessToken, publicKey, (err, decoded) => {
      if (err) {
        console.error("Access token verification failed:", err);
      } else {
        console.log("Access token is valid:", decoded);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {}
};

const authentication = asyncHandler(async (req, res, next) => {
  // Check userId in request
  // Get access token from request header
  // Verify token
  // Check user in bds
  // Check keyStore with this userId
  // Ok all => return next()
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) {
    throw new UnauthorizedError("Authentication Error");
  }

  //2
  const keyStore = await KeyStoreService.findByUserId({ userId });
  if (!keyStore) {
    throw new NotFoundError("KeyStore not found for this user");
  }

  //3
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) {
    throw new UnauthorizedError("Invalid Request");
  }

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (decodeUser.userId !== userId) {
      throw new UnauthorizedError("Invalid User");
    }
    req.keyStore = keyStore;
    req.user = decodeUser;
    return next();
  } catch (catchError) {
    throw catchError;
  }
});

const authenticationV2 = asyncHandler(async (req, res, next) => {
  // Check userId in request
  // Get access token from request header
  // Verify token
  // Check user in bds
  // Check keyStore with this userId
  // Ok all => return next()
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) {
    throw new UnauthorizedError("Authentication Error");
  }

  //2
  const keyStore = await KeyStoreService.findByUserId({ userId });
  if (!keyStore) {
    throw new NotFoundError("KeyStore not found for this user");
  }
  console.log(req.headers);

  //3
  const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
  if (refreshToken) {
    try {
      const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);
      if (decodeUser.userId !== userId) {
        throw new UnauthorizedError("Invalid User");
      }
      req.keyStore = keyStore;
      req.user = decodeUser;
      req.refreshToken = refreshToken;
      return next();
    } catch (catchError) {
      throw catchError;
    }
  }
  
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) {
    throw new UnauthorizedError("Invalid Request");
  }
  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (decodeUser.userId !== userId) {
      throw new UnauthorizedError("Invalid User");
    }
    req.keyStore = keyStore;
    req.user = decodeUser;
    return next();
  } catch (catchError) {
    throw catchError;
  }
});

const verifyJWT = async (token, keySecret) => {
  return JWT.verify(token, keySecret);
};

module.exports = {
  createTokenPair,
  authentication,
  verifyJWT,
  authenticationV2
};
