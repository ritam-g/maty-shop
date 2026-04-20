import cartModel from "../model/cart.model.js";
import productModel from "../model/product.model.js";
import { AppError } from "../utils/AppError.js";

export async function addToCartController(req, res, next) {
    try {
        const { productId, variantId, quantity = 1 } = req.params

        // 1. Find product + variant
        const productDetails = await productModel.findOne({
            _id: productId,
            "variants._id": variantId
        })

        if (!productDetails) {
            throw new AppError("Product not found", 404)
        }

        // 2. Get variant stock
        const variant = productDetails.variants.find(
            v => v._id.toString() === variantId
        )

        const stock = variant.stock

        if (stock < quantity) {
            throw new AppError("Out of stock", 400)
        }

        // 3. Get or create cart
        let cart = await cartModel.findOne({ user: req.user.id })

        if (!cart) {
            cart = await cartModel.create({ user: req.user.id })
        }

        // 4. Check item already exists
        const existingItem = cart.items.find(
            item =>
                item.product.toString() === productId &&
                item.varient?.toString() === variantId
        )

        // 5. If exists → update quantity
        if (existingItem) {
            const newQty = existingItem.quantity + quantity

            if (newQty > stock) {
                throw new AppError("Out of stock", 400)
            }

          const updatedCart =  await cartModel.updateOne(
                {
                    user: req.user.id,
                    "items.product": productId,
                    "items.varient": variantId
                },
                {
                    $inc: { "items.$.quantity": quantity }
                }
            )

            return res.status(200).json({
                message: "Cart updated successfully",
                success: true,
                updatedCart
            })
        }

        // 6. If new item
        cart.items.push({
            product: productId,
            varient: variantId,
            quantity,
            price: productDetails.price
        })

        await cart.save()

        return res.status(200).json({
            message: "Product added to cart successfully",
            success: true,
            cart
        })

    } catch (error) {
        console.log(error)
        next(error)
    }
}

export const getCartController = async (req, res,next) => {
    const user = req.user

    let cart = await cartModel.findOne({ user: user._id }).populate("items.product")

    if (!cart) {
        cart = await cartModel.create({ user: user._id })
    }

    return res.status(200).json({
        message: "Cart fetched successfully",
        success: true,
        cart
    })
}