"use strict";

const { findCartById } = require("../models/repositories/cart.repo");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const { checkProductByServer } = require("../models/repositories/product.repo");
const { getDiscountAmount } = require("../services/discount.service");
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
}

module.exports = CheckoutService;
