import { AppConfig } from "../config/config.js"
import userModel from "../model/user.model.js"
import { loginService, registerService } from "../services/authService.js"
import { generateToken } from "../utils/tokenService.js"
import jwt from 'jsonwebtoken'

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


export const googleController = async (req, res, next) => {
    console.log('====================================');
    console.log(req.user);
    console.log('====================================');

    // here i have to make feture if user is not  in db then i have to create user
    // if in the db then cehk propperly
    // end of the day add toekn also 

    const { _json, id } = req.user
    const { name, email, } = _json

    // first chek its exest ot not 
    let user = await userModel.findOne({ email, googleId: id })

    if (!user) {
         user= await userModel.create({
            name,
            email,
            googleId: id
        })
        console.log('user created ');
        
    }

    const token=jwt.sign({id:user.id,email},AppConfig.JWT_SECRET,{expiresIn:AppConfig.JWT_EXPIRES_IN || "1d"})

    res.cookie('token',token,{httpOnly:true})

    
    res.redirect('http://localhost:5173/')
}