"use strict";

const { inventory } = require("../models/inventory.model");

const { BadRequestError } = require("../core/error.response");
const { getProductById } = require("../models/repositories/product.repo");
const { convertToObjectIdMongodb } = require("../utils");

class InventoryService {
  static async addStockToInventory({
    stock,
    productId,
    shopId,
    location = "Da Nang City",
  }) {
    const product = await getProductById(productId);
    if (!product) throw new BadRequestError("The product does not exists");

    const query = {
        inven_shopId: shopId,
        inven_productId: productId,
      },
      updateSet = {
        $inc: {
          inven_stock: stock,
        },
        $set: {
          inven_location: location,
        },
      },
      options = { upsert: true, new: true };

    return await inventory.findOneAndUpdate(query, updateSet, options);
  }
}

module.exports = InventoryService
