import mongoose from 'mongoose';
/**  
 * Mongoose schema for Price model
 * Represents a product price in the e-commerce system
 * 
 * @typedef {Object} Price
 * @property {number} amount - The product price amount
 * @property {string} currency - Currency code: 'INR' (default), 'USD', or 'EUR'
 */
const priceSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        enum: [ "USD", "EUR", "GBP", "JPY", "INR" ],
        default: "INR"
    }
}, {
    _id: false,
    _v: false
});

export default priceSchema;

