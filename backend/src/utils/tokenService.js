import jwt from 'jsonwebtoken'
import { AppConfig } from '../config/config.js'

export function generateToken(userId, email,role) {
    const token=jwt.sign(
        {id:userId,email,role},
        AppConfig.JWT_SECRET,
        {expiresIn:AppConfig.JWT_EXPIRES_IN || "1d"}
    )
    
    return token
}


export function verifyToken(token) {
    
    const decoded = jwt.verify(token, AppConfig.JWT_SECRET)
    console.log('====================================');
    console.log(decoded);
    console.log('====================================');
    return decoded
}