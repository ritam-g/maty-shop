import { AppError } from "../utils/AppError.js"
import { verifyToken } from "../utils/tokenService.js"


/**
 * Express middleware for authenticating requests using JWT tokens
 * Verifies the token from cookies and attaches the decoded user data to the request object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} Calls next() if authenticated, otherwise passes error to next middleware
 * @throws {AppError} If token is missing or invalid (401 Unauthorized)
 */
export async function authMiddleware(req, res, next) {
    const token = req.cookies.token
    try {
        if (!token) {
            throw new AppError("You are not logged in", 401)
        }
       let  decode = verifyToken(token)
        if (!decode) {
            throw new AppError("You are not logged in", 401)
        }


        req.user = decode
        next()
    } catch (error) {
        console.log('====================================');
        console.log(error);
        console.log('====================================');

        next(error)
    }
}
