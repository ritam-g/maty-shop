import { AppError } from "../utils/AppError.js"
import { verifyToken } from "../utils/tokenService.js"

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

        console.log('====================================');
        console.log(decode);
        console.log('====================================');

        req.user = decode
        next()
    } catch (error) {
        console.log('====================================');
        console.log(error);
        console.log('====================================');

        next(error)
    }
}