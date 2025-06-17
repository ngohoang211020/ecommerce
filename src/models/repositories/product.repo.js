"use strict";

const { Types } = require("mongoose");
const { product, clothing, electronic } = require("../product.model");

const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const findAllPublishedForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const searchProductByUser = async ({keySearch}) => {
    const regexSearch = new RegExp(keySearch)
    const results = await product.find({
        isPublish: true,
        $text: {$search: regexSearch}},
        {score: {$meta: 'textScore'}}
    ).sort({score: {$meta: 'textScore'}})
    .lean()
    return results;
};

const publishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });
  if (!foundShop) return null;

  foundShop.isDraft = false;
  foundShop.isPublish = true;
  await foundShop.save();

  return 1;
};

const unPublishedProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });
  if (!foundShop) return null;

  foundShop.isDraft = true;
  foundShop.isPublish = false;
  await foundShop.save();

  return 1;
};

const queryProduct = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({
      updatedAt: -1,
    })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};
module.exports = {
  findAllDraftsForShop,
  publishProductByShop,
  findAllPublishedForShop,
  unPublishedProductByShop,
  searchProductByUser
};
