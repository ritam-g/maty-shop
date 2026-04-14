import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { createProduct, getUserProduct } from '../controller/product.controller.js'
import { upload } from '../middleware/upload.middleware.js'

/**
 * Express router for product-related routes
 * Handles product creation and retrieval operations
 */
const productRouter = Router()

/**
 * POST /product/create
 * Creates a new product listing
 * Requires authentication and seller role
 * Accepts up to 5 product images
 * 
 * @route POST /api/product/create
 * @param {multipart/form-data} request.body - Form data with product details and images
 * @returns {Object} Created product object
 * @access Private (requires authentication)
 */
productRouter.post('/create', upload.array('images', 5), authMiddleware, createProduct)

/**
 * GET /product/getProduct
 * Retrieves all products belonging to the authenticated user
 * 
 * @route GET /api/product/getProduct
 * @returns {Object[]} Array of product objects
 * @access Private (requires authentication)
 */
productRouter.get('/getProduct', authMiddleware, getUserProduct)

export default productRouter
