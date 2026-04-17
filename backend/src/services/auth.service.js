import userModel from "../model/user.model.js";
import { AppError } from "../utils/AppError.js";

/**
 * Registers a new user in the system
 * @param {string} name - The user's full name
 * @param {string} email - The user's email address (must be unique)
 * @param {string} password - The user's password (will be hashed before storage)
 * @param {string} role - The user's role (e.g., 'user', 'admin')
 * @param {string} contact - The user's contact number
 * @returns {Promise<Object>} The created user object (password removed)
 * @throws {AppError} If validation fails or user already exists
 */
export async function registerService(name, email, password, role, contact) {

    if (!name || !email || !password || !contact) {
        throw new AppError("All fields are required", 400);
    }

    const userExiest = await userModel.findOne({
        $or: [
            { email },
            { contact }
        ]
    })

    if (userExiest) {
        throw new AppError("User already exiest", 400)
    }

    const user = await userModel.create({
        name,
        email,
        password,
        role,
        contact
    })

    const savedUser = user.toObject()
    delete savedUser.password

    return savedUser



}

/**
 * Authenticates a user with email and password
 * @param {string} email - The user's email address
 * @param {string} password - The user's password
 * @returns {Promise<Object>} The authenticated user object
 * @throws {AppError} If credentials are invalid or user not found
 */
export async function loginService(email, password) {
    if (!email || !password) {
        throw new AppError("All fields are required", 400)
    }
    const user = await userModel.findOne({ email })
    if (!user) {
        throw new AppError("User not found", 400)
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new AppError("Password is incorrect", 400)
    }
    return user
}

/**
 * Handles Google OAuth login - creates user if doesn't exist, returns existing user
 * @param {Object} googleUser - The Google OAuth user object containing profile data
 * @param {Object} googleUser._json - The JSON profile data from Google
 * @param {string} googleUser.id - The Google user ID
 * @returns {Promise<Object>} The user object (existing or newly created)
 * @throws {Error} If there's an issue with user creation or lookup
 */
export async function loginWithGoogle(googleUser) {
    const { _json, id } = googleUser
    const { name, email, } = _json

    // first chek its exest ot not 
    let user = await userModel.findOne({ email, googleId: id })

    if (!user) {
        user = await userModel.create({
            name,
            email,
            googleId: id
        })
        console.log('user created ');

    }

    return user
}

export async function getMeUser(userId) {
    const user = await userModel.findById(userId)
    if(!user){
        throw new AppError("User not found", 400)
    }
    return user
}