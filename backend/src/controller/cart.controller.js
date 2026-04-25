import mongoose, { get } from "mongoose";
import cartModel from "../model/cart.model.js";
import productModel from "../model/product.model.js";
import { getMeUser } from "../services/auth.service.js";
import { AppError } from "../utils/AppError.js";
import { createOrder } from "../services/payment.service.js";
import paymentModel from "../model/payment.model.js";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";
import { AppConfig } from "../config/config.js";
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

async function getUserTotalPrice(userId) {
  const userCartTotalAmount = await cartModel.aggregate(
    [
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId)
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
  console.log(userCartTotalAmount);

  return userCartTotalAmount
}
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

    const totalPrice = await getUserTotalPrice(req.user.id)
    if (!totalPrice) {
      throw new AppError("Cart not found", 404);
    }
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
/**  
 * Function Name: createOrderController
 * Purpose: Create an order for the authenticated user's cart.
 * Params:
 * - req.user: Authenticated user payload
 * Returns:
 * - JSON response containing the created order document
 * Errors:
 * - 404 if cart not found
 * 
 */
export async function createOrderController(req, res, next) {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      throw new AppError('Authentication required', 401);
    }

    await getMeUser(userId);

    const cart = await cartModel
      .findOne({ user: userId })
      .populate("items.product");

    if (!cart) {
      throw new AppError("Cart not found", 404);
    }

    const userCartTotalAmount = await getUserTotalPrice(userId);

    if (!userCartTotalAmount.length) {
      throw new AppError("Cart is empty", 400);
    }

    const order = await createOrder({
      amount: Number(userCartTotalAmount[0].totalPrice),
      currency: userCartTotalAmount[0].currency || 'INR',
    });

    const payment = await paymentModel.create({
      user: userId,
      razorpay: {
        orderId: order.id,
      },
      price: {
        amount: userCartTotalAmount[0].totalPrice,
        currency: userCartTotalAmount[0].currency
      },

      orderItems: cart.items.map(item => {

        if (!item.product) {
          throw new AppError("Product not populated", 500);
        }

        // ✅ HANDLE BOTH (variant / varient)
        const variantId = item.variant || item.varient;

        if (!variantId) {
          throw new AppError("Variant missing in cart item", 500);
        }

        const selectedVariant = item.product.variants.find(
          v => v._id && String(v._id) === String(variantId)
        );

        if (!selectedVariant) {
          throw new AppError("Variant not found in product", 500);
        }

        return {
          title: item.product.title,
          productId: item.product._id,
          variantId: variantId,
          quantity: item.quantity,
          images: selectedVariant.images || item.product.images,
          description: item.product.description,
          price: {
            amount: selectedVariant.price?.amount || item.product.price.amount,
            currency: selectedVariant.price?.currency || item.product.price.currency
          }
        };
      })
    });

    return res.status(200).json({
      success: true,
      message: 'Order created successfully',
      order,
      payment
    });

  } catch (error) {
    next(error);
  }
}

export async function paymentVerificationController(req, res, next) {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

  try {
    const paymentDetails = await paymentModel.findOne({
      razorpay: {
        orderId: razorpay_order_id
      },
      status: "pending"
    })

    if (!paymentDetails) {
      throw new AppError("Payment not found", 404);
    }

    const isPaymentValid = await validatePaymentVerification({
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,

    }, razorpay_signature, AppConfig.REZOR_PAY_API_SECRET)
    if (!isPaymentValid) {
      throw new AppError("Payment verification failed", 400);
    }

    // Save the payment ID to the database for future retrieval
    paymentDetails.status = "paid";
    paymentDetails.razorpay.paymentId = razorpay_payment_id;
    await paymentDetails.save();
    console.log('====================================');
    console.log('payemnt verification is sucessed');
    console.log('====================================');
    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      order: paymentDetails
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Function Name: getOrderDetailsController
 * Purpose: Fetch order/payment details for the authenticated user by payment ID.
 *          Ensures users can only access their own orders for security.
 * Params:
 * - req.params.paymentId: Razorpay payment ID
 * - req.user: Authenticated user payload from middleware
 * Returns:
 * - JSON response containing the payment/order details
 * Errors:
 * - 404 if payment not found
 * - 401 if user is not authorized to access this order
 */
export async function getOrderDetailsController(req, res, next) {
  try {
    const { paymentId } = req.params;
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      throw new AppError("Authentication required", 401);
    }

    if (!paymentId) {
      throw new AppError("Payment ID is required", 400);
    }

    // Find payment by razorpay paymentId and ensure it belongs to the logged-in user
    const paymentDetails = await paymentModel.findOne({
      "razorpay.paymentId": paymentId,
      user: userId
    }).lean();

    if (!paymentDetails) {
      throw new AppError("Order not found or you are not authorized to view this order", 404);
    }

    return res.status(200).json({
      success: true,
      message: "Order details fetched successfully",
      order: {
        id: paymentDetails._id,
        paymentId: paymentDetails.razorpay?.paymentId,
        orderId: paymentDetails.razorpay?.orderId,
        status: paymentDetails.status,
        price: paymentDetails.price,
        orderItems: paymentDetails.orderItems,
        createdAt: paymentDetails.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
}
