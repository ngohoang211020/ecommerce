"use strict";

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "Carts";

const cartSchema = new Schema(
  {
    cart_state: {
      type: String,
      required: true,
      enum: ["active", "completed", "failed", "pending"], // state of the cart
      default: "active",
    },
    cart_products: {
      type: Array,
      required: true,
      default: [],
    }, // array of product IDs in the cart
    /*
        [
    {
        productId,
        shopId,
        quantity,
        price,
        name    
    }]
    */
    cart_count_products: {
      type: Number,
      required: true,
      default: 0,
    },
    cart_userId: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "createdOn",
      updatedAt: "modifiedOn",
    },
    collection: COLLECTION_NAME,
  }
);
//export the model
module.exports = {
  cart: model(DOCUMENT_NAME, cartSchema),
};
