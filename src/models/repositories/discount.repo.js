'use strict'

const { Types } = require("mongoose");
const { discount } = require("../discount.model");

const { unSelectData, getSelectData } = require("../../utils/index");
const { get, filter } = require("lodash");

const updateDiscountById = async ({
  discountId,
  bodyUpdate,
  isNew = true 
}) => {
  return await discount.findByIdAndUpdate(discountId, { $set: bodyUpdate }, {
    new: isNew
  })
}

const findAllDiscountCodesUnselect = async ({
  limit = 50, page = 1, sort ='ctime', filter, unSelect, model   
}) => {
   const skip = (page - 1) * limit;
    const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
    const products = await model
      .find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .select(unSelect(unSelect))
      .lean();
    return products;
}

const findAllDiscountCodeSelect = async ({
  limit = 50, page = 1, sort ='ctime', filter, select, model   
}) => {
   const skip = (page - 1) * limit;
    const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
    const products = await model
      .find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .select(getSelectData(select))
      .lean();
    return products;
}

const checkDiscountExists = (model, filter) => {
  return await model.findOne(filter).lean()
}

module.exports = {
  updateDiscountById,
  findAllDiscountCodesUnselect,
  findAllDiscountCodeSelect,
  checkDiscountExists
}