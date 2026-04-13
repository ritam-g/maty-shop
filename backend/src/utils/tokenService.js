import jwt from 'jsonwebtoken'
import { AppConfig } from '../config/config.js'

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


export function verifyToken(token) {
    
    const decoded = jwt.verify(token, AppConfig.JWT_SECRET)
    console.log('====================================');
    console.log(decoded);
    console.log('====================================');
    return decoded
}
