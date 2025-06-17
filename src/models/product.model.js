"use strict";

const { model, Schema, Types } = require("mongoose");

const DOCUMNENT_NAME = "Product";
const COLLECTION_NAME = "Products";
const slugify = require("slugify");

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
    product_slug: String,
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
      enum: ["Electronics", "Clothing", "Furniture"],
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
    product_ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must be at most 5"],
      set: (v) => Math.round(v * 10) / 10, // round to one decimal place
    },
    product_variations: {
      type: Array,
      default: [],
    },
    isDraft: {
      type: Boolean,
      default: true,
      // indexing this field can improve query performance
      // especially when filtering products based on draft status
      index: true,
      // this field is not included in the JSON output
      // when converting the document to JSON
      // useful for APIs where you don't want to expose draft status
      select: false,
    },
    isPublish: {
      type: Boolean,
      default: false,
      index: true,
      select: false,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

//create index for search
productSchema.index({product_name: 'text', product_description: 'text'})

// Document middleware to set product_slug before saving
// This middleware runs before the document is saved to the database
productSchema.pre('save', function (next) {
  this.product_slug = slugify(this.product_name, {
    lower: true,
  });
  next();
})

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
  electronic: model("Electronics", electronicSchema),
  clothing: model("Clothing", clothingSchema),
};
