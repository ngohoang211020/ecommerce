"use strict";
const AccessService = require("../services/access.service");
const { CREATED, SuccessResponse } = require("../core/success.response");

class AccessController {
  handlerRefreshToken = async (req, res, next) => {
    SuccessResponse.create({
      message: "Generate new access token successfully",
      metadata: await AccessService.handlerRefreshToken(req.body.refreshToken),
    }).send(res);
  };

  logout = async (req, res, next) => {
    SuccessResponse.create({
      message: "Logout successfully",
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  };

  login = async (req, res, next) => {
    CREATED.create({
      message: "Login successfully",
      metadata: await AccessService.login(req.body),
    }).send(res);
  };

  signUp = async (req, res, next) => {
    CREATED.create({
      message: "Create new user",
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  };
}

module.exports = new AccessController();
