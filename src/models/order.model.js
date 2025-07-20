"use strict";

const { Schema, model } = require("mongoose");

//Declaration of the schema
const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "Orders";

var orderSchema = new Schema(
  {
    order_user_id: {
      type: Number,
      required: true,
    },
    order_checkout: {
      type: Object,
      default: {},
    },
    /*
     order_checkout:{
        totalPrice,
        totalApplyDiscount,
        feeShip
     }
    */
    order_shipping: {
      type: Object,
      default: {},
    },
    /*
   street, city, state, zipcode
*/
    order_payment: {
      type: Object,
      default: {},
    },
    order_products: {
      type: Array,
      required: true,
    },
    order_trackingNumber: {
      type: String,
      default: "#000118052022",
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = {
  order: model(DOCUMENT_NAME, inventorySchema),
};
