import { Router } from "express";
import { loginValidator, registerValidator } from "../validator/auth.validator.js";
import { getMeController, googleController, loginController, registerController } from "../controller/auth.controller.js";
import passport from 'passport'
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authLimiter } from "../middleware/rateLimit/auth.limiter.js";

/**
 * Express router for authentication routes
 * Handles user registration, login, and Google OAuth authentication
 */
const authRouter = Router();

/**
 * POST /auth/register
 * Registers a new user with email, password, and other required information
 * Uses registerValidator middleware for input validation
 * Uses registerController to handle the registration logic
 */
authRouter.post("/register",authLimiter, registerValidator, registerController);

/**
 * POST /auth/login
 * Authenticates a user with email and password
 * Uses loginValidator middleware for input validation
 * Uses loginController to handle the login logic
 */
authRouter.post("/login", authLimiter,loginValidator, loginController);

/**
 * GET /auth/me
 * Retrieves the current authenticated user's information
 * TODO: Implement this endpoint with proper authentication middleware
 */
authRouter.get("/me",  authMiddleware, getMeController);

/**
 * GET /auth/google
 * Initiates Google OAuth authentication flow
 * Redirects user to Google's authentication page
 * Uses passport.authenticate middleware with Google strategy
 */
authRouter.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

/**
 * GET /auth/google/callback
 * Handles Google OAuth callback after user authentication
 * Uses passport.authenticate middleware with Google strategy
 * Uses googleController to handle the OAuth callback logic
 */
authRouter.get('/google/callback', passport.authenticate('google', { session: false }), googleController)


export default authRouter
