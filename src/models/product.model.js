"use strict";

const { model, Schema, Types } = require("mongoose");

const DOCUMNENT_NAME = "Product";
const COLLECTION_NAME = "Products";

const productSchema = new Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_thumb: {
      type: String,
      required: true,
    },
    product_description: String,
    product_price: {
      type: Number,
      required: true,
    },
    product_quantity: {
      type: Number,
      required: true,
    },
    product_type: {
      type: String,
      enum: ['Electronics', 'Clothing', 'Furniture'],
      required: true,
    },
    product_shop: {
        type: Types.ObjectId,
        ref: "Shop",
    },
    product_attributes: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

// define product type = electronic

const electronicSchema = new Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    size: String,
    material: String,
  },
  {
    collection: "Electronics",
    timestamps: true,
  }
);

// define product type = clothing
const clothingSchema = new Schema(
  {
    size: {
      type: String,
      required: true,
    },
    color: String,
    material: String,
  },
  {
    collection: "Clothes",
    timestamps: true,
  }
);

module.exports = {
    product: model(DOCUMNENT_NAME, productSchema),
    electronic: model('Electronics', electronicSchema),
    clothing: model('Clothing', clothingSchema)
}