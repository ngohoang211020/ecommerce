"use strict";

//!dbmg

const { Schema, model } = require("mongoose");

//Declaration of the schema
const DOCUMENT_NAME = "ApiKey";
const COLLECTION_NAME = "ApiKeys";

var apiKeySchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    }, 
    permissions: {
      type: [String],
      required: true,
      enum: ['0000','1111','2222']
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, apiKeySchema);
