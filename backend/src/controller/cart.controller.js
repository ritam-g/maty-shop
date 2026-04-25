import mongoose, { get } from "mongoose";
import cartModel from "../model/cart.model.js";
import productModel from "../model/product.model.js";
import { getMeUser } from "../services/auth.service.js";
import { AppError } from "../utils/AppError.js";
import { createOrder } from "../services/payment.service.js";

/**
 * Function Name: populateCart
 * Purpose: Load a user's cart with product details hydrated for frontend rendering.
 * Params:
 * - userId: Authenticated user id
 * Returns:
 * - Promise resolving to the populated cart document
 */
const populateCart = async (userId) => (
  cartModel.findOne({ user: userId }).populate("items.product")
);

/**
 * Function Name: getAuthenticatedUserId
 * Purpose: Normalize authenticated user id regardless of whether token payload uses id or _id.
 * Params:
 * - user: req.user payload
 * Returns:
 * - Normalized user id string or null
 */
const getAuthenticatedUserId = (user) => user?.id || user?._id || null;

/**
 * Function Name: findVariant
 * Purpose: Find the requested variant inside a product document.
 * Params:
 * - product: Product mongoose document
 * - variantId: Selected variant id
 * Returns:
 * - Matching variant object or null
 */
const findVariant = (product, variantId) => (
  product?.variants?.find((variant) => variant._id.toString() === variantId) || null
);

/**
 * Function Name: addToCartController
 * Purpose: Add a variant to cart or increase quantity when the same variant already exists.
 * Params:
 * - req.params.productId: Product id
 * - req.params.variantId: Variant id
 * - req.params.quantity: Quantity increment
 * Returns:
 * - JSON response containing the fully populated updated cart
 */
