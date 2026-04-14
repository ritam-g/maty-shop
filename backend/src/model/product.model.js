import mongoose from 'mongoose'

/**
 * Mongoose schema for Product model
 * Represents a product listing in the e-commerce system
 * 
 * @typedef {Object} Product
 * @property {mongoose.Types.ObjectId} user - Reference to the user who created the product (seller)
 * @property {string} name - The product name
 * @property {string} description - Detailed description of the product
 * @property {number} price - The product price
 * @property {string} currency - Currency code: 'INR' (default), 'USD', or 'EUR'
 * @property {string[]} images - Array of image URLs for the product
 * @property {number} quantity - Available quantity of the product
 * @property {Date} createdAt - Timestamp when the product was created (auto-generated)
 * @property {Date} updatedAt - Timestamp when the product was last updated (auto-generated)
 */
const productSchema = new mongoose.Schema({

    user: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        enum: ["INR", "USD", "EUR"],
        required: true,
        default: "INR"
    },
    images: {
        type: [String],
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }

}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
})


const productModel = mongoose.model("product", productSchema)
export default productModel
