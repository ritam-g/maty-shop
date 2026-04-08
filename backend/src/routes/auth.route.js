import { Router } from "express";
import { registerValidator } from "../validator/auth.validator.js";
import { registerController } from "../controller/auth.controller.js";

const authRouter = Router();

authRouter.post("/register",registerValidator, registerController);
authRouter.post("/login", () => { });
authRouter.get("/me", () => { });

export default authRouter