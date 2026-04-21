import express from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js'
import {
  addToCartController,
  getCartController,
  updateCartItemQuantityController,
} from '../controller/cart.controller.js'

const cartRouter = express.Router()

/**
 * Function Name: cartRouter
 * Purpose: Register cart endpoints for add, fetch, and quantity update flows.
 */
cartRouter.get('/add/:productId/:variantId/:quantity', authMiddleware, addToCartController)
cartRouter.patch('/item/:productId/:variantId/:quantity', authMiddleware, updateCartItemQuantityController)
cartRouter.get('/get', authMiddleware, getCartController)

export default cartRouter
