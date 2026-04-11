import userModel from "../model/user.model.js";
import { AppError } from "../utils/AppError.js";

export async function registerService(name, email, password, role, contact) {

    if (!name || !email || !password || !contact) {
        throw new AppError("All fields are required", 400);
    }

    const userExiest = await userModel.findOne({
        $or: [
            { email },
            { contact }
        ]
    })

    if (userExiest) {
        throw new AppError("User already exiest", 400)
    }

    const user = await userModel.create({
        name,
        email,
        password,
        role,
        contact
    })

    const { password: _, ...saveUser } = user

    return saveUser



}

export async function loginService(email, password) {
    if (!email || !password) {
        throw new AppError("All fields are required", 400)
    }
    const user = await userModel.findOne({ email })
    if (!user) {
        throw new AppError("User not found", 400)
    }
    if (!user.comparePassword(password)) {
        throw new AppError("Password is incorrect", 400)
    }
    return user
}

export async function loginWithGoogle(googleUser) {
    const { _json, id } = googleUser
    const { name, email, } = _json

    // first chek its exest ot not 
    let user = await userModel.findOne({ email, googleId: id })

    if (!user) {
        user = await userModel.create({
            name,
            email,
            googleId: id
        })
        console.log('user created ');

    }

    return user
}