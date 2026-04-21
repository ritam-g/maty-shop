import cartModel from "../model/cart.model.js";
import productModel from "../model/product.model.js";
import { AppError } from "../utils/AppError.js";

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
  const user = req.user;

  let cart = await populateCart(user._id);

  if (!cart) {
    await cartModel.create({ user: user._id, items: [] });
    cart = await populateCart(user._id);
  }

  return res.status(200).json({
    message: "Cart fetched successfully",
    success: true,
    cart,
  });
};
