import { Router } from "express";
import { loginValidator, registerValidator } from "../validator/auth.validator.js";
import { loginController, registerController } from "../controller/auth.controller.js";

const authRouter = Router();

authRouter.post("/register", registerValidator, registerController);
authRouter.post("/login", loginValidator, loginController);
authRouter.get("/me", () => { });

export default authRouter