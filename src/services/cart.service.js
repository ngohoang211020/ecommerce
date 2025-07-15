"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");

const { cart } = require("../models/cart.model");
const { getProductById } = require("../models/repositories/product.repo");

/*
    * CartService is a service that handles the cart operations.
    1. add product to cart
    2. remove product from cart
    3. update product quantity in cart
    4. get cart items
    5. clear cart
    6. calculate total price of cart
    7. apply discount code
    8. get cart summary
*/
class CartService {
  static async createCart({ userId, product = {} }) {
    // check if cart already exists for user
    const query = { cart_userId: userId, cart_state: "active" };
    const updateOrInsert = {
      $addToSet: { cart_products: product },
    };
    const options = { upsert: true, new: true };

    return await cart.findOneAndUpdate(query, updateOrInsert, options);
  }

  // update cart with new product
  static async updateUserCartQuantity({ userId, product }) {
    const { productId, quantity } = product;
    const query = {
        cart_userId: userId,
        "cart_products.productId": productId,
        cart_state: "active",
      },
      updateSet = {
        $inc: {
          "cart_products.$.quantity": quantity,
        },
      },
      options = { new: true, upsert: true };

    return await cart.findOneAndUpdate(query, updateSet, options);
  }

  // add product to cart
  static async addProductToCart({ userId, product = {} }) {
    // check cart exists for user
    const userCart = await cart.findOne({ cart_userId: userId });
    if (!userCart) {
      return await CartService.createCart({ userId, product });
    }
    // Check if product already exists in cart
    const exists = userCart.cart_products.some(
      (item) => item.productId.toString() === product.productId.toString()
    );

    if (!exists) {
      // Add new product to cart
      userCart.cart_products.push(product);
      console.log("userCart.cart_products", userCart.cart_products);
      return await userCart.save();
    }

    console.log("userCart.cart_products", userCart.cart_products);

    if (!userCart.cart_products.length) {
      userCart.cart_products = product;
      return await userCart.save();
    }

    return await CartService.updateUserCartQuantity({ userId, product });
  }

  //update cart
  /*
    shop_order_ids: [
        {
    shopId,
    item_products: {
        productId,
        quantity,
        old_quantity,
        price,
        shopId
    }
    }
    ]
  */
  static async addProductToCartV2({ userId, shop_order_ids }) {
    const { productId, quantity, old_quantity } =
      shop_order_ids[0]?.item_products[0];

    console.log(
      "productId, quantity, old_quantity",
      productId,
      quantity,
      old_quantity
    );
    // check product exists in cart
    const foundProduct = await getProductById({ productId });
    if (!foundProduct) {
      throw new NotFoundError(`Product not found`);
    }

    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
      throw new BadRequestError(`Product not found in this shop`);
    }

    if (quantity === 0) {
      // remove product from cart
    }

    return await CartService.updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity,
      },
    });
  }

  // Delete product from cart
  static async deleteProductFromCart({ userId, productId }) {
    const query = { cart_userId: userId, cart_state: "active" };
    const updateSet = {
      $pull: {
        cart_products: {
          productId,
        },
      },
    };

    return await cart.findOneAndUpdate(query, updateSet);
  }

  // Get List User Cart
  static async getListUserCart({ userId }) {
    return await cart.findOne({ cart_userId: userId }).lean();
  }
}

module.exports = CartService;
