import express from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { addToCartController, getCartController } from '../controller/cart.controller.js'

const cartRouter = express.Router()

/**  
 * @description Adds a product to the cart
 * @route POST /api/cart/add/:productId/:variantId/:quantity
 * @param {string} productId - The ID of the product to add to the cart
 * @param {string} variantId - The ID of the variant of the product to add to the cart
 * @param {string} quantity - The quantity of the product to add to the cart
 */
cartRouter.get(`/add/:productId/:variantId/:quantity`, authMiddleware, addToCartController)

/**  
 * @description Returns the cart of the user
 * @route GET /api/cart
 * @returns {Object} Cart object
 * @returns {Array} items - Array of products in the cart
 */
cartRouter.get('/get', authMiddleware, getCartController)
export default cartRouter