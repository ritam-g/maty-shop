import { registerService } from "../services/authService.js"
import { generateToken } from "../utils/tokenService.js"

export async function registerController(req, res, next) {
    try {
        const { name, email, password, role, contact } = req.body
        const createdUser = await registerService(name, email, password, role, contact)
        const token = generateToken(createdUser.id, createdUser.email)
        res.status(201).json({ user: createdUser, token })
    } catch (error) {
        console.log('====================================');
        console.log(error);
        console.log('====================================');
        next(error)
    }
}