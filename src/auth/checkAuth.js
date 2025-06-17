"use strict";

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};
const { ForbiddenError, UnauthorizedError } = require("../core/error.response");
const ApiKeyService = require("../services/apiKey.service");

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();

    if (!key) {
      throw new ForbiddenError("Forbidden Error");
    }

    //check objKey
    const objKey = await ApiKeyService.findById(key);
    if (!objKey) {
      throw new ForbiddenError("Forbidden Error");
    }
    req.objKey = objKey;
    return next();
  } catch (error) {}
};

const permissions = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      throw new UnauthorizedError("Unauthorized Error: No permissions found");
    }

    if (!req.objKey.permissions.includes(permission)) {
      throw new UnauthorizedError("Unauthorized Error: No permissions found");
    }

    return next();
  };
};


module.exports = {
  apiKey,
  permissions
};
