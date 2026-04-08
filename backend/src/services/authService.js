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