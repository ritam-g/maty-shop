import mongoose from 'mongoose'


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
    timestamps: true
})


const productModel = mongoose.model("product", productSchema)
export default productModel