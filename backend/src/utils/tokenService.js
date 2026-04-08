import jwt from 'jsonwebtoken'
import { AppConfig } from '../config/config.js'

export function generateToken(userId, email) {
    const token=jwt.sign(
        {id:userId,email},
        AppConfig.JWT_SECRET,
        {expiresIn:AppConfig.JWT_EXPIRES_IN || "1d"}
    )
    return token
}