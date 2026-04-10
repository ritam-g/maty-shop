import { Router } from "express";
import { loginValidator, registerValidator } from "../validator/auth.validator.js";
import { googleController, loginController, registerController } from "../controller/auth.controller.js";
import passport from 'passport'
const authRouter = Router();

authRouter.post("/register", registerValidator, registerController);
authRouter.post("/login", loginValidator, loginController);
authRouter.get("/me", () => { });
authRouter.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
authRouter.get('/google/callback', passport.authenticate('google', { session: false }), googleController)
export default authRouter