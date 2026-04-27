import { AppConfig } from "../config/config.js"
import { getMeUser, loginService, loginWithGoogle, registerService } from "../services/auth.service.js"
import { generateToken } from "../utils/tokenService.js"

/**
 * Extracts the user ID from a user object in a standardized way
 * @param {Object} user - The user object containing ID information
 * @returns {string|null} The user ID as a string, or null if not available
 */
function resolveUserId(user) {
    return user?._id?.toString?.() || user?.id || null
}


/**
 * Handles user registration requests
 * @param {Object} req - Express request object containing user registration data in req.body
 * @param {Object} res - Express response object for sending the response
 * @param {Function} next - Express next middleware function for error handling
 * @returns {Object} JSON response with created user, authentication token, and success status
 * @throws {Error} Passes any errors to the next middleware for handling
 */
export async function registerController(req, res, next) {
    try {
        const { name, email, password, role, contact } = req.body
        const createdUser = await registerService(name, email, password, role, contact)
        const token = generateToken(resolveUserId(createdUser), createdUser.email, createdUser.role)
        console.log('====================================');
        console.log(token);
        console.log('====================================');
        res.cookie('token', token, { httpOnly: true })
        res.status(201).json({
            user: createdUser,
            token,
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
 * Handles user login requests with email and password authentication
 * @param {Object} req - Express request object containing login credentials in req.body
 * @param {Object} res - Express response object for sending the response
 * @param {Function} next - Express next middleware function for error handling
 * @returns {Object} JSON response with authenticated user, authentication token, and success status
 * @throws {Error} Passes any errors to the next middleware for handling
 */
export async function loginController(req, res, next) {
    const { email, password } = req.body
    try {
        const user = await loginService(email, password)
        const token = generateToken(resolveUserId(user), user.email, user.role)
        res.cookie('token', token, { httpOnly: true })
        res.status(200).json({
            user,
            token,
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
 * Handles Google OAuth authentication callback
 * @param {Object} req - Express request object containing Google OAuth user data in req.user
 * @param {Object} res - Express response object for redirecting the user
 * @param {Function} next - Express next middleware function for error handling
 * @returns {void} Sets authentication cookie and redirects to frontend application
 * @throws {Error} Passes any errors to the next middleware for handling
 */
export const googleController = async (req, res, next) => {
    console.log('====================================');
    console.log(req.user);
    console.log('====================================');

    try {
        // here i have to make feture if user is not  in db then i have to create user
        // if in the db then cehk propperly
        // end of the day add toekn also 

        const user = await loginWithGoogle(req.user)

        const token = generateToken(resolveUserId(user), user.email, user.role)

        res.cookie('token', token, { httpOnly: true })
        if (user.role !== 'buyer') {
            // its only for render time if you are ruuing in local you can cange in url
            //render
            res.redirect(`https://maty-shop.onrender.com/seller/dashboard`)

            // local
            // res.redirect(`http://localhost:5173/seller/dashboard`)


        }
        else {
            // its only for render time if you are ruuing in local you can cange in url
            //render
            res.redirect(`https://maty-shop.onrender.com`)

            // local
            // res.redirect(`http://localhost:5173`)

        }

    } catch (error) {
        console.log('====================================');
        console.log(error);
        console.log('====================================');
        next(error)
    }
}


export async function getMeController(req, res, next) {
    try {
        const user = await getMeUser(req.user.id)
        return res.status(200).json({
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
        next(error)

    }
}