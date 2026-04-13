import { loginService, loginWithGoogle, registerService } from "../services/auth.service.js"
import { generateToken } from "../utils/tokenService.js"

function resolveUserId(user) {
    return user?._id?.toString?.() || user?.id || null
}


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

        res.redirect('http://localhost:5173/')
    } catch (error) {
        next(error)
    }
}
