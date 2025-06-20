"use strict";

//!dbmg

const { Schema, model } = require("mongoose");

//Declaration of the schema
const DOCUMENT_NAME = "Key";
const COLLECTION_NAME = "Keys";

var keyTokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      trim: true,
      ref: "Shop",
    },
    publicKey: {
      type: String,
      required: true,
    },
    privateKey: {
      type: String,
      required: true,
    },
    refreshTokensUsed: {
      type: Array,
      default: [],
    },
    refreshToken: {
      type: String,
      required: true
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, keyTokenSchema);
