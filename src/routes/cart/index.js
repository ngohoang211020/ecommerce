"use strict";

const express = require("express");
const cartController = require("../../controllers/cart.controller");
const router = express.Router();
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");

router.use(authenticationV2);

router.post("", asyncHandler(cartController.addToCart));
router.post("/update",asyncHandler(cartController.updateCart));
router.delete("",asyncHandler(cartController.deleteProductFromCart));
router.get("",asyncHandler(cartController.listCartItems));

module.exports = router;