export async function addToCartController(req, res, next) {
  try {
    const { productId, variantId, quantity = 1 } = req.params;
    const requestedQuantity = Number(quantity);

    if (!Number.isInteger(requestedQuantity) || requestedQuantity <= 0) {
      throw new AppError("Quantity must be at least 1", 400);
    }

    const productDetails = await productModel.findOne({
      _id: productId,
      "variants._id": variantId,
    });

    if (!productDetails) {
      throw new AppError("Product not found", 404);
    }

    const variant = findVariant(productDetails, variantId);
    const stock = Number(variant?.stock ?? 0);

    if (requestedQuantity > stock) {
      throw new AppError("Out of stock", 400);
    }

    let cart = await cartModel.findOne({ user: req.user.id });
    if (!cart) {
      cart = await cartModel.create({ user: req.user.id, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId && item.varient?.toString() === variantId
    );

    if (existingItem) {
      const nextQuantity = Number(existingItem.quantity || 0) + requestedQuantity;
      if (nextQuantity > stock) {
        throw new AppError("Out of stock", 400);
      }

      existingItem.quantity = nextQuantity;
      existingItem.price = variant?.price || productDetails.price;
    } else {
      cart.items.push({
        product: productId,
        varient: variantId,
        quantity: requestedQuantity,
        price: variant?.price || productDetails.price,
      });
    }

    await cart.save();
    const populatedCart = await populateCart(req.user.id);

    return res.status(200).json({
      message: existingItem ? "Cart updated successfully" : "Product added to cart successfully",
      success: true,
      cart: populatedCart,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

/**
 * Function Name: updateCartItemQuantityController
 * Purpose: Set an exact cart quantity for one product variant, or remove it when quantity is zero.
 * Params:
 * - req.params.productId: Product id
 * - req.params.variantId: Variant id
 * - req.params.quantity: New absolute quantity
 * Returns:
 * - JSON response containing the fully populated updated cart
 */
export async function updateCartItemQuantityController(req, res, next) {
  try {
    const { productId, variantId, quantity } = req.params;
    const nextQuantity = Number(quantity);

    if (!Number.isInteger(nextQuantity) || nextQuantity < 0) {
      throw new AppError("Quantity must be 0 or more", 400);
    }

    const cart = await cartModel.findOne({ user: req.user.id });
    if (!cart) {
      throw new AppError("Cart not found", 404);
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId && item.varient?.toString() === variantId
    );

    if (itemIndex === -1) {
      throw new AppError("Cart item not found", 404);
    }

    if (nextQuantity === 0) {
      cart.items.splice(itemIndex, 1);
      await cart.save();

      const populatedCart = await populateCart(req.user.id);
      return res.status(200).json({
        message: "Cart item removed successfully",
        success: true,
        cart: populatedCart,
      });
    }

    const productDetails = await productModel.findOne({
      _id: productId,
      "variants._id": variantId,
    });

    if (!productDetails) {
      throw new AppError("Product not found", 404);
    }

    const variant = findVariant(productDetails, variantId);
    const stock = Number(variant?.stock ?? 0);

    if (nextQuantity > stock) {
      throw new AppError("Out of stock", 400);
    }

    cart.items[itemIndex].quantity = nextQuantity;
    cart.items[itemIndex].price = variant?.price || productDetails.price;
    await cart.save();

    const populatedCart = await populateCart(req.user.id);
    return res.status(200).json({
      message: "Cart quantity updated successfully",
      success: true,
      cart: populatedCart,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

/**
 * Function Name: getCartController
 * Purpose: Return the authenticated user's cart with product details populated.
 * Params:
 * - req.user: Authenticated user payload
 * Returns:
 * - JSON response containing the cart document
 */
export const getCartController = async (req, res) => {
  const userId = getAuthenticatedUserId(req.user);

  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }

  let cart = await populateCart(userId);

  if (!cart) {
    await cartModel.create({ user: userId, items: [] });
    cart = await populateCart(userId);
  }

  return res.status(200).json({
    message: "Cart fetched successfully",
    success: true,
    cart,
  });
};


/**  
 * Function Name: getCartTotalPrice
 * Purpose: Calculate and return the total price of all items in the authenticated user's cart.
 * Params:
 * - req.user: Authenticated user payload
 * Returns:
 * - JSON response containing the total price of the cart
 * Errors:
 * - 404 if cart not found
 * - 500 for any other server errors
 * Note: Total price is calculated as the sum of (item price * quantity) for all items in the cart.
 */
//! i still did not call this api in frontend but i will call it when i will implement checkout page
export async function getCartTotalPrice(req, res, next) {
  try {
    const user = await getMeUser(req.user.id);

    const totalPrice = await cartModel.aggregate(
      [
        {
          $match: {
            user: new mongoose.Types.ObjectId(req.user.id)
          }
        },
        { $unwind: { path: '$items' } },
        {
          $lookup: {
            from: 'products',
            localField: 'items.product',
            foreignField: '_id',
            as: 'items.product'
          }
        },
        { $unwind: { path: '$items.product' } },
        {
          $unwind: { path: '$items.product.variants' }
        },
        {
          $match: {
            $expr: {
              $eq: [
                '$items.product.variants._id',
                '$items.varient'
              ]
            }
          }
        },
        {
          $addFields: {
            itemPrice: {
              price: {
                $multiply: [
                  '$items.quantity',
                  '$items.product.variants.price.amount'
                ]
              },
              currency: '$items.price.currency'
            }
          }
        },
        {
          $group: {
            _id: '$_id',
            totalPrice: { $sum: '$itemPrice.price' },
            currency: {
              $first: '$itemPrice.currency'
            },
            items: { $push: '$items' }
          }
        }
      ]
    );

    res.status(200).json({
      success: true,
      totalPrice: totalPrice[0]?.totalPrice || 0,
      currency: totalPrice[0]?.currency || 'USD',
    });
  } catch (error) {
    next(error)
  }
}
/** 
 * Function Name: getTotalRevenu
 * Purpose: Calculate and return the total revenu for the authenticated user.
 * Params:
 * - req.user: Authenticated user payload
 * Returns:
 * - JSON response containing the total revenu
 * Errors:
 * - 404 if cart not found
 * - 500 for any other server errors
 */

export async function getTotalRevenu(req, res, next) {
  try {

    await getMeUser(req.user.id)
    // get total revenu
    const totalRevenu = await cartModel.aggregate(
      [
        { $unwind: { path: '$items' } },
        {
          $lookup: {
            from: 'products',
            let: { variantId: '$items.varient' },
            pipeline: [
              { $unwind: '$variants' },
              {
                $match: {
                  $expr: {
                    $eq: [
                      '$variants._id',
                      '$$variantId'
                    ]
                  }
                }
              }
            ],
            as: 'variantDetails'
          }
        },
        { $unwind: { path: '$variantDetails' } },
        {
          $group: {
            _id: '$user',
            totalPrice: {
              $sum: {
                $multiply: [
                  '$items.quantity',
                  '$variantDetails.variants.price.amount'
                ]
              }
            },
            buyer: { $first: true }
          }
        },
        {
          $group: {
            _id: null,
            totalRevenu: { $sum: '$totalPrice' }
          }
        }
      ]
    );

    return res.status(200).json({
      success: true,
      totalRevenu: totalRevenu[0]?.totalRevenu || 0,
      mytotalRevenu: totalRevenu.totalRevenu
    })
  } catch (error) {
    next(error)
  }
}

export async function createOrderController(req, res, next) {
  const { amount, currency } = req.body
  try {
    await getMeUser(req.user.id)
    const order = await createOrder({
      amount: Number(amount),
      currency: currency
    })

    return res.status(200).json({
      success: true,
      order
    })
  } catch (error) {
    console.log('====================================');
    console.log(error);
    console.log('====================================');

    next(error)
  }
}