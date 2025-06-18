"use strict";

const ProductService = require("../services/product.service");

const { SuccessResponse } = require("../core/success.response");

class ProductController {
  createProduct = async (req, res, next) => {
    SuccessResponse.create({
      message: "Create product successfully",
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

    //update product
    updateProduct = async (req, res, next) => {
    SuccessResponse.create({
      message: "Update product successfully",
      metadata: await ProductService.updateProduct(req.body.product_type,req.params.productId,{
        ...req.body,
        product_shop: req.user.userId
    }),
    }).send(res);
  };

  publishProduct = async (req, res, next) => {
    SuccessResponse.create({
      message: "Publish product successfully",
      metadata: await ProductService.publishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  unPublishProduct = async (req, res, next) => {
    SuccessResponse.create({
      message: "unPublish product successfully",
      metadata: await ProductService.unPublishedProductForShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
  //QUERY
  getAllDraftsForShop = async (req, res, next) => {
    SuccessResponse.create({
      message: "Get list draft products success!",
      metadata: await ProductService.findAllDraftsForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getAllPublishedForShop = async (req, res, next) => {
    SuccessResponse.create({
      message: "Get list published products success!",
      metadata: await ProductService.findAllPublishedForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getListSearchProduct = async (req, res, next) => {
    SuccessResponse.create({
      message: "Get list search product!",
      metadata: await ProductService.searchProduct(req.params),
    }).send(res);
  };

  getAllProducts = async (req, res, next) => {
    SuccessResponse.create({
      message: "Get all products successfully!",
      metadata: await ProductService.findAllProducts(req.query),
    }).send(res);
  };

  findProduct = async (req, res, next) => {
    SuccessResponse.create({
      message: "Get product!",
      metadata: await ProductService.findProduct({
        product_id: req.params.product_id
      }),
    }).send(res);
  };
  //END QUERY//
}

module.exports = new ProductController();
