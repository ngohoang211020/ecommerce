"use strict";

const { product, clothing, electronic } = require("../models/product.model");
const { BadRequestError } = require("../core/error.response");
const {
  removeUndefinedObject,
  updateNestedObjectParser,
} = require("../utils/index");
const {
  findAllDraftsForShop,
  publishProductByShop,
  findAllPublishedForShop,
  searchProductByUser,
  unPublishedProductByShop,
  findAllProducts,
  findProduct,
  updateProductById,
} = require("../models/repositories/product.repo");

class ProductFactory {
  static productRegistry = {};

  static registerProductType(type, productClass) {
    if (this.productRegistry[type]) {
      throw new BadRequestError(`Product type ${type} is already registered`);
    }
    this.productRegistry[type] = productClass;
  }

  //POST
  static async createProduct(type, payload) {
    const ProductClass = this.productRegistry[type];
    if (!ProductClass) {
      throw new BadRequestError(`Product type ${type} is not registered`);
    }

    return new ProductClass(payload).createProduct();
  }

  static async updateProduct(type, productId, payload) {
    const ProductClass = this.productRegistry[type];
    if (!ProductClass) {
      throw new BadRequestError(`Product type ${type} is not registered`);
    }

    return new ProductClass(removeUndefinedObject(payload)).updateProduct(
      productId
    );
  }

  //PUT
  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id });
  }

  // query product
  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftsForShop({ query, limit, skip });
  }

  // query product
  static async findAllPublishedForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublish: true };
    return await findAllPublishedForShop({ query, limit, skip });
  }

  static async unPublishedProductForShop({ product_shop, product_id }) {
    return await unPublishedProductByShop({ product_shop, product_id });
  }

  static async searchProduct({ keySearch }) {
    return await searchProductByUser({ keySearch });
  }

  static async findAllProducts({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublish: true },
  }) {
    return await findAllProducts({
      limit,
      sort,
      filter,
      page,
      select: ["product_name", "product_description", "product_thumb"],
    });
  }

  static async findProduct({ product_id }) {
    return await findProduct({ product_id, unSelect: ["__v"] });
  }
}

//define base product class

class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  async createProduct(product_id) {
    return await product.create({ ...this, _id: product_id });
  }

  async updateProduct(productId, payload) {
    return await updateProductById({
      productId,
      bodyUpdate: payload,
      model: product,
      isNew: true,
    });
  }
}

// Define sub-classes for specific product types
class Clothing extends Product {
  async createProduct() {
    console.log("Creating clothing product with attributes:", this);
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) {
      throw new BadRequestError("Failed to create clothing product");
    }
    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) {
      throw new BadRequestError("Failed to create product");
    }

    return newProduct;
  }

  async updateProduct(productId) {
    const objectParams = this;
    let cleanedAttributes = objectParams.product_attributes
      ? removeUndefinedObject(
          updateNestedObjectParser(objectParams.product_attributes)
        )
      : undefined;
    console.log(cleanedAttributes)
    if (cleanedAttributes && Object.keys(cleanedAttributes).length > 0) {
      await updateProductById({
        productId,
        bodyUpdate: cleanedAttributes,
        model: clothing,
        isNew: true,
      });
    }

    const updateProduct = super.updateProduct(
      productId,
      updateNestedObjectParser(objectParams)
    );
    return updateProduct;
  }
}

class Electronics extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic) {
      throw new BadRequestError("Failed to create electronic product");
    }
    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) {
      throw new BadRequestError("Failed to create product");
    }

    return newProduct;
  }

  async updateProduct(productId) {
    const objectParams = this;
    if (objectParams.product_attributes) {
      await updateProductById({
        productId,
        bodyUpdate: updateNestedObjectParser(objectParams),
        model: electronic, // <-- use the correct model
        isNew: true,
      });
    }

    const updateProduct = super.updateProduct(productId, objectParams);
    return updateProduct;
  }
}

ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Electronics", Electronics);

module.exports = ProductFactory;
