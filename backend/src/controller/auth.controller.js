import { loginService, registerService } from "../services/authService.js"
import { generateToken } from "../utils/tokenService.js"

export async function registerController(req, res, next) {
    try {
        const { name, email, password, role, contact } = req.body
        const createdUser = await registerService(name, email, password, role, contact)
        const token = generateToken(createdUser.id, createdUser.email)
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


export async function loginController(req, res, next) {
    const { email, password } = req.body
    try {
        const user = await loginService(email, password)
        const token = generateToken(user.id, user.email)
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