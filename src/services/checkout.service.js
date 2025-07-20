"use strict";

const { findCartById } = require("../models/repositories/cart.repo");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const { checkProductByServer } = require("../models/repositories/product.repo");
const { getDiscountAmount } = require("../services/discount.service");
const { order } = require("../models/order.model");
const { acquireLock, releaseLock } = require("./redis.service");
class CheckoutService {
  //login and without login
  /*
        {
            cartId,
            userId,
            shop_order_ids: [
                {
                    shopId,
                    shop_discount: [],
                    item_products: [
                        {
                            productId,
                            quantity,
                            price,
                        }
                    ]
                },
                {
                    shopId,
                    shop_discount: [
                        {
                            discountId,
                            codeId,
                            shopId,
                        }
                    ],
                    item_products: [
                        {
                            productId,
                            quantity,
                            price,
                        }
                    ]
                }
            ]
        }
    
    */

  static async checkoutReview({ cartId, userID, shop_order_ids = [] }) {
    //validate cartId
    const foundCart = await findCartById(cartId);
    if (!foundCart) {
      throw new BadRequestError("Cart not found or inactive");
    }
    const checkout_order = {
        totalPrice: 0,
        feeShip: 0,
        totalDiscount: 0,
        totalCheckout: 0,
      },
      shop_order_ids_new = [];

    for (let i = 0; i < shop_order_ids.length; i++) {
      // destructuring shop_order_ids
      const {
        shopId,
        shop_discounts = [],
        item_products = [],
      } = shop_order_ids[i];
      // check product available in shop
      const checkProductServerArr = await checkProductByServer(item_products);
      console.log(`checkProductServerArr::`, checkProductServerArr);
      if (!checkProductServerArr[0])
        throw new BadRequestError("order wrong!!!");
      // calculate total price for each shop

      const checkoutPrice = checkProductServerArr.reduce((acc, product) => {
        return acc + product.price * product.quantity;
      }, 0); // <-- initial value 0
      //tong tien truoc khi xu ly
      checkout_order.totalPrice = +checkoutPrice;
      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice,
        priceApplyDiscount: checkoutPrice,
        item_products: checkProductServerArr,
      };
      // console.log(`itemCheckout::`, itemCheckout);

      if (shop_discounts.length > 0) {
        // apply discount for shop
        const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
          codeId: shop_discounts[0].codeId,
          userId: userID,
          shopId,
          products: checkProductServerArr,
        });
        // console.log(`totalPrice::`, totalPrice);
        // console.log(`discount::`, discount);
        //tong tien sau khi xu ly discount
        checkout_order.totalDiscount += discount;

        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount;
        }
      }
      //tong thanh toan cuoi cung
      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;

      shop_order_ids_new.push(itemCheckout);
    }
    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order,
    };
  }

  static async orderByUser({
    shop_order_ids,
    cartId,
    userId,
    user_address = {},
    user_payment = {},
  }) {
    const { shop_order_ids_new, checkout_order } =
      await CheckoutService.checkoutReview({
        cartId,
        userID,
        shop_order_ids,
      });

    const products = shop_order_ids_new.flatMap((order) => order.item_products);
    console.log(`[1]:`, products);
    const acquireProduct = [];
    for (let i = 0; i < products.length; i++) {
      const { productId, quantity } = products[i];
      const keyLock = await acquireLock(productId, quantity, cartId);
      acquireProduct.push(keyLock ? true : false);
      if (keyLock) {
        await releaseLock(keyLock);
      }
    }

    //check if co mot san pham het hang trong kho thi
    if (acquireProduct.includes(false)) {
      throw new BadRequestError(
        "Mot so san pham da duoc cap nhat, vui long quay lai gio hang"
      );
    }

    // const newOrder = await order.cre
    const newOrder = await order.create({
      order_userId: userId,
      order_checkout: checkout_order,
      order_shipping: user_address,
      order_payment: user_payment,
      order_products: shop_order_ids_new,
    });

    // truong hop insert thanh cong thi remove product co trong cart
    if (newOrder) {
    }

    return newOrder;
  }

  /*
  1. Query Order [Users]
  */
  static async getOrdersByUser() {}

  // [USER]
  static async getOneOrderByUser(){}

  // [USER]
  static async cancelOrderByUser(){}

  // [SHOP,ADMIN]
  static async updateOrderStatusByShop(){}
}

module.exports = CheckoutService;
