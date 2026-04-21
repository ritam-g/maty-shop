import productModel from "../model/product.model.js";
import mongoose from "mongoose";
import { createProductService, getAllProductsService, getProductByIdService, updateProductVarent } from "../services/product.service.js"
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
        console.log('====================================');
        console.log('before the create product sevice ');
        console.log('====================================');
        const createdProduct = await createProductService({ user: req.user.id, name, description, price, quantity, currency, seller: req.user.id }, { productImages })
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

    const userId = req.user?.id || req.user?._id;
    try {
        console.log(userId);

        const products = await getAllProductsService(userId)
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
        const products = await productModel.find()

        if (!products) {
            throw new AppError("No products found", 404)
        }
        console.log('====================================');
        console.log(products);
        console.log('====================================');

        res.status(200).json({
            products,
            success: true,
            message: "All products fetched successfully"
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
        console.log('====================================');
        console.log(product);
        console.log('====================================');
        res.status(200).json({
            product,
            success: true,
            message: "Product fetched successfully"
        });
    } catch (error) {
        next(error);
    }
}



/**   
 * Adds a new variant to an existing product
 * Handles image upload via request files
 * 
 * @param {Object} req - Express request object containing product ID, variant data, and files
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with updated product and success status
 * @throws {Error} If product update fails
 */
export async function addProductVariant(req, res, next) {
    try {
        console.log(req.params.productId, req.user.id);
        console.log(req.files);

        const images = [...req.files]
        const updatedProduct = await updateProductVarent(req.params.productId, req.user.id, { ...req.body, images })
        console.log('====================================');
        console.log('new varient created ');
        console.log('====================================');
        return res.status(200).json({
            updatedProduct,
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
 * Search across all products (buyer-facing global search).
 * Performs case-insensitive partial match on title, description, and variant attributes.
 * 
 * @param {Object} req - Express request object containing search query 'q'
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function searchProducts(req, res, next) {
    const { q } = req.query;
    console.log('====================================');
    console.log('Search Query Received:', q);
    console.log('====================================');

    try {
        if (!q) {
            return res.status(200).json({
                products: [],
                success: true
            });
        }

        const searchRegex = new RegExp(q, 'i');

        // Search in title, description, and variant attributes
        const query = {
            $or: [
                { title: { $regex: searchRegex } },
                { description: { $regex: searchRegex } },
                { "variants.attributes": { $elemMatch: { $maxDistance: 0 } } } // Attributes are more complex to search in Maps
            ]
        };

        // For Map values in MongoDB, we often need to search using a specific pattern or if we want to search across ALL values in the map:
        // Since variants.attributes is a Map of String, we'll try to match any value in the map
        const products = await productModel.find({
            $or: [
                { title: { $regex: searchRegex } },
                { description: { $regex: searchRegex } },
                { "variants.attributes.$*": { $regex: searchRegex } } // MongoDB 4.4+ syntax for searching all values in a Map/object
            ]
        });

        console.log('====================================');
        console.log(`Found ${products.length} products for query "${q}"`);
        console.log('====================================');

        res.status(200).json({
            products,
            success: true
        });
    } catch (error) {
        console.log('Search Error:', error);
        next(error);
    }
}

/**
 * Search only the authenticated seller's products.
 * 
 * @param {Object} req - Express request object containing search query 'q' and user info
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function searchSellerProducts(req, res, next) {
    const { q } = req.query;
    const userId = req.user.id;

    console.log('====================================');
    console.log(`Seller Search Query: "${q}" for User: ${userId}`);
    console.log('====================================');

    try {
        if (!q) {
            const products = await productModel.find({ seller: userId });
            return res.status(200).json({
                products,
                success: true
            });
        }

        const searchRegex = new RegExp(q, 'i');

        const products = await productModel.find({
            seller: userId,
            $or: [
                { title: { $regex: searchRegex } },
                { description: { $regex: searchRegex } },
                { "variants.attributes.$*": { $regex: searchRegex } }
            ]
        });

        console.log('====================================');
        console.log(`Seller found ${products.length} products for query "${q}"`);
        console.log('====================================');

        res.status(200).json({
            products,
            success: true
        });
    } catch (error) {
        console.log('Seller Search Error:', error);
        next(error);
    }
}
