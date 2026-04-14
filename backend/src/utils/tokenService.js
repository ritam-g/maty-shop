import jwt from 'jsonwebtoken'
import { AppConfig } from '../config/config.js'

/**
 * Generates a JWT token for user authentication
 * @param {string} userId - The user's unique identifier
 * @param {string} [email] - The user's email address (optional)
 * @param {string} [role] - The user's role (optional)
 * @returns {string} The generated JWT token
 * @throws {Error} If userId is missing
 */
export function generateToken(userId, email, role) {
    if (!userId) {
        throw new Error('Cannot generate token: user id is missing')
    }

    const payload = {
        id: String(userId),
        ...(email ? { email } : {}),
        ...(role ? { role } : {})
    }

    const token = jwt.sign(payload, AppConfig.JWT_SECRET, {
        expiresIn: AppConfig.JWT_EXPIRES_IN || "1d"
    })

    return token
}


/**
 * Verifies and decodes a JWT token
 * @param {string} token - The JWT token to verify
 * @returns {Object} The decoded token payload containing user information
 * @throws {Error} If token is invalid or expired
 */
export function verifyToken(token) {
    
    const decoded = jwt.verify(token, AppConfig.JWT_SECRET)
    console.log('====================================');
    console.log(decoded);
    console.log('====================================');
    return decoded
}
