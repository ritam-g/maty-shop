import mongoose from "mongoose";
import priceSchema from "./price.schema.js";

/**  
 * Mongoose schema for Cart model
 * Represents a cart in the e-commerce system
 * 
 * @typedef {Object} Cart
 * @property {mongoose.Types.ObjectId} user - Reference to the user who owns the cart
 * @property {Product[]} items - Array of products in the cart
 */
const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "product",
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            },
            varient: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "product",
                required: true
            },
            price: {
                type: priceSchema,
                required: true
            }
        }
    ]
}, {
    timestamps: true
})

const cartModel = mongoose.model("cart", cartSchema)
export default cartModel
