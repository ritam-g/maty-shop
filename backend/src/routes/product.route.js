import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { addProductVariant, createProduct, getAllProductController, getProductByIdController, getUserProduct, searchProducts, searchSellerProducts } from '../controller/product.controller.js'
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

/**
 * GET /product/search
 * Global product search
 * @description Performs case-insensitive partial match on title, description, and variant attributes
 * 
 * @route GET /api/product/search
 * @param {string} q - Partial search text
 * @returns {Object} Search results
 */
productRouter.get('/search', searchProducts)

/**
 * GET /product/seller/search
 * Seller-specific product search
 */
productRouter.get('/seller/search', authMiddleware, searchSellerProducts)

/**
 * GET /product/:id
 * Retrieves one product by ID.
 *
 * @route GET /api/product/:id
 * @returns {Object} Product object
 * @access Public
 */
productRouter.get('/:id', getProductByIdController)

/**  
 * GET /product
 * Retrieves all products
 * 
 * @route GET /api/product
 * @returns {Object[]} Array of product objects
 * @access Public
 */
productRouter.get('/',getAllProductController)

productRouter.post('/:productId/variants',upload.array('images',5),authMiddleware,addProductVariant)

export default productRouter
