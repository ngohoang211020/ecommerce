"use strict";

const CartService = require("../services/cart.service");

const { SuccessResponse } = require("../core/success.response");

class CartController {


  /*
  * Add product to cart
    * @param {Object} req - The request object containing userId and product details
    * @param {Object} res - The response object to send the result
    * @param {Function} next - The next middleware function
    * @returns {Promise<void>} - A promise that resolves when the product is added to
    * the cart successfully
  */  
  addToCart = async (req, res, next) => {
    console.log("Add to cart request body: ", req.body);
    new SuccessResponse({
      message: "Add to cart successfully",
      metadata: await CartService.addProductToCart({...req.body}),
    }).send(res);
  };

  updateCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Update cart successfully",
      metadata: await CartService.addProductToCartV2({...req.body}),
    }).send(res);
  };

  deleteProductFromCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Delete product from cart successfully",
      metadata: await CartService.deleteProductFromCart({...req.body}),
    }).send(res);
  };

  listCartItems = async (req, res, next) => {
    new SuccessResponse({
      message: "List cart items successfully",
      metadata: await CartService.getListUserCart({  ...req.query, }),
    }).send(res);
  }


}

module.exports = new CartController();
