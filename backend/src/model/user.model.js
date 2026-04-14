import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

/**
 * Mongoose schema for User model
 * Represents a user in the e-commerce system with support for both
 * traditional email/password authentication and Google OAuth
 * 
 * @typedef {Object} User
 * @property {string} name - The user's full name
 * @property {string} [email] - The user's email address (optional if using Google OAuth)
 * @property {string} [password] - Hashed password (required if not using Google OAuth)
 * @property {string} role - User role: 'buyer' (default) or 'seller'
 * @property {string} [contact] - User's contact number (optional)
 * @property {string} [googleId] - Google OAuth user ID (for Google sign-in users)
 */
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: false, },
    password: {
        type: String,
        required: function () {
            return !this.googleId
        }
    },
    role: {
        type: String,
        enum: ["buyer", "seller"],
        default: "buyer"
    },
    contact: {
        type: String,
        required: false
    },
    googleId: {
        type: String
    }
})

/**
 * Pre-save middleware hook that automatically hashes the password before storing
 * Only runs if the password field has been modified or is new
 * Uses bcrypt with a salt rounds of 10 for secure hashing
 */
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return

    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
});


/**
 * Instance method to compare a provided password with the stored hashed password
 * @param {string} password - The plain text password to verify
 * @returns {Promise<boolean>} True if password matches, false otherwise
 */
userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

/**
 * Compound index on email and googleId for efficient lookups
 * Ensures uniqueness of the email + googleId combination
 */
userSchema.index({ email: 1, googleId: 1 }, { unique: true })


const userModel = mongoose.model("user", userSchema)
export default userModel
