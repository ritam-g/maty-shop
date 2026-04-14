import { createProductService, getAllProductsService } from "../services/product.service.js"
import { AppError } from "../utils/AppError.js";

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