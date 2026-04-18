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
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    price: {
        amount: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            enum: ["USD", "EUR", "GBP", "JPY", "INR"],
            default: "INR"
        }
    },
    images: [
        {
            url: {
                type: String,
                required: true
            }
        }
    ],
    variants: [
        {
            images: [
                {
                    url: {
                        type: String,
                        required: true
                    }
                }
            ],
            stock: {
                type: Number,
                default: 0
            },
            attributes: {
                type: Map,
                of: String
            },
            price: {
                amount: {
                    type: Number,
                    required: true
                },
                currency: {
                    type: String,
                    enum: ["USD", "EUR", "GBP", "JPY", "INR"],
                    default: "INR"
                }
            }
        },

    ]
}, { timestamps: true })


const productModel = mongoose.model("product", productSchema)
export default productModel
