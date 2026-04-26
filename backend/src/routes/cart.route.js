import express from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js'
import {
  addToCartController,
  createOrderController,
  getCartController,
  getCartTotalPrice,
  getOrderDetailsController,
  getTotalRevenu,
  paymentVerificationController,
  updateCartItemQuantityController,
} from '../controller/cart.controller.js'

const cartRouter = express.Router()

/**
 * Function Name: cartRouter
 * Purpose: Register cart endpoints for add, fetch, and quantity update flows.
 */
cartRouter.get('/add/:productId/:variantId/:quantity', authMiddleware, addToCartController)
/**  
 * Function Name: updateCartItemQuantityController
 * Purpose: Update the quantity of a specific item in the cart.
 * Endpoint: PATCH /item/:productId/:variantId/:quantity
 * Middleware: authMiddleware - Ensures the user is authenticated before allowing access to this endpoint.
 */
cartRouter.patch('/item/:productId/:variantId/:quantity', authMiddleware, updateCartItemQuantityController)
/**  
 * Function Name: getCartController
 * Purpose: Retrieve the current state of the user's cart, including all items and their details.
 * Endpoint: GET /get
 * Middleware: authMiddleware - Ensures the user is authenticated before allowing access to this endpoint.
 */
cartRouter.get('/get', authMiddleware, getCartController)
/**  
 * Function Name: getCartTotalPrice
 * Purpose: Calculate and return the total price of all items in the user's cart.
 * Endpoint: GET /totalPrice
 * Middleware: authMiddleware - Ensures the user is authenticated before allowing access to this endpoint.
 */
cartRouter.get('/totalPrice',authMiddleware,getCartTotalPrice)
/**  
 * Function Name: getTotalRevenu
 * Purpose: Calculate and return the total revenue generated from all completed orders.
 * Endpoint: GET /getAllRevenu
 * Middleware: authMiddleware - Ensures the user is authenticated before allowing access to this endpoint.
 */
cartRouter.get('/getAllRevenu',authMiddleware,getTotalRevenu)
/**  
 * Function Name: createOrderController
 * Purpose: Create a new order based on the items in the user's cart and initiate the payment process.
 * Endpoint: POST /payment/create/order
 * Middleware: authMiddleware - Ensures the user is authenticated before allowing access to this endpoint.
 */
cartRouter.post('/payment/create/order',authMiddleware,createOrderController)
/**  
 * Function Name: paymentVerificationController
 * Purpose: Verify the payment for an order and update the order status accordingly.
 * Endpoint: POST /payment/verify/order
 * Middleware: authMiddleware - Ensures the user is authenticated before allowing access to this endpoint.
 */
cartRouter.post('/payment/verify/order',authMiddleware,paymentVerificationController)
/**  
 * Function Name: getOrderDetailsController
 * Purpose: Retrieve the details of a specific order based on the provided payment ID.
 * Endpoint: GET /order/:paymentId
 * Middleware: authMiddleware - Ensures the user is authenticated before allowing access to this endpoint.
 */
cartRouter.get('/order/:paymentId',authMiddleware,getOrderDetailsController)


/**  
 * Function Name: cartRouter
 * Purpose: Export the cartRouter to be used in the main application for handling cart-related routes.
 * This router includes endpoints for adding items to the cart, updating item quantities, fetching cart details, calculating total price, creating orders, verifying payments, and retrieving order details.
 */
export default cartRouter
