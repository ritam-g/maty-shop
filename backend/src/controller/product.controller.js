import productModel from "../model/product.model.js";
import mongoose from "mongoose";
import { createProductService, getAllProductsService, getProductByIdService } from "../services/product.service.js"
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
        console.log('====================================');
        console.log('getUserProduct route ');
        console.log('====================================');
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

/**  
 * Retrieves all products from the database
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with all products and success status
 */
export async function getAllProductController(req, res, next) {
    try {
        const products=await productModel.find()

        if(!products){
            throw new AppError("No products found",404)
        }

        res.status(200).json({
            products,
            success: true,
            message:"All products fetched successfully"
        })
    } catch (error) {
        console.log(error);

        next(error)

    }
}

/**
 * Retrieves a single product by ID.
 *
 * @param {Object} req - Express request object with params.id
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with one product and success status
 */
export async function getProductByIdController(req, res, next) {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError("Invalid product ID", 400);
        }
      
        const product = await getProductByIdService(id);
        res.status(200).json({
            product,
            success: true,
            message: "Product fetched successfully"
        });
    } catch (error) {
        next(error);
    }
}
