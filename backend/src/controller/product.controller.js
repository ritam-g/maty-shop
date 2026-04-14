import { createProductService, getAllProductsService } from "../services/product.service.js"
import { AppError } from "../utils/AppError.js";

/**
 * Creates a new product listing
 * Only accessible to users with 'seller' role
 * Handles image upload via request files
 * 
 * @param {Object} req - Express request object containing product data and files
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with created product and success status
 * @throws {AppError} If user is not a seller or if product creation fails
 */
export async function createProduct(req, res, next) {
    const { name, description, price, quantity, currency } = req.body
    const productImages = req.files
    try {
        console.log('====================================');
        console.log(req.user, `this form product controller`);
        console.log('====================================');
        if (req.user.role !== 'seller') {
            throw new AppError("You are not a seller")
        }
        const createdProduct = await createProductService({ user: req.user.id, name, description, price, quantity, currency }, { productImages })
        res.status(201).json({
            product: createdProduct,
            success: true
        })
    } catch (error) {
        console.log('====================================');
        console.log(error.message);
        console.log('====================================');
        next(error)
    }
}

/**
 * Retrieves all products belonging to the authenticated user
 * 
 * @param {Object} req - Express request object containing authenticated user data
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with user's products and success status
 * @throws {Error} If product retrieval fails
 */
export async function getUserProduct(req, res, next) {
    const user = req.user
    try {
        const products = await getAllProductsService(user.id)

        res.status(200).json({
            products,
            success: true
        })
    } catch (error) {
        console.log('====================================');
        console.log(error);
        console.log('====================================');
        next(error)
    }
}
